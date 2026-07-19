/**
 * NutriMX v3.7 - Ilustraciones de ejercicios (SVG originales)
 * Figuras claras tipo "póster de gimnasio" + claves de técnica, para que la
 * persona vea CÓMO se hace el movimiento. Dibujos propios (sin derechos de terceros).
 */

// Piezas reutilizables del muñeco
const _fig = (partes) => `<svg viewBox="0 0 140 130" xmlns="http://www.w3.org/2000/svg" class="ilu-svg">
  <style>.b{stroke:#065f46;stroke-width:5;stroke-linecap:round;fill:none}
  .b2{stroke:#a7f3d0;stroke-width:5;stroke-linecap:round;fill:none}
  .h{fill:#065f46}.h2{fill:#a7f3d0}.obj{stroke:#6b7280;stroke-width:3;fill:#e5e7eb}
  .fl{stroke:#d1d5db;stroke-width:3}.ar{stroke:#f59e0b;stroke-width:3;fill:none;marker-end:url(#a)}</style>
  <defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
    <path d="M0,0 L0,6 L7,3 z" fill="#f59e0b"/></marker></defs>
  <line class="fl" x1="5" y1="122" x2="135" y2="122"/>
  ${partes}</svg>`;

const SILLA = '<path class="obj" d="M78 70 h30 v52 h-6 v-46 h-24 z M78 70 v-34 h6 v34"/>';

