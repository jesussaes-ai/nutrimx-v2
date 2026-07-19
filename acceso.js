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
    // nube.init() decide primero (ya espera a descargar datos). Este temporizador es
    // solo una red de seguridad por si la nube no está disponible.
    setTimeout(() => this.verificarAcceso(), 2500);
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

  /** Intenta recuperar la evaluación desde la nube antes de darla por inexistente. */
  async restaurarDesdeNube() {
    if (!(window.nube && window.nube.activa && window.salud)) return false;
    try {
      const { data } = await window.nube.sb
        .from('profiles').select('datos').eq('id', window.nube.user.id).maybeSingle();
      if (data && data.datos && data.datos.analisis) {
        window.salud.datos = data.datos;
        window.salud.guardarLocal();
        window.salud.renderResumen();
        if (window.salud.aplicarObjetivos) window.salud.aplicarObjetivos();
        return true;
      }
    } catch (e) { console.warn('No se pudo restaurar la evaluación:', e); }
    return false;
  }

  /** Decide qué mostrar según sesión + registro. Llamar tras login, tras evaluación y al inicio. */
  async verificarAcceso() {
    const autenticado = !!(window.nube && window.nube.activa);

    if (!autenticado) {
      // Sin sesión → puerta cerrada.
      this.mostrarGate();
      return;
    }

    if (!this.registroCompleto()) {
      // Antes de pedir la evaluación de nuevo, buscarla en la nube (otro dispositivo/navegador).
      const restaurada = await this.restaurarDesdeNube();
      if (restaurada) { this.ocultarGate(); return; }

      // Realmente no existe → forzar registro completo (no se puede saltar).
      this.mostrarGate();
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
