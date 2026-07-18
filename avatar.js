/**
 * NutriMX v2.7 - Foto de perfil (avatar)
 * Se toma DURANTE el registro (en la evaluación inicial) y también se puede cambiar
 * después en Ajustes. Captura desde la webcam (getUserMedia) o sube una imagen.
 * Se guarda reducida (~256px JPEG) en localStorage + profiles.avatar.
 * La imagen nunca sale del dispositivo salvo para respaldarse en la cuenta del propio usuario.
 */

const AVATAR_PRESETS = [
  { e: '💪', bg: '#059669' }, { e: '🏃', bg: '#0284c7' }, { e: '🧘', bg: '#7c3aed' },
  { e: '🥗', bg: '#65a30d' }, { e: '🍎', bg: '#dc2626' }, { e: '🏋️', bg: '#ea580c' },
  { e: '🚴', bg: '#0891b2' }, { e: '🦊', bg: '#f59e0b' }, { e: '🐻', bg: '#92400e' },
  { e: '🦁', bg: '#d97706' }, { e: '🐯', bg: '#f97316' }, { e: '🦉', bg: '#4f46e5' },
  { e: '🐧', bg: '#1e293b' }, { e: '🦄', bg: '#db2777' }, { e: '🌟', bg: '#eab308' },
  { e: '⚡', bg: '#facc15' }, { e: '🔥', bg: '#ef4444' }, { e: '🥑', bg: '#16a34a' }
];

class AvatarUI {
  constructor() {
    this.avatar = localStorage.getItem('nutrimx_avatar') || '';
    this.stream = null;
    this.montajes = []; // contenedores donde se renderiza el widget
  }

  /** Genera un data URL con un emoji sobre fondo de color (avatar prediseñado). */
  presetDataUrl(emoji, bg) {
    const S = 256, canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
    ctx.font = '150px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(emoji, S / 2, S / 2 + 8);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  init() {
    this.render('configAvatar', 'aj');
    this.pintarHeader();
  }

  guardar(dataUrl) {
    this.avatar = dataUrl || '';
    if (this.avatar) localStorage.setItem('nutrimx_avatar', this.avatar);
    else localStorage.removeItem('nutrimx_avatar');
    this.pintarHeader();
    this.rerenderTodos();
    if (window.nube && window.nube.activa) {
      window.nube.sb.from('profiles').upsert({
        id: window.nube.user.id, avatar: this.avatar, updated_at: new Date().toISOString()
      }).then(() => {}, e => console.warn('avatar sync', e));
    }
  }

  pintarHeader() {
    const chip = document.getElementById('avatarHeader');
    if (chip) chip.innerHTML = this.avatar ? `<img src="${this.avatar}" alt="Tu foto">` : '👤';
  }

  rerenderTodos() {
    this.montajes.forEach(m => { if (document.getElementById(m.id)) this.render(m.id, m.prefix); });
  }

