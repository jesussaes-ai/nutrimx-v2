/**
 * NutriMX v2.0 - Sistema Integral de Recomposición Corporal
 * Motor principal que integra: ciencia.js (datos), index.html (UI), localStorage (persistencia)
 * Módulos: Nutrición + Ejercicio + Suplementos + Médico + Conducta + Mexicano + Tracking
 */

class NutriApp {
  constructor() {
    // Estado
    this.alimentos = [];
    this.registros = {};        // { fecha: { desayuno: [], comida: [], cena: [], colacion: [], agua: 0 } }
    this.pesos = {};            // { fecha: peso }
    this.objetivos = {
      calorias: 1800,
      proteina: 135,
      carbohidratos: 180,
      grasa: 60
    };
    this.fechaActual = this.formatDate(new Date());
    this.categoriaActual = 'all';
    this.busquedaActual = '';
    this.modalComida = 'desayuno';
    this.programaActual = 'fb3';
    this.deferredPrompt = null;
    this.swRegistered = false;
    this.ciencia = null; // Se cargará desde ciencia.js
    
    // Checklists persistidos
    this.checklists = {
      neat: {},
      alt: {},
      identity: {},
      endo: {}
    };
  }

  async init() {
    // Cargar ciencia.js primero
    await this.cargarCiencia();
    await this.cargarDatos();
    this.renderFechaActual();
    this.setupEventListeners();
    this.setupPWA();
    this.renderTodo();
    this.verificarInstalacion();
  }

  async cargarCiencia() {
    try {
      // Cargar desde ciencia.js embebido (ya está en window.CIENCIA por el script tag)
      if (window.CIENCIA) {
        this.ciencia = window.CIENCIA;
      } else {
        // Fallback: cargar via fetch si está como archivo separado
        const resp = await fetch('./ciencia.js');
        const text = await resp.text();
        eval(text); // Crea window.CIENCIA
        this.ciencia = window.CIENCIA;
      }
      console.log('✅ Ciencia cargada:', this.ciencia.alimentos.length, 'alimentos');
    } catch (e) {
      console.warn('Error cargando ciencia.js, usando fallback embebido:', e);
      this.ciencia = this.getCienciaFallback();
    }
  }

  getCienciaFallback() {
    // Fallback mínimo si falla la carga
    return {
      alimentos: [],
      ejercicio: { principios: [], rutinas: {}, hiit_protocolos: [], neat_estrategias: [] },
      suplementos: { grado_A: [], grado_B: [], grado_C_sin_evidencia_solida: [] },
      medico: { criterios_obesidad: {}, laboratorios_recomendados: [], medicamentos_AACE_2024: {}, endocrinologo_cuando_referir: [] },
      comportamiento: { tecnicas_evidencia: [], eje_intestino_cerebro: {}, alimentos_psicobioticos: [] },
      dieta_milpa: { principio: '', estudios: [], alimentos_base: [], patrones_plato_milpa: [] },
      calculadoras: {}
    };
  }

  async cargarDatos() {
    try {
      // Alimentos
      const alimentosGuardados = localStorage.getItem('nutrimx_alimentos');
      if (alimentosGuardados) {
        this.alimentos = JSON.parse(alimentosGuardados);
      } else if (this.ciencia && this.ciencia.alimentos) {
        this.alimentos = this.ciencia.alimentos.map((a, i) => ({
          id: i + 1,
          nombre: a.nombre,
          categoria: a.cat,
          kcal_100g: a.kcal,
          proteina_100g: a.p,
          grasa_100g: a.g,
          carb_100g: a.ch,
          fibra_100g: a.f,
          evid: a.evid,
          tags: a.tags,
          search_terms: a.nombre.toLowerCase().replace(/[(),]/g, ' ').split(/\s+/).filter(t => t.length > 1)
        }));
        localStorage.setItem('nutrimx_alimentos', JSON.stringify(this.alimentos));
      }

      // Registros
      const registrosGuardados = localStorage.getItem('nutrimx_registros');
      if (registrosGuardados) this.registros = JSON.parse(registrosGuardados);

      // Pesos
      const pesosGuardados = localStorage.getItem('nutrimx_pesos');
      if (pesosGuardados) this.pesos = JSON.parse(pesosGuardados);

      // Objetivos
      const objetivosGuardados = localStorage.getItem('nutrimx_objetivos');
      if (objetivosGuardados) this.objetivos = { ...this.objetivos, ...JSON.parse(objetivosGuardados) };

      // Checklists
      const checklistsGuardados = localStorage.getItem('nutrimx_checklists');
      if (checklistsGuardados) this.checklists = JSON.parse(checklistsGuardados);

      // Programa ejercicio
      const progGuardado = localStorage.getItem('nutrimx_programa');
      if (progGuardado) this.programaActual = progGuardado;

      console.log(`✅ Datos cargados: ${this.alimentos.length} alimentos, ${Object.keys(this.registros).length} días registros`);
    } catch (e) {
      console.error('Error cargando datos:', e);
    }
  }

