/**
 * NutriMX v2.2 - Módulo de Perfiles: Hombre / Mujer / Niños
 * Ejercicio, alimentación y suplementos adaptados por perfil.
 * Niños: enfoque de hábitos y juego activo — sin suplementos ni restricción calórica (guías OMS/AAP).
 */

const PERFILES = {
  hombre: {
    icono: '👨', nombre: 'Hombre',
    intro: 'Mayor masa muscular y gasto basal por testosterona. Prioridad: fuerza progresiva, proteína suficiente y control del exceso calórico.',
    ejercicio: {
      nota: 'Guías ACSM/NSCA: fuerza 2-4 días/semana + 150-300 min de cardio moderado. La sobrecarga progresiva es el motor principal.',
      rutinas: [
        { nombre: '💪 Full Body — 3 días/sem (principiante)', detalle: [
          'Sentadilla goblet — 3×8-10', 'Press banca / push-ups — 3×8-12', 'Remo con barra o mancuerna — 3×10-12',
          'Press militar — 3×8-10', 'Peso muerto rumano — 3×10', 'Plancha — 3×30-45s'
        ]},
        { nombre: '🏋️ Torso / Pierna — 4 días/sem (intermedio)', detalle: [
          'Torso A: press banca 4×6-8, remo 4×8-10, press militar 3×8-10, dominadas 3×fallo, curl 3×12',
          'Pierna A: sentadilla 4×6-8, peso muerto rumano 3×8-10, prensa 3×10-12, gemelo 4×12-15',
          'Torso B: press inclinado 4×8-10, jalón 4×10, elevaciones laterales 4×12-15, fondos 3×fallo',
          'Pierna B: peso muerto 4×5, zancadas 3×10/pierna, curl femoral 3×12, abdomen 4×15'
        ]},
        { nombre: '🔥 Push/Pull/Legs — 5-6 días/sem (avanzado)', detalle: [
          'Push: press banca, press militar, inclinado con mancuernas, laterales, tríceps',
          'Pull: peso muerto, dominadas, remo, face pulls, bíceps',
          'Legs: sentadilla, prensa, rumano, zancadas, gemelo, abdomen'
        ]}
      ],
      videos: [
        { id: 'YNNmzqe9TgM', titulo: 'Rutina full body perfecta (3x/sem)' },
        { id: 'pxcO2fFBmSk', titulo: 'Rutina 5 días — masa muscular' },
        { id: 'aM4MuKmDVFs', titulo: 'Full body en casa o gym' },
        { id: 'kjEyN9XHqOA', titulo: 'Cuerpo completo 24 min (mancuernas)' }
      ]
    },
    alimentacion: {
      puntos: [
        ['🥩 Proteína', '1.6–2.2 g/kg/día repartida en 3-5 comidas. En déficit agresivo: hasta 2.3-3.1 g/kg.'],
        ['🔥 Calorías', 'TMB (Mifflin): 10×peso + 6.25×altura − 5×edad + 5. Déficit del 15-25% para perder grasa; superávit del 5-10% para masa.'],
        ['🌾 Carbohidratos', '3–5 g/kg según entrenamiento. Prioriza maíz nixtamalizado, frijol, avena, fruta entera.'],
        ['🛢️ Grasas', '0.8–1.2 g/kg. Aguacate, aceite de oliva, nueces, pescado azul.'],
        ['🍺 Alcohol', 'Principal saboteador silencioso: 7 kcal/g, frena la síntesis proteica y la testosterona.'],
        ['💧 Agua', '35–45 ml/kg/día. La deshidratación del 2% ya reduce el rendimiento.']
      ],
      menu: ['Desayuno: 3 huevos + frijoles + 2 tortillas de maíz + nopal', 'Comida: 150g pechuga o res magra + arroz + ensalada con aguacate', 'Cena: pescado o atún + verduras salteadas + tostadas horneadas', 'Colación: yogur griego + nueces / fruta']
    },
    suplementos: [
      ['Creatina monohidratada', '3–5 g/día, todos los días. Grado A: fuerza, masa magra y cognición.', 'A'],
      ['Proteína de suero', '25–40 g post-entreno si no llegas a tu proteína con comida.', 'A'],
      ['Cafeína', '3–6 mg/kg, 30-60 min antes de entrenar. Rendimiento y enfoque.', 'A'],
      ['Vitamina D3', '1000–4000 UI/día si hay poca exposición solar (confirma con analítica).', 'B'],
      ['Omega-3 (EPA/DHA)', '2–3 g/día: triglicéridos, inflamación, recuperación.', 'B'],
      ['Zinc / Magnesio', 'Solo si hay deficiencia confirmada. No elevan testosterona en niveles normales.', 'C']
    ]
  },

  mujer: {
    icono: '👩', nombre: 'Mujer',
    intro: 'La fuerza es igual de importante: protege hueso, mejora composición corporal y metabolismo. Atención especial a hierro, calcio y energía suficiente.',
    ejercicio: {
      nota: 'Mismos principios de sobrecarga progresiva. El ciclo menstrual permite autorregular: intensidad alta en fase folicular, autoregulada en lútea. Entrenar fuerza NO "agranda" — construye densidad ósea y tono.',
      rutinas: [
        { nombre: '🌸 Full Body — 3 días/sem (principiante)', detalle: [
          'Sentadilla goblet — 3×10', 'Hip thrust — 3×10-12', 'Remo con mancuerna — 3×10-12',
          'Press banca con mancuernas — 3×10', 'Peso muerto rumano — 3×10', 'Plancha — 3×30s'
        ]},
        { nombre: '🍑 Énfasis glúteo/pierna — 4 días/sem (intermedio)', detalle: [
          'Día 1 (glúteo/femoral): hip thrust 4×8-10, rumano 4×10, abducción 3×15, patada polea 3×12',
          'Día 2 (torso): press mancuernas 4×10, jalón 4×10, remo 3×12, laterales 3×15',
          'Día 3 (cuádriceps): sentadilla 4×8, prensa 4×10, zancadas 3×10/pierna, extensión 3×12',
          'Día 4 (full + core): peso muerto 4×6, dominadas asistidas 3×8, plancha 4×40s, farmer walk 3×30m'
        ]},
        { nombre: '⚡ 5 días — recomposición (avanzado)', detalle: [
          '2 días tren inferior énfasis glúteo, 2 días torso, 1 día full body + HIIT corto',
          'Suelo pélvico: incluir respiración diafragmática y core profundo 2-3x/sem'
        ]}
      ],
      videos: [
        { id: 'CRaFIjuHhjE', titulo: 'Piernas y glúteos — 7 mejores ejercicios' },
        { id: '1cqld5q7qrA', titulo: 'Rutina 3 días para mujeres' },
        { id: 'tLBkvyoJWsY', titulo: 'Rutina 5 días — glúteos y piernas' },
        { id: 'bj0Tl0x1KwQ', titulo: 'Glúteos, abdomen y piernas completa' }
      ]
    },
    alimentacion: {
      puntos: [
        ['🥩 Proteína', '1.6–2.2 g/kg/día igual que en hombres — clave para conservar músculo en déficit.'],
        ['🩸 Hierro', '18 mg/día (menstruación). Carnes rojas magras, frijol + vitamina C (limón, guayaba). Fatiga persistente → analítica de ferritina.'],
        ['🦴 Calcio + Vit. D', '1000 mg/día de calcio: lácteos, tortilla nixtamalizada, sardinas, brócoli. Crítico para prevenir osteoporosis.'],
        ['🔥 Calorías', 'TMB (Mifflin): 10×peso + 6.25×altura − 5×edad − 161. NUNCA menos de 1200 kcal — frena metabolismo y ciclo.'],
        ['🤰 Folato', '400 µg/día en edad fértil: hoja verde, frijol, aguacate.'],
        ['⚠️ Señal de alarma', 'Pérdida del ciclo menstrual = déficit excesivo (RED-S). Sube calorías y consulta médico.']
      ],
      menu: ['Desayuno: avena con leche + fruta + 1 huevo', 'Comida: 130g pollo o pescado + frijoles + ensalada + tortilla', 'Cena: tacos de lechuga con atún + aguacate', 'Colación: yogur griego + fresas / almendras']
    },
    suplementos: [
      ['Creatina monohidratada', '3–5 g/día. Igual de efectiva en mujeres: fuerza, hueso y cognición.', 'A'],
      ['Proteína de suero', '25–30 g cuando no llegues a tu objetivo con comida.', 'A'],
      ['Vitamina D3 + Calcio', 'D3 1000–2000 UI si hay poca exposición solar; calcio si la dieta no alcanza 1000 mg.', 'B'],
      ['Hierro', 'SOLO con deficiencia confirmada por analítica — el exceso es tóxico.', 'B*'],
      ['Omega-3 (EPA/DHA)', '1–2 g/día: antiinflamatorio, salud cardiovascular.', 'B'],
      ['⚠️ Embarazo/lactancia', 'Todo suplemento debe aprobarlo tu médico. El folato sí es estándar preconcepción.', '!']
    ]
  },

  ninos: {
    icono: '🧒', nombre: 'Niños',
    intro: 'Los niños NO son adultos pequeños: están creciendo. El objetivo no es "quemar calorías" sino construir hábitos, huesos fuertes y amor por el movimiento. Sin dietas restrictivas y sin suplementos.',
    ejercicio: {
      nota: 'OMS: mínimo 60 minutos diarios de actividad moderada-vigorosa + juegos de fuerza (trepar, saltar, colgarse) 3 veces/semana. La palabra clave es JUGAR, no "entrenar". Siempre con supervisión de un adulto.',
      rutinas: [
        { nombre: '🎮 Circuito del explorador (6-9 años, 20 min)', detalle: [
          'Saltos de rana — 1 min', 'Caminar como cangrejo — 1 min', 'Carrera de obstáculos con cojines — 3 min',
          'Equilibrio en un pie (¡como flamenco!) — 1 min por pie', 'Bailar su canción favorita — 5 min', 'Estiramientos de animales (gato, cobra) — 3 min'
        ]},
        { nombre: '⚽ Reto activo (10-13 años, 30 min)', detalle: [
          'Calentamiento: trote suave + coordinación con escalera imaginaria — 5 min',
          'Sentadillas al sillón — 2×10', 'Lagartijas con rodillas — 2×8', 'Saltos de tijera — 2×15',
          'Juego: fútbol, bici, natación o trampolín — 15 min', 'Colgarse de barra o trepar — 3 intentos'
        ]},
        { nombre: '📵 Hábitos que suman', detalle: [
          'Máximo 2 horas de pantalla recreativa al día (AAP)',
          'Caminar o ir en bici a la escuela cuando sea posible',
          'Jugar al aire libre todos los días — el sol ayuda a la vitamina D',
          'Dormir 9-12 horas (6-12 años): el crecimiento ocurre dormido'
        ]}
      ],
      videos: [
        { id: 'HZ54ZGuvVkw', titulo: 'Rutina de ejercicio para niños en casa' },
        { id: 'mC-vnuz34tM', titulo: 'Ejercicio para niños — 15 minutos' },
        { id: 'VrSb67s-PLk', titulo: '30 ejercicios divertidos en casa' },
        { id: 'SCGhftqIDXM', titulo: 'Circuito motriz con juegos' }
      ]
    },
    alimentacion: {
      puntos: [
        ['🍽️ Sin dietas', 'NUNCA restricción calórica sin indicación pediátrica: están creciendo. El enfoque es calidad, no cantidad.'],
        ['🥛 Calcio + Vit. D', 'Hueso en construcción: leche, queso, yogur, tortilla de maíz nixtamalizado. Pico de masa ósea se forma AHORA.'],
        ['🩸 Hierro', 'Crítico para el desarrollo cerebral: frijoles, carne, huevo, espinaca + fruta con vitamina C.'],
        ['🥤 Cero refrescos', 'La medida #1 con más impacto: agua natural o de fruta sin azúcar. Un refresco diario = +6 kg/año potenciales.'],
        ['🍳 Desayuno siempre', 'Mejora concentración y rendimiento escolar. Huevo, avena, fruta, leche.'],
        ['👨‍🍳 Involúcralos', 'Niños que cocinan comen más verduras. Deja que elijan y preparen (con supervisión).'],
        ['👂 Respeta su hambre', 'No obligar a "terminarse el plato" ni usar comida como premio/castigo — forma su relación con la comida de por vida.']
      ],
      menu: ['Desayuno: quesadilla de maíz + fruta + leche', 'Lunch escolar: sándwich integral + jícama con limón + agua', 'Comida: pollo deshebrado + arroz + frijoles + agua de jamaica sin azúcar', 'Cena: cereal de avena con leche + plátano']
    },
    suplementos: null,
    avisoSuplementos: '🚫 Los niños sanos NO necesitan suplementos: una alimentación variada cubre todo. Las excepciones (vitamina D en lactantes, hierro en deficiencia, etc.) las decide SOLO el pediatra. Nunca dar creatina, proteínas en polvo, pre-entrenos ni "vitaminas para crecer" por cuenta propia.'
  },

  mayores: {
    icono: '🧓', nombre: 'Adultos mayores',
    intro: 'El músculo es el órgano de la longevidad: después de los 60 se pierde 1-2% al año si no se entrena (sarcopenia). Moverse — aunque sea en silla o cama — y comer suficiente proteína cambia radicalmente la independencia y calidad de vida.',
    ejercicio: {
      nota: 'ACSM/OMS 65+: fuerza 2-3 días/sem + equilibrio 3 días/sem + actividad aeróbica según capacidad. TODO se puede adaptar: de pie, en silla, en el piso o en cama. Regla de oro: que rete, sin dolor. Si hay mareo, dolor en pecho o falta de aire inusual, detenerse y consultar al médico.',
      rutinas: [
        { nombre: '🪑 En silla (movilidad reducida o inicio)', detalle: [
          'Sentarse y levantarse de la silla (con apoyo si hace falta) — 2×8: el ejercicio MÁS importante',
          'Marcha sentada levantando rodillas — 2 min', 'Extensión de rodilla sentado — 2×10 por pierna',
          'Press de hombros con botellas de agua — 2×10', 'Remo con liga sujeta a la puerta — 2×10',
          'Círculos de tobillo y "escribir el alfabeto" con el pie — previene caídas', 'Estiramiento suave de cuello y espalda — 3 min'
        ]},
        { nombre: '🧘 A ras de piso (con tapete)', detalle: [
          'Puente de glúteo — 2×10: cadera fuerte = menos caídas', 'Gato-vaca en 4 puntos — 2×8: columna móvil',
          'Elevación de pierna acostado de lado — 2×10 por lado', 'Superman suave (brazo y pierna contraria) — 2×8',
          'Práctica de levantarse del piso con apoyo — 3 repeticiones: habilidad que salva vidas',
          'Respiración diafragmática — 2 min al final'
        ]},
        { nombre: '🛏️ En cama (encamados o post-operatorio, con permiso médico)', detalle: [
          'Bombeo de tobillos — 20 repeticiones cada hora despierto: previene trombosis',
          'Apretar glúteos 5 segundos — 2×10', 'Deslizar talón hacia el cuerpo — 2×8 por pierna',
          'Apretar almohada entre rodillas — 2×10', 'Elevación de brazos con o sin botella pequeña — 2×10',
          'Sentarse al borde de la cama con supervisión — mantener 1-2 min: primer paso a la movilidad'
        ]},
        { nombre: '⚖️ Equilibrio diario (previene caídas — 5 min)', detalle: [
          'Pararse junto a una pared o silla de apoyo', 'Apoyo en un pie — 10-30 segundos por pie',
          'Caminar en línea recta talón-punta — 10 pasos', 'Pararse de puntas y talones alternando — 2×10',
          'Caminar de lado agarrado de la barra o mueble — 2×10 pasos'
        ]}
      ],
      videos: [
        { id: '67wl05H1K3U', titulo: 'Entrenamiento en silla — adultos mayores' },
        { id: 'FPe2R4QwgzE', titulo: 'Fortalecimiento muscular sentado' },
        { id: 'o-4R_BNYyiM', titulo: 'Rutina 70+ años sentados en silla' },
        { id: 'UQx5qhptp4s', titulo: 'Rutina y estiramientos sentados' }
      ]
    },
    alimentacion: {
      puntos: [
        ['🥩 MÁS proteína, no menos', '1.2–2.0 g/kg/día (PROT-AGE): el cuerpo mayor la aprovecha peor ("resistencia anabólica"). 25-30 g por comida, con leucina (huevo, lácteos, pollo, frijol).'],
        ['💧 Hidratación programada', 'La sed disminuye con la edad — beber por horario, no por sed: un vaso cada 2 horas. Deshidratación = confusión, caídas, hospitalización.'],
        ['🦴 Calcio + Vitamina D', '1200 mg de calcio/día. Lácteos, sardina, tortilla nixtamalizada. La D casi siempre requiere suplemento (ver pestaña).'],
        ['🍽️ Comidas pequeñas y frecuentes', 'Si hay poco apetito: 5-6 tomas pequeñas, enriquecidas (leche en polvo añadida a sopas, aguacate, huevo).'],
        ['🦷 Textura adaptada', 'Problemas de masticación NO justifican comer menos proteína: picadillo, huevo, frijoles machacados, yogur, atún.'],
        ['⚠️ Pérdida de peso involuntaria', 'Perder >5% del peso en 6 meses sin intentarlo es señal de alarma médica — no celebrarlo, evaluarlo.'],
        ['💊 Interacciones', 'Anticoagulantes, tiroides, diabetes: la dieta y suplementos deben revisarse con el médico de cabecera.']
      ],
      menu: ['Desayuno: avena con leche entera + plátano + 1 huevo', 'Media mañana: yogur con miel', 'Comida: caldo de pollo con verduras + pollo deshebrado + frijoles + tortilla', 'Merienda: licuado de leche con fruta', 'Cena: quesadillas suaves + aguacate']
    },
    suplementos: [
      ['Vitamina D3', '800–2000 UI/día: casi universal en mayores (menos síntesis cutánea). Reduce caídas y fracturas.', 'A'],
      ['Proteína en polvo', '25–30 g cuando el apetito no alcanza — de las intervenciones más costo-efectivas contra la sarcopenia.', 'A'],
      ['Creatina monohidratada', '3–5 g/día + ejercicio de fuerza: masa muscular y cognición también en 60+. Requiere riñón sano (consultar médico).', 'B'],
      ['Vitamina B12', 'Tras los 60 baja la absorción (atrofia gástrica, metformina, omeprazol). Analítica anual y suplementar si está baja.', 'B'],
      ['Calcio', 'Solo si la dieta no llega a 1200 mg — preferir SIEMPRE comida primero.', 'B'],
      ['Omega-3', '1–2 g/día: función cognitiva y antiinflamatorio articular.', 'B'],
      ['⚠️ Regla de oro', 'TODO suplemento nuevo pasa primero por el médico: las interacciones con medicamentos son la norma, no la excepción.', '!']
    ]
  }
};

