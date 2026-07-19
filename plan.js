/**
 * NutriMX v3.1 - Plan sugerido (menú + ejercicio) según la evaluación del usuario.
 * Genera un menú diario con alimentos reales de la base, ajustado a las calorías y
 * proteína objetivo, y una rutina de ejercicio según el perfil y la modalidad segura.
 */

class PlanUI {
  constructor() {
    this.menu = null;
  }

  datos() {
    try { return JSON.parse(localStorage.getItem('nutrimx_salud') || 'null'); } catch (e) { return null; }
  }

  porCategoria(cat) {
    const app = window.nutriApp;
    if (!app || !app.alimentos) return [];
    return app.alimentos.filter(a => a.categoria === cat);
  }

  // Elige un alimento de una categoría de forma rotativa (determinista por día)
  elige(cat, offset = 0) {
    const lista = this.porCategoria(cat);
    if (!lista.length) return null;
    const dia = new Date().getDate();
    return lista[(dia + offset) % lista.length];
  }

  // Calcula gramos para aportar 'kcalObjetivo' de un alimento
  gramosPara(alimento, kcal) {
    if (!alimento || !alimento.kcal_100g) return 100;
    let g = Math.round((kcal / alimento.kcal_100g) * 100 / 5) * 5;
    return Math.max(20, Math.min(300, g));
  }

  item(alimento, kcal) {
    if (!alimento) return null;
    const g = this.gramosPara(alimento, kcal);
    const f = g / 100;
    return {
      id: alimento.id, nombre: alimento.nombre, gramos: g,
      cat: alimento.categoria,      // para ofrecer alternativas parecidas
      kcalObjetivo: Math.round(kcal), // calorías que debe aportar este lugar del menú
      kcal: Math.round(alimento.kcal_100g * f),
      p: Math.round(alimento.proteina_100g * f),
      ch: Math.round(alimento.carb_100g * f),
      gr: Math.round(alimento.grasa_100g * f)
    };
  }

  /** Reconstruye un item del menú con otro alimento, ajustando gramos a las mismas kcal. */
  sustituir(comida, idx, alimentoId, gramosFijos) {
    const app = window.nutriApp;
    if (!app || !this.menu || !this.menu[comida]) return;
    const alimento = app.alimentos.find(a => a.id === alimentoId);
    if (!alimento) return;
    const anterior = this.menu[comida][idx];
    const objetivo = (anterior && anterior.kcalObjetivo) || 250;
    let nuevo;
    if (gramosFijos) {
      const f = gramosFijos / 100;
      nuevo = {
        id: alimento.id, nombre: alimento.nombre, gramos: gramosFijos,
        cat: alimento.categoria, kcalObjetivo: objetivo,
        kcal: Math.round(alimento.kcal_100g * f), p: Math.round(alimento.proteina_100g * f),
        ch: Math.round(alimento.carb_100g * f), gr: Math.round(alimento.grasa_100g * f)
      };
    } else {
      nuevo = this.item(alimento, objetivo);
    }
    this.menu[comida][idx] = nuevo;
    this.menuEditado = true;
    this.render(true);
  }

  /** Quita un alimento del menú. */
  quitarDelMenu(comida, idx) {
    if (!this.menu || !this.menu[comida]) return;
    this.menu[comida].splice(idx, 1);
    this.menuEditado = true;
    this.render(true);
  }

  /** Agrega un alimento a una comida del menú. */
  agregarAlMenu(comida, alimentoId, gramos) {
    const app = window.nutriApp;
    if (!app || !this.menu) return;
    const alimento = app.alimentos.find(a => a.id === alimentoId);
    if (!alimento) return;
    const g = gramos || 100;
    const f = g / 100;
    this.menu[comida].push({
      id: alimento.id, nombre: alimento.nombre, gramos: g,
      cat: alimento.categoria, kcalObjetivo: Math.round(alimento.kcal_100g * f),
      kcal: Math.round(alimento.kcal_100g * f), p: Math.round(alimento.proteina_100g * f),
      ch: Math.round(alimento.carb_100g * f), gr: Math.round(alimento.grasa_100g * f)
    });
    this.menuEditado = true;
    this.render(true);
  }