  guardarTodo() {
    localStorage.setItem('nutrimx_registros', JSON.stringify(this.registros));
    localStorage.setItem('nutrimx_pesos', JSON.stringify(this.pesos));
    localStorage.setItem('nutrimx_objetivos', JSON.stringify(this.objetivos));
    localStorage.setItem('nutrimx_checklists', JSON.stringify(this.checklists));
    localStorage.setItem('nutrimx_programa', this.programaActual);
  }

  // ==================== UTILIDADES ====================

  formatDate(d) { return d.toISOString().split('T')[0]; }
  parseDate(s) { return new Date(s + 'T00:00:00'); }
  hoy() { return this.formatDate(new Date()); }

  getRegistro(fecha = this.fechaActual) {
    if (!this.registros[fecha]) {
      this.registros[fecha] = { desayuno: [], comida: [], cena: [], colacion: [], agua: 0 };
    }
    return this.registros[fecha];
  }

  calcularMacros(alimento, gramos) {
    const factor = gramos / 100;
    return {
      kcal: Math.round(alimento.kcal_100g * factor),
      proteina: Math.round(alimento.proteina_100g * factor * 10) / 10,
      grasa: Math.round(alimento.grasa_100g * factor * 10) / 10,
      carb: Math.round(alimento.carb_100g * factor * 10) / 10,
      fibra: Math.round(alimento.fibra_100g * factor * 10) / 10,
    };
  }

  calcularTotalesDia(fecha = this.fechaActual) {
    const reg = this.getRegistro(fecha);
    const comidas = ['desayuno', 'comida', 'cena', 'colacion'];
    let totals = { kcal: 0, proteina: 0, grasa: 0, carb: 0, fibra: 0 };
    const porComida = {};

    comidas.forEach(c => {
      let ct = { kcal: 0, proteina: 0, grasa: 0, carb: 0, fibra: 0 };
      reg[c].forEach(item => {
        ct.kcal += item.macros.kcal;
        ct.proteina += item.macros.proteina;
        ct.grasa += item.macros.grasa;
        ct.carb += item.macros.carb;
        ct.fibra += item.macros.fibra;
      });
      porComida[c] = ct;
      totals.kcal += ct.kcal;
      totals.proteina += ct.proteina;
      totals.grasa += ct.grasa;
      totals.carb += ct.carb;
      totals.fibra += ct.fibra;
    });

    totals.proteina = Math.round(totals.proteina * 10) / 10;
    totals.grasa = Math.round(totals.grasa * 10) / 10;
    totals.carb = Math.round(totals.carb * 10) / 10;
    totals.fibra = Math.round(totals.fibra * 10) / 10;

    return { totals, porComida, agua: reg.agua || 0 };
  }

  // ==================== RENDERIZADO PRINCIPAL ====================

  renderTodo() {
    this.renderFechaActual();
    this.renderBuscar();
    this.renderRegistro();
    this.renderResumen();
    this.renderEjercicio();
    this.renderSuplementos();
    this.renderMedico();
    this.renderConducta();
    this.renderMexicano();
    this.renderTracking();
    this.renderObjetivos();
    this.renderChecklists();
  }

  renderFechaActual() {
    const hoy = new Date();
    const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('todayDate').textContent = hoy.toLocaleDateString('es-MX', opciones);
    document.getElementById('dashboardFecha').value = this.fechaActual;
    document.getElementById('registroFecha').value = this.fechaActual;
    document.getElementById('resumenFecha').value = this.fechaActual;
    document.getElementById('pesoFecha').value = this.fechaActual;
  }

  // ==================== TAB BUSCAR (NUTRICIÓN) ====================

