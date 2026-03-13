# Tareas - Ruda Rugby Website (Versión Completa)

## FASE 0: Preparación (Estamos aquí)
- [x] Definir requisitos completos
- [x] Crear schema de base de datos
- [x] Definir paleta de colores
- [x] Reunir assets iniciales
- [ ] Reunir info del club (comisión, jugadores, etc.)

## FASE 1: Setup Técnico (Semana 1)
### Infraestructura
- [ ] Crear proyecto Next.js 14 con App Router
- [ ] Configurar Tailwind CSS con colores Ruda
- [ ] Setup Supabase proyecto
- [ ] Configurar variables de entorno (.env)
- [ ] Setup Git + GitHub repo
- [ ] Configurar ESLint + Prettier

### Base de Datos
- [ ] Ejecutar schema SQL en Supabase
- [ ] Configurar Row Level Security (RLS) policies
- [ ] Crear usuarios/roles de prueba
- [ ] Seed data inicial (categorías, módulos básicos)

### Auth
- [ ] Configurar Supabase Auth
- [ ] Setup magic links
- [ ] Middleware de protección de rutas
- [ ] Sistema de roles (jugador/moderador/tesorero/admin)

## FASE 2: Sistema de Usuarios y Perfiles (Semana 2)
### Frontend
- [ ] Página de Login
- [ ] Página de Registro (solo para jugadores, moderadores creados por admin)
- [ ] Componente de navegación con roles
- [ ] Página de Perfil de Jugador (público)
- [ ] Página de Editar Perfil (privado)

### Backend
- [ ] API: GET/PUT perfil de jugador
- [ ] API: Subir foto de perfil
- [ ] Validación de datos

## FASE 3: Cuotas con Privacidad (Semana 3)
### Frontend
- [ ] Componente de Estado de Cuenta
- [ ] Toggle "Ojito" para ocultar/mostrar estado
- [ ] Vista de historial de pagos
- [ ] Página de Cuotas para tesoreros

### Backend
- [ ] API: CRUD cuotas (solo tesoreros/admins)
- [ ] API: Ver cuotas propias (con filtro de privacidad)
- [ ] Lógica de privacidad: si privado=true, solo jugador y admin pueden ver

## FASE 4: Estadísticas (Semana 3-4)
### Frontend
- [ ] Vista de estadísticas por jugador
- [ ] Gráficos de progreso (recharts o similar)
- [ ] Comparador de jugadores
- [ ] Panel de carga de estadísticas (moderadores)

### Backend
- [ ] API: CRUD estadísticas de partidos
- [ ] API: Calcular totales por temporada
- [ ] Sistema de importación desde Excel/CSV

## FASE 5: Ruda School - MVP (Semanas 4-6)
### Estructura
- [ ] Página de Ruda School (dashboard)
- [ ] Sidebar de módulos
- [ ] Sistema de rutas dinámicas para lecciones

### Gamificación
- [ ] Sistema de XP y niveles
- [ ] Barra de progreso
- [ ] Streaks diarios
- [ ] Medallas/Logros

### Contenido
- [ ] Crear 5-10 lecciones iniciales
- [ ] Sistema de quizzes interactivos
- [ ] Videos embebidos
- [ ] Marcado de lecciones completadas

### Progreso
- [ ] Guardar progreso en BD
- [ ] Sincronización offline/online
- [ ] Desbloqueo de niveles

## FASE 6: Panel de Administración (Semana 6)
- [ ] Dashboard de admin
- [ ] CRUD de jugadores (búsqueda, filtros)
- [ ] Gestión de cuotas masiva
- [ ] Carga masiva de estadísticas
- [ ] Gestión de contenidos de Ruda School
- [ ] Reportes: morosidad, asistencias, etc.

## FASE 7: Frontend Público (Semana 7)
- [ ] Home con video de carga
- [ ] Sección "El Club" (historia, comisión)
- [ ] Fixture/Calendario
- [ ] Galería de fotos
- [ ] Contacto
- [ ] Footer

## FASE 8: Testing y Optimización (Semana 8)
- [ ] Testing con 2-3 jugadores reales
- [ ] Responsive design (mobile-first)
- [ ] PWA (Progressive Web App)
- [ ] Optimización de imágenes
- [ ] Lighthouse score > 80
- [ ] Bug fixes

## FASE 9: Deploy y Lanzamiento (Semana 8)
- [ ] Deploy a Vercel
- [ ] Configurar dominio (si aplica)
- [ ] SSL/HTTPS
- [ ] Backup automático de BD
- [ ] Capacitación a moderadores
- [ ] Lanzamiento oficial

## POST-LANZAMIENTO
- [ ] Monitorear uso
- [ ] Feedback de usuarios
- [ ] Agregar más contenido a Ruda School
- [ ] Nuevas funcionalidades (chat, notificaciones push)

## PRIORIDADES
### MUST HAVE (Semanas 1-4)
- Auth y perfiles
- Cuotas con privacidad
- Estadísticas básicas

### SHOULD HAVE (Semanas 4-6)
- Ruda School MVP
- Panel de admin completo

### NICE TO HAVE (Semanas 6-8)
- PWA
- Gamificación avanzada
- Notificaciones push
