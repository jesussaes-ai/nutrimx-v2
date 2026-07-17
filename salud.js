/**
 * NutriMX v2.3 - Evaluación inicial de salud y análisis personalizado
 * Cuestionario tipo PAR-Q+ (estándar internacional pre-ejercicio) + datos generales.
 * Calcula IMC, TMB/TDEE y genera recomendaciones seguras de ejercicio según condiciones
 * (diabetes, hipertensión, cardiopatía, fracturas, cirugías, embarazo...).
 * Datos de salud = datos sensibles (LFPDPPP Art. 3-VI): requieren consentimiento expreso.
 */

class SaludUI {
  constructor() {
    this.paso = 1;
    this.datos = this.cargarLocal();
  }

  cargarLocal() {
    try { return JSON.parse(localStorage.getItem('nutrimx_salud') || 'null'); } catch (e) { return null; }
  }

  guardarLocal() {
    localStorage.setItem('nutrimx_salud', JSON.stringify(this.datos));
  }

  /** Llamado tras login/registro y al inicio: abre el wizard si no hay evaluación. */
  verificar() {
    if (!this.datos) this.abrir();
    else this.renderResumen();
  }

  // ==================== WIZARD ====================

  abrir() {
    this.paso = 1;
    let m = document.getElementById('saludModal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'saludModal';
      m.className = 'auth-modal';
      document.body.appendChild(m);
    }
    m.classList.remove('hidden');
    this.renderPaso();
  }

  cerrar() {
    const m = document.getElementById('saludModal');
    if (m) m.classList.add('hidden');
  }

  v(id) { const el = document.getElementById(id); return el ? el.value : ''; }
  c(id) { const el = document.getElementById(id); return el ? el.checked : false; }

