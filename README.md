# Ruda Rugby Club - Website

## Información del Proyecto
- **Cliente:** Club de Rugby Ruda
- **Tipo:** Plataforma completa de gestión + E-learning
- **Contexto:** Proyecto asignado como parte del programa de becados de rugby
- **Estado:** En planificación - Fase de definición de requisitos
- **Complejidad:** ALTA (sistema multi-rol con gamificación)

## Visión General
Plataforma integral para el club de rugby que combina:
- Gestión de jugadores y cuotas
- Perfiles de usuario con estadísticas
- Sistema de aprendizaje gamificado (Ruda School)

## Funcionalidades Principales

### 1. Sistema de Autenticación y Roles

#### Roles de Usuario:
- **Jugador:** Puede ver su perfil, estadísticas, estado de cuenta, acceder a Ruda School
- **Moderador/Admin:** Carga estadísticas, gestiona cuotas, administra contenidos
- **Tesorero:** Gestión específica de pagos y cuotas

#### Funcionalidades de Privacidad:
- Toggle "Ojito" para ocultar estado de cuenta (visible solo para el jugador y admins)
- Configuración de privacidad del perfil

### 2. Perfil de Jugador

#### Información Personal:
- Nombre completo
- Fecha de nacimiento
- Categoría (M19, Senior, etc.)
- Posición
- Foto de perfil
- Fecha de ingreso al club
- Contacto (tel, email)
- Contacto de emergencia

#### Estadísticas (Cargadas por Moderadores):
- Partidos jugados
- Tries anotados
- Asistencias
- Minutos en cancha
- Tarjetas (amarillas/rojas)
- Lesiones
- Progreso físico (opcional)

#### Estado de Cuenta:
- Cuota mensual actual
- Estado: Al día / Pendiente / Atrasado
- Historial de pagos
- **Privacidad:** Toggle para ocultar estado (solo visible para jugador y admins)

### 3. Ruda School (Sistema de Aprendizaje)

Concepto: **Journey gamificado estilo Duolingo** para aprender sobre rugby

#### Módulos de Aprendizaje:

**Nivel 1: Fundamentos**
- ¿Qué es el rugby?
- Historia del rugby
- Reglas básicas (scrum, lineout, tackle)
- Posiciones en el campo
- Duración del partido

**Nivel 2: Reglas URBA**
- Reglamento específico de la Unión de Rugby de Buenos Aires
- Sistema de competencia
- Categorías y formatos

**Nivel 3: Táctica y Posicionamiento**
- Formaciones (backs vs forwards)
- Jugadas básicas
- Defensa organizada
- Ataque estructurado

**Nivel 4: Técnica Individual**
- Pase (spin pass, pop pass)
- Tackle seguro
- Rucking
- Mauling
- Kicking

**Nivel 5: Táctica Avanzada**
- Análisis de rivales
- Lectura de juego
- Adaptación en caliente

#### Características del Sistema:
- **Progreso granular:** Cada módulo se desglosa en lecciones pequeñas (5-10 min)
- **Gamificación:** Puntos XP, niveles, medallas, streaks diarios
- **Evaluación:** Quizzes interactivos, videos demostrativos
- **Progresión desbloqueable:** Niveles se desbloquean al completar los anteriores
- **Contenido multimedia:** Videos, imágenes, diagramas interactivos

### 4. Panel de Administración (Moderadores)

#### Gestión de Jugadores:
- CRUD completo de jugadores
- Carga masiva de estadísticas
- Importar desde Excel/CSV

#### Gestión de Cuotas:
- Registrar pagos
- Ver estado de cuotas por jugador
- Reportes de morosidad
- Exportar datos

#### Gestión de Contenido (Ruda School):
- Crear/editar lecciones
- Subir videos y materiales
- Crear quizzes
- Ver progreso de jugadores

### 5. Secciones Públicas del Sitio

**Home:**
- Hero con video de carga
- Próximos partidos
- Noticias del club
- Acceso a login/registro

**El Club:**
- Historia y valores
- Comisión directiva
- Instalaciones

**Fixture:**
- Calendario de partidos
- Resultados
- Tabla de posiciones (si aplica)

**Galería:**
- Fotos de partidos
- Eventos sociales

**Contacto:**
- Formulario
- Ubicación
- Redes sociales

## Base de Datos - Schema

### Tablas Principales:

#### usuarios
- id, email, password_hash, rol (jugador/moderador/tesorero)
- nombre, apellido, created_at

#### jugadores
- id, user_id (FK), fecha_nacimiento, categoria_id (FK)
- posicion, fecha_ingreso, foto_url, contacto_emergencia
- estado (activo/lesionado/inactivo)

#### estadisticas
- id, jugador_id (FK), partido_id (FK), temporada
- tries, asistencias, minutos_jugados
- tarjetas_amarillas, tarjetas_rojas
- tackles, carries, passes

#### cuotas
- id, jugador_id (FK), mes, anio, monto
- estado (pagado/pendiente/atrasado)
- fecha_pago, metodo_pago
- privado (boolean - para el toggle del ojito)