  generarMenu() {
    const d = this.datos();
    const kcal = (d && d.analisis && d.analisis.kcalObjetivo) || (window.nutriApp && window.nutriApp.objetivos.calorias) || 1800;

    // Distribución por comida
    const dist = { desayuno: 0.25, comida: 0.35, cena: 0.25, colacion: 0.15 };
    const menu = { desayuno: [], comida: [], cena: [], colacion: [] };

    // Desayuno: proteína + cereal + fruta
    const kd = kcal * dist.desayuno;
    menu.desayuno = [
      this.item(this.elige('Proteína', 0), kd * 0.4),
      this.item(this.elige('Cereal', 0), kd * 0.4),
      this.item(this.elige('Fruta', 0), kd * 0.2)
    ].filter(Boolean);

    // Comida: proteína + legumbre/cereal + verdura
    const kc = kcal * dist.comida;
    menu.comida = [
      this.item(this.elige('Proteína', 1), kc * 0.45),
      this.item(this.elige('Legumbre', 0) || this.elige('Cereal', 1), kc * 0.35),
      this.item(this.elige('Verdura', 0), kc * 0.2)
    ].filter(Boolean);

    // Cena: proteína + verdura + grasa buena
    const kn = kcal * dist.cena;
    menu.cena = [
      this.item(this.elige('Proteína', 2), kn * 0.5),
      this.item(this.elige('Verdura', 1), kn * 0.25),
      this.item(this.elige('Grasa', 0), kn * 0.25)
    ].filter(Boolean);

    // Colación: fruta + fruto seco o lácteo
    const kl = kcal * dist.colacion;
    menu.colacion = [
      this.item(this.elige('Fruta', 1), kl * 0.5),
      this.item(this.elige('Fruto seco', 0) || this.elige('Lácteo', 0), kl * 0.5)
    ].filter(Boolean);

    this.menu = menu;
    return menu;
  }

  totales(menu) {
    let kcal = 0, p = 0, ch = 0, gr = 0;
    Object.values(menu).forEach(items => items.forEach(i => { kcal += i.kcal; p += i.p; ch += i.ch; gr += i.gr; }));
    return { kcal, p, ch, gr };
  }

  // ==================== EJERCICIO ====================

  planEjercicio() {
    const d = this.datos();
    const a = d && d.analisis;
    const perfilKey = (a && a.perfil) || 'hombre';
    const modalidad = (a && a.modalidad) || 'completa';
    const P = (window.PERFILES && window.PERFILES[perfilKey]) || null;
    if (!P) return null;

    // Opciones de modalidad que la persona puede ELEGIR (la recomendada va marcada)
    const opciones = P.ejercicio.rutinas.map(r => ({ nombre: r.nombre, detalle: r.detalle, activa: false }));

    // Para perfiles/condiciones con restricción, ofrecer TAMBIÉN una opción más activa (con aviso)
    const restringido = (modalidad === 'silla_cama' || modalidad === 'bajo_impacto' || perfilKey === 'mayores');
    if (restringido && window.PERFILES.hombre) {
      opciones.push({
        nombre: '💪 Fuerza de pie (más activa) — con visto bueno médico',
        detalle: window.PERFILES.hombre.ejercicio.rutinas[0].detalle,
        activa: true
      });
    }

    // ¿Cuál recomendamos por defecto según la evaluación?
    let recomendadaIdx = 0;
    let recomendacion = 'Programa completo con progresión normal.';
    if (modalidad === 'silla_cama') {
      recomendadaIdx = opciones.findIndex(o => /cama/i.test(o.nombre));
      recomendacion = 'Por tu evaluación (cirugía/recuperación reciente) te recomendamos empezar en cama o silla, y consultar a tu médico antes de progresar.';
    } else if (modalidad === 'bajo_impacto') {
      recomendadaIdx = opciones.findIndex(o => /silla|piso/i.test(o.nombre));
      recomendacion = 'Te recomendamos bajo impacto (silla, piso o agua) para proteger tus articulaciones.';
    } else if (modalidad === 'suave') {
      recomendadaIdx = 0;
      recomendacion = 'Te recomendamos empezar solo con actividad ligera (caminar) hasta tener autorización médica.';
    } else if (perfilKey === 'mayores') {
      recomendadaIdx = opciones.findIndex(o => /silla/i.test(o.nombre));
      recomendacion = 'A tu edad recomendamos priorizar fuerza y equilibrio. Empieza donde te sientas cómodo — puedes elegir en silla, en piso, de pie o algo más activo.';
    }
    if (recomendadaIdx < 0) recomendadaIdx = 0;

    // Elección guardada del usuario (si ya escogió antes)
    let elegidaIdx = recomendadaIdx;
    const guardada = localStorage.getItem('nutrimx_modalidad_ejercicio');
    if (guardada !== null) {
      const gi = opciones.findIndex(o => o.nombre === guardada);
      if (gi >= 0) elegidaIdx = gi;
    }

    // Rotar 3 videos por día para dar variedad (de la videoteca completa del perfil)
    const todos = P.ejercicio.videos || [];
    const dia = new Date().getDate() + (this.forzar || 0);
    const videos = [];
    for (let k = 0; k < Math.min(3, todos.length); k++) {
      videos.push(todos[(dia * 3 + k) % todos.length]);
    }

    return {
      perfilKey, nombrePerfil: P.nombre, icono: P.icono,
      nota: P.ejercicio.nota, videos,
      opciones, recomendadaIdx, elegidaIdx, recomendacion
    };
  }

