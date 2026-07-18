# 🗓️ NutriMX — Línea del tiempo del proyecto (paso a paso)

Historia completa de cómo se construyó NutriMX, versión por versión.

---

## 🌱 Punto de partida — v2.0
La app existía como archivos locales (index.html, app.js, ciencia.js, sw.js, manifest.json) con un dashboard, pero **no hacía nada**: solo mostraba el tablero.

**Infraestructura montada:**
1. Se creó el repositorio en GitHub: `jesussaes-ai/nutrimx-v2` (público).
2. Se subieron los archivos y se dejó el repo local conectado para push sin credenciales (Git Credential Manager, sin tokens en chat).
3. Se conectó GitHub → **Netlify** con auto-deploy: cada `git push` publica en `https://nutrimx.netlify.app`.

---

## 🐛 v2.1 — La app cobra vida
- **Bug crítico:** un `import` roto en index.html impedía que se ejecutara el JavaScript. Se corrigió cargando los scripts de forma clásica.
- **Error de datos:** un `SyntaxError` en ciencia.js (`kcal:9kcal/g`) rompía la base de alimentos. Corregido.
- **localStorage corrupto:** se blindó la carga de datos.
- Resultado: las pestañas, la búsqueda de alimentos y el registro empezaron a funcionar.

---

## ☁️ v2.1–v2.2 — Cuentas, nube e IA
- Se creó el proyecto **Supabase** ("nutrimx").
- **Cuentas de usuario** (email + contraseña), tablas con seguridad por usuario (RLS), bucket privado de fotos.
- **Foto de comida con IA:** edge function `analizar-comida` que identifica alimentos y estima calorías.
- **Sincronización en la nube** de comidas, agua, pesos y objetivos.
- **Videoteca de técnica** (6 videos) en la pestaña Ejercicio.

---

## 👨‍👩‍👧 v2.2 — Secciones por perfil
- Nueva pestaña **"Para ti"** con 4 perfiles: **Hombre, Mujer, Niños, Adultos mayores**.
- Cada perfil con ejercicio (rutinas + videos), alimentación (menú mexicano) y suplementos por grado de evidencia.
- Reglas: niños sin suplementos ni dietas; adultos mayores con rutinas en silla, piso, cama y equilibrio.

---

## 🩺 v2.3–v2.4 — Evaluación de salud y privacidad
- **Evaluación inicial (tipo PAR-Q+):** datos físicos + tamizaje de salud + consentimiento. Calcula IMC, TMB, TDEE, calorías y proteína, y asigna perfil y modalidad segura.
- **Aviso de Privacidad** completo (LFPDPPP México + GDPR) con derechos ARCO.
- **Portada animada** de entrada.
- Se agregó la interfaz que faltaba: registro diario de comidas y módulo de peso.

---

## 🔧 v2.5 — IA abierta + Asistente
- **Proveedor de IA configurable:** Anthropic u **OpenRouter** (y cualquier modelo de visión), sin tocar código.
- **Asistente NutriCoach:** chat flotante de nutrición, ejercicio y salud.

---

## 🎛️ v2.6 — Selector de modelo
- Panel en Ajustes para **elegir el modelo de IA** por usuario (GPT-4o, Gemini, Claude…), con lista blanca de seguridad del lado del servidor.

---

## 📸 v2.7 — Foto de perfil / Avatar
- Foto de perfil en el registro: **cámara, subir imagen o 18 avatares** prediseñados.
- La imagen solo vive en el perfil del propio usuario.

---

## 🚪 v2.8–v2.9 — Puerta de acceso + arreglos
- **La portada es la puerta:** botones "Crear cuenta" / "Entrar". El dashboard solo se abre tras registro completo.
- Se **desactivó la confirmación de correo** (registro inmediato) y se corrigieron cuentas atoradas.
- Aceptación del **Aviso de Privacidad** obligatoria al crear cuenta.

---

## 📷 (soporte) — Cámara y permisos
- Se hizo la cámara más robusta (sin dimensiones exactas) y con mensajes claros de permiso.
- Se acompañó al usuario a desbloquear la cámara: el ajuste GLOBAL de Chrome estaba en "No permitir sitios usen cámara" (se corrige en `chrome://settings/content/camera`); Windows y hardware estaban bien.

---

## 🍽️ v3.2–v3.3 — Búsqueda, plan y ejercicio a elección
- **Búsqueda arreglada:** ahora tolera plurales y acentos ("huevos" encuentra "Huevo entero").
- **Selector de comida** al agregar alimentos.
- **"Plan del día":** menú sugerido con alimentos reales según tus calorías, con botón para cargarlo al registro.
- **Ejercicio con elección libre:** la app recomienda primero y luego el usuario **elige su modalidad** (silla, piso, de pie, más activa…). Los adultos mayores ya no quedan limitados a la silla.

---

## 📚 v3.4 — Más variedad, glosario y ayuda
- **Base de alimentos ampliada de 96 a 151** (48 antiinflamatorios): pescados omega-3, bayas, crucíferas, especias (cúrcuma, jengibre), fermentados, cereales integrales, frutos secos, té verde… con actualización automática para todos.
- **Videoteca ampliada:** 18 videos en hombre y mujer, 14 en niños, 13 en mayores; rotación diaria.
- **Glosario** de siglas y términos (OMS, ACSM, IMC, TDEE, PAR-Q, ARCO, LFPDPPP…), con buscador.
- **Centro de ayuda** (botón "?") con preguntas frecuentes + glosario + asistente. El asistente también responde dudas de uso de la app.

---

## 📺 v3.5 — Videos médicos con estadística + salud diaria
- **Sección de videos de recomendaciones médicas** (suplementos y alimentos antiinflamatorios) de médicos y nutriólogos.
- Los videos **se reordenan cada mes según el interés real** (estadística de clics en Supabase; "🔥 Top del mes").
- **Dashboard con rutinas de salud:** sueño, pasos, relajación, ánimo y checklist de hábitos saludables.

---

## 📶 v3.6 — Báscula Bluetooth
- **Conexión con básculas inteligentes** (Web Bluetooth, servicios GATT estándar): peso, % grasa, músculo, agua.
- **Edad fisiológica/metabólica estimada** a partir de peso, IMC y % grasa.
- Fallback a registro manual (funciona en Chrome/Edge Android y PC; no en iPhone).

---

## 📄 Documentación final
- `NUTRIMX_PROMPT_MAESTRO.txt` — especificación completa para reconstruir la app.
- `README.md` — descripción del proyecto.
- `LINEA_DEL_TIEMPO.md` — este documento.

---

## ⏳ Pendientes (siguiente etapa)
- Pruebas end-to-end del análisis de comida con foto (la IA de OpenRouter ya responde).
- **Monetización con planes** — pospuesta hasta terminar pruebas.

---

*Cada versión se desplegó a producción vía GitHub → Netlify, con el agente HERMES sincronizado en cada cambio.*