class PerfilesUI {
  constructor() {
    this.perfilActual = 'hombre';
    this.seccionActual = 'ejercicio';
  }

  init() {
    const cont = document.getElementById('tab-perfiles');
    if (!cont) return;
    document.querySelectorAll('.perfil-btn').forEach(b => {
      b.addEventListener('click', () => {
        this.perfilActual = b.dataset.perfil;
        document.querySelectorAll('.perfil-btn').forEach(x => x.classList.toggle('activo', x === b));
        this.render();
      });
    });
    this.render();
  }

  render() {
    const p = PERFILES[this.perfilActual];
    const cont = document.getElementById('perfilContenido');
    if (!p || !cont) return;

    const secciones = [['ejercicio', '🏃 Ejercicio'], ['alimentacion', '🥗 Alimentación']];
    if (p.suplementos) secciones.push(['suplementos', '💊 Suplementos']);
    if (!secciones.some(s => s[0] === this.seccionActual)) this.seccionActual = 'ejercicio';

    const tabs = secciones.map(([k, t]) =>
      `<button class="perfil-subtab ${k === this.seccionActual ? 'activo' : ''}" data-sec="${k}">${t}</button>`).join('');

    let cuerpo = '';
    if (this.seccionActual === 'ejercicio') cuerpo = this.renderEjercicio(p);
    else if (this.seccionActual === 'alimentacion') cuerpo = this.renderAlimentacion(p);
    else cuerpo = this.renderSuplementos(p);

    const avisoNinos = this.perfilActual === 'ninos' && !p.suplementos
      ? `<div class="perfil-aviso">${p.avisoSuplementos}</div>` : '';

    cont.innerHTML = `
      <p class="perfil-intro">${p.icono} ${p.intro}</p>
      <div class="perfil-subtabs">${tabs}</div>
      ${cuerpo}
      ${avisoNinos}
      <p class="perfil-disclaimer">ℹ️ Información educativa general — no sustituye la valoración de un médico, nutriólogo o entrenador certificado.</p>`;

    cont.querySelectorAll('.perfil-subtab').forEach(b => {
      b.addEventListener('click', () => { this.seccionActual = b.dataset.sec; this.render(); });
    });
    cont.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => this.reproducir(card.dataset.video, card.dataset.titulo));
    });
    cont.querySelectorAll('.perfil-rutina-head').forEach(h => {
      h.addEventListener('click', () => h.parentElement.classList.toggle('abierta'));
    });
  }

  renderEjercicio(p) {
    const rutinas = p.ejercicio.rutinas.map(r => `
      <div class="perfil-rutina">
        <div class="perfil-rutina-head">${r.nombre}<span class="perfil-flecha">▾</span></div>
        <ul class="perfil-rutina-lista">${r.detalle.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>`).join('');
    const videos = p.ejercicio.videos.map(v => `
      <div class="video-card" data-video="${v.id}" data-titulo="${v.titulo}">
        <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.titulo}" loading="lazy">
        <span class="video-play">▶</span><span class="video-titulo">${v.titulo}</span>
      </div>`).join('');
    return `
      <p class="perfil-nota">${p.ejercicio.nota}</p>
      <h4 class="perfil-h4">📋 Rutinas (toca para abrir)</h4>
      ${rutinas}
      <h4 class="perfil-h4">🎬 Videos guiados</h4>
      <div class="video-grid">${videos}</div>
      <div id="perfilVideoPlayer" class="video-player hidden"></div>`;
  }

  renderAlimentacion(p) {
    const puntos = p.alimentacion.puntos.map(([t, d]) => `
      <div class="perfil-punto"><div class="perfil-punto-t">${t}</div><div class="perfil-punto-d">${d}</div></div>`).join('');
    const menu = p.alimentacion.menu.map(m => `<li>${m}</li>`).join('');
    return `
      <div class="perfil-puntos">${puntos}</div>
      <h4 class="perfil-h4">🍽️ Ejemplo de día (estilo mexicano)</h4>
      <ul class="perfil-menu">${menu}</ul>`;
  }

  renderSuplementos(p) {
    const filas = p.suplementos.map(([n, d, g]) => `
      <div class="perfil-supl">
        <span class="perfil-supl-grado grado-${g.replace('*','x').replace('!','warn')}">${g}</span>
        <div><div class="perfil-punto-t">${n}</div><div class="perfil-punto-d">${d}</div></div>
      </div>`).join('');
    return `
      <p class="perfil-nota">Grados de evidencia: A = sólida · B = moderada · C = débil. Los suplementos complementan — no sustituyen — comida, sueño y entrenamiento.</p>
      ${filas}`;
  }

  reproducir(id, titulo) {
    const player = document.getElementById('perfilVideoPlayer');
    if (!player) return;
    player.classList.remove('hidden');
    player.innerHTML = `<div class="video-player-head"><strong>${titulo}</strong><button class="auth-btn" onclick="this.closest('.video-player').classList.add('hidden');this.closest('.video-player').querySelector('iframe')?.remove()">✕ Cerrar</button></div>
      <iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${titulo}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    player.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

window.PERFILES = PERFILES;
window.perfilesUI = new PerfilesUI();
document.addEventListener('DOMContentLoaded', () => window.perfilesUI.init());
