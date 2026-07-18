/**
 * NutriMX v3.4 - Ayuda + Glosario
 * Botón flotante de Ayuda (?) con: preguntas frecuentes de la app, glosario de
 * términos y siglas, y acceso al asistente. El asistente responde dudas de la app,
 * nutrición y ejercicio — nunca da diagnóstico ni consejo médico.
 */

const GLOSARIO = [
  { grupo: '🏛️ Instituciones y guías', items: [
    ['OMS', 'Organización Mundial de la Salud. Marca las recomendaciones globales de actividad física y nutrición.'],
    ['ACSM', 'American College of Sports Medicine (Colegio Americano de Medicina del Deporte). Guías de ejercicio.'],
    ['NSCA', 'National Strength and Conditioning Association. Referencia en entrenamiento de fuerza.'],
    ['ISSN', 'International Society of Sports Nutrition. Guías de nutrición deportiva y suplementos.'],
    ['AACE / ACE', 'American Association of Clinical Endocrinology. Guías de obesidad y metabolismo.'],
    ['AAP', 'American Academy of Pediatrics. Recomendaciones de salud infantil.'],
    ['ACOG', 'American College of Obstetricians and Gynecologists. Guías de ejercicio en el embarazo.'],
    ['Cochrane', 'Red científica que hace revisiones sistemáticas (la evidencia más confiable).'],
    ['INAI', 'Instituto Nacional de Transparencia y Protección de Datos (México). Autoridad de privacidad.']
  ]},
  { grupo: '🥗 Nutrición', items: [
    ['kcal', 'Kilocalorías: la "energía" de los alimentos. Lo que llamamos "calorías" en el día a día.'],
    ['Macros', 'Macronutrientes: proteína, carbohidratos y grasa. Aportan las calorías.'],
    ['Proteína', 'Nutriente que construye y repara músculo. Clave para saciedad y recomposición.'],
    ['Carbohidratos', 'Principal fuente de energía rápida (cereales, frutas, legumbres).'],
    ['Grasa', 'Nutriente esencial (hormonas, absorción de vitaminas). Prioriza las buenas: aceite de oliva, aguacate, pescado.'],
    ['Fibra', 'Parte de los vegetales que no se digiere; mejora digestión, saciedad y microbiota.'],
    ['TMB (BMR)', 'Tasa Metabólica Basal: calorías que gastas en reposo total (solo por estar vivo).'],
    ['TDEE', 'Gasto Energético Total Diario: TMB + tu actividad. Es tu "mantenimiento" calórico.'],
    ['IMC', 'Índice de Masa Corporal: peso ÷ estatura². Referencia general (no distingue músculo de grasa).'],
    ['Déficit calórico', 'Comer menos calorías de las que gastas → se pierde grasa.'],
    ['Superávit calórico', 'Comer más de lo que gastas → se gana peso (músculo si entrenas).'],
    ['Recomposición corporal', 'Perder grasa y ganar músculo al mismo tiempo.'],
    ['IG (Índice glucémico)', 'Qué tan rápido un alimento sube el azúcar en sangre.'],
    ['TEF', 'Efecto térmico de los alimentos: calorías que gastas al digerir (la proteína gasta más).'],
    ['Antiinflamatorio', 'Alimento que ayuda a bajar la inflamación crónica (omega-3, polifenoles, fibra).'],
    ['Omega-3 (EPA/DHA)', 'Grasas del pescado azul, antiinflamatorias y buenas para corazón y cerebro.'],
    ['Nixtamalizado', 'Proceso del maíz (tortilla) que libera niacina y calcio. Base de la dieta mexicana.'],
    ['Prebiótico / Probiótico', 'Prebiótico = fibra que alimenta tus bacterias buenas. Probiótico = las bacterias buenas (yogur, kéfir).'],
    ['Sarcopenia', 'Pérdida de músculo con la edad. Se combate con fuerza y proteína.'],
    ['RED-S', 'Déficit energético relativo en el deporte: comer muy poco daña hormonas, hueso y ciclo menstrual.']
  ]},
  { grupo: '🏋️ Ejercicio', items: [
    ['PAR-Q', 'Cuestionario de aptitud para actividad física: tamizaje de salud antes de entrenar (lo usa tu evaluación inicial).'],
    ['NEAT', 'Calorías que gastas en actividad NO de ejercicio: caminar, tareas, moverte durante el día.'],
    ['HIIT', 'Entrenamiento interválico de alta intensidad: ráfagas cortas e intensas con descansos.'],
    ['RPE', 'Escala de esfuerzo percibido (1-10): qué tan duro se siente un ejercicio.'],
    ['Series × Reps', 'Ej. "3×10" = 3 series de 10 repeticiones.'],
    ['Sobrecarga progresiva', 'Aumentar poco a poco peso o repeticiones para seguir mejorando.'],
    ['Bajo impacto', 'Ejercicio suave con las articulaciones (caminar, nadar, bici, silla).']
  ]},
  { grupo: '🔐 Privacidad y app', items: [
    ['LFPDPPP', 'Ley Federal de Protección de Datos Personales (México). Protege tu información.'],
    ['GDPR', 'Reglamento europeo de protección de datos (para usuarios internacionales).'],
    ['ARCO', 'Tus derechos: Acceso, Rectificación, Cancelación y Oposición sobre tus datos.'],
    ['Datos sensibles', 'Información de salud; requiere tu consentimiento expreso y protección extra.'],
    ['RLS', 'Row Level Security: candado que hace que cada usuario solo vea SUS datos.'],
    ['PWA', 'App web progresiva: puedes "instalar" NutriMX y usarla sin conexión.'],
    ['IA / LLM', 'Inteligencia Artificial que analiza tus fotos de comida y responde en el asistente.']
  ]}
];

