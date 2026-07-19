/**
 * NutriMX v4.1 - Cierre de sesión por inactividad
 * Como la app maneja datos de salud (datos sensibles), la sesión se cierra sola
 * tras un periodo sin actividad, avisando antes para que puedas continuar.
 * Estándar en apps de salud y banca.
 */

class SesionUI {
  constructor() {
    this.MINUTOS = 30;        // inactividad permitida
    this.AVISO_SEG = 60;      // aviso antes de cerrar
    this.timer = null;
    this.timerAviso = null;
    this.cuenta = null;
  }

  init() {
    // Reiniciar el contador con cualquier señal de actividad
    ['click', 'keydown', 'touchstart', 'scroll', 'mousemove'].forEach(ev =>
      document.addEventListener(ev, () => this.reiniciar(), { passive: true }));
    // Al volver a la pestaña, revisar si expiró mientras estaba fuera
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.revisarAlVolver();
    });
    this.reiniciar();
  }

  activa() { return !!(window.nube && window.nube.activa); }

  reiniciar() {
    localStorage.setItem('nutrimx_ultima_actividad', String(Date.now()));
    this.cerrarAviso();
    clearTimeout(this.timer);
    clearTimeout(this.timerAviso);
    if (!this.activa()) return;
    const msTotal = this.MINUTOS * 60 * 1000;
    this.timerAviso = setTimeout(() => this.mostrarAviso(), msTotal - this.AVISO_SEG * 1000);
    this.timer = setTimeout(() => this.cerrarSesion(), msTotal);
  }

  /** Si estuvo fuera más del tiempo permitido, cerrar al volver. */
  revisarAlVolver() {
    if (!this.activa()) return;
    const ult = parseInt(localStorage.getItem('nutrimx_ultima_actividad') || '0');
    if (ult && Date.now() - ult > this.MINUTOS * 60 * 1000) this.cerrarSesion();
    else this.reiniciar();
  }

  mostrarAviso() {
    if (!this.activa() || document.getElementById('sesionAviso')) return;
    const d = document.createElement('div');
    d.id = 'sesionAviso';
    d.className = 'sesion-aviso';
    d.innerHTML = `
      <div class="sesion-caja">
        <div class="sesion-icono">🔒</div>
        <h3>¿Sigues ahí?</h3>
        <p>Por tu seguridad cerraremos tu sesión en <strong id="sesionCuenta">${this.AVISO_SEG}</strong> segundos,
        porque la app guarda información de tu salud.</p>
        <div class="sesion-btns">
          <button class="btn btn-primary" id="sesionSeguir">Sí, sigo aquí</button>
          <button class="btn btn-secondary" id="sesionSalir">Cerrar sesión</button>
        </div>
      </div>`;
    document.body.appendChild(d);

    let seg = this.AVISO_SEG;
    this.cuenta = setInterval(() => {
      seg--;
      const el = document.getElementById('sesionCuenta');
      if (el) el.textContent = seg;
      if (seg <= 0) clearInterval(this.cuenta);
    }, 1000);

    document.getElementById('sesionSeguir').addEventListener('click', () => this.reiniciar());
    document.getElementById('sesionSalir').addEventListener('click', () => this.cerrarSesion());
  }

  cerrarAviso() {
    clearInterval(this.cuenta);
    const d = document.getElementById('sesionAviso');
    if (d) d.remove();
  }

  async cerrarSesion() {
    this.cerrarAviso();
    clearTimeout(this.timer);
    clearTimeout(this.timerAviso);
    if (window.nube && window.nube.activa) {
      try { await window.nube.salir(); } catch (e) { console.warn(e); }
      if (window.nutriApp && window.nutriApp.toast)
        window.nutriApp.toast('🔒 Cerramos tu sesión por seguridad (30 min sin actividad)', 'info');
    }
  }
}

window.sesionUI = new SesionUI();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => window.sesionUI.init(), 1500);
});
