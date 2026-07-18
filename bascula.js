/**
 * NutriMX v3.6 - Báscula Bluetooth (Web Bluetooth)
 * Conecta con básculas inteligentes que exponen los servicios BLE estándar
 * "Weight Scale" (0x181D) y "Body Composition" (0x181B): peso, % grasa, músculo, etc.
 * Calcula una edad fisiológica/metabólica estimada a partir de peso, IMC y edad.
 *
 * Limitaciones honestas:
 *  - Funciona en Chrome/Edge (escritorio y Android). NO en iPhone/iPad (Safari no soporta Web Bluetooth).
 *  - Solo básculas con los servicios GATT estándar. Muchas básculas baratas (que solo "transmiten")
 *    no son compatibles con navegadores; para esas, usa el registro manual de peso.
 */

class BasculaUI {
  constructor() { this.ultima = null; }

  soportado() {
    return typeof navigator !== 'undefined' && !!navigator.bluetooth;
  }

  estatura() {
    try {
      const s = JSON.parse(localStorage.getItem('nutrimx_salud') || 'null');
      return s && s.estatura ? s.estatura / 100 : 1.7;
    } catch (e) { return 1.7; }
  }

  edad() {
    try {
      const s = JSON.parse(localStorage.getItem('nutrimx_salud') || 'null');
      return (s && s.edad) || 35;
    } catch (e) { return 35; }
  }

  imc(peso) {
    const h = this.estatura();
    return Math.round((peso / (h * h)) * 10) / 10;
  }

  /** Estimación orientativa de "edad fisiológica/metabólica". No es diagnóstico. */
  edadMetabolica(peso, grasa) {
    const edad = this.edad();
    const imc = this.imc(peso);
    let ajuste = 0;
    // A partir del IMC respecto a un rango saludable (~22)
    ajuste += (imc - 22) * 0.8;
    // Si la báscula dio % de grasa, afinar respecto a referencia sana (~20% h / ~28% m)
    if (grasa != null) {
      let sexo = 'hombre';
      try { const s = JSON.parse(localStorage.getItem('nutrimx_salud') || 'null'); if (s && s.sexo) sexo = s.sexo; } catch (e) {}
      const ref = sexo === 'mujer' ? 28 : 20;
      ajuste += (grasa - ref) * 0.4;
    }
    return Math.max(18, Math.round(edad + ajuste));
  }

  render() {
    const cont = document.getElementById('basculaBt');
    if (!cont) return;
    const u = this.ultima;
    const soport = this.soportado();

    let resultado = '';
    if (u) {
      const imc = this.imc(u.peso);
      const catIMC = imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Saludable' : imc < 30 ? 'Sobrepeso' : 'Obesidad';
      const edadMet = this.edadMetabolica(u.peso, u.grasa);
      const edadReal = this.edad();
      const comp = [];
      if (u.grasa != null) comp.push(`<div class="bt-stat"><b>${u.grasa}%</b><span>Grasa corporal</span></div>`);
      if (u.musculo != null) comp.push(`<div class="bt-stat"><b>${u.musculo} kg</b><span>Masa muscular</span></div>`);
      if (u.agua != null) comp.push(`<div class="bt-stat"><b>${u.agua}%</b><span>Agua corporal</span></div>`);
      if (u.hueso != null) comp.push(`<div class="bt-stat"><b>${u.hueso} kg</b><span>Masa ósea</span></div>`);
      resultado = `
        <div class="bt-resultado">
          <div class="bt-grid">
            <div class="bt-stat destacado"><b>${u.peso} kg</b><span>Peso</span></div>
            <div class="bt-stat"><b>${imc}</b><span>IMC — ${catIMC}</span></div>
            <div class="bt-stat edad"><b>${edadMet} años</b><span>Edad fisiológica estimada</span></div>
            ${comp.join('')}
          </div>
          <p class="bt-edad-nota">${edadMet <= edadReal ? '💪 ¡Tu cuerpo está en buena forma para tu edad!' : '📈 Tu edad fisiológica es mayor que la real: con ejercicio y buena alimentación puedes bajarla.'} (edad real: ${edadReal})</p>
          <button class="btn btn-primary" id="btGuardar">💾 Guardar esta medición</button>
        </div>`;
    }

    const boton = soport
      ? `<button class="btn btn-primary" id="btConectar">📶 Conectar báscula Bluetooth</button>`
      : `<p class="bt-aviso">📱 Tu navegador no permite Bluetooth aquí (los iPhone/iPad no lo soportan). Usa Chrome en Android o computadora, o registra tu peso manualmente abajo.</p>`;

    cont.innerHTML = `
      <h3 class="font-bold text-lg mb-1">📶 Báscula inteligente (Bluetooth)</h3>
      <p class="text-sm text-gray-500 mb-3">Conecta tu báscula y registra peso, grasa, músculo y tu edad fisiológica estimada, sin escribir nada.</p>
      ${boton}
      <p id="btEstado" class="bt-estado"></p>
      ${resultado}
      <details class="bt-ayuda"><summary>¿Mi báscula es compatible?</summary>
        <p>Funciona con básculas que usan los servicios Bluetooth estándar (Weight Scale / Body Composition). Muchas básculas económicas solo "transmiten" y no se conectan a navegadores — en ese caso registra tu peso manualmente. Compatible en Chrome/Edge (Android y computadora), no en iPhone.</p>
      </details>`;

    const bc = document.getElementById('btConectar');
    if (bc) bc.addEventListener('click', () => this.conectar());
    const bg = document.getElementById('btGuardar');
    if (bg) bg.addEventListener('click', () => this.guardar());
  }

