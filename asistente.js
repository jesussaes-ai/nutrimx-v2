/**
 * NutriMX v2.5 - Asistente de IA (NutriCoach)
 * Chat flotante de nutrición, ejercicio y salud. Usa la edge function 'asistente'
 * (proveedor LLM configurable: Anthropic u OpenRouter). Requiere sesión iniciada.
 */

class AsistenteUI {
  constructor() {
    this.mensajes = this.cargar();
    this.abierto = false;
    this.pensando = false;
  }

  cargar() {
    try { return JSON.parse(localStorage.getItem('nutrimx_chat') || '[]'); } catch (e) { return []; }
  }

  guardar() {
    localStorage.setItem('nutrimx_chat', JSON.stringify(this.mensajes.slice(-30)));
  }

  init() {
    // Botón flotante
    const fab = document.createElement('button');
    fab.id = 'chatFab';
    fab.className = 'chat-fab';
    fab.innerHTML = '🤖';
    fab.setAttribute('aria-label', 'Abrir asistente NutriCoach');
    fab.addEventListener('click', () => this.toggle());
    document.body.appendChild(fab);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'chatPanel';
    panel.className = 'chat-panel hidden';
    panel.innerHTML = `
      <div class="chat-head">
        <span>🤖 NutriCoach <small>· nutrición, ejercicio y salud</small></span>
        <button class="auth-btn" id="chatCerrar">✕</button>
      </div>
      <div class="chat-mensajes" id="chatMensajes"></div>
      <div class="chat-input-zona">
        <input type="text" id="chatInput" class="input" placeholder="Pregúntame de nutrición o ejercicio..." maxlength="1000">
        <button class="btn btn-primary" id="chatEnviar">➤</button>
      </div>
      <p class="chat-nota">Orientación educativa — no sustituye a tu médico.</p>`;
    document.body.appendChild(panel);

    document.getElementById('chatCerrar').addEventListener('click', () => this.toggle());
    document.getElementById('chatEnviar').addEventListener('click', () => this.enviar());
    document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') this.enviar(); });

    this.renderMensajes();
  }

  toggle() {
    this.abierto = !this.abierto;
    document.getElementById('chatPanel').classList.toggle('hidden', !this.abierto);
    if (this.abierto) {
      if (!this.mensajes.length) {
        this.mensajes.push({ role: 'assistant', content: '¡Hola! 💪 Soy NutriCoach. Pregúntame lo que quieras sobre nutrición, ejercicio, suplementos o hábitos. ¿En qué te ayudo hoy?' });
        this.renderMensajes();
      }
      setTimeout(() => document.getElementById('chatInput').focus(), 100);
    }
  }

  contextoUsuario() {
    try {
      const s = JSON.parse(localStorage.getItem('nutrimx_salud') || 'null');
      if (!s || !s.analisis) return '';
      const cond = Object.entries(s.salud || {}).filter(([k, v]) => v === true).map(([k]) => k).join(', ');
      return `${s.sexo}, ${s.edad} años, IMC ${s.analisis.imc} (${s.analisis.catIMC}), objetivo: ${s.objetivo}, kcal diarias: ${s.analisis.kcalObjetivo}, proteína: ${s.analisis.proteina}g. Condiciones: ${cond || 'ninguna'}.`;
    } catch (e) { return ''; }
  }

  async enviar() {
    const input = document.getElementById('chatInput');
    const texto = input.value.trim();
    if (!texto || this.pensando) return;

    if (!window.nube || !window.nube.activa) {
      this.mensajes.push({ role: 'user', content: texto });
      this.mensajes.push({ role: 'assistant', content: '🔒 Para chatear conmigo necesitas iniciar sesión (botón arriba a la derecha). ¡Es gratis y así puedo personalizar mis consejos!' });
      input.value = '';
      this.renderMensajes();
      return;
    }

    this.mensajes.push({ role: 'user', content: texto });
    input.value = '';
    this.pensando = true;
    this.renderMensajes(true);

    try {
      const modelo = window.modeloUI ? window.modeloUI.get() : '';
      const { data, error } = await window.nube.sb.functions.invoke('asistente', {
        body: {
          mensajes: this.mensajes.filter(m => m.role === 'user' || m.role === 'assistant').slice(-10),
          contexto: this.contextoUsuario(),
          model: modelo || undefined
        }
      });
      if (error || !data || !data.ok) throw new Error((data && data.error) || 'Sin respuesta');
      this.mensajes.push({ role: 'assistant', content: data.respuesta });
    } catch (e) {
      this.mensajes.push({ role: 'assistant', content: '⚠️ ' + (e.message || 'No pude responder, intenta de nuevo.') });
    } finally {
      this.pensando = false;
      this.guardar();
      this.renderMensajes();
    }
  }

  renderMensajes(pensando = false) {
    const cont = document.getElementById('chatMensajes');
    if (!cont) return;
    cont.innerHTML = this.mensajes.map(m =>
      `<div class="chat-msg chat-${m.role === 'user' ? 'user' : 'bot'}">${this.escapar(m.content)}</div>`
    ).join('') + (pensando || this.pensando ? '<div class="chat-msg chat-bot chat-pensando">Escribiendo<span>.</span><span>.</span><span>.</span></div>' : '');
    cont.scrollTop = cont.scrollHeight;
  }

  escapar(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML.replace(/\n/g, '<br>');
  }
}

window.asistente = new AsistenteUI();
document.addEventListener('DOMContentLoaded', () => window.asistente.init());
