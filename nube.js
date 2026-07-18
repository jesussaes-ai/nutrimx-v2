/**
 * NutriMX v2.1 - Módulo de nube (Supabase)
 * Autenticación (email+password), sincronización de registros/pesos,
 * fotos de comidas con análisis de calorías por IA (edge function).
 * Funciona de forma opcional: sin sesión, la app sigue 100% local.
 */

const NUBE_CONFIG = {
  url: 'https://nbjzvgtbuceyjutmdhgx.supabase.co',
  // Clave publicable (segura para frontend; protegida por RLS)
  key: 'sb_publishable_GvCR-Jt_rXOBLhCgcXWcPg_Px_8zxhC'
};

class NubeNutriMX {
  constructor() {
    this.sb = null;
    this.user = null;
    this.sincronizando = false;
  }

  get activa() { return !!(this.sb && this.user); }

  async init() {
    if (!window.supabase || NUBE_CONFIG.key.startsWith('__')) {
      console.warn('Nube: supabase-js no disponible o sin configurar');
      this.renderAuthUI();
      return;
    }
    this.sb = window.supabase.createClient(NUBE_CONFIG.url, NUBE_CONFIG.key);

    const { data: { session } } = await this.sb.auth.getSession();
    this.user = session?.user || null;

    this.sb.auth.onAuthStateChange((_evt, session2) => {
      this.user = session2?.user || null;
      this.renderAuthUI();
    });

    this.renderAuthUI();
    if (this.user) await this.descargarDatos();
    // Al cargar la app: decidir acceso (puerta / registro obligatorio / dashboard)
    if (window.acceso) window.acceso.verificarAcceso();
  }

  // ==================== AUTH ====================

  async registrar(email, password, nombre) {
    const { data, error } = await this.sb.auth.signUp({
      email, password,
      options: { data: { nombre } }
    });
    if (error) throw error;
    return data;
  }

  async entrar(email, password) {
    const { data, error } = await this.sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.user = data.user;
    await this.descargarDatos();
    await this.subirDatos();
    // Decidir acceso: si falta la evaluación, se forzará; si está completa, entra al dashboard.
    if (window.acceso) setTimeout(() => window.acceso.verificarAcceso(), 400);
    else if (window.salud) setTimeout(() => window.salud.verificar(), 600);
    return data;
  }

  async salir() {
    await this.sb.auth.signOut();
    this.user = null;
    this.renderAuthUI();
    if (window.acceso) window.acceso.alSalir();
  }

  // ==================== SYNC ====================

  /** Sube el estado local (registros del día y pesos) a la nube. */
  async subirDatos() {
    if (!this.activa || !window.nutriApp) return;
    const app = window.nutriApp;
    try {
      const filasDias = Object.entries(app.registros).map(([fecha, data]) => ({
        user_id: this.user.id, fecha, data, updated_at: new Date().toISOString()
      }));
      if (filasDias.length) {
        await this.sb.from('dias').upsert(filasDias, { onConflict: 'user_id,fecha' });
      }
      const filasPesos = Object.entries(app.pesos).map(([fecha, peso]) => ({
        user_id: this.user.id, fecha, peso
      }));
      if (filasPesos.length) {
        await this.sb.from('pesos').upsert(filasPesos, { onConflict: 'user_id,fecha' });
      }
      await this.sb.from('profiles').upsert({
        id: this.user.id,
        objetivos: app.objetivos,
        updated_at: new Date().toISOString()
      });
    } catch (e) { console.warn('Nube: error subiendo datos', e); }
  }