  renderPaso() {
    const m = document.getElementById('saludModal');
    const d = this.datos || {};
    const s = d.salud || {};
    let cuerpo = '';

    if (this.paso === 1) {
      cuerpo = `
        <h3 class="auth-titulo">📋 Tu evaluación inicial (1/3)</h3>
        <p class="salud-sub">Con estos datos personalizamos tus calorías, proteína y ejercicios seguros.</p>
        <div class="salud-grid">
          <div><label class="auth-label">Sexo</label>
            <select id="evSexo" class="input">
              <option value="hombre" ${d.sexo === 'hombre' ? 'selected' : ''}>Hombre</option>
              <option value="mujer" ${d.sexo === 'mujer' ? 'selected' : ''}>Mujer</option>
            </select></div>
          <div><label class="auth-label">Edad (años)</label>
            <input type="number" id="evEdad" class="input" min="5" max="110" value="${d.edad || ''}" placeholder="35"></div>
          <div><label class="auth-label">Peso (kg)</label>
            <input type="number" id="evPeso" class="input" min="15" max="300" step="0.1" value="${d.peso || ''}" placeholder="78"></div>
          <div><label class="auth-label">Estatura (cm)</label>
            <input type="number" id="evEstatura" class="input" min="80" max="230" value="${d.estatura || ''}" placeholder="170"></div>
          <div><label class="auth-label">Nivel de actividad</label>
            <select id="evActividad" class="input">
              <option value="sedentario">Sedentario (oficina, poco movimiento)</option>
              <option value="ligero">Ligero (camino algo, 1-2 entrenos/sem)</option>
              <option value="moderado" selected>Moderado (3-5 entrenos/sem)</option>
              <option value="activo">Activo (6-7 entrenos/sem)</option>
            </select></div>
          <div><label class="auth-label">Objetivo principal</label>
            <select id="evObjetivo" class="input">
              <option value="perder">Perder grasa</option>
              <option value="mantener">Mantenerme / salud</option>
              <option value="ganar">Ganar músculo</option>
            </select></div>
        </div>
        <button class="btn btn-primary auth-submit" id="saludSig1">Siguiente →</button>`;
    } else if (this.paso === 2) {
      const items = [
        ['diabetes', '🩸 Tengo diabetes (tipo 1 o 2)'],
        ['hipertension', '❤️ Tengo hipertensión (presión alta)'],
        ['cardiaco', '💔 Tengo o he tenido un problema del corazón'],
        ['dolorPecho', '⚠️ Siento dolor en el pecho al hacer esfuerzo'],
        ['mareos', '😵 He tenido mareos o pérdida de conocimiento recientes'],
        ['fractura', '🦴 Tengo una fractura, lesión ósea o articular reciente'],
        ['cirugia', '🏥 Tuve una cirugía en los últimos 6 meses'],
        ['embarazo', '🤰 Estoy embarazada o di a luz hace menos de 3 meses'],
        ['medicamentos', '💊 Tomo medicamentos de forma regular (presión, corazón, insulina...)'],
        ['articular', '🦵 Tengo dolor articular crónico (rodillas, cadera, espalda)']
      ];
      cuerpo = `
        <h3 class="auth-titulo">🏥 Tu salud (2/3)</h3>
        <p class="salud-sub">Marca lo que aplique. Esto define qué ejercicios te benefician y cuáles evitar. Es información sensible y está protegida (solo tú puedes verla).</p>
        <div class="salud-checks">
          ${items.map(([k, t]) => `<label class="salud-check"><input type="checkbox" id="ev_${k}" ${s[k] ? 'checked' : ''}> ${t}</label>`).join('')}
        </div>
        <label class="auth-label" for="evNotas">Detalles que quieras agregar (opcional: dónde fue la fractura/cirugía, qué medicamentos...)</label>
        <textarea id="evNotas" class="input" rows="2" placeholder="Ej. cirugía de rodilla derecha en marzo">${s.notas || ''}</textarea>
        <div class="salud-nav">
          <button class="btn btn-secondary" id="saludAtras2">← Atrás</button>
          <button class="btn btn-primary" id="saludSig2">Siguiente →</button>
        </div>`;
    } else if (this.paso === 3) {
      cuerpo = `
        <h3 class="auth-titulo">🔐 Privacidad y consentimiento (3/3)</h3>
        <p class="salud-sub">Tus datos de salud son <strong>datos personales sensibles</strong> protegidos por la Ley Federal de Protección de Datos Personales (México) y estándares internacionales.</p>
        <label class="salud-check salud-consent"><input type="checkbox" id="evConsAviso">
          He leído y acepto el <a href="./aviso-privacidad.html" target="_blank" rel="noopener">Aviso de Privacidad</a>.</label>
        <label class="salud-check salud-consent"><input type="checkbox" id="evConsSalud">
          <strong>Consiento expresamente</strong> el tratamiento de mis datos de salud para personalizar mis planes de ejercicio y nutrición.</label>
        <p class="auth-nota">Puedes revocar tu consentimiento y borrar tus datos cuando quieras desde esta misma evaluación (derechos ARCO). Contacto: jesussaes@gmail.com</p>
        <p id="saludError" class="auth-error hidden"></p>
        <div class="salud-nav">
          <button class="btn btn-secondary" id="saludAtras3">← Atrás</button>
          <button class="btn btn-primary" id="saludFin">✅ Generar mi análisis</button>
        </div>`;
    } else {
      cuerpo = this.renderAnalisis() + `
        <div class="salud-nav">
          <button class="btn btn-secondary" id="saludBorrar">🗑️ Borrar mis datos</button>
          <button class="btn btn-primary" id="saludCerrarFin">Entendido</button>
        </div>`;
    }

    m.innerHTML = `<div class="auth-caja salud-caja"><button class="auth-cerrar" id="saludCerrarX">✕</button>${cuerpo}</div>`;

    // Listeners
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('saludCerrarX', () => this.cerrar());
    on('saludSig1', () => this.guardarPaso1());
    on('saludAtras2', () => { this.paso = 1; this.renderPaso(); });
    on('saludSig2', () => this.guardarPaso2());
    on('saludAtras3', () => { this.paso = 2; this.renderPaso(); });
    on('saludFin', () => this.finalizar());
    on('saludCerrarFin', () => { this.cerrar(); this.renderResumen(); });
    on('saludBorrar', () => this.borrarDatos());
  }

  guardarPaso1() {
    const edad = parseInt(this.v('evEdad'));
    const peso = parseFloat(this.v('evPeso'));
    const est = parseInt(this.v('evEstatura'));
    if (!edad || !peso || !est) { alert('Completa edad, peso y estatura'); return; }
    this.datos = this.datos || {};
    Object.assign(this.datos, {
      sexo: this.v('evSexo'), edad, peso, estatura: est,
      actividad: this.v('evActividad'), objetivo: this.v('evObjetivo')
    });
    this.paso = 2; this.renderPaso();
  }