  renderBuscar() {
    const container = document.getElementById('searchResults');
    const empty = document.getElementById('emptySearch');

    if (!this.busquedaActual && this.categoriaActual === 'all') {
      container.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');

    let filtrados = this.alimentos;
    if (this.categoriaActual !== 'all') {
      filtrados = filtrados.filter(a => a.categoria === this.categoriaActual);
    }
    if (this.busquedaActual) {
      const terms = this.busquedaActual.toLowerCase().split(' ').filter(t => t);
      filtrados = filtrados.filter(a =>
        terms.every(t => a.nombre.toLowerCase().includes(t) || a.search_terms.some(st => st.includes(t)))
      );
    }

    if (filtrados.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron alimentos</p></div>';
      return;
    }

    container.innerHTML = filtrados.slice(0, 50).map(a => `
      <div class="food-item" role="listitem" data-id="${a.id}" tabindex="0">
        <div class="food-info">
          <div class="food-name">${this.highlightMatch(a.nombre, this.busquedaActual)} <span class="badge ${this.badgeClass(a.categoria)}">${a.categoria}</span></div>
          <div class="food-macros">
            <span class="food-macro">🔥 ${a.kcal_100g} kcal</span>
            <span class="food-macro">🥩 ${a.proteina_100g}g</span>
            <span class="food-macro">🛢️ ${a.grasa_100g}g</span>
            <span class="food-macro">🌾 ${a.carb_100g}g</span>
            <span class="food-macro">🌿 ${a.fibra_100g}g</span>
          </div>
          ${a.evid ? `<div class="text-xs text-gray-500 mt-1">${a.evid}</div>` : ''}
        </div>
        <span class="text-sm text-gray-400">por 100g</span>
      </div>
    `).join('');

    container.querySelectorAll('.food-item').forEach(el => {
      el.addEventListener('click', () => this.abrirModalAgregar(parseInt(el.dataset.id)));
      el.addEventListener('keydown', e => { if (e.key === 'Enter') this.abrirModalAgregar(parseInt(el.dataset.id)); });
    });
  }

  highlightMatch(text, query) {
    if (!query) return text;
    const terms = query.toLowerCase().split(' ').filter(t => t);
    let result = text;
    terms.forEach(t => {
      const regex = new RegExp(`(${t})`, 'gi');
      result = result.replace(regex, '<mark class="search-highlight">$1</mark>');
    });
    return result;
  }

  badgeClass(cat) {
    const map = { Proteína:'badge-green', Verdura:'badge-green', Fruta:'badge-orange', Cereal:'badge-yellow', Lácteo:'badge-blue', 'Fruto seco':'badge-purple', Legumbre:'badge-orange', Grasa:'badge-red', Especia:'badge-gray', Bebida:'badge-gray', Fermentado:'badge-gray', Suplemento:'badge-blue', Medicamento:'badge-red', Otros:'badge-gray' };
    return map[cat] || 'badge-gray';
  }

  // ==================== TAB REGISTRO ====================

  renderRegistro() {
    const reg = this.getRegistro(this.fechaActual);
    const comidas = [
      {id:'desayuno', icon:'🌅', label:'Desayuno', color:'desayuno', kcalEl:'desayunoKcal', itemsEl:'desayunoItems'},
      {id:'comida', icon:'☀️', label:'Comida', color:'comida', kcalEl:'comidaKcal', itemsEl:'comidaItems'},
      {id:'cena', icon:'🌙', label:'Cena', color:'cena', kcalEl:'cenaKcal', itemsEl:'cenaItems'},
      {id:'colacion', icon:'🍎', label:'Colación', color:'colacion', kcalEl:'colacionKcal', itemsEl:'colacionItems'},
    ];

    comidas.forEach(c => {
      const items = reg[c.id] || [];
      let totalKcal = 0;
      const html = items.map((item, idx) => {
        totalKcal += item.macros.kcal;
        return `
          <div class="logged-food" data-idx="${idx}" data-meal="${c.id}">
            <div class="logged-info">
              <div class="logged-name">${item.nombre} (${item.gramos}g)</div>
              <div class="logged-macros">
                <span>🔥 ${item.macros.kcal} kcal</span>
                <span>🥩 ${item.macros.proteina}g</span>
                <span>🛢️ ${item.macros.grasa}g</span>
                <span>🌾 ${item.macros.carb}g</span>
              </div>
            </div>
            <button class="btn btn-danger text-sm px-2 py-1" data-delete="${c.id}" data-idx="${idx}" aria-label="Eliminar">✕</button>
          </div>
        `;
      }).join('') || '<p class="text-sm text-gray-400 text-center py-2">Sin alimentos</p>';
      document.getElementById(c.itemsEl).innerHTML = html;
      document.getElementById(c.kcalEl).textContent = `${totalKcal} kcal`;
    });

    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => this.eliminarAlimento(btn.dataset.delete, parseInt(btn.dataset.idx)));
    });
  }

  // ==================== TAB RESUMEN (DASHBOARD) ====================

  renderResumen() {
    const { totals, porComida, agua } = this.calcularTotalesDia(this.fechaActual);
    const obj = this.objetivos;

    // Calorías ring
    const pct = Math.min(totals.kcal / obj.calorias, 1);
    const offset = 283 * (1 - pct);
    document.getElementById('kcalRing').style.strokeDashoffset = offset;
    document.getElementById('kcalConsumidas').textContent = totals.kcal;
    document.getElementById('kcalObjetivo').textContent = obj.calorias;
    document.getElementById('kcalPct').textContent = `${Math.round(pct * 100)}%`;

    // Macros
    const protPct = Math.min(totals.proteina / obj.proteina, 1) * 100;
    const carbPct = Math.min(totals.carb / obj.carbohidratos, 1) * 100;
    const fatPct = Math.min(totals.grasa / obj.grasa, 1) * 100;

    document.getElementById('protTotal').textContent = `${totals.proteina}g`;
    document.getElementById('carbTotal').textContent = `${totals.carb}g`;
    document.getElementById('fatTotal').textContent = `${totals.grasa}g`;

    document.getElementById('protBar').style.width = `${protPct}%`;
    document.getElementById('carbBar').style.width = `${carbPct}%`;
    document.getElementById('fatBar').style.width = `${fatPct}%`;

    // Distribución por comida
    const comidasDist = [
      {id:'desayuno', bar:'distDesayuno', kcal:'distDesayunoKcal'},
      {id:'comida', bar:'distComida', kcal:'distComidaKcal'},
      {id:'cena', bar:'distCena', kcal:'distCenaKcal'},
      {id:'colacion', bar:'distColacion', kcal:'distColacionKcal'},
    ];

    comidasDist.forEach(c => {
      const pc = porComida[c.id] || { kcal: 0 };
      const pct = totals.kcal > 0 ? (pc.kcal / totals.kcal) * 100 : 0;
      const bar = document.getElementById(c.bar);
      const kcalEl = document.getElementById(c.kcal);
      if (bar) bar.style.width = `${pct}%`;
      if (kcalEl) kcalEl.textContent = `${pc.kcal} kcal`;
    });

    // Fibra
    const fibraPct = Math.min(totals.fibra / 28, 1) * 100;
    document.getElementById('fibraTotal').textContent = `${totals.fibra}g`;
    document.getElementById('fibraBar').style.width = `${fibraPct}%`;

    // Agua
    document.getElementById('aguaTotal').textContent = agua;
    const vasos = document.getElementById('aguaVasos');
    vasos.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
      vasos.innerHTML += `<span class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${i <= agua ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}">${i}</span>`;
    }
  }

  // ==================== TAB EJERCICIO ====================

  renderEjercicio() {
    // Programa actual
    this.mostrarPrograma(this.programaActual);
    
    // Checklists NEAT
    this.renderChecklistNEAT();
    
    // Renderizar accordions
    this.setupAccordions();
  }

  mostrarPrograma(programa) {
    this.programaActual = programa;
    localStorage.setItem('nutrimx_programa', programa);
    
    // Actualizar tabs
    document.querySelectorAll('[data-program]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.program === programa);
    });
    
    // Mostrar contenido
    document.querySelectorAll('.program-content').forEach(el => {
      el.classList.toggle('hidden', el.id !== `prog-${programa}`);
    });
  }

  renderChecklistNEAT() {
    const container = document.querySelector('#neat-checklist');
    if (!container) return;
    
    const items = [
      {id: 'neat1', text: 'Caminar 10-15 min post cada comida (glucosa ↓ 20-30%)'},
      {id: 'neat2', text: 'Trabajar de pie / escritorio ajustable 2-4h/día'},
      {id: 'neat3', text: 'Subir escaleras siempre (1 piso = ~10 kcal)'},
      {id: 'neat4', text: 'Parking lejos / bajar 1 parada antes del transporte'},
      {id: 'neat5', text: 'Llamadas caminando / reuniones walking'},
      {id: 'neat6', text: 'Tareas domésticas vigorosas (aspirar, fregar = 150-200 kcal/h)'},
      {id: 'neat7', text: 'Jugar con hijos/mascotas activo'},
      {id: 'neat8', text: 'Estirar/movilidad viendo TV'},
    ];
    
    container.innerHTML = items.map(item => `
      <div class="checklist-item">
        <input type="checkbox" id="${item.id}" ${this.checklists.neat[item.id] ? 'checked' : ''}>
        <label for="${item.id}" class="flex-1 text-sm">${item.text}</label>
      </div>
    `).join('');
    
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.checklists.neat[e.target.id] = e.target.checked;
        this.guardarTodo();
      });
    });
  }

  setupAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const targetId = trigger.dataset.target;
        const content = document.getElementById(targetId);
        const isOpen = content.classList.contains('open');
        
        // Cerrar todos los del mismo accordion
        trigger.closest('.accordion').querySelectorAll('.accordion-content').forEach(c => {
          c.classList.remove('open');
        });
        trigger.closest('.accordion').querySelectorAll('.accordion-trigger').forEach(t => {
          t.querySelector('span:last-child').textContent = '▼';
        });
        
        if (!isOpen) {
          content.classList.add('open');
          trigger.querySelector('span:last-child').textContent = '▲';
        }
      });
    });
  }

  // ==================== TAB SUPLEMENTOS ====================

  renderSuplementos() {
    // Los suplementos se renderizan desde HTML estático, solo necesitamos badge clicks si hubiera interacción
  }

  // ==================== TAB MÉDICO ====================

  renderMedico() {
    // Checklist endocrinología
    this.renderChecklistEndo();
  }

  renderChecklistEndo() {
    const container = document.querySelector('#endo-checklist');
    if (!container) return;
    
    const items = [
      {id: 'endo1', text: 'Historial completo: peso máximo, intentos previos, medicaciones, cirugías'},
      {id: 'endo2', text: 'Anthropometría completa: peso, talla, IMC, cintura, cadera, % grasa (BIA/DEXA)'},
      {id: 'endo3', text: 'Panel metabólico completo (ver panel laboratorial arriba)'},
      {id: 'endo4', text: 'Evaluación hormonal: TSH, T4L, Testosterona (H), Cortisol 8am, Prolactina'},
      {id: 'endo5', text: 'Screening apnea sueño (STOP-BANG) — prevalencia 70% en obesidad'},
      {id: 'endo6', text: 'Evaluación psicológica: depresión (PHQ-9), ansiedad (GAD-7), trastorno atracón (BEDS-7)'},
      {id: 'endo7', text: 'Revisión medicaciones obesogénicas (corticoides, antipsicóticos, betabloqueantes, insulinoterapia, sulfonilureas, gabapentinoides, antihistamínicos)'},
      {id: 'endo8', text: 'Plan personalizado: déficit calórico, proteína objetivo, ejercicio recetado, seguimiento 4-12 semanas'},
      {id: 'endo9', text: 'Criterios farmacoterapia: IMC ≥30 o ≥27 + comorbilidad tras 3-6 mes estilo de vida intensivo'},
      {id: 'endo10', text: 'Plan mantenimiento post-pérdida: vigilancia peso mensual, proteína alta, fuerza continua, NEAT'},
    ];
    
    const container_el = document.querySelector('#endo-checklist');
    if (container_el) {
      container_el.innerHTML = items.map(item => `
        <div class="checklist-item">
          <input type="checkbox" id="${item.id}" ${this.checklists.endo[item.id] ? 'checked' : ''}>
          <label for="${item.id}" class="flex-1">${item.text}</label>
        </div>
      `).join('');
      
      container_el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
          this.checklists.endo[e.target.id] = e.target.checked;
          this.guardarTodo();
        });
      });
    }
  }

  // ==================== TAB CONDUCTA ====================

  renderConducta() {
    this.renderChecklistAlternativas();
    this.renderChecklistIdentidad();
  }

  renderChecklistAlternativas() {
    const container = document.querySelector('#alt-checklist');
    if (!container) return;
    
    const items = [
      {id: 'alt1', text: 'Caminar 10 min'},
      {id: 'alt2', text: 'Llamar a alguien'},
      {id: 'alt3', text: 'Respiración 4-7-8 ×5'},
      {id: 'alt4', text: 'Ducharse / lavar cara'},
      {id: 'alt5', text: 'Escribir 3 cosas (journaling)'},
      {id: 'alt6', text: 'Estirar / movilidad 5 min'},
      {id: 'alt7', text: 'Beber agua grande'},
      {id: 'alt8', text: 'Música / podcast'},
    ];
    
    container.innerHTML = items.map(item => `
      <button class="checklist-item">
        <input type="checkbox" id="${item.id}" ${this.checklists.alt[item.id] ? 'checked' : ''}>
        <label for="${item.id}" class="flex-1">${item.text}</label>
      </button>
    `).join('');
    
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.checklists.alt[e.target.id] = e.target.checked;
        this.guardarTodo();
      });
    });
  }

  renderChecklistIdentidad() {
    const container = document.querySelector('#identity-checklist');
    if (!container) return;
    
    const items = [
      {id: 'id1', text: '"Soy alguien que entrena 3-4x/semana" (vs "quiero perder 10kg")'},
      {id: 'id2', text: '"Soy alguien que come proteína en cada comida"'},
      {id: 'id3', text: '"Soy alguien que prioriza su sueño"'},
      {id: 'id4', text: '"Soy alguien que gestiona su estrés activamente"'},
      {id: 'id5', text: '"Soy alguien que se hidrata bien"'},
      {id: 'id6', text: '"Soy alguien que camina después de comer"'},
    ];
    
    container.innerHTML = items.map(item => `
      <div class="checklist-item">
        <input type="checkbox" id="${item.id}" ${this.checklists.identity[item.id] ? 'checked' : ''}>
        <label for="${item.id}" class="flex-1">${item.text}</label>
      </div>
    `).join('');
    
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.checklists.identity[e.target.id] = e.target.checked;
        this.guardarTodo();
      });
    });
  }

  // ==================== TAB MEXICANO ====================

  renderMexicano() {
    // Contenido estático en HTML
  }

  // ==================== TAB TRACKING ====================

  renderTracking() {
    // Contenido estático en HTML
  }

  // ==================== TAB AJUSTES ====================

  renderObjetivos() {
    document.getElementById('objCalorias').value = this.objetivos.calorias;
    document.getElementById('objProteina').value = this.objetivos.proteina;
    document.getElementById('objCarbs').value = this.objetivos.carbohidratos;
    document.getElementById('objGrasa').value = this.objetivos.grasa;
  }

  renderChecklists() {
    this.renderChecklistNEAT();
    this.renderChecklistEndo();
    this.renderChecklistAlternativas();
    this.renderChecklistIdentidad();
  }

  // ==================== MODAL AÑADIR ALIMENTO ====================

  abrirModalAgregar(alimentoId, comida = this.modalComida) {
    const alimento = this.alimentos.find(a => a.id === alimentoId);
    if (!alimento) return;

    this.modalComida = comida;
    document.getElementById('modalMeal').textContent = comida.charAt(0).toUpperCase() + comida.slice(1);
    document.getElementById('modalTitle').textContent = `Añadir a ${comida}`;
    document.getElementById('modalSearch').value = '';
    document.getElementById('modalResults').innerHTML = '';
    document.getElementById('modalOverlay').classList.add('open');

    if (alimento) {
      this.renderModalResult([alimento], true);
    }
    document.getElementById('modalSearch').focus();
  }

  renderModalResult(alimentos, preSeleccionado = false) {
    const container = document.getElementById('modalResults');
    container.innerHTML = alimentos.map(a => `
      <div class="food-item" data-id="${a.id}" tabindex="0">
        <div class="food-info">
          <div class="food-name">${a.nombre} <span class="badge ${this.badgeClass(a.categoria)}">${a.categoria}</span></div>
          <div class="food-macros">
            <span class="food-macro">🔥 ${a.kcal_100g} kcal</span>
            <span class="food-macro">🥩 ${a.proteina_100g}g</span>
            <span class="food-macro">🛢️ ${a.grasa_100g}g</span>
            <span class="food-macro">🌾 ${a.carb_100g}g</span>
            <span class="food-macro">🌿 ${a.fibra_100g}g</span>
          </div>
          ${a.evid ? `<div class="text-xs text-gray-500 mt-1">${a.evid}</div>` : ''}
        </div>
        <div class="flex items-center gap-2">
          <input type="number" class="portion-input" value="${preSeleccionado ? 100 : 100}" min="1" max="1000" step="1" aria-label="Gramos">
          <span class="text-sm text-gray-400">g</span>
          <button class="btn btn-primary text-sm px-3 py-1.5" data-add="${a.id}">Añadir</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.food-item');
        const id = parseInt(item.dataset.id);
        const gramos = parseFloat(item.querySelector('.portion-input').value);
        this.agregarAlimentoComida(id, gramos, this.modalComida);
        this.cerrarModal();
      });
    });
    container.querySelectorAll('.food-item').forEach(el => {
      el.addEventListener('keydown', e => { if (e.key === 'Enter') el.querySelector('[data-add]').click(); });
    });
  }

  buscarModal(query) {
    if (!query.trim()) { document.getElementById('modalResults').innerHTML = ''; return; }
    const terms = query.toLowerCase().split(' ').filter(t => t);
    const resultados = this.alimentos
      .filter(a => terms.every(t => a.nombre.toLowerCase().includes(t) || a.search_terms.some(st => st.includes(t))))
      .slice(0, 20);
    this.renderModalResult(resultados);
  }

  cerrarModal() {
    document.getElementById('modalOverlay').classList.remove('open');
  }

  // ==================== ACCIONES COMIDAS ====================

  agregarAlimentoComida(alimentoId, gramos, comida) {
    const alimento = this.alimentos.find(a => a.id === alimentoId);
    if (!alimento) return;

    const reg = this.getRegistro(this.fechaActual);
    const macros = this.calcularMacros(alimento, gramos);
    const entry = { ...alimento, gramos, macros, timestamp: Date.now() };
    reg[comida].push(entry);
    this.guardarTodo();
    this.renderRegistro();
    this.renderResumen();
    this.toast(`✅ ${alimento.nombre} (${gramos}g) añadido a ${comida}`, 'success');
  }

  eliminarAlimento(comida, idx) {
    const reg = this.getRegistro(this.fechaActual);
    const eliminado = reg[comida].splice(idx, 1)[0];
    this.guardarTodo();
    this.renderRegistro();
    this.renderResumen();
    this.toast(`🗑️ ${eliminado.nombre} eliminado`, 'info');
  }

  // ==================== PESO ====================

  guardarPeso() {
    const fecha = document.getElementById('pesoFecha').value;
    const valor = parseFloat(document.getElementById('pesoValor').value);
    if (!fecha || isNaN(valor) || valor < 30 || valor > 200) {
      this.toast('⚠️ Introduce una fecha y peso válidos', 'error');
      return;
    }
    this.pesos[fecha] = valor;
    this.guardarTodo();
    this.renderPeso();
    document.getElementById('pesoValor').value = '';
    this.toast(`⚖️ Peso guardado: ${valor} kg`, 'success');
  }

  renderPeso() {
    const fechas = Object.keys(this.pesos).sort();
    if (fechas.length === 0) {
      document.getElementById('pesoActual').textContent = '—';
      document.getElementById('imcActual').textContent = '—';
      document.getElementById('tendenciaPeso').textContent = '—';
      document.getElementById('tendenciaPeso').className = 'weight-trend';
      document.getElementById('emptyPeso').classList.remove('hidden');
      document.getElementById('pesoHistorial').innerHTML = '';
      return;
    }

    document.getElementById('emptyPeso').classList.add('hidden');

    const ultimo = this.pesos[fechas[fechas.length - 1]];
    document.getElementById('pesoActual').textContent = `${ultimo} kg`;

    const imc = (ultimo / (1.7 * 1.7)).toFixed(1);
    document.getElementById('imcActual').textContent = imc;

    const recientes = fechas.slice(-7).map(f => this.pesos[f]);
    const tendenciaEl = document.getElementById('tendenciaPeso');
    if (recientes.length >= 2) {
      const diff = recientes[recientes.length - 1] - recientes[0];
      if (diff < -0.2) { tendenciaEl.textContent = `↓ ${Math.abs(diff).toFixed(1)}kg`; tendenciaEl.className = 'weight-trend trend-down'; }
      else if (diff > 0.2) { tendenciaEl.textContent = `↑ ${diff.toFixed(1)}kg`; tendenciaEl.className = 'weight-trend trend-up'; }
      else { tendenciaEl.textContent = '→ Estable'; tendenciaEl.className = 'weight-trend trend-stable'; }
    } else {
      tendenciaEl.textContent = '—'; tendenciaEl.className = 'weight-trend';
    }

    const hist = document.getElementById('pesoHistorial');
    hist.innerHTML = fechas.slice().reverse().map(f => `
      <div class="flex justify-between py-2 border-b last:border-0">
        <span>${this.formatDateDisplay(f)}</span>
        <span class="font-bold">${this.pesos[f]} kg</span>
      </div>
    `).join('');
  }

  formatDateDisplay(d) { return this.parseDate(d).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }); }

  // ==================== AGUA ====================

  agregarAgua() {
    const reg = this.getRegistro(this.fechaActual);
    reg.agua = (reg.agua || 0) + 1;
    this.guardarTodo();
    this.renderResumen();
    this.toast('💧 Vaso de agua registrado', 'success');
  }

  // ==================== EVENT LISTENERS ====================

  setupEventListeners() {
    // Navegación tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => this.cambiarTab(tab.dataset.tab));
    });

    // Programa ejercicio
    document.querySelectorAll('[data-program]').forEach(btn => {
      btn.addEventListener('click', () => this.mostrarPrograma(btn.dataset.program));
    });

    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.busquedaActual = e.target.value.trim();
        this.renderBuscar();
      });
    }

    // Filtros categoría
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('badge-green', 'badge-orange', 'badge-yellow', 'badge-blue', 'badge-purple', 'badge-red', 'badge-gray');
        });
        btn.classList.add(this.badgeClass(btn.dataset.cat));
        this.categoriaActual = btn.dataset.cat;
        this.renderBuscar();
      });
    });

    // Click en resultados búsqueda
    document.getElementById('searchResults').addEventListener('click', (e) => {
      const item = e.target.closest('.food-item');
      if (item) this.abrirModalAgregar(parseInt(item.dataset.id));
    });

    // Modal
    document.getElementById('modalClose').addEventListener('click', () => this.cerrarModal());
    document.getElementById('modalOverlay').addEventListener('click', (e) => { if (e.target.id === 'modalOverlay') this.cerrarModal(); });
    document.getElementById('modalSearch').addEventListener('input', (e) => this.buscarModal(e.target.value));

    // Fechas
    ['registroFecha', 'resumenFecha', 'pesoFecha', 'dashboardFecha'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', (e) => {
        this.fechaActual = e.target.value;
        ['registroFecha', 'resumenFecha', 'pesoFecha', 'dashboardFecha'].forEach(i => {
          const e2 = document.getElementById(i);
          if (e2) e2.value = this.fechaActual;
        });
        this.renderTodo();
      });
    });

    // Botones añadir comida
    document.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => this.abrirModalAgregar(null, btn.dataset.add));
    });

    // Agua
    const btnAgua = document.getElementById('btnAgua');
    if (btnAgua) btnAgua.addEventListener('click', () => this.agregarAgua());

    // Peso
    const btnPeso = document.getElementById('btnGuardarPeso');
    if (btnPeso) btnPeso.addEventListener('click', () => this.guardarPeso());

    // Objetivos
    const btnObj = document.getElementById('btnGuardarObjetivos');
    if (btnObj) btnObj.addEventListener('click', () => this.guardarObjetivos());

    // Export/Import/Borrar
    const btnExp = document.getElementById('btnExportar');
    if (btnExp) btnExp.addEventListener('click', () => this.exportarDatos());
    const btnExpFull = document.getElementById('btnExportFull');
    if (btnExpFull) btnExpFull.addEventListener('click', () => this.exportarDatos());
    
    const btnImp = document.getElementById('btnImportar');
    if (btnImp) btnImp.addEventListener('click', () => document.getElementById('importFile').click());
    
    const btnImpFull = document.getElementById('btnImportFull');
    if (btnImpFull) btnImpFull.addEventListener('click', () => document.getElementById('importFullFile').click());
    
    const importFile = document.getElementById('importFile');
    if (importFile) importFile.addEventListener('change', (e) => this.importarDatos(e));
    
    const importFullFile = document.getElementById('importFullFile');
    if (importFullFile) importFullFile.addEventListener('change', (e) => this.importarDatos(e));

    const btnBorrar = document.getElementById('btnBorrarTodo');
    if (btnBorrar) btnBorrar.addEventListener('click', () => this.borrarTodo());

    // Compartir
    const btnShare = document.getElementById('btnCompartir');
    if (btnShare) btnShare.addEventListener('click', () => this.compartirResumen());

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.cerrarModal();
    });

    // Checklists NEAT
    document.querySelectorAll('#neat-checklist input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.checklists.neat[e.target.id] = e.target.checked;
        this.guardarTodo();
      });
    });

    // Checklist Endo
    document.querySelectorAll('#endo-checklist input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.checklists.endo[e.target.id] = e.target.checked;
        this.guardarTodo();
      });
    });

    // Checklist Alternativas
    document.querySelectorAll('#alt-checklist input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.checklists.alt[e.target.id] = e.target.checked;
        this.guardarTodo();
      });
    });

    // Checklist Identidad
    document.querySelectorAll('#identity-checklist input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.checklists.identity[e.target.id] = e.target.checked;
        this.guardarTodo();
      });
    });
  }

  cambiarTab(tab) {
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
      t.setAttribute('aria-selected', t.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('hidden', c.id !== `tab-${tab}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==================== OBJETIVOS ====================

  guardarObjetivos() {
    this.objetivos = {
      calorias: parseInt(document.getElementById('objCalorias').value) || 1800,
      proteina: parseInt(document.getElementById('objProteina').value) || 135,
      carbohidratos: parseInt(document.getElementById('objCarbs').value) || 180,
      grasa: parseInt(document.getElementById('objGrasa').value) || 60,
    };
    localStorage.setItem('nutrimx_objetivos', JSON.stringify(this.objetivos));
    this.renderResumen();
    this.toast('🎯 Objetivos guardados', 'success');
  }

  // ==================== EXPORT/IMPORT ====================

  exportarDatos() {
    const data = {
      version: '2.0',
      fecha: new Date().toISOString(),
      alimentos: this.alimentos,
      registros: this.registros,
      pesos: this.pesos,
      objetivos: this.objetivos,
      checklists: this.checklists,
      programa: this.programaActual
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrimx-v2-backup-${this.hoy()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('📤 Datos exportados', 'success');
  }

  importarDatos(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.alimentos) this.alimentos = data.alimentos;
        if (data.registros) this.registros = data.registros;
        if (data.pesos) this.pesos = data.pesos;
        if (data.objetivos) this.objetivos = data.objetivos;
        if (data.checklists) this.checklists = data.checklists;
        if (data.programa) this.programaActual = data.programa;
        localStorage.setItem('nutrimx_alimentos', JSON.stringify(this.alimentos));
        this.guardarTodo();
        this.renderTodo();
        this.toast('📥 Datos importados correctamente', 'success');
      } catch (err) {
        this.toast('❌ Error al importar', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  borrarTodo() {
    if (!confirm('¿Borrar TODOS los datos? Esta acción no se puede deshacer.')) return;
    if (!confirm('Última confirmación: se perderán registros, pesos, objetivos, checklists.')) return;
    localStorage.clear();
    this.registros = {};
    this.pesos = {};
    this.objetivos = { calorias: 1800, proteina: 135, carbohidratos: 180, grasa: 60 };
    this.checklists = { neat: {}, alt: {}, identity: {}, endo: {} };
    this.programaActual = 'fb3';
    this.guardarTodo();
    this.renderTodo();
    this.toast('🗑️ Todo borrado', 'info');
  }

  // ==================== COMPARTIR ====================

  async compartirResumen() {
    const { totals, porComida } = this.calcularTotalesDia(this.fechaActual);
    const reg = this.getRegistro(this.fechaActual);
    const texto = `📊 NutriMX v2.0 - Resumen ${this.formatDateDisplay(this.fechaActual)}

🔥 ${totals.kcal} kcal / ${this.objetivos.calorias} objetivo
🥩 ${totals.proteina}g · 🛢️ ${totals.grasa}g · 🌾 ${totals.carb}g · 🌿 ${totals.fibra}g
💧 ${reg.agua || 0}/8 vasos

🌅 Desayuno: ${porComida.desayuno?.kcal || 0} kcal
☀️ Comida: ${porComida.comida?.kcal || 0} kcal
🌙 Cena: ${porComida.cena?.kcal || 0} kcal
🍎 Colación: ${porComida.colacion?.kcal || 0} kcal

#NutriMX #RecomposiciónCorporal #Evidencia`;

    if (navigator.share) {
      try { await navigator.share({ title: 'Mi resumen NutriMX v2.0', text: texto }); }
      catch { this.copiarAlPortapapeles(texto); }
    } else {
      this.copiarAlPortapapeles(texto);
    }
  }

  copiarAlPortapapeles(texto) {
    navigator.clipboard.writeText(texto).then(() => this.toast('📋 Copiado al portapapeles', 'success'));
  }

  // ==================== PWA / SERVICE WORKER ====================

  async setupPWA() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('./sw.js');
        this.swRegistered = true;
        console.log('✅ SW registrado:', reg.scope);

        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              this.mostrarActualizacion();
            }
          });
        });
      } catch (err) { console.warn('SW registration failed:', err); }
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.mostrarBannerInstalacion();
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      document.getElementById('installBanner').classList.add('hidden');
      document.getElementById('installBtn').classList.add('hidden');
      this.toast('🎉 NutriMX v2.0 instalado', 'success');
    });
  }

  verificarInstalacion() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').match || window.navigator.standalone;
    if (isStandalone) {
      document.getElementById('installBanner').classList.add('hidden');
      document.getElementById('installBtn').classList.add('hidden');
    } else if (this.deferredPrompt) {
      this.mostrarBannerInstalacion();
    }
  }

  mostrarBannerInstalacion() {
    const banner = document.getElementById('installBanner');
    banner.classList.remove('hidden');
    document.getElementById('installAccept').onclick = () => this.instalarApp();
    document.getElementById('installDismiss').onclick = () => banner.classList.add('hidden');
  }

  async instalarApp() {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    if (outcome === 'accepted') this.toast('🎉 Instalando...', 'success');
    this.deferredPrompt = null;
    document.getElementById('installBanner').classList.add('hidden');
  }

  mostrarActualizacion() {
    this.toast('🔄 Nueva versión disponible. Recarga para actualizar.', 'info');
  }

  // ==================== TOAST ====================

  toast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
  }
}

// Cargar ciencia.js primero, luego inicializar app
document.addEventListener('DOMContentLoaded', async () => {
  // Primero cargar ciencia.js
  try {
    await import('./ciencia.js');
  } catch (e) {
    console.warn('ciencia.js no cargó como módulo, intentando script tag...');
  }
  
  // Inicializar app
  window.nutriApp = new NutriApp();
  await window.nutriApp.init();
});