  /** Baja datos de la nube y los fusiona con lo local (la nube gana en días que existen en ambas). */
  async descargarDatos() {
    if (!this.activa || !window.nutriApp) return;
    const app = window.nutriApp;
    try {
      const { data: dias } = await this.sb.from('dias').select('fecha,data');
      (dias || []).forEach(d => { app.registros[d.fecha] = d.data; });
      const { data: pesos } = await this.sb.from('pesos').select('fecha,peso');
      (pesos || []).forEach(p => { app.pesos[p.fecha] = parseFloat(p.peso); });
      const { data: prof } = await this.sb.from('profiles').select('objetivos,datos,modelo,avatar').eq('id', this.user.id).maybeSingle();
      if (prof && prof.objetivos) app.objetivos = { ...app.objetivos, ...prof.objetivos };
      // Restaurar foto de perfil
      if (prof && prof.avatar && window.avatarUI) {
        window.avatarUI.avatar = prof.avatar;
        localStorage.setItem('nutrimx_avatar', prof.avatar);
        window.avatarUI.pintarHeader();
        window.avatarUI.render();
      }
      // Restaurar modelo de IA preferido del usuario
      if (prof && prof.modelo && window.modeloUI) {
        window.modeloUI.actual = prof.modelo;
        localStorage.setItem('nutrimx_modelo', prof.modelo);
        window.modeloUI.render();
      }
      // Restaurar evaluación de salud desde la nube si no existe local
      if (prof && prof.datos && window.salud && !window.salud.datos) {
        window.salud.datos = prof.datos;
        window.salud.guardarLocal();
        window.salud.renderResumen();
      }
      app.guardarTodo && app.guardarTodo();
      app.renderTodo && app.renderTodo();
    } catch (e) { console.warn('Nube: error descargando datos', e); }
  }

  // ==================== FOTOS + IA ====================

