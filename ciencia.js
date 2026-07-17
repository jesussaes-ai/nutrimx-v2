/**
 * NutriMX v2.0 - Sistema Integral de Recomposición Corporal
 * Basado en evidencia científica: Guías AACE/ACE 2023-2025, ISSN, ACSM, Cochrane, meta-análisis
 * Módulos: Nutrición + Ejercicio + Suplementos + Comportamiento + Médico + Tradición Mexicana
 */

// ============================================================================
// BASE DE DATOS CIENTÍFICA EMBEBIDA (offline-first)
// ============================================================================

const CIENCIA = {
  // ----------------------------------------------------------
  // ALIMENTOS CON EVIDENCIA PARA PÉRDIDA DE GRASA / RECOMPOSICIÓN
  // Fuentes: Meta-análisis, RCTs, Guías IMSS/ISSSTE/INSP, Dieta Milpa
  // ----------------------------------------------------------
  alimentos: [
    // PROTEÍNAS - Alta saciedad, TEF alto, preservación masa muscular
    {id:1, nombre:"Pechuga de pollo (sin piel)", cat:"Proteína", kcal:110, p:23, g:1.5, ch:0, f:0, evid:"Alta proteína, bajo grasa, TEF 20-30%, saciedad alta", tags:["magra","versatil","barata"]},
    {id:2, nombre:"Pescado blanco (merluza, tilapia, bacalao)", cat:"Proteína", kcal:75, p:17, g:0.8, ch:0, f:0, evid:"Proteína completa, bajo calórico, yodo, selenio", tags:["magro","yodo","fácil digestión"]},
    {id:3, nombre:"Salmón salvaje", cat:"Proteína", kcal:182, p:20, g:11, ch:0, f:0, evid:"Omega-3 (EPA/DHA) antiinflamatorio, mejora sensibilidad insulina", tags:["omega3","antiinflamatorio","costoso"]},
    {id:4, nombre:"Atún en agua (lata)", cat:"Proteína", kcal:115, p:25, g:1, ch:0, f:0, evid:"Práctico, alto proteína, bajo grasa, mercurio moderado", tags:["conveniente","despensa"]},
    {id:5, nombre:"Huevo entero", cat:"Proteína", kcal:143, p:12.5, g:9.5, ch:0.5, f:0, evid:"Proteína referencia (PDCAAS 1.0), colina, luteína, saciedad alta", tags:["completo","barato","versatil"]},
    {id:6, nombre:"Clara de huevo", cat:"Proteína", kcal:48, p:11, g:0, ch:0.5, f:0, evid:"Proteína pura, cero grasa, ideal déficit agresivo", tags:["pura","deficit"]},
    {id:7, nombre:"Carne de res magra (lomo, sirloin)", cat:"Proteína", kcal:135, p:21, g:5, ch:0, f:0, evid:"Hierro hemo, B12, zinc, creatina natural, saciedad", tags:["hierro","B12","creatina"]},
    {id:8, nombre:"Pavo/pechuga de pavo", cat:"Proteína", kcal:105, p:23, g:1, ch:0, f:0, evid:"Muy bajo grasa, triptófano, versátil", tags:["magro","triptofano"]},
    {id:9, nombre:"Yogur griego 0% / Skyr", cat:"Lácteo", kcal:59, p:10, g:0.4, ch:3.6, f:0, evid:"Caseína lenta, calcio, probióticos, saciedad > leche", tags:["caseina","probioticos","snack"]},
    {id:10, nombre:"Requesón / Cottage cheese bajo grasa", cat:"Lácteo", kcal:98, p:11, g:4.3, ch:3.4, f:0, evid:"Caseína, leucina alta, versátil dulce/salado", tags:["leucina","versatil"]},
    {id:11, nombre:"Tofu firme", cat:"Proteína", kcal:76, p:8, g:4.8, ch:1.9, f:0.7, evid:"Proteína completa vegetal, isoflavonas, calcio (si coagulado Ca)", tags:["vegano","isoflavonas","calcio"]},
    {id:12, nombre:"Tempeh", cat:"Proteína", kcal:192, p:20, g:11, ch:9, f:0, evid:"Fermentado, probióticos, biodisponibilidad ↑, B12 análogos", tags:["fermentado","probioticos","vegano"]},
    {id:13, nombre:"Lentejas cocidas", cat:"Legumbre", kcal:116, p:9, g:0.4, ch:20, f:7.9, evid:"Fibra + proteína, IG bajo, hierro no-hemo, barato", tags:["fibra","barato","prebiotico"]},
    {id:14, nombre:"Frijol negro / bayo / pinto", cat:"Legumbre", kcal:132, p:8.9, g:0.5, ch:24, f:8.7, evid:"Base dieta milpa, resistente almidón, polifenoles", tags:["tradicional","resistente","polifenoles"]},
    {id:15, nombre:"Garbanzos", cat:"Legumbre", kcal:164, p:8.9, g:2.6, ch:27, f:7.6, evid:"Hummus, saciedad, aquafaba versátil", tags:["versatil","snack"]},
    {id:16, nombre:"Edamame (soya verde)", cat:"Legumbre", kcal:121, p:11, g:5, ch:10, f:5, evid:"Proteína completa, isoflavonas, snack alto proteína", tags:["completo","snack"]},
    {id:17, nombre:"Proteína whey isolate", cat:"Suplemento", kcal:370, p:90, g:0.5, ch:1, f:0, evid:"Absorción rápida, leucina 11%, conveniente post-entreno", tags:["rapida","leucina","conveniente"]},
    {id:18, nombre:"Proteína caseína", cat:"Suplemento", kcal:360, p:80, g:1, ch:4, f:0, evid:"Absorción lenta 6-8h, anti-catabólico nocturno", tags:["lenta","nocturno","anti-catabolico"]},

    // VERDURAS - Volumen, fibra, micronutrientes, IG casi cero
    {id:19, nombre:"Espinacas crudas", cat:"Verdura", kcal:23, p:2.9, g:0.4, ch:3.6, f:2.2, evid:"Tilacoides reducen apetito, nitratos → NO → flujo sanguíneo", tags:["tilacoides","nitratos","volumen"]},
    {id:20, nombre:"Brócoli", cat:"Verdura", kcal:34, p:2.8, g:0.4, ch:7, f:2.6, evid:"Sulforafano (NRf2), indol-3-carbinol, calcio, vit C", tags:["sulforafano","anticancer","calcio"]},
    {id:21, nombre:"Coliflor", cat:"Verdura", kcal:25, p:1.9, g:0.3, ch:5, f:2, evid:"Versátil (arroz, pizza, puré), glucosinolatos", tags:["versatil","bajo-carb"]},
    {id:22, nombre:"Nopales (cactus)", cat:"Verdura", kcal:16, p:1.3, g:0.1, ch:3.3, f:2.2, evid:"Fibra soluble (mucílago) → glucosa/lípidos ↓, antioxidantes", tags:["tradicional","glucosa","mucilago"]},
    {id:23, nombre:"Quelites (quelite, quintonil, epazote)", cat:"Verdura", kcal:20, p:2.5, g:0.3, ch:3, f:2.5, evid:"Dieta milpa, quercetina, vit K, folatos, cultura ancestral", tags:["milpa","ancestral","quercetina"]},
    {id:24, nombre:"Espárragos", cat:"Verdura", kcal:20, p:2.2, g:0.1, ch:3.9, f:2.1, evid:"Inulina prebiótica, asparagina diurética, folatos", tags:["prebiotico","diuretico"]},
    {id:25, nombre:"Pepino", cat:"Verdura", kcal:15, p:0.7, g:0.1, ch:3.6, f:0.5, evid:"95% agua, volumen extremo, silicio piel/articulaciones", tags:["volumen","hidratacion"]},
    {id:26, nombre:"Apio", cat:"Verdura", kcal:16, p:0.7, g:0.2, ch:3, f:1.6, evid:"Apigenina, fthalidas presión arterial, volumen", tags:["presion","volumen"]},
    {id:27, nombre:"Calabacita / zucchini", cat:"Verdura", kcal:17, p:1.2, g:0.3, ch:3.1, f:1, evid:"Versátil (noodles, lasagna), potasio, vit C", tags:["noodles","potasio"]},
    {id:28, nombre:"Jitomate / tomate rojo", cat:"Verdura", kcal:18, p:0.9, g:0.2, ch:3.9, f:1.2, evid:"Licopeno (cocinado ↑ 4x), vit C, potasio", tags:["licopeno","antioxidante"]},
    {id:29, nombre:"Chile (serrano, jalapeño, poblano, habanero)", cat:"Verdura", kcal:40, p:2, g:0.4, ch:9, f:1.5, evid:"Capsaicina → termogénesis + oxidación grasa + saciedad", tags:["capsaicina","termogenico","tradicional"]},
    {id:30, nombre:"Pimiento morrón (rojo/amarillo/verde)", cat:"Verdura", kcal:31, p:1, g:0.3, ch:6, f:2.1, evid:"Vit C > naranja, capsantina, volumen", tags:["vitC","volumen"]},
    {id:31, nombre:"Col rizada / kale", cat:"Verdura", kcal:49, p:4.3, g:0.9, ch:9, f:3.6, evid:"Densidad nutricional top, vit K1, luteína, zeaxantina", tags:["densidad","ojos","huesos"]},
    {id:32, nombre:"Repollo / col blanca", cat:"Verdura", kcal:25, p:1.3, g:0.1, ch:5.8, f:2.5, evid:"Glucosinolatos, fermentable (chucrut), barato, duradero", tags:["fermentable","barato","prebiotico"]},
    {id:33, nombre:"Judía verde / ejote", cat:"Verdura", kcal:31, p:1.8, g:0.2, ch:7, f:2.7, evid:"Fibra, vit K, silicio, bajo IG", tags:["bajoIG","silicio"]},
    {id:34, nombre:"Espárragos blancos", cat:"Verdura", kcal:20, p:2.2, g:0.1, ch:3.9, f:2.1, evid:"Inulina, rutina, diurético natural", tags:["inulina","diuretico"]},

    // FRUTAS - Fibra, agua, polifenoles, IG bajo-moderado
    {id:35, nombre:"Fresa", cat:"Fruta", kcal:32, p:0.7, g:0.3, ch:7.7, f:2, evid:"Antocianinas, vit C, IG 40, volumen alto", tags:["antocianinas","bajoIG","volumen"]},
    {id:36, nombre:"Frambuesa", cat:"Fruta", kcal:52, p:1.2, g:0.7, ch:12, f:6.5, evid:"Fibra TOP (6.5g/100g), elagitaninos, IG 32", tags:["fibra-top","elagitaninos"]},
    {id:37, nombre:"Mora azul / blueberry", cat:"Fruta", kcal:57, p:0.7, g:0.3, ch:14, f:2.4, evid:"Antocianinas, función cognitiva, sensibilidad insulina", tags:["cerebro","insulina"]},
    {id:38, nombre:"Sandía", cat:"Fruta", kcal:30, p:0.6, g:0.2, ch:7.6, f:0.4, evid:"Citrullina → arginina → NO, licopeno, volumen", tags:["citrulina","volumen","licopeno"]},
    {id:39, nombre:"Melón cantalupo", cat:"Fruta", kcal:34, p:0.8, g:0.2, ch:8, f:0.9, evid:"Vit A (β-caroteno), potasio, volumen", tags:["vitA","potasio"]},
    {id:40, nombre:"Pomelo / toronja", cat:"Fruta", kcal:42, p:0.8, g:0.1, ch:11, f:1.6, evid:"Naringenina (AMPK), IG 25, interacciona medicamentos", tags:["naringenina","AMPK","precaucion"]},
    {id:41, nombre:"Manzana verde", cat:"Fruta", kcal:52, p:0.3, g:0.2, ch:14, f:2.4, evid:"Pectina (fibra soluble), polifenoles, IG 36, saciedad", tags:["pectina","saciedad"]},
    {id:42, nombre:"Aguacate", cat:"Fruta", kcal:160, p:2, g:14.7, ch:8.5, f:6.7, evid:"MUFA oleico, fibra 6.7g, saciedad extrema, absorción carotenoides", tags:["MUFA","saciedad-top","absorcion"]},
    {id:43, nombre:"Kiwi", cat:"Fruta", kcal:61, p:1.1, g:0.5, ch:15, f:3, evid:"Actinidina (digestión proteína), vit C, serotonina sueño", tags:["digestion","sueño","vitC"]},
    {id:44, nombre:"Piña", cat:"Fruta", kcal:50, p:0.5, g:0.1, ch:13, f:1.4, evid:"Bromelina (antiinflamatorio, digestión), manganeso", tags:["bromelina","antiinflamatorio"]},
    {id:45, nombre:"Granada", cat:"Fruta", kcal:83, p:1.7, g:1.2, ch:19, f:4, evid:"Punicalaginas, urolitina A (mitofagia), memoria", tags:["mitofagia","memoria","polifenoles"]},

    // CEREALES / ALMIDONES RESISTENTES - Energía entrenos, fibra, saciedad
    {id:46, nombre:"Avena (copos/hojuelas)", cat:"Cereal", kcal:389, p:16.9, g:6.9, ch:66, f:10.6, evid:"Beta-glucano (colesterol, glucosa, saciedad), avenanthramidas", tags:["beta-glucano","preentreno","saciedad"]},
    {id:47, nombre:"Arroz integral", cat:"Cereal", kcal:111, p:2.6, g:0.9, ch:23, f:1.8, evid:"Magnesio, vitaminas B, IG medio, arsénico (lavar/remojar)", tags:["magnesio","versatil"]},
    {id:48, nombre:"Quinoa", cat:"Pseudo-cereal", kcal:120, p:4.4, g:1.9, ch:21, f:2.8, evid:"Proteína completa, lisina, sin gluten, fitoestrógenos", tags:["completa","sin-gluten","lisina"]},
    {id:49, nombre:"Papa hervida y enfriada", cat:"Tubérculo", kcal:87, p:1.9, g:0.1, ch:20, f:1.8, evid:"Almidón resistente tipo 3 ↑ enfriamiento, IG ↓ 40%, saciedad #1", tags:["resistente","saciedad-max","barato"]},
    {id:50, nombre:"Camote / batata", cat:"Tubérculo", kcal:86, p:1.6, g:0.1, ch:20, f:3, evid:"β-caroteno, vit C, IG medio, antioxidantes", tags:["betacaroteno","antioxidante"]},
    {id:51, nombre:"Maíz nixtamalizado (tortilla)", cat:"Cereal", kcal:218, p:5.7, g:2.9, ch:44, f:6.3, evid:"Nixtamalización: Ca biodisponible ↑, niacina libre, fibra", tags:["tradicional","calcio","niacina"]},
    {id:52, nombre:"Frijol + maíz (complementación)", cat:"Plato tradicional", kcal:150, p:8, g:2, ch:27, f:5, evid:"Proteína completa (lisina + metionina), base dieta milpa", tags:["completa","milpa","ancestral"]},
    {id:53, nombre:"Amaranto", cat:"Pseudo-cereal", kcal:371, p:13.6, g:7, ch:65, f:6.7, evid:"Lisina, escualeno, péptidos antihipertensivos, sin gluten", tags:["lisina","antihipertensivo"]},
    {id:54, nombre:"Chía", cat:"Semilla", kcal:486, p:16.5, g:30.7, ch:42, f:34.4, evid:"Omega-3 ALA, fibra soluble gelificante, calcio, hidratación", tags:["omega3","gel","hidratacion"]},
    {id:55, nombre:"Linaza molida", cat:"Semilla", kcal:534, p:18.3, g:42.2, ch:29, f:27.3, evid:"Lignanos (fitoestrógenos), ALA, regularidad intestinal", tags:["lignanos","regularidad","hormonas"]},

    // FRUTOS SECOS / SEMILLAS - Densidad calórica alta, porcionar
    {id:56, nombre:"Almendra natural", cat:"Fruto seco", kcal:579, p:21.2, g:49.9, ch:21.6, f:12.5, evid:"Vit E, Mg, fibra, saciedad, no toda grasa absorbida", tags:["vitE","magnesio","absorcion-incompleta"]},
    {id:57, nombre:"Nuez de Castilla", cat:"Fruto seco", kcal:654, p:15.2, g:65.2, ch:13.7, f:6.7, evid:"Omega-3 ALA, polifenoles, mejora endotelio", tags:["omega3","corazon","polifenoles"]},
    {id:58, nombre:"Pistacho", cat:"Fruto seco", kcal:560, p:20.2, g:45.3, ch:27.2, f:10.6, evid:"Menor caloría/nuez, luteína, descascarar = comer lento", tags:["lento","luteina","ojo"]},
    {id:59, nombre:"Cacahuate / maní", cat:"Legumbre", kcal:567, p:25.8, g:49.2, ch:16.1, f:8.5, evid:"Proteína más alta, resveratrol, barato, mantequilla natural", tags:["proteina-alta","barato","resveratrol"]},
    {id:60, nombre:"Semilla de calabaza (pepita)", cat:"Semilla", kcal:559, p:30.2, g:49.1, ch:10.7, f:6, evid:"Zinc TOP, magnesio, fitosteroles, próstata", tags:["zinc","prostata","magnesio"]},

    // GRASAS SALUDABLES - Esenciales, hormonas, absorción
    {id:61, nombre:"Aceite de oliva virgen extra (AOVE)", cat:"Grasa", kcal:884, p:0, g:100, ch:0, f:0, evid:"Oleocantal (ibuprofeno natural), polifenoles, MUFA, calor seco", tags:["oleocantal","polifenoles","antiinflamatorio"]},
    {id:62, nombre:"Aceite de aguacate", cat:"Grasa", kcal:884, p:0, g:100, ch:0, f:0, evid:"Punto humo alto (270°C), MUFA, luteína", tags:["cocinar-alto","luteina"]},
    {id:63, nombre:"Aceite de coco (virgen, moderado)", cat:"Grasa", kcal:862, p:0, g:100, ch:0, f:0, evid:"MCT (ácido caprílico/cáprico), termogénesis ligera", tags:["MCT","termogenico","moderado"]},
    {id:64, nombre:"Ghee / mantequilla clarificada", cat:"Grasa", kcal:900, p:0, g:100, ch:0, f:0, evid:"Butirato (salud colon), vit A/D/K2, punto humo alto", tags:["butirato","K2","colon"]},
    {id:65, nombre:"Pescado graso (sardina, caballa, arenque)", cat:"Proteína", kcal:150, p:20, g:7.5, ch:0, f:0, evid:"Omega-3 EPA/DHA directo, vit D, B12, barato, sostenible", tags:["EPA-DHA-directo","vitD","sostenible"]},

    // ESPECIAS / CONDIMENTOS / FUNCIONALES - Termogénicos, sensibilidad insulina
    {id:66, nombre:"Canela (Ceilán)", cat:"Especia", kcal:247, p:4, g:1.2, ch:81, f:53, evid:"Cinnamaldehído → AMPK, sensibilidad insulina, glucosa ayunas ↓", tags:["insulina","AMPK","glucosa"]},
    {id:67, nombre:"Cúrcuma + pimienta negra", cat:"Especia", kcal:354, p:7.8, g:9.9, ch:65, f:21, evid:"Curcumina + piperina ↑ biodisponibilidad 2000%, NF-κB ↓", tags:["curcumina","antiinflamatorio","piperina"]},
    {id:68, nombre:"Jengibre fresco", cat:"Especia", kcal:80, p:1.8, g:0.8, ch:18, f:2, evid:"Gingeroles, termogénesis, náuseas, vaciado gástrico", tags:["termogenico","digestion","nauseas"]},
    {id:69, nombre:"Comino", cat:"Especia", kcal:375, p:17.8, g:22.3, ch:44, f:10.5, evid:"Estudio 88 mujeres: 3g/día → peso/grasa/cintura ↓ significativo", tags:["estudio-humano","cintura"]},
    {id:70, nombre:"Pimienta negra (piperina)", cat:"Especia", kcal:251, p:10.4, g:3.3, ch:64, f:25, evid:"Biodisponibilidad ↑ nutrientes/suplementos, termogénesis", tags:["biodisponibilidad","termogenico"]},
    {id:71, nombre:"Vinagre de manzana (1-2 cdas)", cat:"Condimento", kcal:21, p:0, g:0, ch:0.9, f:0, evid:"Ácido acético → AMPK, glucosa postprandial ↓, saciedad", tags:["acetico","postprandial","saciedad"]},
    {id:72, nombre:"Mostaza (semillas)", cat:"Condimento", kcal:66, p:4, g:3.3, ch:6, f:3, evid:"Isotiocianatos, termogénesis ligera, sin calorías", tags:["isotiocianatos","cero-calorias"]},
    {id:73, nombre:"Café negro (sin azúcar)", cat:"Bebida", kcal:2, p:0.3, g:0, ch:0, f:0, evid:"Cafeína 3-6mg/kg → rendimiento, oxidación grasa ↑, supresión apetito", tags:["cafeina","rendimiento","apetito"]},
    {id:74, nombre:"Té verde (matcha/sencha)", cat:"Bebida", kcal:1, p:0.2, g:0, ch:0, f:0, evid:"EGCG + cafeína sinergia → oxidación grasa 17% ↑, L-teanina foco", tags:["EGCG","L-teanina","sinergia"]},
    {id:75, nombre:"Yerba mate", cat:"Bebida", kcal:0, p:0, g:0, ch:0, f:0, evid:"Cafeína + teobromina + teofilina, oxidación grasa, cultura", tags:["teobromina","cultural","oxidacion"]},
    {id:76, nombre:"Agua con limón / electrolitos", cat:"Bebida", kcal:3, p:0, g:0, ch:1, f:0, evid:"Hidratación → metabolismo, vit C, previene confundir sed/hambre", tags:["hidratacion","confusion-sed"]},

    // PROBIÓTICOS / FERMENTADOS - Microbioma, eje intestino-cerebro
    {id:77, nombre:"Kéfir de leche/agua", cat:"Fermentado", kcal:42, p:3.3, g:1, ch:4, f:0, evid:"30+ cepas, coloniza, vit K2, B12, lactosa ↓", tags:["diversidad","K2","coloniza"]},
    {id:78, nombre:"Chucrut / kimchi (sin pasteurizar)", cat:"Fermentado", kcal:19, p:0.9, g:0.1, ch:4.3, f:2.5, evid:"Lactobacillus, vit C, fibra, isotiocianatos (col)", tags:["Lactobacillus","vitC","prebiotico"]},
    {id:79, nombre:"Miso / tamari", cat:"Fermentado", kcal:198, p:12, g:6, ch:26, f:5, evid:"Bacillus subtilis, enzimas, umami reduce sal", tags:["enzimas","umami","sodio-bajo"]},
    {id:80, nombre:"Tepache / tesgüino (tradicional)", cat:"Fermentado", kcal:45, p:0.5, g:0, ch:11, f:0, evid:"Bebida ancestral, probióticos naturales, moderación alcohol", tags:["ancestral","moderacion","cultural"]},

    // SUPLEMENTOS CON EVIDENCIA REAL (Grado A/B ISSN/Examine/Cochrane)
    {id:81, nombre:"Cafeína anhidra (3-6 mg/kg)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado A ISSN: fuerza, potencia, resistencia, oxidación grasa, foco. 200-400mg pre-entreno", tags:["Grado-A","pre-entreno","oxidacion-grasa"]},
    {id:82, nombre:"Creatina monohidrato (5g/día)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado A ISSN: fuerza, masa magra, recuperación, cognición. Segura, barata, crónica", tags:["Grado-A","fuerza","masa-magra","cognicion"]},
    {id:83, nombre:"Proteína whey isolate (20-40g post-entreno)", cat:"Suplemento", kcal:370, p:90, g:0.5, ch:1, f:0, evid:"Grado A: MPS máx, leucina 11%, conveniencia, completar objetivo proteína", tags:["Grado-A","MPS","leucina","conveniencia"]},
    {id:84, nombre:"Beta-alanina (3.2-6.4g/día crónico)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado B: carnosina ↑, buffer H+, series 1-4 min, parestesias", tags:["Grado-B","buffer","resistencia"]},
    {id:85, nombre:"Citrullina malato (6-8g pre)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado B: arginina ↑ → NO → flujo, fatiga ↓, bomba, recuperación", tags:["Grado-B","NO","bomba","recup"]},
    {id:86, nombre:"Extracto té verde estandarizado EGCG (400-500mg)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado B: oxidación grasa +17% con cafeína, hepatotoxicidad dosis altas", tags:["Grado-B","EGCG","oxidacion","precaucion-hepatica"]},
    {id:87, nombre:"Berberina (500mg 3x/día)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado B: AMPK → sensibilidad insulina comparable metformina, microbioma", tags:["Grado-B","AMPK","insulina","metformina-like"]},
    {id:88, nombre:"Omega-3 EPA/DHA (2-3g EPA+DHA)", cat:"Suplemento", kcal:9kcal/g, p:0, g:100, ch:0, f:0, evid:"Grado A: triglicéridos ↓, inflamación ↓, recuperación, cognición, ojos", tags:["Grado-A","trigliceridos","inflamacion","cerebro"]},
    {id:89, nombre:"Vitamina D3 (2000-5000 UI según 25-OH)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado A: hormona, testosterona, inmunidad, hueso, estado ánimo. Obesidad → sequestro", tags:["Grado-A","hormona","testosterona","obesidad-sequestro"]},
    {id:90, nombre:"Magnesio glicinato/bisglicinato (400mg)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado B: 300+ enzimas, sueño, testosterona, insulin sensitivity, calambres", tags:["Grado-B","sueño","testosterona","insulina"]},
    {id:91, nombre:"Zinc picolinato (15-30mg)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado B: testosterona (si deficiente), inmunidad, gustación, próstata", tags:["Grado-B","testosterona","inmunidad"]},
    {id:91, nombre:"Probiótico multi-cepa (L. gasseri, L. rhamnosus, B. lactis)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado B: L. gasseri SBT2055 → grasa visceral ↓ 8.5% en 12 sem", tags:["Grado-B","visceral","L-gasseri"]},
    {id:92, nombre:"Ashwagandha KSM-66 (600mg)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado B: cortisol ↓ 27%, testosterona ↑ 17%, fuerza, sueño, ansiedad", tags:["Grado-B","cortisol","testosterona","ansiedad"]},
    {id:93, nombre:"Melatonina (0.3-3mg)", cat:"Suplemento", kcal:0, p:0, g:0, ch:0, f:0, evid:"Grado A: onset sueño, ritmo circadiano, GH nocturno, antioxidante", tags:["Grado-A","sueño","GH","circadiano"]},

    // MEDICAMENTOS (requieren endocrinólogo) - Solo referencia educativa
    {id:94, nombre:"Semaglutida (Ozempic/Wegovy)", cat:"Medicamento", kcal:0, p:0, g:0, ch:0, f:0, evid:"GLP-1 RA: peso -15% a 68 sem, saciedad, glucosa. Requiere endocrino, efectos GI, costo", tags:["GLP-1","endocrino","recupera-peso-si-suspende"]},
    {id:95, nombre:"Tirzepatida (Mounjaro/Zepbound)", cat:"Medicamento", kcal:0, p:0, g:0, ch:0, f:0, evid:"GIP/GLP-1 dual: peso -20%+, superior semaglutida. Endocrino obligatorio", tags:["dual-GIP-GLP1","superior","endocrino"]},
    {id:96, nombre:"Metformina", cat:"Medicamento", kcal:0, p:0, g:0, ch:0, f:0, evid:"AMPK, sensibilidad insulina, modesto peso -2-3kg, longevidad, bajo costo", tags:["AMPK","insulina","barato","longevidad"]},
  ],

  // ----------------------------------------------------------
  // PROTOCOLOS DE EJERCICIO BASADOS EN EVIDENCIA (ACSM, NSCA, meta-análisis)
  // ----------------------------------------------------------
  ejercicio: {
    principios: [
      "Entrenamiento de fuerza 3-4x/semana: base metabólica, preserva masa magra en déficit",
      "Sobrecarga progresiva semanal: +repes, +carga, +series, -descanso, mejor técnica",
      "Compuestos multiarticulares (sentadilla, peso muerto, press, remo) > aislamientos",
      "Rango 6-12 rep (hipertrofia), 3-5 (fuerza), 15-20 (resistencia metabólica)",
      "Cardio: herramienta gasto extra, NO sustituto de fuerza. HIIT 1-2x/sem + LISS/NEAT",
      "NEAT (termogénesis actividad no ejercicio): 7000-10000 pasos/día objetivo mínimo",
      "Recuperación: 48-72h entre grupos, sueño 7-9h, gestión estrés (cortisol catabólico)"
    ],
    rutinas: {
      "Full Body 3x (Principiante/Intermedio)": {
        frecuencia: 3,
        dias: ["Lun", "Mié", "Vie"],
        ejercicios: [
          {nombre:"Sentadilla goblet / barra", series:3, repes:"8-10", rpe:8, tipo:"compuesto"},
          {nombre:"Peso muerto rumano / KB swing", series:3, repes:"10-12", rpe:8, tipo:"compuesto"},
          {nombre:"Press banca / mancuernas / push-ups", series:3, repes:"8-12", rpe:8, tipo:"empuje"},
          {nombre:"Remo 1 mano / polea / dominadas asistidas", series:3, repes:"10-12", rpe:8, tipo:"traccion"},
          {nombre:"Press militar / landmine", series:3, repes:"8-10", rpe:8, tipo:"empuje-vertical"},
          {nombre:"Plancha / dead bug / pallof", series:3, tiempo:"30-45s", rpe:8, tipo:"core"},
          {nombre:"Carga farmers walk / sentadilla búlgara", series:3, repes:"10-12/pierna", rpe:8, tipo:"unilateral"}
        ],
        cardio: "Post-entreno 10-15min HIIT (10s sprint/50s caminar x5) o 20-30min LISS zona 2",
        neat: "8000-10000 pasos días no entreno"
      },
      "Upper/Lower 4x (Intermedio/Avanzado)": {
        frecuencia: 4,
        split: ["Upper A", "Lower A", "Descanso", "Upper B", "Lower B", "Descanso", "Descanso"],
        upperA: [
          {e:"Press banca barra", s:4, r:"6-8"},
          {e:"Remo barra pronado", s:4, r:"8-10"},
          {e:"Press militar mancuernas", s:3, r:"8-10"},
          {e:"Dominadas / jalón pecho", s:3, r:"8-12"},
          {e:"Curl bíceps / extensiones tríceps", s:3, r:"12-15"}
        ],
        lowerA: [
          {e:"Sentadilla libre / hack", s:4, r:"6-8"},
          {e:"Peso muerto convencional", s:3, r:"6-8"},
          {e:"Prensa 45° / zancadas", s:3, r:"10-12"},
          {e:"Curl femoral / nórdico", s:3, r:"10-12"},
          {e:"Elevación talones", s:4, r:"15-20"}
        ],
        upperB: [
          {e:"Press inclinado mancuernas", s:4, r:"8-10"},
          {e:"Remo 1 mano mancuerna", s:4, r:"10-12"},
          {e:"Press militar barra", s:3, r:"8-10"},
          {e:"Face pulls / rear delt", s:3, r:"15-20"},
          {e:"Dips / extensiones cuerda", s:3, r:"10-12"}
        ],
        lowerB: [
          {e:"Sentadilla frontal / búlgara", s:4, r:"8-10"},
          {e:"Peso muerto rumano", s:3, r:"8-10"},
          {e:"Step-ups / hip thrust", s:3, r:"10-12"},
          {e:"Curl femoral sentado", s:3, r:"12-15"},
          {e:"Abductores / aductores", s:3, r:"15-20"}
        ],
        cardio: "HIIT 1x/sem (sprints 30s/90s x6-8) + LISS 2x/sem 30-45min zona 2 (FC 120-135)"
      },
      "Push/Pull/Legs 6x (Avanzado)": {
        frecuencia: 6,
        push: [{e:"Press banca",s:4,r:"6-8"},{e:"Press inclinado",s:3,r:"8-10"},{e:"Press militar",s:3,r:"8-10"},{e:"Fondos",s:3,r:"10-12"},{e:"Elevaciones laterales",s:4,r:"15-20"},{e:"Extensiones tríceps",s:3,r:"12-15"}],
        pull: [{e:"Peso muerto",s:4,r:"6-8"},{e:"Dominadas",s:4,r:"8-10"},{e:"Remo barra",s:3,r:"8-10"},{e:"Face pulls",s:3,r:"15-20"},{e:"Curl bíceps",s:3,r:"10-12"},{e:"Curl martillo",s:3,r:"10-12"}],
        legs: [{e:"Sentadilla",s:4,r:"6-8"},{e:"Peso muerto rumano",s:3,r:"8-10"},{e:"Prensa",s:3,r:"10-12"},{e:"Búlgaras",s:3,r:"10-12/p"},{e:"Curl femoral",s:3,r:"12-15"},{e:"Gemelos",s:4,r:"15-20"}],
        cardio: "HIIT post-push/pull 10min, LISS post-legs 30min, NEAT 10k pasos diario"
      }
    },
    hiit_protocolos: [
      {nombre:"Wingate modificado", trabajo:30, descanso:120, series:4, progresion:"+1 serie/sem"},
      {nombre:"Tabata real", trabajo:20, descanso:10, series:8, nota:"Solo si base aeróbica sólida"},
      {nombre:"Sprints cuesta", trabajo:15, descanso:90, series:6, progresion:"+1 sprint/sem"},
      {nombre:"Battle ropes / assault bike", trabajo:20, descanso:40, series:10, progresion:"+2 series/sem"}
    ],
    neat_estrategias: [
      "Caminar 10-15 min post cada comida (glucosa ↓ 20-30%)",
      "Trabajar de pie / escritorio ajustable (2-4h/día)",
      "Subir escaleras siempre (1 piso = 10 kcal)",
      "Parking lejos / bajar 1 parada antes",
      "Llamadas caminando / reuniones walking",
      "Tareas domésticas vigorosas (aspirar, fregar = 150-200 kcal/h)",
      "Jugar con hijos / mascotas activo",
      "Estirar / movilidad viendo TV"
    ]
  },

  // ----------------------------------------------------------
  // SUPLEMENTACIÓN BASADA EN EVIDENCIA (ISSN, Examine, Cochrane)
  // ----------------------------------------------------------
  suplementos: {
    grado_A: [
      {nombre:"Creatina monohidrato", dosis:"5g/día crónico (no requiere carga)", timing:"Cualquier momento, con carbohidrato opcional", evidencia:"1000+ estudios: fuerza +5-15%, masa magra 1-2kg, recuperación, cognición, seguro renal sano", contra:"Ninguna en sanos. Hidratación adecuada."},
      {nombre:"Proteína whey isolate / caseína", dosis:"1.6-2.4g/kg/día total (incl. dieta)", timing:"Whey post-entreno / caseína pre-sueño", evidencia:"Completa aminoácidos, leucina trigger MPS, conveniente, saciedad", contra:"Intolerancia lactosa → isolate/hidrolizado/vegana"},
      {nombre:"Cafeína anhidra", dosis:"3-6 mg/kg (200-400mg) 30-60min pre", timing:"Pre-entreno, no >400mg/día, ciclar 4 sem on/2 off", evidencia:"Fuerza, potencia, resistencia, oxidación grasa, foco, RPE ↓", contra:"Ansiedad, insomnio, hipertensión no controlada, embarazo"},
      {nombre:"Omega-3 EPA/DHA (aceite pescado/algal)", dosis:"2-3g EPA+DHA/día (1-2g EPA)", timing:"Con comida grasa", evidencia:"Triglicéridos ↓ 20-30%, inflamación ↓, recuperación, cognición, ojos", contra:"Anticoagulantes → médico. Oxidación → certificado IFOS"},
      {nombre:"Vitamina D3 (colecalciferol)", dosis:"2000-5000 UI/día según 25(OH)D objetivo 50-80 ng/mL", timing:"Con comida grasa + K2 (MK-7 100-200mcg)", evidencia:"Hormona esteroide: testosterona, inmunidad, hueso, estado ánimo, fuerza", contra:"Hipercalcemia si >10000 UI crónico sin control"},
      {nombre:"Melatonina", dosis:"0.3-3mg 30-60min pre-sueño", timing:"Noche, luz roja/oscuridad", evidencia:"Onset sueño, calidad, GH nocturno, antioxidante, ritmo circadiano", contra:"Depresión, anticoagulantes, inmunosupresores → médico"}
    ],
    grado_B: [
      {nombre:"Beta-alanina", dosis:"3.2-6.4g/día crónico (4-6 sem)", timing:"Dividido 800-1600mg c/3-4h para evitar parestesias", evidencia:"Carnosina muscular ↑ → buffer H+ → series 1-4 min ↑ rendimiento 2-3%"},
      {nombre:"Citrullina malato 2:1", dosis:"6-8g 40-60min pre", timing:"Pre-entreno", evidencia:"Arginina ↑ → NO → flujo sanguíneo, fatiga ↓, bomba, recuperación"},
      {nombre:"Extracto té verde (EGCG 400-500mg + cafeína 200mg)", dosis:"3-4x/día", timing:"Con comidas", evidencia:"Oxidación grasa +17% sinergia, termogénesis 24h ↑ 4%", contra:"Hepatotoxicidad raro >800mg EGCG/día en ayunas"},
      {nombre:"Berberina HCl", dosis:"500mg 3x/día con comidas", timing:"Pre-comidas principales", evidencia:"AMPK → sensibilidad insulina ≈ metformina, glucosa ↓, lípidos ↓, microbioma", contra:"Interacciona CYP450, embarazo, hipoglucemia si + meds"},
      {nombre:"Ashwagandha KSM-66", dosis:"600mg/día (300mg x2)", timing:"Mañana + noche", evidencia:"Cortisol ↓ 27%, testosterona ↑ 17%, fuerza ↑, sueño ↑, ansiedad ↓", contra:"Hipertiroidismo, embarazo, sedantes, autoinmune"},
      {nombre:"Probiótico multi-cepa (L. gasseri BNR17, L. rhamnosus, B. lactis)", dosis:"10-50B UFC/día", timing:"Con comida", evidencia:"L. gasseri → grasa visceral ↓ 8.5% 12 sem, L. rhamnosus → peso ♀, B. lactis → inflamación"},
      {nombre:"Magnesio glicinato/bisglicinato", dosis:"400mg elemental noche", timing:"Pre-sueño", evidencia:"300+ enzimas, GABA, testosterona libre, sensibilidad insulina, sueño, calambres"},
      {nombre:"Zinc picolinato/quelado", dosis:"15-30mg/día con comida", timing:"No con fitatos/calcio/hierro", evidencia:"Testosterona si deficiente, inmunidad, gustación, próstata, cicatrización"},
      {nombre:"Vitamina K2 (MK-7)", dosis:"100-200mcg con D3", timing:"Con comida grasa", evidencia:"Carboxila osteocalcina (hueso) + MGP (arterias) → calcio a hueso NO arterias"},
      {nombre:"Boro (boroquelato)", dosis:"3-6mg/día", timing:"Con comida", evidencia:"Testosterona libre ↑, estradiol ↓, vit D metabolismo, cognición, osteoartritis"}
    ],
    grado_C_sin_evidencia_solida: [
      "Quemadores de grasa comerciales (mezclas propietarias, subdosis)",
      "CLA (ácido linoleico conjugado) - efecto nulo en humanos",
      "L-carnitina oral (no cruza BBB, solo intravenoso funciona)",
      "Garcinia cambogia / HCA - meta-análisis nulo",
      "Cetonas exógenas (no queman grasa, solo sustrato alternativo)",
      "Detox / teatox / laxantes (pérdida agua, peligroso)",
      "Bloqueadores carbohidratos (faseolamina - efecto mínimo)",
      "Suplementos 'testosterone boosters' mezclas (tribulus, fenugreek, DAA - evidencia débil)"
    ]
  },

  // ----------------------------------------------------------
  // MÓDULO MÉDICO / ENDOCRINO - Guías AACE/ACE 2023-2025, ADA, EASO
  // ----------------------------------------------------------
  medico: {
    criterios_obesidad: {
      IMC: {normal:"18.5-24.9", sobrepeso:"25-29.9", obesidad_I:"30-34.9", obesidad_II:"35-39.9", obesidad_III:">=40"},
      circunferencia_cintura: {hombre_riesgo:">=102cm", hombre_alto:">94cm", mujer_riesgo:">=88cm", mujer_alto:">80cm"},
      porcentaje_grasa: {hombre_esencial:"2-5%", hombre_atleta:"6-13%", hombre_fitness:"14-17%", hombre_promedio:"18-24%", hombre_obeso:">25%", mujer_esencial:"10-13%", mujer_atleta:"14-20%", mujer_fitness:"21-24%", mujer_promedio:"25-31%", mujer_obesa:">32%"}
    },
    laboratorios_recomendados: [
      {panel:"Metabólico", pruebas:["Glucosa ayunas", "HbA1c", "Insulina ayunas", "HOMA-IR", "Lipidograma completo", "ALT/AST/GGT", "Creatinina/eGFR", "Ácido úrico"]},
      {panel:"Hormonal", pruebas:["TSH, T4 libre, T3 libre", "Testosterona total y libre (♂)", "SHBG", "Estradiol (♀/♂)", "Cortisol matutino / DHEA-S", "Prolactina", "IGF-1"]},
      {panel:"Nutricional", pruebas:["25-hidroxivitamina D", "B12 / Folato", "Ferritina / Hierro / Transferrina", "Magnesio RBC", "Zinc / Cobre / Selenio", "Omega-3 index (EPA+DHA %)"]},
      {panel:"Inflamación/Recuperación", pruebas:["PCR ultrasensible", "Homocisteína", "Vitamina B12/B6/folato"]}
    ],
    medicamentos_AACE_2024: {
      primera_linea_IMC_30_o_27_comorbilidad: [
        {nombre:"Semaglutida 2.4mg (Wegovy)", mecanismo:"GLP-1 RA", perdida_peso_promedio:"-15% a 68 sem", consideraciones:"Náuseas transitorias, pancreatitis raro, costo alto"},
        {nombre:"Tirzepatida 15mg (Zepbound)", mecanismo:"GIP/GLP-1 dual", perdida_peso_promedio:"-20% a 72 sem", consideraciones:"Superior semaglutida, mismo perfil GI"},
        {nombre:"Liraglutida 3mg (Saxenda)", mecanismo:"GLP-1 RA", perdida_peso_promedio:"-8% a 56 sem", consideraciones:"Inyección diaria, menos pérdida que semaglutida"}
      ],
      segunda_linea_o_adyuvante: [
        {nombre:"Fentermina-topiramato (Qsymia)", mecanismo:"Simpático + GABA", perdida_peso_promedio:"-10%", consideraciones:"Teratogénico, TA ↑, psiquiátrico"},
        {nombre:"Naltrexona-bupropión (Contrave)", mecanismo:"Dopamina/norepinefrina + opioides", perdida_peso_promedio:"-5-8%", consideraciones:"Convulsiones, opioides, HTA"},
        {nombre:"Orlistat (Xenical/Alli)", mecanismo:"Inhibe lipasa intestinal", perdida_peso_promedio:"-3-5%", consideraciones:"Heces grasas, vitaminas liposolubles ↓"}
      ],
      diabetes_tipo2_con_obesidad: [
        {nombre:"Metformina", mecanismo:"AMPK, gluconeogénesis ↓", perdida_peso_promedio:"-2-3kg", consideraciones:"B12 ↓ largo plazo, GI, bajo costo"},
        {nombre:"SGLT2i (empagliflozina, dapagliflozina)", mecanismo:"Glucosuria", perdida_peso_promedio:"-2-3kg", consideraciones:"Genitales infecciones, euglicémica cetoacidosis rara"}
      ]
    },
    endocrinologo_cuando_referir: [
      "IMC ≥30 o ≥27 con comorbilidades (HTA, DLP, DM2, OSA, NAFLD, PCOS)",
      "Fracaso intervención estilo de vida 6 meses (peso <5% pérdida)",
      "Sospecha endocrinopatía: hipotiroidismo, Cushing, hipogonadismo, PCOS, insulinoma",
      "Diabetes tipo 2 no controlada (HbA1c >7%) con obesidad",
      "Evaluación cirugía bariátrica (IMC ≥40 o ≥35 + comorbilidades)",
      "Medicamentos obesogénicos (antipsicóticos, corticoides, betabloqueantes, insulina, sulfonilureas)"
    ]
  },

  // ----------------------------------------------------------
  // COMPORTAMIENTO / PSICOLOGÍA / SUEÑO / EJE INTESTINO-CEREBRO
  // ----------------------------------------------------------
  comportamiento: {
    tecnicas_evidencia: [
      {nombre:"Automonitoreo (self-monitoring)", evidencia:"Meta-análisis: peso ↓ 2-3kg mayor vs control. Registro comida + peso + actividad", implementacion:"App, papel, fotos. Frecuencia diaria > semanal"},
      {nombre:"Establecimiento metas SMART", evidencia:"Específicas, Medibles, Alcanzables, Relevantes, Temporales. Metas proceso > resultado", implementacion:"'Caminar 30min 5x/sem' vs 'bajar 5kg'"},
      {nombre:"Control estimulo (stimulus control)", evidencia:"Entorno determina comportamiento. Eliminar disparadores, facilitar saludables", implementacion:"No comprar 'basura', fruta visible, agua en mesa, zapatillas visibles"},
      {nombre:"Planificación implementación (if-then)", evidencia:"Gollwitzer: 'Si X ocurre, haré Y'. Adherencia ↑ 2-3x", implementacion:"'Si tengo antojo noche → bebo agua + espero 10min + si persiste como yogur'"},
      {nombre:"Reestructuración cognitiva (CBT)", evidencia:"Identificar pensamientos sabotaje ('todo o nada', 'me lo merezco'), reemplazar", implementacion:"Diario pensamientos → evidencia a favor/en contra → pensamiento alternativo"},
      {nombre:"Alimentación consciente (mindful eating)", evidencia:"Hambre/saciedad señales internas vs externas. Velocidad ↓, saciedad ↑, kcal ↓ 10-15%", implementacion:"Sin pantallas, 20+ masticaciones, pausa 20min antes segundo plato"},
      {nombre:"Gestión estrés / cortisol", evidencia:"Cortisol crónico → grasa visceral ↑, antojos azúcar/grasa, catabolismo músculo", implementacion:"Respiración 4-7-8, meditación 10min/día, naturaleza, hobbies, límites laborales"},
      {nombre:"Sueño 7-9h (higiene del sueño)", evidencia:"<6h → grelina ↑, leptina ↓, cortisol ↑, HGH ↓, antojos ↑ 300-400kcal/día", implementacion:"Horario fijo, oscuridad total, 18-20°C, sin pantallas 1h antes, cafeína corte 2pm"},
      {nombre:"Apoyo social / accountability", evidencia:"Grupos, coach, pareja, app comunidad → adherencia 2-3x mayor", implementacion:"Check-in semanal, compartir metas, celebrar hitos no-comida"}
    ],
    eje_intestino_cerebro: {
      mecanismos: [
        "Microbioma produce 95% serotonina, 50% dopamina, GABA, acetilcolina",
        "Eje vagal: señales bidireccionales intestino ↔ hipotálamo (apetito/saciedad)",
        "Ácidos grasos cadena corta (butirato, propionato, acetato) → GLP-1, PYY ↑ saciedad",
        "Disbiosis → LPS endotoxemia → inflamación hipotalámica → leptino-resistencia",
        "Psicobióticos: L. rhamnosus, B. longum, L. plantarum → ansiedad/depresión ↓"
      ],
      alimentos_psicobioticos: ["Kéfir", "Chucrut/kimchi sin pasteurizar", "Yogur probiótico", "Miso", "Tempeh", "Fibra prebiótica (achicoria, ajo, cebolla, puerro, plátano verde, avena)"],
      suplementos_psicobioticos: ["L. rhamnosus GG", "B. longum 1714", "L. plantarum PS128", "L. gasseri BNR17"]
    }
  },

  // ----------------------------------------------------------
  // DIETA MILPA / TRADICIÓN MEXICANA - EVIDENCIA CIENTÍFICA
  // ----------------------------------------------------------
  dieta_milpa: {
    principio: "Sistema milpa: maíz + frijol + calabaza + chile + quelites = proteína completa + fibra + polifenoles + bajo IG",
    estudios: [
      "Valerino-Perea 2019: Dieta tradicional mexicana ↓ enfermedades crónicas, comparable Mediterránea",
      "Alatorre-Cruz 2023: Compuestos fenólicos maíz nixtamalizado/frijol/chile → obesidad/diabetes/CV ↓",
      "INSP: Promover milpa = soberanía alimentaria + salud metabólica + biodiversidad"
    ],
    alimentos_base: [
      {grupo:"Cereal", items:["Maíz nixtamalizado (tortilla, tlacoyo, tamal)", "Amaranto", "Maíz pozolero"]},
      {grupo:"Legumbre", items:["Frijol (negro, bayo, pinto, ayocote)", "Lenteja", "Garbanzo", "Altramuz"]},
      {grupo:"Verdura/Quelite", items:["Quelite, quintonil, epazote, hoja santa, verdolaga, huauzontle", "Nopal", "Calabaza, chilacayote, flor de calabaza", "Chile (serrano, jalapeño, poblano, habanero, seco)"]},
      {grupo:"Fruta", items:["Guayaba, tejocote, zapote, mamey, pitaya, tuna, papaya", "Mango, piña, plátano, aguacate"]},
      {grupo:"Proteína", items:["Huevo", "Pescado (charal, trucha, mojarra)", "Pollo, pavo", "Conejo", "Insectos (chapulín, escamol, gusano maguey)"]},
      {grupo:"Grasa", items:["Aguacate", "Pepita de calabaza", "Aceite de aguacate", "Manteca cerdo (moderado)"]}
    ],
    patrones_plato_milpa: [
      {comida:"Desayuno", ejemplo:"Tortilla maíz + frijol + huevo + salsa verde + aguacate 1/4"},
      {comida:"Comida", ejemplo:"Caldo de verduras/quelites + tortilla + frijol + proteína (pescado/pollo) + ensalada nopal"},
      {comida:"Cena", ejemplo:"Quesadilla huitlacoche/flor calabaza + ensalada quelites + frijol"},
      {comida:"Colación", ejemplo:"Fruta temporada + pepitas tostadas / yogur + amaranto"}
    ]
  },

  // ----------------------------------------------------------
  // CALCULADORAS / HERRAMIENTAS
  // ----------------------------------------------------------
  calculadoras: {
    TMB_Mifflin_StJeor: {
      hombre: "10 × peso(kg) + 6.25 × altura(cm) - 5 × edad + 5",
      mujer: "10 × peso(kg) + 6.25 × altura(cm) - 5 × edad - 161"
    },
    TDEE_factores: {sedentario:1.2, ligero:1.375, moderado:1.55, activo:1.725, muy_activo:1.9},
    deficit_recomendado: "15-25% TDEE (0.5-1% peso corporal/semana). Mínimo TMB. Refeed 1x/semana mantenimiento.",
    proteinas_objetivo: {sedentario:"1.2-1.6g/kg", entrena_fuerza:"1.8-2.4g/kg", deficit_agresivo:"2.3-3.1g/kg", mayor_60:"1.5-2.0g/kg"},
    hidratacion: "35-45ml/kg/día + 500-1000ml/hora ejercicio. Orina color pajizo claro.",
    ritmo_perdida_seguro: "0.5-1% peso corporal/semana. >1% → riesgo masa muscular, metabólico, rebote."
  }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CIENCIA;
}