  guardarPaso2() {
    const claves = ['diabetes','hipertension','cardiaco','dolorPecho','mareos','fractura','cirugia','embarazo','medicamentos','articular'];
    const salud = {};
    claves.forEach(k => { salud[k] = this.c('ev_' + k); });
    salud.notas = this.v('evNotas').trim();
    this.datos.salud = salud;
    this.paso = 3; this.renderPaso();
  }

  finalizar() {
    const err = document.getElementById('saludError');
    if (!this.c('evConsAviso') || !this.c('evConsSalud')) {
      err.textContent = 'Para continuar necesitas aceptar el aviso de privacidad y dar tu consentimiento expreso (tus datos de salud lo requieren por ley).';
      err.classList.remove('hidden');
      return;
    }
    this.datos.consentimientos = {
      aviso: true, saludExpreso: true,
      fecha: new Date().toISOString(),
      version: 'aviso-v1-2026'
    };
    this.datos.analisis = this.analizar();
    this.guardarLocal();
    this.aplicarObjetivos();
    this.subirNube();
    this.paso = 4; this.renderPaso();
  }

  async subirNube() {
    if (window.nube && window.nube.activa) {
      try {
        await window.nube.sb.from('profiles').upsert({
          id: window.nube.user.id,
          datos: this.datos,
          consentimientos: this.datos.consentimientos,
          updated_at: new Date().toISOString()
        });
      } catch (e) { console.warn('No se pudo subir la evaluación:', e); }
    }
  }

  async borrarDatos() {
    if (!confirm('¿Borrar tu evaluación y datos de salud? Esto revoca tu consentimiento (derecho de cancelación ARCO).')) return;
    this.datos = null;
    localStorage.removeItem('nutrimx_salud');
    if (window.nube && window.nube.activa) {
      try {
        await window.nube.sb.from('profiles').update({ datos: null, consentimientos: { revocado: new Date().toISOString() } }).eq('id', window.nube.user.id);
      } catch (e) { console.warn(e); }
    }
    this.cerrar();
    this.renderResumen();
    window.nutriApp && window.nutriApp.toast('🗑️ Datos de salud eliminados', 'success');
  }

  // ==================== ANÁLISIS ====================