  /** Redimensiona una imagen a máx 1024px y devuelve base64 JPEG (sin prefijo). */
  async prepararImagen(file) {
    const img = await new Promise((res, rej) => {
      const url = URL.createObjectURL(file);
      const i = new Image();
      i.onload = () => { URL.revokeObjectURL(url); res(i); };
      i.onerror = rej;
      i.src = url;
    });
    const MAX = 1024;
    const escala = Math.min(1, MAX / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    return dataUrl.split(',')[1];
  }

  /** Analiza la foto con IA. Devuelve {alimentos:[{nombre,gramos,kcal,proteina,carbs,grasa}], total_kcal, comentario} */
  async analizarFoto(file) {
    if (!this.activa) throw new Error('Inicia sesión para usar el análisis con IA');
    const base64 = await this.prepararImagen(file);
    const modelo = window.modeloUI ? window.modeloUI.get() : '';
    const { data, error } = await this.sb.functions.invoke('analizar-comida', {
      body: { image: base64, media_type: 'image/jpeg', model: modelo || undefined }
    });
    if (error) throw new Error(error.message || 'Error al analizar la foto');
    if (!data || !data.ok) throw new Error((data && data.error) || 'La IA no pudo analizar la imagen');
    return data;
  }

  /** Sube la foto al storage y registra el análisis. Devuelve el path. */
  async guardarFoto(file, fecha, comida, analisis) {
    if (!this.activa) return null;
    try {
      const path = `${this.user.id}/${fecha}_${comida}_${Date.now()}.jpg`;
      const base64 = await this.prepararImagen(file);
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      await this.sb.storage.from('fotos').upload(path, bytes, { contentType: 'image/jpeg' });
      await this.sb.from('fotos').insert({
        user_id: this.user.id, fecha, comida, path, analisis
      });
      return path;
    } catch (e) { console.warn('Nube: error guardando foto', e); return null; }
  }

  // ==================== UI ====================

  renderAuthUI() {
    const chip = document.getElementById('authChip');
    if (!chip) return;
    if (this.activa) {
      const nombre = this.user.user_metadata?.nombre || this.user.email.split('@')[0];
      chip.innerHTML = `<span class="auth-nombre">👤 ${nombre}</span> <button class="auth-btn" id="btnSalir">Salir</button>`;
      document.getElementById('btnSalir').addEventListener('click', () => this.salir());
    } else {
      chip.innerHTML = `<button class="auth-btn auth-btn-primario" id="btnEntrar">Iniciar sesión</button>`;
      document.getElementById('btnEntrar').addEventListener('click', () => this.abrirModal());
    }
    // Estado en la sección de foto IA
    const aviso = document.getElementById('fotoAvisoSesion');
    if (aviso) aviso.classList.toggle('hidden', this.activa);
    const btnFoto = document.getElementById('btnAnalizarFoto');
    if (btnFoto) btnFoto.disabled = !this.activa;
  }

  abrirModal(modo = 'entrar') {
    const m = document.getElementById('authModal');
    if (!m) return;
    m.classList.remove('hidden');
    this.cambiarModoAuth(modo);
  }

  cerrarModal() {
    const m = document.getElementById('authModal');
    if (m) m.classList.add('hidden');
    const err = document.getElementById('authError');
    if (err) { err.textContent = ''; err.classList.add('hidden'); }
  }

  cambiarModoAuth(modo) {
    this.modoAuth = modo;
    document.getElementById('authTitulo').textContent = modo === 'entrar' ? 'Iniciar sesión' : 'Crear cuenta';
    document.getElementById('authNombreWrap').classList.toggle('hidden', modo === 'entrar');
    document.getElementById('authSubmit').textContent = modo === 'entrar' ? 'Entrar' : 'Registrarme';
    document.getElementById('authAlt').innerHTML = modo === 'entrar'
      ? '¿No tienes cuenta? <a href="#" id="authSwitch">Regístrate</a>'
      : '¿Ya tienes cuenta? <a href="#" id="authSwitch">Inicia sesión</a>';
    document.getElementById('authSwitch').addEventListener('click', (e) => {
      e.preventDefault();
      this.cambiarModoAuth(this.modoAuth === 'entrar' ? 'registrar' : 'entrar');
    });
  }

  async submitAuth() {
    const email = document.getElementById('authEmail').value.trim();
    const pass = document.getElementById('authPass').value;
    const nombre = document.getElementById('authNombre').value.trim();
    const err = document.getElementById('authError');
    err.classList.add('hidden');
    if (!email || !pass) { err.textContent = 'Escribe tu email y contraseña'; err.classList.remove('hidden'); return; }
    if (pass.length < 8) { err.textContent = 'La contraseña debe tener al menos 8 caracteres'; err.classList.remove('hidden'); return; }
    const btn = document.getElementById('authSubmit');
    btn.disabled = true; btn.textContent = '...';
    try {
      if (this.modoAuth === 'registrar') {
        const reg = await this.registrar(email, pass, nombre || email.split('@')[0]);
        // Si el proyecto no pide confirmación de correo, habrá sesión inmediata.
        try { await this.entrar(email, pass); } catch (e2) {
          // Requiere confirmar correo antes de entrar.
          err.textContent = '✅ Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.';
          err.classList.remove('hidden'); err.style.color = '#059669';
          this.cambiarModoAuth('entrar');
          return;
        }
        window.nutriApp && window.nutriApp.toast('✅ Cuenta creada. ¡Completa tu registro!', 'success');
      } else {
        await this.entrar(email, pass);
        window.nutriApp && window.nutriApp.toast('✅ Sesión iniciada', 'success');
      }
      this.cerrarModal();
      this.renderAuthUI();
    } catch (e) {
      const msg = (e.message || '').includes('Invalid login') ? 'Email o contraseña incorrectos'
        : (e.message || '').includes('already registered') ? 'Ese email ya está registrado'
        : e.message || 'Error de autenticación';
      err.textContent = msg; err.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      btn.textContent = this.modoAuth === 'entrar' ? 'Entrar' : 'Registrarme';
    }
  }

  setupEventListeners() {
    const $ = id => document.getElementById(id);
    $('authCerrar') && $('authCerrar').addEventListener('click', () => this.cerrarModal());
    $('authSubmit') && $('authSubmit').addEventListener('click', () => this.submitAuth());
    $('authPass') && $('authPass').addEventListener('keydown', e => { if (e.key === 'Enter') this.submitAuth(); });

    // Flujo de foto
    const inputFoto = $('fotoInput');
    const preview = $('fotoPreview');
    if (inputFoto) {
      inputFoto.addEventListener('change', () => {
        const f = inputFoto.files[0];
        if (!f) return;
        preview.src = URL.createObjectURL(f);
        preview.classList.remove('hidden');
        $('btnAnalizarFoto').classList.remove('hidden');
        $('fotoResultado').innerHTML = '';
      });
    }
    $('btnAnalizarFoto') && $('btnAnalizarFoto').addEventListener('click', () => this.flujoAnalizarFoto());
  }

  async flujoAnalizarFoto() {
    const input = document.getElementById('fotoInput');
    const res = document.getElementById('fotoResultado');
    const btn = document.getElementById('btnAnalizarFoto');
    const file = input.files[0];
    if (!file) { res.innerHTML = '<p class="foto-error">Primero elige o toma una foto</p>'; return; }
    btn.disabled = true; btn.textContent = '🔍 Analizando...';
    res.innerHTML = '<p class="foto-info">La IA está identificando los alimentos de tu foto…</p>';
    try {
      const analisis = await this.analizarFoto(file);
      this.ultimoAnalisis = analisis;
      this.ultimoArchivo = file;
      const filas = (analisis.alimentos || []).map((a, i) => `
        <label class="foto-item">
          <input type="checkbox" checked data-idx="${i}">
          <span class="foto-item-nombre">${a.nombre} <small>(${a.gramos}g aprox.)</small></span>
          <span class="foto-item-kcal">🔥 ${a.kcal} kcal · 🥩 ${a.proteina}g · 🌾 ${a.carbs}g · 🛢️ ${a.grasa}g</span>
        </label>`).join('');
      res.innerHTML = `
        <div class="foto-analisis">
          <p class="foto-comentario">🤖 ${analisis.comentario || 'Esto es lo que identifiqué:'}</p>
          ${filas || '<p>No se identificaron alimentos.</p>'}
          <p class="foto-total">Total estimado: <strong>${analisis.total_kcal} kcal</strong></p>
          <div class="foto-acciones">
            <select id="fotoComidaDestino" class="input">
              <option value="desayuno">🌅 Desayuno</option>
              <option value="comida" selected>☀️ Comida</option>
              <option value="cena">🌙 Cena</option>
              <option value="colacion">🥜 Colación</option>
            </select>
            <button class="btn btn-primary" id="btnAgregarAnalisis">➕ Agregar a mi registro</button>
          </div>
          <p class="foto-nota">Estimación por IA a partir de la imagen — ajusta las porciones si lo necesitas.</p>
        </div>`;
      document.getElementById('btnAgregarAnalisis').addEventListener('click', () => this.agregarAnalisisARegistro());
    } catch (e) {
      res.innerHTML = `<p class="foto-error">⚠️ ${e.message}</p>`;
    } finally {
      btn.disabled = !this.activa; btn.textContent = '🤖 Analizar con IA';
    }
  }

  async agregarAnalisisARegistro() {
    const app = window.nutriApp;
    if (!app || !this.ultimoAnalisis) return;
    const comida = document.getElementById('fotoComidaDestino').value;
    const seleccion = [...document.querySelectorAll('#fotoResultado input[type="checkbox"]:checked')]
      .map(c => this.ultimoAnalisis.alimentos[parseInt(c.dataset.idx)]);
    if (!seleccion.length) { app.toast('Selecciona al menos un alimento', 'error'); return; }

    const fecha = app.fechaActual;
    if (!app.registros[fecha]) app.registros[fecha] = { desayuno: [], comida: [], cena: [], colacion: [], agua: 0 };
    seleccion.forEach(a => {
      app.registros[fecha][comida].push({
        id: 'ia-' + Date.now() + Math.random().toString(36).slice(2, 6),
        nombre: '📷 ' + a.nombre,
        gramos: a.gramos,
        macros: {
          kcal: a.kcal,
          proteina: a.proteina,
          carb: a.carbs,
          grasa: a.grasa,
          fibra: a.fibra || 0
        },
        timestamp: Date.now()
      });
    });
    app.guardarTodo && app.guardarTodo();
    app.renderTodo && app.renderTodo();
    app.toast(`✅ ${seleccion.length} alimento(s) agregados a ${comida}`, 'success');
    document.getElementById('fotoResultado').innerHTML = '';
    document.getElementById('fotoPreview').classList.add('hidden');
    document.getElementById('fotoInput').value = '';

    // Persistir en la nube (foto + registro)
    this.guardarFoto(this.ultimoArchivo, fecha, comida, this.ultimoAnalisis);
    this.subirDatos();
  }
}

window.nube = new NubeNutriMX();
