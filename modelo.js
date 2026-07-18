/**
 * NutriMX v2.6 - Selector de modelo de IA (panel en Ajustes)
 * Permite a cada usuario elegir el modelo que le convenga. La elección se guarda
 * por usuario (localStorage + profiles.modelo) y se envía a las edge functions.
 * La API key nunca sale del servidor. Lista blanca controlada para evitar abuso de costos.
 */

const MODELOS_DISPONIBLES = [
  { id: '', label: '⭐ Predeterminado (Claude Haiku — económico)', nota: 'La opción del servidor. Rápido y barato.' },
  { id: 'openai/gpt-4o', label: 'GPT-4o (OpenAI)', nota: 'Excelente reconociendo comida. Costo medio.' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o mini (OpenAI)', nota: 'Muy barato, buena calidad.' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (Anthropic)', nota: 'Muy preciso. Costo medio-alto.' },
  { id: 'anthropic/claude-haiku-4.5', label: 'Claude Haiku 4.5 (Anthropic)', nota: 'Económico y rápido.' },
  { id: 'google/gemini-flash-1.5', label: 'Gemini 1.5 Flash (Google)', nota: 'El más económico.' },
  { id: 'google/gemini-pro-1.5', label: 'Gemini 1.5 Pro (Google)', nota: 'Alta calidad. Costo medio.' },
  { id: 'meta-llama/llama-3.2-90b-vision-instruct', label: 'Llama 3.2 90B Visión (Meta)', nota: 'Open source, económico.' },
  { id: '__custom__', label: '✏️ Otro modelo (personalizado)…', nota: 'Escribe cualquier ID de modelo de OpenRouter.' }
];

class ModeloUI {
  constructor() {
    this.actual = localStorage.getItem('nutrimx_modelo') || '';
  }

  /** Devuelve el modelo elegido para enviar a las funciones ('' = usar default del servidor). */
  get() { return this.actual || ''; }

  guardar(model) {
    this.actual = model || '';
    if (this.actual) localStorage.setItem('nutrimx_modelo', this.actual);
    else localStorage.removeItem('nutrimx_modelo');
    // Sincronizar por usuario
    if (window.nube && window.nube.activa) {
      window.nube.sb.from('profiles').upsert({
        id: window.nube.user.id, modelo: this.actual, updated_at: new Date().toISOString()
      }).then(() => {}, e => console.warn('modelo sync', e));
    }
  }

  render() {
    const cont = document.getElementById('configModelo');
    if (!cont) return;
    const enLista = MODELOS_DISPONIBLES.some(m => m.id === this.actual);
    const custom = this.actual && !enLista;
    const opciones = MODELOS_DISPONIBLES.map(m => {
      const sel = (m.id === this.actual || (custom && m.id === '__custom__')) ? 'selected' : '';
      return `<option value="${m.id}" ${sel}>${m.label}</option>`;
    }).join('');

    cont.innerHTML = `
      <h3 class="font-bold mb-1">🤖 Modelo de Inteligencia Artificial</h3>
      <p class="text-sm text-gray-500 mb-3">Elige el modelo que analiza tus fotos y responde en el asistente. Puedes cambiarlo cuando quieras según tu preferencia y presupuesto.</p>
      <select id="modeloSelect" class="input mb-2">${opciones}</select>
      <input type="text" id="modeloCustom" class="input mb-2 ${custom ? '' : 'hidden'}" placeholder="ej. mistralai/pixtral-12b" value="${custom ? this.actual : ''}">
      <p id="modeloNota" class="text-xs text-gray-400 mb-3"></p>
      <button class="btn btn-primary" id="modeloGuardar">Guardar modelo</button>
      <p id="modeloOk" class="text-xs mt-2 hidden" style="color:#059669;">✅ Modelo actualizado</p>
      <p class="text-xs text-gray-400 mt-3">💡 Los modelos con "/" usan OpenRouter (requiere que el proveedor esté configurado). La lista es orientativa; el costo lo define tu proveedor.</p>`;

    const sel = document.getElementById('modeloSelect');
    const inp = document.getElementById('modeloCustom');
    const nota = document.getElementById('modeloNota');
    const setNota = () => {
      const m = MODELOS_DISPONIBLES.find(x => x.id === sel.value);
      nota.textContent = m ? m.nota : '';
    };
    setNota();
    sel.addEventListener('change', () => {
      inp.classList.toggle('hidden', sel.value !== '__custom__');
      setNota();
    });
    document.getElementById('modeloGuardar').addEventListener('click', () => {
      let elegido = sel.value;
      if (elegido === '__custom__') elegido = inp.value.trim();
      this.guardar(elegido);
      const ok = document.getElementById('modeloOk');
      ok.classList.remove('hidden');
      setTimeout(() => ok.classList.add('hidden'), 2500);
      if (window.nutriApp && window.nutriApp.toast) window.nutriApp.toast('🤖 Modelo de IA actualizado', 'success');
    });
  }
}

window.modeloUI = new ModeloUI();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => window.modeloUI.render(), 300);
});
