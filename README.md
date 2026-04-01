# 🏉 Ruda Macho Rugby Club - Sitio Web Oficial

[![Deploy Status](https://api.netlify.com/api/v1/badges/cf633968-0df0-43d8-94f3-1a61769ddff8/deploy-status)](https://rudamachorugby.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)

## 📍 Sitio en Producción

**URL:** https://rudamachorugby.netlify.app

---

## 📋 Índice

- [Visión General](#visión-general)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Base de Datos](#base-de-datos)
- [Seguridad](#seguridad)
- [Deployment](#deployment)
- [Créditos](#créditos)

---

## 🎯 Visión General

Plataforma web completa para **Ruda Macho Rugby Club**, el primer club de rugby inclusivo de Argentina. El sitio incluye:

- **Sitio público** con información del club
- **Sistema de autenticación** para jugadores
- **Perfiles de usuario** con foto y estadísticas
- **Ruda School** - Plataforma de aprendizaje gamificada
- **Sistema de asistencia** con QR
- **Ruda TV** - Streaming y contenido multimedia
- **Panel de administración** para gestión

---

## ✨ Funcionalidades

### Sitio Público
- 🏠 **Home** - Hero animado, información del club, Quick Stats
- 📖 **Quiénes Somos** - Historia, valores, comisión directiva
- 📺 **Ruda TV** - Videos y contenido multimedia
- 🎬 **Streaming** - Transmisiones en vivo
- 📚 **Ruda School** - Plataforma de aprendizaje gamificado
- 📞 **Contacto** - Ubicación con Google Maps

### Sistema de Usuarios
- 🔐 **Autenticación** - Email/contraseña + Google OAuth
- 👤 **Perfiles** - Foto, posición, categoría, contacto
- 📊 **Estadísticas** - Progreso en Ruda School
- 🎫 **Sistema de asistencia** - QR para entrenamientos

### Panel Admin
- 📋 **Gestión de asistencia** - QR scanner, historial
- 👥 **Gestión de jugadores** - CRUD completo
- 📈 **Dashboard** - Métricas y reportes

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| [Next.js](https://nextjs.org/) | 14.0.4 | Framework React con App Router |
| [React](https://react.dev/) | 18.x | UI Library |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x | Estilos y diseño responsive |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Tipado estático |

### Backend & Infraestructura
| Tecnología | Propósito |
|------------|-----------|
| [Supabase](https://supabase.com/) | Base de datos PostgreSQL + Auth + Storage |
| [Netlify](https://netlify.com/) | Hosting y deploy continuo |

### Características Adicionales
- **PWA (Progressive Web App)** - Instalable en móviles
- **Responsive Design** - Adaptado para todos los dispositivos
- **SEO Optimizado** - Meta tags y estructura semántica

---

## 📁 Estructura del Proyecto

```
ruda-rugby-website/
├── app/                    # App Router (Next.js 14)
│   ├── admin/              # Panel de administración
│   │   └── asistencia/     # Gestión de asistencia
│   ├── api/                # API Routes
│   ├── asistencias/        # Vista de asistencia
│   ├── auth/               # Callback OAuth
│   ├── completar-perfil/   # Onboarding
│   ├── components/         # Componentes compartidos
│   ├── login/              # Inicio de sesión
│   ├── perfil/             # Perfil de usuario
│   ├── registro/           # Registro de usuarios
│   ├── registro-rapido/     # Registro con QR
│   ├── ruda-school/        # Plataforma educativa
│   ├── ruda-tv/            # Contenido multimedia
│   ├── sections/           # Secciones públicas
│   ├── streaming/          # Transmisiones
│   └── test-images/        # Testing
├── components/             # Componentes reutilizables
├── contexts/               # React Contexts (Auth, Theme)
├── public/                 # Archivos estáticos
│   ├── assets/             # Imágenes y media
│   ├── icons/              # PWA icons
│   └── manifest.json       # PWA manifest
├── scripts/                # Scripts de utilidad
├── supabase/               # Configuración Supabase
└── styles/                 # Estilos globales
```

---

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta en Supabase
- Cuenta en Netlify (para deploy)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/hiroxtime/ruda-macho-website.git
cd ruda-macho-website

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env.local con:
# NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
# SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir http://localhost:3000
```

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (localhost:3000) |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar build de producción |
| `npm run lint` | Linting con ESLint |
| `netlify deploy --prod` | Deploy a producción |

---

## 🗄️ Base de Datos

### Tablas Principales

#### `perfiles`
Información de usuario extendida (nombre, posición, foto, etc.)

#### `asistencias`
Registro de asistencia a entrenamientos

#### `registros_rapidos`
Códigos QR temporales para registro

#### `rudaschool_progreso`
Progreso de usuarios en Ruda School

### Seguridad (RLS)

Todas las tablas tienen **Row Level Security (RLS)** habilitado:

- Los usuarios solo pueden ver/editar **sus propios datos**
- Los administradores tienen acceso completo
- Las políticas están definidas en `supabase/` o en scripts SQL

Ver sección de [Seguridad](#seguridad) para más detalles.

---

## 🔒 Seguridad

### Autenticación
- **Supabase Auth** con Row Level Security
- Password hasheado con bcrypt
- Sesiones seguras con JWT
- OAuth con Google

### Row Level Security (RLS)
```sql
-- Ejemplo de política RLS
CREATE POLICY "Usuarios pueden ver su propio perfil"
ON perfiles FOR SELECT
USING (auth.uid() = id);
```

### Variables de Entorno
Las credenciales sensibles están en `.env.local` (no commiteado):

```env
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### Buenas Prácticas Implementadas
- ✅ Sin credenciales hardcodeadas
- ✅ Sin keys de API en el frontend (usar Service Role solo en API routes)
- ✅ Validación de datos en Supabase
- ✅ Protección CSRF nativa de Next.js
- ✅ Headers de seguridad configurados

---

## 🚢 Deployment

### Netlify (Recomendado)

El proyecto está configurado para deploy automático en Netlify:

1. **Conectar repo:** Netlify detecta automáticamente Next.js
2. **Variables de entorno:** Configurar en Netlify Dashboard
3. **Deploy automático:** Cada push a `master` dispara un nuevo deploy

### Comandos de Deploy

```bash
# Deploy a producción
netlify deploy --prod

# Preview deploy
netlify deploy
```

### URLs del Proyecto

| Ambiente | URL |
|----------|-----|
| Producción | https://rudamachorugby.netlify.app |
| Netlify Dashboard | https://app.netlify.com/projects/rudamachorugby |

---

## 📱 PWA (Progressive Web App)

El sitio es instalable como aplicación nativa:

- **iOS:** Safari → Compartir → Agregar a pantalla de inicio
- **Android:** Chrome → Menú → Agregar a pantalla de inicio
- **Desktop:** Chrome → Instalar aplicación

### Manifest
- Iconos: 72x72 a 512x512 px
- Tema: Verde Ruda (#1B5E20)
- Display: Standalone

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Verde Ruda | `#1B5E20` | Color principal |
| Dorado | `#FFC107` | Acentos y CTA |
| Negro | `#0D0D0D` | Fondo oscuro |
| Blanco | `#FFFFFF` | Texto claro |

---

## 👥 Comisión Directiva

| Nombre | Cargo |
|--------|-------|
| Fabián Luciano Fretti | Presidente |
| Eduardo Gusa del Valle | Miembro Fundador |
| Gustavo Yaquers | Manager |
| Agustín Gómez | Secretario |

---

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

Este proyecto es de uso interno para **Ruda Macho Rugby Club**.

---

## 📞 Contacto

- **Instagram:** [@rudamachorugby](https://instagram.com/rudamachorugby)
- **Email:** rudamachorugby@gmail.com
- **Ubicación:** Av. Pres. Figueroa Alcorta 6600, CABA, Argentina
- **Entrenamientos:** Miércoles y Jueves 20:30

---

**Nuestra lucha es jugando.** 💚🟡