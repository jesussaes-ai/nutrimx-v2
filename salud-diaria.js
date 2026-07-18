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
          <div class="sd-sub">Meta: 7-9 h</div>
          <div class="sd-btns">${[5, 6, 7, 8, 9, 10].map(h => `<button class="sd-mini ${sueno === h ? 'on' : ''}" data-sueno="${h}">${h}h</button>`).join('')}</div>
        </div>

        <div class="sd-card">
          <div class="sd-top"><span>👟 Pasos</span><b>${pasos.toLocaleString()}</b></div>
          <div class="sd-bar"><div class="sd-fill" style="width:${barra(pasos, 8000)}%;background:#0891b2"></div></div>
          <div class="sd-sub">Meta: 8,000</div>
          <div class="sd-input-row"><input type="number" id="sdPasos" class="input" placeholder="Pasos de hoy" min="0" max="60000" value="${pasos || ''}"><button class="btn btn-secondary sd-guardar" id="sdPasosBtn">✓</button></div>
        </div>

        <div class="sd-card">
          <div class="sd-top"><span>🧘 Relajación</span><b>${relax} min</b></div>
          <div class="sd-bar"><div class="sd-fill" style="width:${barra(relax, 15)}%;background:#7c3aed"></div></div>
          <div class="sd-sub">Respiración/meditación · Meta: 10-15 min</div>
          <div class="sd-btns">${[5, 10, 15, 20].map(m => `<button class="sd-mini ${relax === m ? 'on' : ''}" data-relax="${m}">${m}m</button>`).join('')}</div>
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
  }
}

window.saludDiariaUI = new SaludDiariaUI();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if (window.saludDiariaUI) window.saludDiariaUI.render(); }, 500);
});