const ILUSTRACIONES = {
  'sentarse-levantarse': {
    nombre: 'Sentarse y levantarse de la silla',
    svg: _fig(`${SILLA}
      <!-- posición sentado (claro) --><circle class="h2" cx="86" cy="44" r="9"/>
      <path class="b2" d="M86 53 v22 M86 75 h-18 M68 75 v20 M86 60 l-14 8"/>
      <!-- posición de pie (oscuro) --><circle class="h" cx="40" cy="26" r="10"/>
      <path class="b" d="M40 36 v34 M40 70 l-8 30 M40 70 l8 30 M40 44 l-14 16 M40 44 l14 16"/>
      <path class="ar" d="M58 62 q10 -14 22 -20"/>`),
    cues: ['Pies firmes al piso, separados al ancho de tus caderas',
      'Inclina el pecho un poco al frente y empuja con los talones',
      'Usa los apoyabrazos solo si lo necesitas — cada vez menos',
      'Baja despacio, contando 3 segundos, sin dejarte caer']
  },
  'marcha-sentada': {
    nombre: 'Marcha sentada (levantar rodillas)',
    svg: _fig(`${SILLA}
      <circle class="h" cx="86" cy="40" r="9"/>
      <path class="b" d="M86 49 v24 M86 73 h-16 M86 55 l-12 10 M86 55 l10 12"/>
      <!-- pierna arriba --><path class="b" d="M70 73 l-14 -14 M56 59 l-6 12"/>
      <!-- pierna abajo (clara) --><path class="b2" d="M70 73 v22 M70 95 h-10"/>
      <path class="ar" d="M50 78 q-4 -14 2 -22"/>`),
    cues: ['Siéntate derecho, sin recargar la espalda',
      'Sube una rodilla como si marcharas, alterna',
      'Ritmo cómodo — que se sienta el trabajo, sin dolor',
      'Si puedes, no te agarres de la silla']
  },
  'extension-rodilla': {
    nombre: 'Extensión de rodilla sentado',
    svg: _fig(`${SILLA}
      <circle class="h" cx="86" cy="40" r="9"/>
      <path class="b" d="M86 49 v24 M86 73 h-16 M86 55 l-12 8"/>
      <!-- pierna extendida --><path class="b" d="M70 73 h-34 M36 73 l-2 8"/>
      <!-- pierna flexionada (clara) --><path class="b2" d="M70 73 v22 M70 95 h-10"/>
      <path class="ar" d="M48 92 q-6 -10 -8 -16"/>`),
    cues: ['Estira una pierna hasta que quede recta',
      'Aprieta el muslo arriba 2 segundos',
      'Baja despacio, sin soltarla de golpe',
      'Alterna piernas — este ejercicio protege tus rodillas']
  },
  'press-hombros': {
    nombre: 'Press de hombros (botellas de agua)',
    svg: _fig(`${SILLA}
      <circle class="h" cx="86" cy="40" r="9"/>
      <path class="b" d="M86 49 v24 M86 73 h-16 M70 73 v22 M70 95 h-10"/>
      <!-- brazos arriba --><path class="b" d="M86 55 l-16 -22 M86 55 l14 -22"/>
      <rect class="obj" x="64" y="26" width="10" height="9" rx="2"/>
      <rect class="obj" x="96" y="26" width="10" height="9" rx="2"/>
      <path class="ar" d="M110 52 v-16"/>`),
    cues: ['Empieza con las botellas a la altura de los hombros',
      'Sube hasta estirar los brazos, sin trabar los codos',
      'Baja controlado, contando 2 segundos',
      'Respira: suelta el aire al subir. Nunca aguantes la respiración']
  },
  'remo-liga': {
    nombre: 'Remo con liga',
    svg: _fig(`${SILLA}
      <circle class="h" cx="86" cy="40" r="9"/>
      <path class="b" d="M86 49 v24 M86 73 h-16 M70 73 v22 M70 95 h-10"/>
      <!-- brazos jalando --><path class="b" d="M86 56 l-10 -4 M86 56 l-10 6"/>
      <!-- liga --><path d="M76 52 q-26 4 -40 0 M76 62 q-26 -4 -40 0" stroke="#f59e0b" stroke-width="3" fill="none"/>
      <path class="ar" d="M64 76 q12 -2 20 -8"/>`),
    cues: ['Liga sujeta al frente, a la altura del pecho',
      'Jala los codos hacia atrás, pegados al cuerpo',
      'Junta los omóplatos, como si apretaras un lápiz en la espalda',
      'Regresa despacio — la espalda fuerte mejora tu postura']
  },
  'circulos-tobillo': {
    nombre: 'Círculos de tobillo / escribir el alfabeto',
    svg: _fig(`${SILLA}
      <circle class="h" cx="86" cy="40" r="9"/>
      <path class="b" d="M86 49 v24 M86 73 h-16 M70 73 h-24 M46 73 l-3 8"/>
      <path class="b2" d="M70 73 v22 M70 95 h-10"/>
      <circle cx="42" cy="86" r="15" stroke="#f59e0b" stroke-width="3" fill="none" stroke-dasharray="4 3"/>
      <path class="ar" d="M56 80 a15 15 0 0 1 -6 14"/>`),
    cues: ['Levanta un pie del piso',
      'Dibuja círculos lentos con la punta, en los dos sentidos',
      'También puedes "escribir" el abecedario con el dedo gordo',
      'Tobillos móviles = menos riesgo de caídas']
  },
  'estiramiento-cuello': {
    nombre: 'Estiramiento de cuello y espalda',
    svg: _fig(`${SILLA}
      <circle class="h" cx="80" cy="44" r="9" transform="rotate(-18 80 44)"/>
      <path class="b" d="M84 52 q-4 12 2 22 M86 74 h-16 M70 74 v21 M70 95 h-10 M84 58 l-12 8 M84 58 l12 6"/>
      <path class="ar" d="M70 34 q-10 4 -12 12"/>`),
    cues: ['Inclina la cabeza hacia un lado, oreja al hombro',
      'Sostén 20-30 segundos, respirando tranquilo',
      'No rebotes ni fuerces — debe sentirse un jalón suave',
      'Cambia de lado. Ideal al final de la rutina']
  },
  'puente-gluteo': {
    nombre: 'Puente de glúteo',
    svg: _fig(`<circle class="h" cx="30" cy="96" r="9"/>
      <path class="b" d="M39 96 q22 -26 42 -4 M81 92 v24 M81 116 h12 M39 96 l-4 -14"/>
      <path class="ar" d="M60 68 v-14"/>`),
    cues: ['Acostado boca arriba, rodillas dobladas, pies al piso',
      'Aprieta los glúteos y sube la cadera',
      'Sostén 2 segundos arriba, forma una línea recta',
      'Baja despacio. Cadera fuerte = menos caídas y menos dolor de espalda']
  },
  'gato-vaca': {
    nombre: 'Gato-vaca (movilidad de columna)',
    svg: _fig(`<circle class="h" cx="34" cy="66" r="9"/>
      <path class="b" d="M42 68 q22 -18 44 2 M46 74 v34 M84 74 v34"/>
      <path class="b2" d="M42 76 q22 14 44 -2" stroke-dasharray="5 4"/>
      <path class="ar" d="M64 46 v-12 M64 96 v12"/>`),
    cues: ['En cuatro puntos: manos bajo hombros, rodillas bajo caderas',
      'Redondea la espalda hacia arriba (gato) soltando el aire',
      'Luego hunde el abdomen y mira al frente (vaca) tomando aire',
      'Movimiento lento — despierta toda tu columna']
  },
  'elevacion-pierna-lateral': {
    nombre: 'Elevación de pierna de lado',
    svg: _fig(`<circle class="h" cx="26" cy="98" r="9"/>
      <path class="b" d="M35 98 h44 M79 98 l22 -18 M79 98 l24 14"/>
      <path class="ar" d="M104 90 q6 -10 2 -18"/>`),
    cues: ['Acostado de lado, cuerpo alineado como una tabla',
      'Sube la pierna de arriba sin girar la cadera',
      'Sube hasta donde puedas sin dolor, baja despacio',
      'Fortalece la cadera: clave para caminar firme']
  },
  'bombeo-tobillos': {
    nombre: 'Bombeo de tobillos (en cama)',
    svg: _fig(`<rect class="obj" x="12" y="86" width="116" height="12" rx="3"/>
      <circle class="h" cx="30" cy="74" r="9"/>
      <path class="b" d="M39 76 h56 M95 76 l10 -10"/>
      <path class="b2" d="M95 76 l10 10" stroke-dasharray="4 3"/>
      <path class="ar" d="M116 70 v14"/>`),
    cues: ['Acostado, con las piernas estiradas',
      'Apunta los pies hacia adelante y luego hacia ti',
      '20 repeticiones cada hora que estés despierto',
      'Muy importante: activa la circulación y previene trombosis']
  },
  'equilibrio-un-pie': {
    nombre: 'Equilibrio en un pie',
    svg: _fig(`<path class="obj" d="M112 40 v82" stroke-width="4"/>
      <circle class="h" cx="56" cy="30" r="10"/>
      <path class="b" d="M56 40 v34 M56 74 v46 M56 74 l16 16 M72 90 l-6 12 M56 48 l16 6"/>
      <path class="ar" d="M78 54 h22"/>`),
    cues: ['Párate junto a una pared o silla por si acaso',
      'Levanta un pie y sostén de 10 a 30 segundos',
      'Mira un punto fijo al frente: ayuda muchísimo',
      'Cambia de pie. El equilibrio se entrena y previene caídas']
  },
  'sentadilla': {
    nombre: 'Sentadilla',
    svg: _fig(`<circle class="h" cx="54" cy="26" r="10"/>
      <path class="b" d="M54 36 v30 M54 66 l-12 26 M42 92 v26 M54 66 l14 26 M68 92 v26 M54 44 h22"/>
      <path class="ar" d="M92 60 v26"/>`),
    cues: ['Pies al ancho de hombros, punta ligeramente hacia afuera',
      'Baja como si te sentaras en una silla invisible',
      'Rodillas en línea con los pies, pecho arriba',
      'Baja hasta donde no duela y sube empujando con los talones']
  },
  'lagartija': {
    nombre: 'Lagartija / push-up',
    svg: _fig(`<circle class="h" cx="34" cy="72" r="9"/>
      <path class="b" d="M43 74 h50 M93 74 l14 20 M43 74 l-4 22 M39 96 v14"/>
      <path class="ar" d="M62 58 v-12 M62 88 v12"/>`),
    cues: ['Manos un poco más abiertas que los hombros',
      'Cuerpo recto como tabla: no subas la cadera',
      'Baja hasta que el pecho casi toque, codos a 45°',
      'Si es mucho, apóyate en rodillas o contra la pared']
  },
  'plancha': {
    nombre: 'Plancha (core)',
    svg: _fig(`<circle class="h" cx="30" cy="80" r="9"/>
      <path class="b" d="M39 84 h60 M99 84 l10 30 M39 84 v22 M39 106 h14"/>
      <path d="M30 70 h80" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 4" fill="none"/>`),
    cues: ['Antebrazos y puntas de los pies en el piso',
      'Cuerpo en línea recta: no subas ni hundas la cadera',
      'Aprieta abdomen y glúteos, respira normal',
      'Empieza con 20 segundos y ve subiendo']
  },
  'peso-muerto-rumano': {
    nombre: 'Peso muerto rumano',
    svg: _fig(`<circle class="h" cx="50" cy="34" r="10"/>
      <path class="b" d="M50 44 q16 12 22 26 M72 70 v48 M50 52 l6 26 M40 78 h34"/>
      <path class="ar" d="M96 56 q6 16 0 30"/>`),
    cues: ['Rodillas ligeramente dobladas, espalda RECTA siempre',
      'Empuja la cadera hacia atrás, no dobles la espalda',
      'Baja hasta sentir el jalón atrás del muslo',
      'Sube apretando glúteos. Nunca redondees la espalda']
  }
};