  estado(msg, error) {
    const e = document.getElementById('btEstado');
    if (e) { e.textContent = msg; e.style.color = error ? '#dc2626' : '#059669'; }
  }

  async conectar() {
    if (!this.soportado()) return;
    try {
      this.estado('Buscando tu báscula… acepta el permiso del navegador.');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['weight_scale'] }, { services: ['body_composition'] }],
        optionalServices: ['body_composition', 'weight_scale', 'current_time']
      });
      this.estado('Conectando con ' + (device.name || 'la báscula') + '…');
      const server = await device.gatt.connect();

      let recibido = false;
      const procesar = (peso, extra) => {
        recibido = true;
        this.ultima = Object.assign({ peso, hora: Date.now() }, extra || {});
        this.estado('✅ Medición recibida. Súbete a la báscula si aún no lo has hecho.');
        this.render();
      };

      // Servicio Weight Scale (peso)
      try {
        const ws = await server.getPrimaryService('weight_scale');
        const wc = await ws.getCharacteristic('weight_measurement');
        await wc.startNotifications();
        wc.addEventListener('characteristicvaluechanged', (ev) => {
          const p = this.parseWeight(ev.target.value);
          if (p != null) procesar(p);
        });
      } catch (e) { /* sin weight scale */ }

      // Servicio Body Composition (grasa, músculo, agua, hueso, peso)
      try {
        const bs = await server.getPrimaryService('body_composition');
        const bcCh = await bs.getCharacteristic('body_composition_measurement');
        await bcCh.startNotifications();
        bcCh.addEventListener('characteristicvaluechanged', (ev) => {
          const d = this.parseBodyComposition(ev.target.value);
          if (d && d.peso != null) procesar(d.peso, d);
          else if (d && this.ultima) { Object.assign(this.ultima, d); this.render(); }
        });
      } catch (e) { /* sin body composition */ }

      this.estado('📲 Conectado. Súbete a la báscula ahora para recibir tu medición.');
      setTimeout(() => { if (!recibido) this.estado('Si no aparece nada, súbete a la báscula o verifica que sea compatible.', true); }, 12000);
    } catch (e) {
      const msg = /cancel/i.test(e.message) ? 'Cancelaste la conexión.' : 'No se pudo conectar. Verifica que tu báscula esté encendida y sea compatible.';
      this.estado(msg, true);
    }
  }

  // Weight Measurement (0x2A9D): flags(1) + peso uint16
  parseWeight(dv) {
    try {
      const flags = dv.getUint8(0);
      const si = !(flags & 0x01); // bit0: 0 = SI (kg), 1 = imperial (lb)
      const raw = dv.getUint16(1, true);
      let kg = si ? raw * 0.005 : raw * 0.01 * 0.453592;
      return Math.round(kg * 10) / 10;
    } catch (e) { return null; }
  }

  // Body Composition Measurement (0x2A9C): flags uint16 + body fat uint16(0.1%) + campos opcionales
  parseBodyComposition(dv) {
    try {
      const flags = dv.getUint16(0, true);
      let off = 2;
      const out = {};
      // Body Fat Percentage (siempre presente)
      out.grasa = Math.round(dv.getUint16(off, true) * 0.1 * 10) / 10; off += 2;
      const si = !(flags & 0x0001);
      // Recorremos los campos opcionales según flags (simplificado)
      if (flags & 0x0002) off += 7; // timestamp
      if (flags & 0x0004) off += 2; // user id
      if (flags & 0x0008) { off += 2; } // basal metabolism (kJ)
      if (flags & 0x0010) { off += 2; } // muscle percentage
      if (flags & 0x0020) { out.musculo = Math.round(dv.getUint16(off, true) * (si ? 0.005 : 0.01) * 10) / 10; off += 2; } // muscle mass
      if (flags & 0x0040) { off += 2; } // fat free mass
      if (flags & 0x0080) { out.aguaKg = Math.round(dv.getUint16(off, true) * (si ? 0.005 : 0.01) * 10) / 10; off += 2; } // soft lean / water
      if (flags & 0x0100) { off += 2; } // body water mass
      if (flags & 0x0200) { out.peso = Math.round(dv.getUint16(off, true) * (si ? 0.005 : 0.01) * 10) / 10; off += 2; } // weight
      if (out.aguaKg && out.peso) out.agua = Math.round((out.aguaKg / out.peso) * 100);
      return out;
    } catch (e) { return null; }
  }

  guardar() {
    const u = this.ultima;
    const app = window.nutriApp;
    if (!u || !app) return;
    const fecha = app.fechaActual;
    app.pesos[fecha] = u.peso;
    // Guardar composición corporal en salud diaria
    if (window.saludDiariaUI) {
      const d = window.saludDiariaUI.hoy();
      d.composicion = { peso: u.peso, grasa: u.grasa, musculo: u.musculo, agua: u.agua, imc: this.imc(u.peso), edadMetabolica: this.edadMetabolica(u.peso, u.grasa) };
      window.saludDiariaUI.guardar();
    }
    app.guardarTodo();
    app.renderPeso && app.renderPeso();
    app.toast && app.toast('✅ Peso y composición guardados', 'success');
  }
}

window.basculaUI = new BasculaUI();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if (window.basculaUI) window.basculaUI.render(); }, 500);
});