  async reducir(fuente) {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      if (typeof fuente === 'string') { i.onload = () => res(i); i.onerror = rej; i.src = fuente; }
      else { const u = URL.createObjectURL(fuente); i.onload = () => { URL.revokeObjectURL(u); res(i); }; i.onerror = rej; i.src = u; }
    });
    const S = 256, canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    const lado = Math.min(img.width, img.height);
    const sx = (img.width - lado) / 2, sy = (img.height - lado) / 2;
    ctx.drawImage(img, sx, sy, lado, lado, 0, 0, S, S);
    return canvas.toDataURL('image/jpeg', 0.85);
  }

  /** Renderiza el widget de avatar en el contenedor dado. prefix evita colisiones de IDs. */
  render(containerId, prefix = 'a', opciones = {}) {
    const cont = document.getElementById(containerId);
    if (!cont) return;
    if (!this.montajes.some(m => m.id === containerId)) this.montajes.push({ id: containerId, prefix });
    const p = prefix;
    const titulo = opciones.titulo !== undefined ? opciones.titulo
      : '<h3 class="font-bold mb-1">📸 Tu foto de perfil</h3><p class="text-sm text-gray-500 mb-3">Toma una foto con tu cámara o sube una imagen. Solo tú la ves.</p>';

    cont.innerHTML = `
      ${titulo}
      <div class="avatar-zona">
        <div class="avatar-preview">${this.avatar ? `<img src="${this.avatar}" alt="Tu foto">` : '👤'}</div>
        <div class="avatar-controles">
          <button class="btn btn-primary" id="${p}Camara">📷 Tomar foto</button>
          <label class="btn btn-secondary avatar-subir">🖼️ Subir imagen
            <input type="file" id="${p}File" accept="image/*" class="hidden">
          </label>
          ${this.avatar ? `<button class="btn btn-danger" id="${p}Borrar">🗑️ Quitar</button>` : ''}
        </div>
      </div>
      <div id="${p}CamZona" class="avatar-cam hidden">
        <video id="${p}Video" autoplay playsinline></video>
        <div class="avatar-cam-btns">
          <button class="btn btn-primary" id="${p}Capturar">📸 Capturar</button>
          <button class="btn btn-secondary" id="${p}Cancelar">Cancelar</button>
        </div>
      </div>
      <p class="avatar-presets-label">O elige un avatar (si prefieres no usar foto):</p>
      <div class="avatar-presets">
        ${AVATAR_PRESETS.map((a, i) => `<button class="avatar-preset" id="${p}Preset${i}" style="background:${a.bg}" title="Elegir avatar">${a.e}</button>`).join('')}
      </div>
      <p id="${p}Error" class="text-xs mt-2 hidden" style="color:#dc2626;"></p>`;

    const $ = id => document.getElementById(p + id);
    $('Camara').addEventListener('click', () => this.abrirCamara(p));
    $('File').addEventListener('change', async e => {
      const f = e.target.files[0]; if (!f) return;
      try { this.guardar(await this.reducir(f)); window.nutriApp && window.nutriApp.toast('✅ Foto de perfil actualizada', 'success'); }
      catch (err) { this.error(p, 'No se pudo procesar la imagen'); }
    });
    if (this.avatar && $('Borrar')) $('Borrar').addEventListener('click', () => this.guardar(''));
    $('Capturar').addEventListener('click', () => this.capturar(p));
    $('Cancelar').addEventListener('click', () => this.cerrarCamara(p));
    AVATAR_PRESETS.forEach((a, i) => {
      const btn = document.getElementById(p + 'Preset' + i);
      if (btn) btn.addEventListener('click', () => {
        this.guardar(this.presetDataUrl(a.e, a.bg));
        window.nutriApp && window.nutriApp.toast('✅ Avatar elegido', 'success');
      });
    });
  }

  error(p, msg) {
    const e = document.getElementById(p + 'Error');
    if (e) { e.textContent = msg; e.classList.remove('hidden'); }
  }

  async abrirCamara(p) {
    // Verificación previa
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.error(p, 'Tu navegador no permite usar la cámara aquí. Usa "Subir imagen" o elige un avatar.');
      return;
    }
    const errEl = document.getElementById(p + 'Error');
    if (errEl) { errEl.classList.add('hidden'); errEl.style.color = '#dc2626'; }

    // Aviso mientras el navegador muestra el permiso
    this.error(p, '📷 Aparecerá un aviso del navegador arriba: toca "Permitir" para usar tu cámara…');

    // Intentos con restricciones cada vez más flexibles (evita OverconstrainedError)
    const intentos = [
      { video: { facingMode: 'user' }, audio: false },
      { video: true, audio: false }
    ];
    let stream = null, ultimoError = null;
    for (const c of intentos) {
      try { stream = await navigator.mediaDevices.getUserMedia(c); break; }
      catch (e) { ultimoError = e; if (e.name === 'NotAllowedError' || e.name === 'NotFoundError') break; }
    }

    if (stream) {
      if (errEl) errEl.classList.add('hidden');
      this.stream = stream;
      const video = document.getElementById(p + 'Video');
      video.srcObject = stream;
      document.getElementById(p + 'CamZona').classList.remove('hidden');
      return;
    }

    // Mensajes específicos y accionables según el error
    const n = ultimoError ? ultimoError.name : '';
    let msg;
    if (n === 'NotAllowedError' || n === 'SecurityError') {
      msg = '🔒 El navegador bloqueó la cámara. Haz clic en el ícono de cámara 📷 en la barra de direcciones (arriba a la derecha), elige "Permitir siempre" y vuelve a tocar "Tomar foto". O usa "Subir imagen".';
    } else if (n === 'NotFoundError' || n === 'DevicesNotFoundError') {
      msg = '🎥 No detecté ninguna cámara en tu dispositivo. Usa "Subir imagen" o elige un avatar.';
    } else if (n === 'NotReadableError') {
      msg = '⚠️ Tu cámara está ocupada por otra app (Zoom, Teams, etc.). Ciérrala y vuelve a intentar, o usa "Subir imagen".';
    } else {
      msg = 'No pude acceder a la cámara. Usa "Subir imagen" o elige un avatar.';
    }
    this.error(p, msg);
  }

  capturar(p) {
    const video = document.getElementById(p + 'Video');
    const S = 256, canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    const lado = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - lado) / 2, sy = (video.videoHeight - lado) / 2;
    ctx.drawImage(video, sx, sy, lado, lado, 0, 0, S, S);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    this.cerrarCamara(p);
    this.guardar(dataUrl);
    window.nutriApp && window.nutriApp.toast('📸 ¡Foto tomada!', 'success');
  }

  cerrarCamara(p) {
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    const zona = document.getElementById(p + 'CamZona');
    if (zona) zona.classList.add('hidden');
  }
}

window.avatarUI = new AvatarUI();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => window.avatarUI.init(), 300);
});
