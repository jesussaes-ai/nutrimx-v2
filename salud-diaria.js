/**
 * NutriMX v3.5 - Rutinas de salud diarias (dashboard)
 * Registra sueño, pasos, ánimo/energía, minutos de relajación y hábitos saludables.
 * Se guarda por día en localStorage y se sincroniza a la nube (profiles/dias) si hay sesión.
 */

class SaludDiariaUI {
  constructor() {
    this.datos = this.cargar();
  }

  cargar() {
    try { return JSON.parse(localStorage.getItem('nutrimx_salud_diaria') || '{}'); } catch (e) { return {}; }
  }

  guardar() {
    localStorage.setItem('nutrimx_salud_diaria', JSON.stringify(this.datos));
    if (window.nube && window.nube.activa) {
      const fecha = this.fecha();
      window.nube.sb.from('dias').upsert({
        user_id: window.nube.user.id, fecha, salud: this.datos[fecha] || {}, updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,fecha' }).then(() => {}, () => {});
    }
  }

  fecha() {
    return (window.nutriApp && window.nutriApp.fechaActual) || new Date().toISOString().slice(0, 10);
  }

  hoy() {
    const f = this.fecha();
    if (!this.datos[f]) this.datos[f] = {};
    return this.datos[f];
  }

  set(campo, valor) {
    this.hoy()[campo] = valor;
    this.guardar();
    this.render();
    if (window.nutriApp && window.nutriApp.toast) window.nutriApp.toast('💚 Registrado', 'success');
  }

  toggleHabito(h) {
    const d = this.hoy();
    d.habitos = d.habitos || {};
    d.habitos[h] = !d.habitos[h];
    this.guardar();
    this.render();
  }

  render() {
    const cont = document.getElementById('saludDiaria');
    if (!cont) return;
    const d = this.hoy();
    const sueno = d.sueno || 0;
    const pasos = d.pasos || 0;
    const relax = d.relax || 0;
    const animo = d.animo || 0;
    const barra = (val, meta) => Math.min(100, Math.round((val / meta) * 100));

    const habitos = [
      ['dormir', '😴 Dormí 7-9 horas'],
      ['pasos', '👟 Me moví / caminé'],
      ['agua', '💧 Tomé suficiente agua'],
      ['verduras', '🥦 Comí verduras y fruta'],
      ['sol', '☀️ Me dio el sol (vit. D)'],
      ['sinultra', '🚫 Evité ultraprocesados'],
      ['estirar', '🧘 Estiré / respiré profundo'],
      ['pantalla', '📵 Corté pantallas antes de dormir']
    ];
    const dh = d.habitos || {};
    const hechos = habitos.filter(([k]) => dh[k]).length;

    const emojisAnimo = ['😞', '😐', '🙂', '😊', '🤩'];

    cont.innerHTML = `
      <h3 class="font-bold text-lg mb-1">💚 Rutinas de salud de hoy</h3>
      <p class="text-sm text-gray-500 mb-3">Dormir bien, moverte y calmar el estrés cuentan tanto como comer bien.</p>

      <div class="sd-grid">
        <div class="sd-card">
          <div class="sd-top"><span>😴 Sueño</span><b>${sueno} h</b></div>
          <div class="sd-bar"><div class="sd-fill" style="width:${barra(sueno, 8)}%;background:#6366f1"></div></div>
          <div class="sd-sub">Referencia: 7-9 h — pero cada persona es distinta (turnos, guardias, condición médica)</div>
          <div class="sd-btns">${[0, 4, 5, 6, 7, 8, 9, 10, 12].map(h => `<button class="sd-mini ${sueno === h ? 'on' : ''}" data-sueno="${h}">${h}h</button>`).join('')}</div>
          <div class="sd-input-row" style="margin-top:8px">
            <button class="agua-btn sd-paso" data-sueno-paso="-0.5" title="Media hora menos">−</button>
            <input type="number" id="sdSueno" class="input" placeholder="Horas" min="0" max="24" step="0.5" value="${sueno || ''}">
            <button class="agua-btn sd-paso" data-sueno-paso="0.5" title="Media hora más">+</button>
            <button class="btn btn-secondary sd-guardar" id="sdSuenoBtn">✓</button>
          </div>
          <div class="sd-sub" style="margin-top:6px">Escribe cualquier cantidad (0 a 24 h, admite medias horas). Si trabajas de noche o dormiste por partes, suma todo lo que dormiste en el día.</div>
        </div>

        <div class="sd-card">
          <div class="sd-top"><span>👟 Pasos</span><b>${pasos.toLocaleString()}</b></div>
          <div class="sd-bar"><div class="sd-fill" style="width:${barra(pasos, 8000)}%;background:#0891b2"></div></div>
          <div class="sd-sub">Meta: 8,000</div>
          <div class="sd-input-row"><input type="number" id="sdPasos" class="input" placeholder="Pasos de hoy" min="0" max="60000" value="${pasos || ''}"><button class="btn btn-secondary sd-guardar" id="sdPasosBtn">✓</button></div>
        </div>

        <div class="sd-card">
          <div class="sd-top"><span>🧘 Relajación</span><b>${relax} min</b></div>
          <div class="sd-bar"><div class="sd-fill" style="width:${barra(relax, 60)}%;background:#7c3aed"></div></div>
          <div class="sd-sub">Respiración / meditación · Referencia: 10-15 min (hasta 1 hora si meditas más)</div>
          <div class="sd-btns">${[10, 20, 30, 40, 50, 60].map(m => `<button class="sd-mini ${relax === m ? 'on' : ''}" data-relax="${m}">${m}m</button>`).join('')}</div>
          <div class="sd-input-row" style="margin-top:8px">
            <button class="agua-btn sd-paso" data-relax-paso="-5" title="5 min menos">−</button>
            <input type="number" id="sdRelax" class="input" placeholder="Minutos" min="0" max="180" step="5" value="${relax || ''}">
            <button class="agua-btn sd-paso" data-relax-paso="5" title="5 min más">+</button>
            <button class="btn btn-secondary sd-guardar" id="sdRelaxBtn">✓</button>
          </div>
        </div>

        <div class="sd-card">
          <div class="sd-top"><span>😊 Ánimo / energía</span></div>
          <div class="sd-animo">${emojisAnimo.map((e, i) => `<button class="sd-emoji ${animo === i + 1 ? 'on' : ''}" data-animo="${i + 1}">${e}</button>`).join('')}</div>
          <div class="sd-sub">${animo ? '¡Registrado!' : 'Toca cómo te sientes hoy'}</div>
        </div>
      </div>

      <h4 class="sd-h4">✅ Hábitos saludables de hoy <span class="sd-cont">${hechos}/${habitos.length}</span></h4>
      <div class="sd-habitos">
        ${habitos.map(([k, t]) => `<label class="sd-habito ${dh[k] ? 'on' : ''}"><input type="checkbox" ${dh[k] ? 'checked' : ''} data-habito="${k}"> ${t}</label>`).join('')}
      </div>
      <p class="text-xs text-gray-400 mt-2">Constancia > perfección. Marca lo que sí lograste hoy. 💪</p>`;

    // Listeners
    cont.querySelectorAll('[data-sueno]').forEach(b => b.addEventListener('click', () => this.set('sueno', parseInt(b.dataset.sueno))));
    cont.querySelectorAll('[data-relax]').forEach(b => b.addEventListener('click', () => this.set('relax', parseInt(b.dataset.relax))));
    cont.querySelectorAll('[data-animo]').forEach(b => b.addEventListener('click', () => this.set('animo', parseInt(b.dataset.animo))));
    cont.querySelectorAll('[data-habito]').forEach(c => c.addEventListener('change', () => this.toggleHabito(c.dataset.habito)));
    const pb = document.getElementById('sdPasosBtn');
    if (pb) pb.addEventListener('click', () => {
      const v = parseInt(document.getElementById('sdPasos').value) || 0;
      this.set('pasos', v);
    });

    // Sueño: campo libre (0-24 h, medias horas) + botones de medio paso
    const guardarSueno = () => {
      let v = parseFloat(document.getElementById('sdSueno').value) || 0;
      this.set('sueno', Math.max(0, Math.min(24, Math.round(v * 2) / 2)));
    };
    const sb = document.getElementById('sdSuenoBtn');
    if (sb) sb.addEventListener('click', guardarSueno);
    const si = document.getElementById('sdSueno');
    if (si) si.addEventListener('keydown', e => { if (e.key === 'Enter') { si.blur(); guardarSueno(); } });
    cont.querySelectorAll('[data-sueno-paso]').forEach(b => b.addEventListener('click', () => {
      const paso = parseFloat(b.dataset.suenoPaso);
      this.set('sueno', Math.max(0, Math.min(24, (this.hoy().sueno || 0) + paso)));
    }));

    // Relajación: campo libre en minutos + pasos de 5
    const guardarRelax = () => {
      let v = parseInt(document.getElementById('sdRelax').value) || 0;
      this.set('relax', Math.max(0, Math.min(180, v)));
    };
    const rb = document.getElementById('sdRelaxBtn');
    if (rb) rb.addEventListener('click', guardarRelax);
    const ri = document.getElementById('sdRelax');
    if (ri) ri.addEventListener('keydown', e => { if (e.key === 'Enter') { ri.blur(); guardarRelax(); } });
    cont.querySelectorAll('[data-relax-paso]').forEach(b => b.addEventListener('click', () => {
      const paso = parseInt(b.dataset.relaxPaso);
      this.set('relax', Math.max(0, Math.min(180, (this.hoy().relax || 0) + paso)));
    }));
  }
}

window.saludDiariaUI = new SaludDiariaUI();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if (window.saludDiariaUI) window.saludDiariaUI.render(); }, 500);
});