/** Busca la ilustración que corresponde a un texto de ejercicio (por palabras clave). */
function ilustracionPara(texto) {
  const t = (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const reglas = [
    [/sentarse y levantarse|levantarse de la silla/, 'sentarse-levantarse'],
    [/marcha sentada/, 'marcha-sentada'],
    [/extension de rodilla/, 'extension-rodilla'],
    [/press de hombros|press militar/, 'press-hombros'],
    [/remo/, 'remo-liga'],
    [/circulos de tobillo|alfabeto/, 'circulos-tobillo'],
    [/estiramiento suave de cuello|estiramiento de cuello/, 'estiramiento-cuello'],
    [/puente de gluteo/, 'puente-gluteo'],
    [/gato-vaca|gato vaca/, 'gato-vaca'],
    [/elevacion de pierna acostado|pierna de lado/, 'elevacion-pierna-lateral'],
    [/bombeo de tobillos/, 'bombeo-tobillos'],
    [/apoyo en un pie|equilibrio|un pie/, 'equilibrio-un-pie'],
    [/sentadilla/, 'sentadilla'],
    [/lagartija|push-up|push up|flexion/, 'lagartija'],
    [/plancha/, 'plancha'],
    [/peso muerto/, 'peso-muerto-rumano']
  ];
  for (const [re, key] of reglas) if (re.test(t)) return { key, ...ILUSTRACIONES[key] };
  return null;
}

/** HTML de un <li> de ejercicio con botón de ilustración si existe. */
function liEjercicioConIlustracion(texto, idPrefix, i) {
  const ilu = ilustracionPara(texto);
  if (!ilu) return `<li>${texto}</li>`;
  const id = `${idPrefix}-ilu-${i}`;
  return `<li>${texto}
    <button class="ilu-btn" data-ilu="${ilu.key}" data-target="${id}">👁️ ver cómo</button>
    <div class="ilu-caja hidden" id="${id}"></div></li>`;
}

/** Activa los botones de ilustración dentro de un contenedor. */
function activarIlustraciones(cont) {
  if (!cont) return;
  cont.querySelectorAll('.ilu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const caja = document.getElementById(btn.dataset.target);
      const ilu = ILUSTRACIONES[btn.dataset.ilu];
      if (!caja || !ilu) return;
      if (!caja.classList.contains('hidden')) { caja.classList.add('hidden'); return; }
      caja.innerHTML = `<div class="ilu-inner">
        <div class="ilu-fig">${ilu.svg}</div>
        <div class="ilu-txt"><strong>${ilu.nombre}</strong>
          <ul>${ilu.cues.map(c => `<li>${c}</li>`).join('')}</ul></div>
      </div>`;
      caja.classList.remove('hidden');
    });
  });
}

window.ILUSTRACIONES = ILUSTRACIONES;
window.ilustracionPara = ilustracionPara;
window.liEjercicioConIlustracion = liEjercicioConIlustracion;
window.activarIlustraciones = activarIlustraciones;
