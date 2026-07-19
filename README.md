# 🧬 NutriMX v4.2

**Nutrición, ejercicio y salud basados en evidencia — personalizados para ti.**
App web progresiva (PWA) para hombres, mujeres, niños y adultos mayores 🇲🇽

🔗 **En producción:** https://jesussaes-ai.github.io/nutrimx-v2/

---

## ¿Qué es NutriMX?

Una aplicación que ayuda a las personas a **comer mejor, moverse más y vivir más fuerte**, con un plan hecho a la medida de su cuerpo y su salud. Toda la información está basada en evidencia (OMS, ACSM, ISSN, AACE, Cochrane). Es educativa y de autocuidado — **nunca da diagnóstico ni consejo médico**, siempre remite al profesional de la salud.

---

## ✨ Funciones principales

- **Acceso seguro:** portada con registro/login. El dashboard solo se abre tras completar el registro con evaluación inicial. La sesión se cierra sola tras 30 min de inactividad (con aviso), porque maneja datos de salud.
- **Evaluación inicial (tipo PAR-Q+):** datos físicos + tamizaje de salud + consentimiento. Calcula IMC, TMB, TDEE, calorías y proteína objetivo, perfil y modalidad segura. Si entras desde otro dispositivo, se recupera de la nube.
- **Foto de perfil:** cámara, subir imagen o 18 avatares.
- **Dashboard con rutinas de salud:** calorías/macros, agua (vasos de 250 ml con meta según tu peso), **sueño libre de 0 a 24 h** (para turnos y guardias), pasos, **relajación hasta 60 min**, ánimo y hábitos saludables.
- **Nutrición:** 151 alimentos (48 antiinflamatorios) con búsqueda que tolera plurales y acentos; selector de comida; **foto de comida analizada por IA**.
- **Plan del día EDITABLE:** menú sugerido según tus calorías, donde puedes **cambiar 🔄, quitar ✕ o agregar ➕** cualquier alimento según lo que tengas en casa.
- **Ejercicio "Para ti":** rutinas y videoteca amplia por perfil (hasta 18 videos, con rotación). **La app recomienda, pero tú eliges** tu modalidad (silla, piso, de pie, más activa…). Cada ejercicio tiene **ilustración animada** con claves de técnica.
- **Suplementos + videos médicos:** recomendaciones en video de médicos y nutriólogos, que **se reordenan cada mes según el interés** (estadística de clics).
- **Asistente de IA (NutriCoach):** resuelve dudas de la app, nutrición y ejercicio (nunca médico).
- **Tracking + báscula Bluetooth:** peso, IMC, tendencia; conexión con básculas inteligentes y **edad fisiológica estimada**.
- **Ayuda y glosario:** botón "?" con preguntas frecuentes y glosario de siglas y términos.
- **Privacidad:** Aviso de Privacidad (LFPDPPP + GDPR), consentimiento expreso, derechos ARCO, cifrado y aislamiento por usuario.

---

## 🛠️ Tecnología

| Capa | Herramienta |
|------|-------------|
| Frontend | HTML + CSS + JavaScript (vanilla, modular), Tailwind CDN, PWA offline |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| IA | Proveedor configurable: Anthropic u OpenRouter (modelo elegible en Ajustes) |
| Hosting | GitHub Pages (auto-deploy desde main, gratis y sin límites) |
| Repositorio | GitHub — jesussaes-ai/nutrimx-v2 (rama main) |

---

## 📁 Archivos del proyecto

| Archivo | Función |
|---------|---------|
| `index.html` | Estructura, estilos y todas las secciones |
| `app.js` | Motor principal (registro de comidas, peso, navegación) |
| `ciencia.js` | Base de datos de 151+ alimentos con evidencia |
| `nube.js` | Autenticación y sincronización con Supabase |
| `salud.js` | Evaluación inicial (PAR-Q+) y análisis personalizado |
| `acceso.js` | Puerta de acceso (login/registro obligatorio) |
| `perfiles.js` | Contenido por perfil (hombre/mujer/niños/mayores) + videoteca |
| `plan.js` | Generador del "Plan del día" (menú + ejercicio) |
| `avatar.js` | Foto de perfil y avatares |
| `modelo.js` | Selector del modelo de IA |
| `asistente.js` | Chat NutriCoach |
| `ayuda.js` | Centro de ayuda y glosario |
| `videos-salud.js` | Videos médicos con estadística mensual |
| `salud-diaria.js` | Rutinas de salud del dashboard (sueño, pasos, hábitos) |
| `bascula.js` | Báscula Bluetooth + edad fisiológica |
| `ilustraciones.js` | 16 ilustraciones SVG animadas de ejercicios |
| `sesion.js` | Cierre de sesión por inactividad (30 min) |
| `aviso-privacidad.html` | Aviso de Privacidad (LFPDPPP + GDPR) |
| `sw.js` / `manifest.json` | Service Worker y configuración PWA |

Edge Functions (Supabase): `analizar-comida`, `asistente`.

---

## 🔒 Privacidad

Los datos de salud son datos sensibles: se recaban con consentimiento expreso, viajan cifrados, las contraseñas nunca son visibles, y cada usuario solo accede a su propia información (Row Level Security). El usuario puede acceder, corregir o borrar sus datos en cualquier momento (derechos ARCO). Consulta el Aviso de Privacidad dentro de la app.

---

## ⚠️ Aviso

NutriMX ofrece información educativa y herramientas de autocuidado. **No sustituye el diagnóstico, tratamiento ni consejo de un profesional de la salud.** Ante cualquier síntoma, condición o duda médica, consulta a tu médico o nutriólogo.

---

*Hecho con evidencia y cariño para una vida más saludable. 💚*