const FAQ = [
  ['¿Cómo registro lo que comí?', 'En la pestaña 🥗 Nutrición: busca el alimento (o toca "Agregar alimento" en una comida), elige a qué comida va (desayuno/comida/cena/colación), ajusta los gramos y toca Añadir. También puedes tomar una foto y que la IA lo estime.'],
  ['¿Qué es "Tu plan del día"?', 'Un menú sugerido con alimentos reales ajustado a tus calorías y proteína. Puedes cargarlo a tu registro con un botón o pedir "Otra variante".'],
  ['¿Cómo cambio mi rutina de ejercicio?', 'En "Tu plan del día" o en la pestaña 👨‍👩‍👧 Para ti. La app te da una recomendación, pero tú eliges la modalidad (silla, piso, de pie, más activa…).'],
  ['¿Cómo cambio mis datos o mi evaluación?', 'En 👨‍👩‍👧 Para ti, arriba, toca "Ver / actualizar" tu evaluación. Ahí también puedes borrar tus datos (derecho ARCO).'],
  ['¿Cómo pongo mi foto de perfil?', 'En ⚙️ Ajustes o en tu registro: toma una foto, sube una imagen o elige un avatar.'],
  ['¿La app da consejo médico?', 'No. NutriMX es educativa y de autocuidado. Ante síntomas, dolor, medicamentos o dudas de salud, consulta SIEMPRE a tu médico o nutriólogo.'],
  ['¿Mis datos están seguros?', 'Sí: viajan cifrados, tu contraseña nadie la ve, y solo tú accedes a tu información. Consulta el Aviso de Privacidad.']
];

class AyudaUI {
  constructor() { this.abierto = false; this.tab = 'faq'; }

  init() {
    const fab = document.createElement('button');
    fab.id = 'ayudaFab';
    fab.className = 'ayuda-fab';
    fab.innerHTML = '❓';
    fab.title = 'Ayuda y glosario';
    fab.addEventListener('click', () => this.toggle());
    document.body.appendChild(fab);

    const panel = document.createElement('div');
    panel.id = 'ayudaPanel';
    panel.className = 'ayuda-panel hidden';
    document.body.appendChild(panel);
  }

  toggle() {
    this.abierto = !this.abierto;
    const p = document.getElementById('ayudaPanel');
    p.classList.toggle('hidden', !this.abierto);
    if (this.abierto) this.render();
  }

  render() {
    const p = document.getElementById('ayudaPanel');
    const contenido = this.tab === 'faq' ? this.renderFaq() : this.renderGlosario();
    p.innerHTML = `
      <div class="ayuda-head">
        <span>❓ Centro de ayuda</span>
        <button class="auth-btn" id="ayudaCerrar">✕</button>
      </div>
      <div class="ayuda-tabs">
        <button class="ayuda-tab ${this.tab === 'faq' ? 'activa' : ''}" data-t="faq">🙋 Preguntas frecuentes</button>
        <button class="ayuda-tab ${this.tab === 'glosario' ? 'activa' : ''}" data-t="glosario">📖 Glosario</button>
      </div>
      <div class="ayuda-body">${contenido}</div>
      <div class="ayuda-pie">
        <button class="btn btn-primary" id="ayudaAsistente">💬 Preguntar al asistente</button>
        <p class="ayuda-nota">El asistente resuelve dudas de la app, nutrición y ejercicio — nunca da diagnóstico médico.</p>
      </div>`;

    document.getElementById('ayudaCerrar').addEventListener('click', () => this.toggle());
    p.querySelectorAll('.ayuda-tab').forEach(b => b.addEventListener('click', () => { this.tab = b.dataset.t; this.render(); }));
    document.getElementById('ayudaAsistente').addEventListener('click', () => {
      this.toggle();
      if (window.asistente && !window.asistente.abierto) window.asistente.toggle();
    });
    p.querySelectorAll('.ayuda-faq-q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('abierta')));
  }

  renderFaq() {
    return `<div class="ayuda-buscar-wrap"><input type="search" id="ayudaBuscar" class="input" placeholder="Buscar en la ayuda..."></div>` +
      FAQ.map(([q, a]) => `
        <div class="ayuda-faq">
          <div class="ayuda-faq-q">${q}<span>▾</span></div>
          <div class="ayuda-faq-a">${a}</div>
        </div>`).join('');
  }

  renderGlosario() {
    return `<div class="ayuda-buscar-wrap"><input type="search" id="ayudaBuscarG" class="input" placeholder="Buscar término o sigla..." oninput="window.ayudaUI.filtrarGlosario(this.value)"></div>
      <div id="ayudaGlosarioLista">${this.glosarioHTML('')}</div>`;
  }

  glosarioHTML(filtro) {
    const f = (filtro || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return GLOSARIO.map(g => {
      const items = g.items.filter(([sigla, def]) =>
        !f || (sigla + ' ' + def).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(f));
      if (!items.length) return '';
      return `<div class="ayuda-glo-grupo"><h4>${g.grupo}</h4>${items.map(([s, d]) =>
        `<div class="ayuda-glo-item"><strong>${s}</strong> — ${d}</div>`).join('')}</div>`;
    }).join('') || '<p class="ayuda-nota">Sin resultados. Prueba con otra palabra o pregúntale al asistente.</p>';
  }

  filtrarGlosario(v) {
    const l = document.getElementById('ayudaGlosarioLista');
    if (l) l.innerHTML = this.glosarioHTML(v);
  }
}

window.ayudaUI = new AyudaUI();
document.addEventListener('DOMContentLoaded', () => window.ayudaUI.init());
