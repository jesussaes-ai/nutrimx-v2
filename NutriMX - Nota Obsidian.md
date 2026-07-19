---
title: NutriMX v4.2 — Proyecto completo
tags: [proyecto, nutrimx, salud, nutricion, ejercicio, app, pwa, supabase]
fecha: 2026-07-18
estado: en-produccion
url: https://jesussaes-ai.github.io/nutrimx-v2/
repo: https://github.com/jesussaes-ai/nutrimx-v2
---

# 🧬 NutriMX v4.2

> App de nutrición, ejercicio y salud basada en evidencia, personalizada para hombres, mujeres, niños y adultos mayores. PWA instalable, con IA y sincronización en la nube.

**🔗 Producción:** https://jesussaes-ai.github.io/nutrimx-v2/
**📦 Repositorio:** https://github.com/jesussaes-ai/nutrimx-v2

---

## 🎯 Qué resuelve

Que cualquier persona —sin importar edad, sexo o condición de salud— tenga un plan de alimentación y ejercicio **hecho a su medida**, basado en evidencia científica y sin imponerle nada. Es educativa y de autocuidado: **nunca sustituye al médico**.

---

## 🏗️ Arquitectura

| Capa | Tecnología |
|---|---|
| Frontend | HTML + CSS + JS vanilla (modular), Tailwind CDN, PWA offline |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| IA | Configurable: Anthropic u OpenRouter (modelo elegible por usuario) |
| Hosting | GitHub Pages (auto-deploy desde `main`) |

**Proyecto Supabase:** `nutrimx` (ref `nbjzvgtbuceyjutmdhgx`)

### Tablas (todas con RLS por usuario)
- `profiles` — nombre, objetivos, datos de evaluación, consentimientos, modelo IA, avatar
- `dias` — registro diario de comidas + rutinas de salud
- `pesos` — historial de peso
- `fotos` — fotos de comida + análisis IA (bucket privado)
- `video_stats` — estadística mensual de interés en videos

### Edge Functions
- `analizar-comida` — analiza foto → alimentos, gramos, calorías y macros
- `asistente` — chat NutriCoach (app + nutrición + ejercicio, nunca médico)

---

## ✨ Funciones principales

### Acceso y perfil
- Portada como puerta: **registro / login**; el dashboard solo abre con registro completo
- **Evaluación inicial tipo PAR-Q+**: datos físicos + tamizaje (diabetes, hipertensión, cardiaco, fracturas, cirugías, embarazo, medicamentos) + consentimiento expreso
- Calcula **IMC, TMB, TDEE, calorías y proteína**, asigna perfil y modalidad segura
- **Foto de perfil**: cámara, subir imagen o 18 avatares
- **Sesión con cierre por inactividad** (30 min, con aviso)

### Nutrición
- **151 alimentos** con evidencia (48 antiinflamatorios)
- Búsqueda tolerante a **plurales y acentos**
- **Plan del día editable**: cambiar 🔄, quitar ✕ o agregar ➕ cualquier alimento
- **Foto de comida con IA**: identifica alimentos y estima calorías

### Ejercicio
- 4 perfiles: **hombre, mujer, niños, adultos mayores**
- Videoteca: 18 / 18 / 14 / 13 videos con rotación diaria
- **La app recomienda, el usuario elige** su modalidad (silla, piso, cama, de pie, más activa)
- **16 ilustraciones SVG animadas** con claves de técnica

### Salud diaria
- Agua: vasos de **250 ml**, meta según peso (35 ml/kg), cantidad libre
- **Sueño libre 0–24 h** (turnos, guardias, condiciones médicas)
- Pasos, **relajación hasta 60 min**, ánimo, checklist de 8 hábitos
- **Báscula Bluetooth** + edad fisiológica estimada

### Apoyo
- **Asistente NutriCoach** (IA) para dudas de la app, nutrición y ejercicio
- **Centro de ayuda** con FAQ y **glosario** de 43 términos y siglas
- **Videos médicos** sobre suplementos y antiinflamatorios, reordenados por interés real cada mes

---

## 🔐 Privacidad y cumplimiento

- Aviso de Privacidad completo: **LFPDPPP (México) + GDPR**
- Datos de salud = **datos sensibles** → consentimiento expreso
- **Derechos ARCO** ejercibles desde la app
- Cifrado en tránsito, contraseñas con hash, **RLS** (cada quien ve solo lo suyo)
- Fotos en bucket privado

---

## 📐 Principios de diseño (no negociables)

1. **Recomendar, no imponer** — dar la recomendación y dejar elegir
2. **Nunca diagnóstico médico** — siempre remitir al profesional
3. **Niños**: sin dietas restrictivas ni suplementos
4. **Adultos mayores**: fuerza, proteína, equilibrio; nunca limitarlos solo a la silla
5. **Referencias, no metas rígidas** — cada cuerpo y cada vida son distintos
6. **Videos**: solo embeds oficiales de YouTube, respetando derechos de autor

---

## 🧠 Lecciones aprendidas

- Rutas absolutas rompen el sitio en subdirectorio → usar siempre `./`
- Decidir el acceso antes de bajar los datos de la nube hace que se pida la evaluación otra vez
- Algunos videos bloquean la reproducción incrustada → siempre ofrecer enlace directo
- Metas fijas (8 vasos, 8 h) no le sirven a todos → referencia + campo libre
- Un menú que no se puede editar frustra al usuario
- Los cachés del Service Worker se acumulan si no se limpian al activar

---

## ⏳ Pendientes

- [ ] Prueba end-to-end del asistente y de la foto de comida con IA
- [ ] Dar de baja el hosting viejo de Netlify
- [ ] Monetización con planes

---

## 🔗 Documentos relacionados

- [[NUTRIMX_PROMPT_MAESTRO]] — especificación completa para reconstruir la app
- [[LINEA_DEL_TIEMPO]] — historia del proyecto v2.0 → v4.2
- [[README]] — descripción general

---

*Última actualización: 18 de julio de 2026 · versión 4.2*