  // ==================== RENDER ====================

  render(conservarMenu) {
    const cont = document.getElementById('planSugerido');
    if (!cont) return;
    const d = this.datos();
    if (!d || !d.analisis) {
      cont.innerHTML = `<div class="plan-cta"><h3 class="font-bold">🎯 Tu plan personalizado</h3>
        <p class="text-sm text-gray-500">Completa tu evaluación inicial (en "Para ti") y aquí aparecerá tu menú y rutina hechos a tu medida.</p></div>`;
      return;
    }
    // Si el usuario ya editó su menú, respetarlo (no regenerar)
    const menu = (conservarMenu && this.menu) ? this.menu : this.generarMenu();
    this.menu = menu;
    const t = this.totales(menu);
    const obj = (d.analisis.kcalObjetivo) || 1800;
    const nombres = { desayuno: '🌅 Desayuno', comida: '☀️ Comida', cena: '🌙 Cena', colacion: '🍎 Colación' };

    const bloques = Object.entries(menu).map(([k, items]) => {
      const kc = items.reduce((s, i) => s + i.kcal, 0);
      return `<div class="plan-comida">
        <div class="plan-comida-head">${nombres[k]} <span>${kc} kcal</span></div>
        <ul>${items.map((i, idx) => `<li class="plan-item">
          <span class="plan-item-txt">${i.nombre} — <strong>${i.gramos}g</strong> <span class="plan-macro">(${i.kcal} kcal · ${i.p}g prot)</span></span>
          <span class="plan-item-acc">
            <button class="plan-mini" data-cambiar="${k}" data-idx="${idx}" title="Cambiar por otro alimento">🔄</button>
            <button class="plan-mini plan-mini-x" data-quitar="${k}" data-idx="${idx}" title="Quitar">✕</button>
          </span>
          <div class="plan-cambio hidden" id="cambio-${k}-${idx}"></div>
        </li>`).join('')}</ul>
        <button class="plan-add" data-agregar="${k}">➕ Agregar alimento a ${nombres[k].split(' ')[1]}</button>
        <div class="plan-cambio hidden" id="agregar-${k}"></div>
      </div>`;
    }).join('');

    const ej = this.planEjercicio();
    let ejHtml = '';
    if (ej) {
      const sel = ej.opciones[ej.elegidaIdx] || ej.opciones[ej.recomendadaIdx];
      const botones = ej.opciones.map((o, i) => {
        const esRec = i === ej.recomendadaIdx;
        const activa = i === ej.elegidaIdx;
        return `<button class="plan-modo ${activa ? 'activa' : ''}" data-modo="${i}">${o.nombre}${esRec ? ' <span class="plan-rec-badge">recomendada</span>' : ''}</button>`;
      }).join('');
      const avisoActiva = sel.activa ? '<p class="plan-aviso">⚠️ Elegiste una rutina más activa. Está bien querer más movimiento — solo asegúrate de tener el visto bueno de tu médico y de no sentir dolor ni mareo.</p>' : '';
      ejHtml = `
      <div class="plan-ejercicio">
        <h4 class="plan-h4">🏋️ Tu ejercicio (${ej.icono} ${ej.nombrePerfil})</h4>
        <p class="plan-recom">🩺 <strong>Nuestra recomendación:</strong> ${ej.recomendacion}</p>
        <p class="plan-elige-label">Pero tú decides cómo entrenar hoy — elige tu modalidad:</p>
        <div class="plan-modos">${botones}</div>
        ${avisoActiva}
        <div class="plan-rutina-nombre">${sel.nombre}</div>
        <ul class="plan-rutina">${sel.detalle.map((x, i) => window.liEjercicioConIlustracion ? window.liEjercicioConIlustracion(x, 'plan', i) : `<li>${x}</li>`).join('')}</ul>
        <p class="text-xs text-gray-500 mb-2">${ej.nota}</p>
        <div class="video-grid">${ej.videos.map(v => `
          <div class="video-card" data-video="${v.id}" data-titulo="${v.titulo}">
            <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.titulo}" loading="lazy">
            <span class="video-play">▶</span><span class="video-titulo">${v.titulo}</span>
          </div>`).join('')}</div>
        <div id="planVideoPlayer" class="video-player hidden"></div>
        <button class="btn btn-secondary mt-2" id="planIrEjercicio">Ver todas las rutinas en "Para ti" →</button>
      </div>`;
    }