#### rudaschool_modulos
- id, titulo, descripcion, orden, nivel
- icono, color, activo

#### rudaschool_lecciones
- id, modulo_id (FK), titulo, contenido
- tipo (video/texto/quiz/interactivo)
- orden, xp_reward, tiempo_estimado

#### rudaschool_progreso
- id, jugador_id (FK), leccion_id (FK)
- completado, fecha_completado, xp_obtenido

#### temporadas
- id, nombre, fecha_inicio, fecha_fin
- activa (boolean)

## Tech Stack (Actualizado)

### Frontend:
- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS + paleta de colores Ruda
- **UI Components:** shadcn/ui o Headless UI
- **Animaciones:** Framer Motion (para Ruda School)
- **Estado:** Zustand o React Query

### Backend:
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (magic links + OAuth)
- **Storage:** Supabase Storage (fotos, videos)
- **API:** Next.js API Routes + Supabase client

### Features Adicionales:
- **Progressive Web App (PWA):** Para acceso móvil nativo
- **Notificaciones:** Push notifications para cuotas vencidas
- **Offline:** Ruda School funciona offline (sync cuando hay conexión)

## Assets Disponibles

### Logos
- **Logo Ruda Macho:** `assets/Logo Ruda Macho.png` — Logo principal del club
- **Logo Ruda School:** `assets/Logo Ruda School.png` — Logo de la plataforma de aprendizaje

### Video
- **Splash screen:** `assets/Animación_de_Carga_Minimalista_y_Fluida.mp4`

### Documentos de Referencia
- **Rugby con Luca - dossier.pdf** — Material educativo de referencia sobre fundamentos
- *(Documentos adicionales para incorporar al contenido de Ruda School)*

### Paleta de Colores
- **Archivo:** `COLOR_PALETTE.md`
- **Base:** Verde (#1B5E20) y Amarillo (#FFC107) - colores del equipo
- **Estado:** ✅ Definida

## Ruda School - Sistema de Aprendizaje Gamificado

### Concepto
Plataforma de e-learning estilo **Duolingo**, diseñada para **adultos de 20-40 años**.

### Estructura de Contenido (Ver detalles completos en `docs/RUDA_SCHOOL_CONTENT.md`)

**Nivel 1: Fundamentos**
- Historia, cancha, puntuación básica
- Badge: "Primeros Pasos"

**Nivel 2: Reglamento URBA**
- Sistema de competencia, tackles, faltas, tarjetas
- Badge: "Experto URBA"

**Nivel 3: Posiciones**
- Forwards vs Backs, test de posición ideal
- Badge: "Descubriendo mi Lugar"

**Nivel 4: Técnica Individual**
- Pase, recepción, kicking
- Badges: "Distribuidor", "Elusivo", "Pierna de Oro"

**Nivel 5: Táctica de Equipo**
- Defensa organizada, ataque estructurado, pelota parada
- Badges: "Muro Impenetrable", "Estratega"

**Nivel 6: Preparación Física y Mental**
- Condición física, mentalidad de competidor
- Badge: "Mentalidad de Campeón"

### Sistema de Gamificación
- **XP por lección:** 10-40 XP según dificultad
- **Niveles de jugador:** Novato → Aprendiz → Intermedio → Avanzado → Experto → Leyenda
- **Badges por progresión, habilidad y constancia**
- **Streaks diarios** de estudio

### Características Pedagógicas
- Videos cortos (2-5 min) + práctica en cancha
- Quizzes interactivos
- Progresión desbloqueable
- Contenido específico de URBA (Unión de Rugby de Buenos Aires)
- Interpretado para adultos (práctico, directo, sin teoría aburrida)

## Timeline Estimado (Actualizado)

### Fase 1: Setup y BD (Semana 1)
- Setup proyecto Next.js + Supabase
- Configurar auth y roles
- Crear schema de base de datos
- Setup Tailwind con colores Ruda

### Fase 2: Auth y Perfiles (Semana 2)
- Sistema de login/registro
- Perfil de jugador
- Panel de administración básico

### Fase 3: Cuotas y Estadísticas (Semana 3)
- Sistema de cuotas con toggle privacidad
- CRUD estadísticas (moderadores)
- Reportes

### Fase 4: Ruda School MVP (Semanas 4-5)
- Estructura de módulos/lecciones
- Sistema de progreso
- Gamificación básica (XP, niveles)
- 5-10 lecciones iniciales

### Fase 5: Frontend Público (Semana 6)
- Home, El Club, Fixture, Galería
- Responsive design
- PWA setup

### Fase 6: Testing y Deploy (Semana 7)
- Testing con usuarios reales
- Bug fixes
- Deploy a producción
- Capacitación

**Total estimado: 6-7 semanas** (proyecto complejo)

## Notas Importantes

- **Prioridad:** Sistema de cuotas y perfiles antes que Ruda School
- **MVP:** Primero funcionalidad básica, luego gamificación
- **Usuarios pilotos:** Testear con 2-3 jugadores antes de lanzar a todos
- **Contenido:** Preparar material educativo para Ruda School (videos, diagramas)