  analizar() {
    const d = this.datos, s = d.salud;
    const alturaM = d.estatura / 100;
    const imc = Math.round((d.peso / (alturaM * alturaM)) * 10) / 10;
    const catIMC = imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Peso saludable' : imc < 30 ? 'Sobrepeso' : 'Obesidad';

    // TMB Mifflin-St Jeor
    const tmb = Math.round(10 * d.peso + 6.25 * d.estatura - 5 * d.edad + (d.sexo === 'hombre' ? 5 : -161));
    const factores = { sedentario: 1.2, ligero: 1.375, moderado: 1.55, activo: 1.725 };
    const tdee = Math.round(tmb * (factores[d.actividad] || 1.4));
    let kcalObjetivo = tdee;
    if (d.objetivo === 'perder') kcalObjetivo = Math.max(Math.round(tdee * 0.8), tmb, d.sexo === 'mujer' ? 1200 : 1500);
    if (d.objetivo === 'ganar') kcalObjetivo = Math.round(tdee * 1.08);
    const proteina = Math.round(d.peso * (d.edad >= 60 ? 1.6 : d.objetivo === 'perder' ? 2.0 : 1.8));

    // Banderas rojas PAR-Q → médico primero
    const rojas = [];
    if (s.dolorPecho) rojas.push('dolor en el pecho al esforzarte');
    if (s.cardiaco) rojas.push('antecedente cardiaco');
    if (s.mareos) rojas.push('mareos o desmayos recientes');
    if (s.cirugia) rojas.push('cirugía reciente (necesitas alta médica)');
    const requiereMedico = rojas.length > 0;

    // Perfil y modalidad sugeridos
    let perfil = d.edad < 14 ? 'ninos' : d.edad >= 60 ? 'mayores' : d.sexo;
    let modalidad = 'completa';
    if (requiereMedico || s.embarazo) modalidad = 'suave';
    if (s.fractura || (s.articular && imc >= 30)) modalidad = 'bajo_impacto';
    if (s.cirugia) modalidad = 'silla_cama';

    // Recomendaciones y precauciones específicas
    const rec = [], prec = [];
    if (requiereMedico) prec.push('🚨 ANTES de iniciar cualquier programa: consulta a tu médico. Detectamos: ' + rojas.join(', ') + '.');
    if (s.diabetes) {
      rec.push('🩸 Diabetes: el ejercicio ES tu aliado (mejora la sensibilidad a la insulina). Entrena después de comer, no en ayunas.');
      prec.push('Lleva siempre una fuente de azúcar rápida; revisa tus pies a diario; si usas insulina, habla con tu médico sobre ajustes.');
    }
    if (s.hipertension) {
      rec.push('❤️ Hipertensión: cardio moderado (caminar, nadar, bici) 30 min casi diario baja la presión tanto como algunos fármacos.');
      prec.push('Evita aguantar la respiración (Valsalva) y los isométricos máximos; nada de cargas máximas sin control médico; respira siempre durante el esfuerzo.');
    }
    if (s.embarazo) {
      rec.push('🤰 Embarazo: actividad moderada es benéfica (ACOG) — caminar, nadar, fuerza ligera, suelo pélvico.');
      prec.push('Evita ejercicios acostada boca arriba tras el 1er trimestre, deportes de contacto y calor extremo. Todo con visto bueno de tu ginecólogo.');
    }
    if (s.fractura) prec.push('🦴 Fractura/lesión reciente: no cargues esa zona hasta el alta; entrena el resto del cuerpo (el músculo se conserva con trabajo cruzado).');
    if (s.cirugia) prec.push('🏥 Post-quirúrgico: inicia con la rutina de cama/silla del perfil Adultos mayores (sirve para cualquier edad en recuperación) hasta tener alta médica.');
    if (s.articular) rec.push('🦵 Dolor articular: prioriza bajo impacto (bici, nado, elíptica) y fortalece el músculo alrededor de la articulación — es la mejor "rodillera" que existe.');
    if (s.medicamentos) prec.push('💊 Medicamentos: betabloqueadores alteran el pulso, diuréticos la hidratación, insulina la glucosa — coméntale tu plan de ejercicio a tu médico.');
    if (imc >= 30) rec.push('⚖️ Tu IMC sugiere empezar con bajo impacto (caminata, agua, fuerza sentado) para proteger articulaciones mientras bajas de peso.');
    if (imc < 18.5) rec.push('⚠️ Bajo peso: prioriza superávit calórico y fuerza. Si pierdes peso sin querer, consulta médico.');
    if (d.edad >= 60) rec.push('🧓 60+: usa el perfil Adultos mayores — fuerza 2-3x/sem + equilibrio diario. La proteína es tu medicina: ' + proteina + 'g/día.');
    if (d.edad < 14) rec.push('🧒 Menores: usa el perfil Niños — juego activo 60 min/día, sin dietas restrictivas ni suplementos.');
    if (!requiereMedico && !s.embarazo && rec.length === 0) rec.push('✅ Sin restricciones detectadas: puedes seguir el programa completo de tu perfil con progresión normal.');

    return { imc, catIMC, tmb, tdee, kcalObjetivo, proteina, perfil, modalidad, requiereMedico, recomendaciones: rec, precauciones: prec, fecha: new Date().toISOString() };
  }

  aplicarObjetivos() {
    const a = this.datos.analisis;
    const app = window.nutriApp;
    if (!app || !a) return;
    app.objetivos = {
      calorias: a.kcalObjetivo,
      proteina: a.proteina,
      carbohidratos: Math.round((a.kcalObjetivo * 0.4) / 4),
      grasa: Math.round((a.kcalObjetivo * 0.28) / 9)
    };
    app.guardarTodo();
    app.renderTodo && app.renderTodo();
  }