    cont.innerHTML = `
      <div class="plan-header">
        <div><h3 class="font-bold text-lg">🎯 Tu plan del día</h3>
        <p class="text-sm text-gray-500">Menú sugerido para tu objetivo de <strong>${obj} kcal</strong> y ${d.analisis.proteina}g de proteína.</p></div>
        <div class="plan-total">${t.kcal} kcal<br><small>${t.p}g proteína</small></div>
      </div>
      <div class="plan-menu">${bloques}</div>
      <div class="plan-acciones">
        <button class="btn btn-primary" id="planCargar">📋 Cargar este menú a mi registro de hoy</button>
        <button class="btn btn-secondary" id="planRegenerar">🔄 Otra variante</button>
      </div>
      <p class="text-xs text-gray-400 mt-1">Sugerencia orientativa con alimentos de la base. Ajusta porciones a tu gusto y apetito.</p>
      ${ejHtml}`;

    document.getElementById('planCargar').addEventListener('click', () => this.cargarMenu());
    document.getElementById('planRegenerar').addEventListener('click', () => { this.forzar = (this.forzar || 0) + 1; this.menuEditado = false; this.menu = null; this.renderVariante(); });

    // Cambiar / quitar / agregar alimentos del menú
    cont.querySelectorAll('[data-cambiar]').forEach(b => b.addEventListener('click', () =>
      this.abrirSelector(b.dataset.cambiar, parseInt(b.dataset.idx), 'cambiar')));
    cont.querySelectorAll('[data-quitar]').forEach(b => b.addEventListener('click', () =>
      this.quitarDelMenu(b.dataset.quitar, parseInt(b.dataset.idx))));
    cont.querySelectorAll('[data-agregar]').forEach(b => b.addEventListener('click', () =>
      this.abrirSelector(b.dataset.agregar, null, 'agregar')));
    const irEj = document.getElementById('planIrEjercicio');
    if (irEj) irEj.addEventListener('click', () => window.nutriApp && window.nutriApp.cambiarTab('perfiles'));
    cont.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => this.reproducir(card.dataset.video, card.dataset.titulo));
    });
    if (window.activarIlustraciones) window.activarIlustraciones(cont);
    // Selector de modalidad de ejercicio: guarda la elección del usuario
    cont.querySelectorAll('.plan-modo').forEach(btn => {
      btn.addEventListener('click', () => {
        if (ej) {
          const i = parseInt(btn.dataset.modo);
          if (ej.opciones[i]) localStorage.setItem('nutrimx_modalidad_ejercicio', ej.opciones[i].nombre);
          this.render();
        }
      });
    });
  }

  /** Abre el selector para cambiar o agregar un alimento en el menú. */
  abrirSelector(comida, idx, modo) {
    const caja = document.getElementById(modo === 'cambiar' ? `cambio-${comida}-${idx}` : `agregar-${comida}`);
    if (!caja) return;
    if (!caja.classList.contains('hidden')) { caja.classList.add('hidden'); return; }
    const actual = modo === 'cambiar' ? this.menu[comida][idx] : null;
    const cat = actual ? actual.cat : null;
    const titulo = modo === 'cambiar'
      ? `Cambiar <strong>${actual.nombre}</strong> por:`
      : 'Agregar un alimento:';

    caja.innerHTML = `
      <p class="plan-cambio-tit">${titulo}</p>
      <input type="search" class="input plan-buscar" placeholder="Busca: fresa, plátano, licuado..." data-buscar="${comida}|${idx === null ? '' : idx}|${modo}">
      ${cat ? `<p class="plan-cambio-sug">Parecidos (${cat}):</p>` : ''}
      <div class="plan-lista" data-lista="${comida}|${idx === null ? '' : idx}|${modo}"></div>
      <div class="plan-gramos-row hidden">
        <label>Gramos:</label><input type="number" class="input plan-gramos" min="1" max="1000" value="100">
        <button class="btn btn-primary plan-confirmar">Aplicar</button>
      </div>`;
    caja.classList.remove('hidden');

    const lista = caja.querySelector('.plan-lista');
    const buscar = caja.querySelector('.plan-buscar');
    const pintar = (arr) => {
      lista.innerHTML = arr.slice(0, 12).map(a =>
        `<button class="plan-opcion" data-alimento="${a.id}">${a.nombre}
          <span>${a.kcal_100g} kcal/100g · ${a.proteina_100g}g prot</span></button>`).join('')
        || '<p class="plan-cambio-sug">Sin resultados — prueba otra palabra.</p>';
      lista.querySelectorAll('[data-alimento]').forEach(b => b.addEventListener('click', () => {
        const id = parseInt(b.dataset.alimento);
        if (modo === 'cambiar') this.sustituir(comida, idx, id);
        else this.agregarAlMenu(comida, id, 100);
      }));
    };
    const app = window.nutriApp;
    // Sugerencias iniciales: misma categoría
    pintar(cat ? app.alimentos.filter(a => a.categoria === cat) : app.alimentos.slice(0, 12));
    buscar.addEventListener('input', () => {
      const q = buscar.value.trim();
      if (!q) { pintar(cat ? app.alimentos.filter(a => a.categoria === cat) : app.alimentos.slice(0, 12)); return; }
      const terms = q.split(/\s+/).filter(Boolean);
      pintar(app.alimentos.filter(a => app.coincideAlimento(a, terms)));
    });
    buscar.focus();
  }

  renderVariante() {
    // Cambia el "día" virtual para generar otra combinación
    const cont = document.getElementById('planSugerido');
    const origDate = Date.prototype.getDate;
    const extra = this.forzar || 0;
    Date.prototype.getDate = function () { return origDate.call(this) + extra; };
    this.render();
    Date.prototype.getDate = origDate;
  }

  cargarMenu() {
    const app = window.nutriApp;
    if (!app || !this.menu) return;
    const fecha = app.fechaActual;
    if (!app.registros[fecha]) app.registros[fecha] = { desayuno: [], comida: [], cena: [], colacion: [], agua: 0 };
    Object.entries(this.menu).forEach(([comida, items]) => {
      items.forEach(i => {
        app.registros[fecha][comida].push({
          id: 'plan-' + i.id + '-' + Math.random().toString(36).slice(2, 5),
          nombre: i.nombre, gramos: i.gramos,
          macros: { kcal: i.kcal, proteina: i.p, carb: i.ch, grasa: i.gr, fibra: 0 },
          timestamp: Date.now()
        });
      });
    });
    app.guardarTodo();
    app.renderTodo && app.renderTodo();
    app.toast && app.toast('✅ Menú del día cargado a tu registro', 'success');
  }

  reproducir(id, titulo) {
    const player = document.getElementById('planVideoPlayer');
    if (!player) return;
    player.classList.remove('hidden');
    player.innerHTML = `<div class="video-player-head"><strong>${titulo}</strong>
      <span><a class="video-yt" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">▶ Ver en YouTube</a>
      <button class="auth-btn" onclick="this.closest('.video-player').classList.add('hidden');this.closest('.video-player').querySelector('iframe')?.remove()">✕ Cerrar</button></span></div>
      <iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${titulo}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      <p class="video-nota">Si el video no carga aquí, es porque su autor bloqueó la reproducción externa — ábrelo con "Ver en YouTube".</p>`;
    player.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

window.planUI = new PlanUI();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if (window.planUI) window.planUI.render(); }, 500);
});
