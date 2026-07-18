/**
 * NutriMX v2.8 - Control de acceso (puerta de entrada)
 * La portada es la puerta: Iniciar sesión / Crear cuenta.
 * El dashboard SOLO se muestra cuando el usuario:
 *   1) tiene sesión iniciada, Y
 *   2) completó su registro con la evaluación inicial (datos + consentimiento).
 * Si falta la evaluación, se fuerza (obligatoria) antes de dar acceso.
 */

class AccesoUI {
  constructor() {
    this.listo = false;
  }

  init() {
    const splash = document.getElementById('splash');
    if (!splash) return;

    const btnReg = document.getElementById('splashRegistro');
    const btnLog = document.getElementById('splashLogin');
    if (btnReg) btnReg.addEventListener('click', () => window.nube && window.nube.abrirModal('registrar'));
    if (btnLog) btnLog.addEventListener('click', () => window.nube && window.nube.abrirModal('entrar'));

    // Estado inicial: mostrar la puerta hasta confirmar acceso.
    this.mostrarGate();
    // nube.init() decidirá; damos un margen para que cargue la sesión.
    setTimeout(() => this.verificarAcceso(), 800);
  }

  /** ¿El usuario completó su registro (evaluación con análisis)? */
  registroCompleto() {
    return !!(window.salud && window.salud.datos && window.salud.datos.analisis);
  }

  mostrarGate() {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.remove('oculta');
    document.body.classList.add('bloqueado');
  }

  ocultarGate() {
    const splash = document.getElementById('splash');
    if (splash) splash.classList.add('oculta');
    document.body.classList.remove('bloqueado');
  }

  /** Decide qué mostrar según sesión + registro. Llamar tras login, tras evaluación y al inicio. */
  verificarAcceso() {
    const autenticado = !!(window.nube && window.nube.activa);

    if (!autenticado) {
      // Sin sesión → puerta cerrada.
      this.mostrarGate();
      return;
    }

    if (!this.registroCompleto()) {
      // Con sesión pero sin evaluación → forzar registro completo (no se puede saltar).
      this.mostrarGate(); // el fondo sigue bloqueado detrás del wizard
      if (window.salud) window.salud.abrirObligatorio();
      return;
    }

    // Sesión + registro completo → acceso concedido al dashboard.
    this.ocultarGate();
  }

  /** Llamado al cerrar sesión. */
  alSalir() {
    this.mostrarGate();
  }
}

window.acceso = new AccesoUI();
document.addEventListener('DOMContentLoaded', () => window.acceso.init());