  renderAnalisis() {
    const d = this.datos, a = d.analisis;
    const nombresPerfil = { hombre: '👨 Hombre', mujer: '👩 Mujer', ninos: '🧒 Niños', mayores: '🧓 Adultos mayores' };
    const nombresModalidad = {
      completa: '✅ Programa completo con progresión normal',
      suave: '🚨 SOLO actividad suave (caminar) hasta tener autorización médica',
      bajo_impacto: '🦵 Bajo impacto: silla, agua, bici, fuerza controlada',
      silla_cama: '🛏️ Rutinas de silla/cama (perfil Adultos mayores) hasta el alta médica'
    };
    return `
      <h3 class="auth-titulo">📊 Tu análisis personalizado</h3>
      <div class="salud-stats">
        <div class="salud-stat"><b>${a.imc}</b><span>IMC — ${a.catIMC}</span></div>
        <div class="salud-stat"><b>${a.tdee}</b><span>kcal de mantenimiento</span></div>
        <div class="salud-stat"><b>${a.kcalObjetivo}</b><span>kcal objetivo (aplicadas ✔)</span></div>
        <div class="salud-stat"><b>${a.proteina}g</b><span>proteína diaria (aplicada ✔)</span></div>
      </div>
      <p class="salud-linea"><strong>Tu perfil sugerido:</strong> ${nombresPerfil[a.perfil]} (pestaña "Para ti")</p>
      <p class="salud-linea"><strong>Modalidad segura:</strong> ${nombresModalidad[a.modalidad]}</p>
      ${a.recomendaciones.length ? '<h4 class="perfil-h4">💡 Recomendaciones</h4>' + a.recomendaciones.map(r => `<p class="salud-rec">${r}</p>`).join('') : ''}
      ${a.precauciones.length ? '<h4 class="perfil-h4">⚠️ Precauciones</h4>' + a.precauciones.map(p => `<p class="salud-prec">${p}</p>`).join('') : ''}
      <p class="perfil-disclaimer">Este análisis es orientativo y no sustituye una valoración médica profesional.</p>`;
  }

  /** Tarjeta persistente en la pestaña "Para ti". */
  renderResumen() {
    const cont = document.getElementById('saludResumen');
    if (!cont) return;
    if (!this.datos || !this.datos.analisis) {
      cont.innerHTML = `
        <div class="card p-4 mb-4 salud-cta">
          <div><h3 class="font-bold">📋 Haz tu evaluación inicial</h3>
          <p class="text-sm text-gray-500">Peso, estatura, edad y salud — para sugerirte ejercicios que te beneficien sin dañarte, y calcular tus calorías exactas.</p></div>
          <button class="btn btn-primary" id="btnEvaluacion">Comenzar</button>
        </div>`;
    } else {
      const a = this.datos.analisis;
      cont.innerHTML = `
        <div class="card p-4 mb-4 salud-cta">
          <div><h3 class="font-bold">📊 Tu evaluación: IMC ${a.imc} (${a.catIMC}) · ${a.kcalObjetivo} kcal · ${a.proteina}g proteína</h3>
          <p class="text-sm text-gray-500">${a.requiereMedico ? '🚨 Requiere valoración médica antes de entrenar.' : 'Perfil sugerido: ' + a.perfil + ' · Toca para ver detalles o actualizar.'}</p></div>
          <button class="btn btn-secondary" id="btnEvaluacion">Ver / actualizar</button>
        </div>`;
    }
    const btn = document.getElementById('btnEvaluacion');
    if (btn) btn.addEventListener('click', () => {
      if (this.datos && this.datos.analisis) { this.paso = 4; this.abrirEnPaso4(); }
      else this.abrir();
    });
  }

  abrirEnPaso4() {
    let m = document.getElementById('saludModal');
    if (!m) { m = document.createElement('div'); m.id = 'saludModal'; m.className = 'auth-modal'; document.body.appendChild(m); }
    m.classList.remove('hidden');
    this.paso = 4;
    this.renderPaso();
    // Botón para rehacer
    const caja = m.querySelector('.salud-caja');
    const redo = document.createElement('button');
    redo.className = 'btn btn-secondary';
    redo.style.marginTop = '8px';
    redo.textContent = '✏️ Rehacer evaluación';
    redo.addEventListener('click', () => { this.paso = 1; this.renderPaso(); });
    caja.appendChild(redo);
  }
}

window.salud = new SaludUI();
document.addEventListener('DOMContentLoaded', () => {
  // Deja que la app cargue primero
  setTimeout(() => window.salud.renderResumen(), 300);
});
