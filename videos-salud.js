/**
 * NutriMX v3.5 - Videos de recomendaciones médicas (suplementos y antiinflamatorios)
 * Los videos se REORDENAN cada mes según el interés real (clics), guardados en
 * Supabase (tabla video_stats). Los más vistos del mes suben al inicio.
 * Solo reproduce embeds oficiales de YouTube. Contenido educativo, no médico.
 */

const VIDEOS_SALUD = {
  suplementos: {
    titulo: '💊 Suplementos con evidencia',
    intro: 'Qué suplementos SÍ funcionan según la ciencia, y cómo tomarlos.',
    videos: [
      { id: 'qnfAwouRtcw', titulo: 'Cuándo tomar Vit. D3, Omega-3 y Creatina' },
      { id: 'CitJdUUAcIE', titulo: 'Suplementos con evidencia: creatina y omega-3' },
      { id: 'S5bdtAiNU9c', titulo: 'Creatina y cafeína: mucha evidencia científica' },
      { id: 'm2lzKZlN4V4', titulo: 'Los que sí y no necesitas (Clínica Alemana)' },
      { id: 'e-fVVz-p53s', titulo: 'Elegir y usar bien tus suplementos' },
      { id: 'r0AxmI4kbo8', titulo: 'Los mejores suplementos según la ciencia' }
    ]
  },
  antiinflamatorios: {
    titulo: '🥦 Alimentos antiinflamatorios',
    intro: 'Médicos y nutriólogos explican qué comer para bajar la inflamación.',
    videos: [
      { id: 'Icfeh5V9dsw', titulo: 'Qué comer a diario para reducir la inflamación' },
      { id: '1wWz0yo6Yd8', titulo: 'Alimentos antiinflamatorios (Dr. David Mariscal)' },
      { id: 'vW3FwZO4Vkc', titulo: 'Dieta antiinflamatoria: alimentos, hábitos y suplementos' },
      { id: 'mXM0Qp7iMgc', titulo: '5 alimentos antiinflamatorios + receta' },
      { id: '4eJQG2yX2dY', titulo: '7 alimentos y hábitos para desinflamar' },
      { id: '0DnvqHkU_mc', titulo: 'Claves de la dieta antiinflamatoria' },
      { id: 'CswWlk6HNsU', titulo: '¿En qué consiste una dieta antiinflamatoria?' },
      { id: 'XyMwruG-KM4', titulo: 'Qué es y qué alimentos incluye' }
    ]
  }
};

class VideosSaludUI {
  constructor() { this.stats = {}; }

  mesActual() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  async cargarStats() {
    this.stats = {};
    if (!(window.nube && window.nube.activa)) return;
    try {
      const { data } = await window.nube.sb
        .from('video_stats').select('video_id,clicks').eq('mes', this.mesActual());
      (data || []).forEach(r => { this.stats[r.video_id] = r.clicks; });
    } catch (e) { /* sin stats: orden por defecto */ }
  }

  ordenar(videos) {
    // Más clics del mes primero; empate mantiene el orden original (curado)
    return videos
      .map((v, i) => ({ ...v, clicks: this.stats[v.id] || 0, orig: i }))
      .sort((a, b) => (b.clicks - a.clicks) || (a.orig - b.orig));
  }

  async render() {
    const cont = document.getElementById('videosSalud');
    if (!cont) return;
    await this.cargarStats();

    const seccion = (key) => {
      const s = VIDEOS_SALUD[key];
      const vids = this.ordenar(s.videos);
      const topId = vids.length && vids[0].clicks > 0 ? vids[0].id : null;
      return `
        <h4 class="vs-h4">${s.titulo}</h4>
        <p class="vs-intro">${s.intro}</p>
        <div class="video-grid">${vids.map(v => `
          <div class="video-card" data-video="${v.id}" data-titulo="${v.titulo}" data-seccion="${key}">
            <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.titulo}" loading="lazy">
            <span class="video-play">▶</span>
            ${v.id === topId ? '<span class="vs-top">🔥 Top del mes</span>' : ''}
            <span class="video-titulo">${v.titulo}</span>
          </div>`).join('')}</div>`;
    };

    cont.innerHTML = `
      <h3 class="font-bold text-lg mb-1">📺 Recomendaciones en video</h3>
      <p class="text-sm text-gray-500 mb-3">Médicos y nutriólogos sobre suplementos y alimentos antiinflamatorios. Se reordenan cada mes según lo que más ven.</p>
      ${seccion('suplementos')}
      ${seccion('antiinflamatorios')}
      <div id="vsPlayer" class="video-player hidden"></div>
      <p class="text-xs text-gray-400 mt-2">Contenido educativo de terceros (YouTube). No sustituye la consulta con tu médico o nutriólogo.</p>`;

    cont.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => this.reproducir(card.dataset.video, card.dataset.titulo, card.dataset.seccion));
    });
  }

  async registrarClick(id, seccion, titulo) {
    this.stats[id] = (this.stats[id] || 0) + 1; // optimista local
    if (!(window.nube && window.nube.activa)) return;
    try {
      await window.nube.sb.rpc('registrar_click_video', {
        p_id: id, p_mes: this.mesActual(), p_seccion: seccion, p_titulo: titulo
      });
    } catch (e) { /* no crítico */ }
  }

  reproducir(id, titulo, seccion) {
    this.registrarClick(id, seccion, titulo);
    const player = document.getElementById('vsPlayer');
    if (!player) return;
    player.classList.remove('hidden');
    player.innerHTML = `<div class="video-player-head"><strong>${titulo}</strong>
      <span><a class="video-yt" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">▶ Ver en YouTube</a>
      <button class="auth-btn" onclick="this.closest('.video-player').classList.add('hidden');this.closest('.video-player').querySelector('iframe')?.remove()">✕ Cerrar</button></span></div>
      <iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${titulo}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      <p class="video-nota">Si el video no carga aquí, ábrelo con "Ver en YouTube".</p>`;
    player.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

window.videosSaludUI = new VideosSaludUI();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if (window.videosSaludUI) window.videosSaludUI.render(); }, 400);
});
