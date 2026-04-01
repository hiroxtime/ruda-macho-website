# 🔐 Documentación de Seguridad - Ruda Macho Rugby Club

## Resumen Ejecutivo

Este documento describe las medidas de seguridad implementadas en el sitio web de Ruda Macho Rugby Club para proteger los datos de los usuarios y garantizar la integridad del sistema.

---

## 📊 Índice

1. [Arquitectura de Seguridad](#arquitectura-de-seguridad)
2. [Autenticación](#autenticación)
3. [Autorización (RLS)](#autorización-rls)
4. [Protección de Datos](#protección-de-datos)
5. [Seguridad de Red](#seguridad-de-red)
6. [Monitoreo y Logs](#monitoreo-y-logs)
7. [Vulnerabilidades Conocidas](#vulnerabilidades-conocidas)
8. [Plan de Respuesta a Incidentes](#plan-de-respuesta-a-incidentes)
9. [Checklist de Auditoría](#checklist-de-auditoría)

---

## 🏗️ Arquitectura de Seguridad

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  - Validación de formularios                                 │
│  - Sanitización de inputs                                    │
│  - Protección CSRF                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API ROUTES (Next.js)                      │
│  - Server-side validation                                    │
│  - Rate limiting                                              │
│  - Auth middleware                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                     │
│  - Row Level Security (RLS)                                  │
│  - JWT Authentication                                        │
│  - Encriptación at-rest                                      │
│  - Backups automáticos                                       │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos Seguro

```
Usuario → HTTPS → Next.js → Supabase Client → PostgreSQL (RLS)
                                                   │
                                                   ▼
                                            Validación RLS
                                                   │
                                                   ▼
                                            Datos Autorizados
```

---

## 🔑 Autenticación

### Métodos Disponibles

| Método | Implementación | Estado |
|--------|----------------|--------|
| Email/Password | Supabase Auth | ✅ Activo |
| Magic Link | ~~Supabase Auth~~ | ❌ Deshabilitado |

### Política de Contraseñas

- **Longitud mínima:** 8 caracteres
- **Complejidad:** Recomendada pero no forzada
- **Hash:** bcrypt (Supabase lo maneja automáticamente)
- **Reset:** Vía email con enlace temporal (1 hora de validez)

### Sesiones

```javascript
// Configuración de sesión
{
  jwt: {
    expiresIn: '7d',           // Expira en 7 días
    refreshEnabled: true,       // Refresh automático
    secureCookies: true,       // Solo HTTPS
    sameSite: 'lax'            // Protección CSRF
  }
}
```

### Implementación

```typescript
// contexts/AuthContext.tsx
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // Manejo seguro de errores
};
```

---

## 🛡️ Autorización (RLS)

### Row Level Security (Seguridad a Nivel de Fila)

Todas las tablas sensibles tienen RLS habilitado. Las políticas definen qué datos puede ver/modificar cada usuario.

### Tablas con RLS

| Tabla | Políticas |
|-------|-----------|
| `perfiles` | ✅ Usuarios ven solo su perfil |
| `asistencias` | ✅ Usuarios ven propias, admins ven todas |
| `registros_rapidos` | ✅ Solo admins pueden crear |
| `rudaschool_progreso` | ✅ Usuarios ven su progreso |

### Políticas Implementadas

#### Ejemplo: Tabla `perfiles`

```sql
-- Política: Solo el propio usuario puede ver su perfil
CREATE POLICY "perfiles_select_own"
ON perfiles FOR SELECT
USING (auth.uid() = id);

-- Política: Solo el propio usuario puede actualizar su perfil
CREATE POLICY "perfiles_update_own"
ON perfiles FOR UPDATE
USING (auth.uid() = id);

-- Política: Admins pueden ver todos los perfiles
CREATE POLICY "perfiles_admin_all"
ON perfiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM perfiles
    WHERE id = auth.uid() AND rol = 'admin'
  )
);
```

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| `usuario` | Ver/editar propio perfil, ver propia asistencia |
| `admin` | Acceso completo a gestión |
| `jugador` | Equivalente a `usuario` |

---

## 🔒 Protección de Datos

### Datos Sensibles

| Tipo | Almacenamiento | Acceso |
|------|----------------|--------|
| Contraseñas | Hash bcrypt (Supabase) | Nunca expuesto |
| Emails | PostgreSQL | Solo usuario y admins |
| Fotos | Supabase Storage | Público (perfiles) |
| Historial asistencias | PostgreSQL | Solo usuario y admins |

### Encriptación

- **At-rest:** PostgreSQL encripta datos en disco
- **In-transit:** TLS 1.3 en todas las conexiones
- **Backups:** Encriptados por Supabase

### Variables de Entorno

```env
# Archivo: .env.local (NO commitear)

# Público (visible en frontend)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...

# Privado (solo server-side)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJ...
```

⚠️ **Importante:** `SUPABASE_SERVICE_ROLE_KEY` solo se usa en API routes, nunca en el cliente.

---

## 🌐 Seguridad de Red

### Headers de Seguridad

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### CORS

Configurado en Supabase para permitir solo:
- `https://rudamachorugby.netlify.app`
- `http://localhost:3000` (desarrollo)

### Rate Limiting

- Implementado a nivel de Supabase
- Límite: 100 requests/minuto por usuario
- Protección contra abuso

---

## 📝 Monitoreo y Logs

### Logs de Supabase

- Acceso al dashboard: `app.supabase.com`
- Logs disponibles: Auth, Database, Storage, API

### Eventos Monitoreados

| Evento | Alerta |
|--------|--------|
| Múltiples intentos de login fallidos | ⚠️ Revisar |
| Acceso desde IPs inusuales | ℹ️ Info |
| Modificación de roles | 🚨 Alerta alta |
| Acceso admin | ℹ️ Info |

### Retención de Logs

- Logs de auth: 30 días
- Logs de database: 7 días
- Logs de API: 7 días

---

## ⚠️ Vulnerabilidades Conocidas

### Sin Vulnerabilidades Críticas Detectadas

### Riesgos Menores

1. **Email público en perfiles:** Por diseño, los emails son visibles para miembros del club.
   - **Mitigación:** Solo usuarios autenticados pueden ver perfiles.

2. **Fotos públicas:** Las fotos de perfil son accesibles vía URL.
   - **Mitigación:** URLs aleatorias, no indexadas.

---

## 🚨 Plan de Respuesta a Incidentes

### En Caso de Brecha de Seguridad

1. **Detectar:** Revisar logs de Supabase
2. **Contener:** Desactivar cuentas comprometidas
3. **Notificar:** Informar a administración
4. **Remediar:** Cambiar claves, restaurar backups
5. **Documentar:** Registrar incidente y lecciones

### Contactos de Emergencia

- **Lead Técnico:** [Contactar a administración]
- **Supabase Support:** `support@supabase.com`

---

## ✅ Checklist de Auditoría

Use esta lista para revisar la seguridad del sistema:

### Autenticación
- [x] Contraseñas hasheadas con bcrypt
- [x] Sesiones con expiración (7 días)
- [x] Refresh tokens habilitados
- [x] Logout funcional
- [x] OAuth con proveedores confiables (Google)

### Autorización
- [x] RLS habilitado en todas las tablas sensibles
- [x] Políticas de acceso mínimas necesarias
- [x] Roles diferenciados (usuario/admin)
- [x] Sin acceso sin autenticación (excepto rutas públicas)

### Datos
- [x] Sin credenciales hardcodeadas
- [x] Variables de entorno seguras
- [x] HTTPS obligatorio
- [x] Inputs sanitizados
- [x] SQL Injection protegido por Supabase

### Red
- [x] Headers de seguridad configurados
- [x] CORS restringido
- [x] Rate limiting activo
- [x] Sin endpoints innecesarios expuestos

### Monitoreo
- [x] Logs activos en Supabase
- [x] Acceso al dashboard disponible
- [x] Alertas configuradas (manual)

### Backup
- [x] Backups automáticos de Supabase
- [x] Punto de restauración disponible
- [x] Procedimiento de restore documentado

---

## 📋 Dependencias y Vulnerabilidades

### Auditoría de Dependencias

```bash
# Ejecutar auditoría
npm audit

# Resultado esperado: 0 vulnerabilidades críticas
```

### Dependencias Principales

| Paquete | Versión | Vulnerabilidades |
|---------|---------|------------------|
| next | 14.0.4 | ✅ Ninguna |
| react | 18.x | ✅ Ninguna |
| @supabase/supabase-js | 2.x | ✅ Ninguna |

### Actualización de Dependencias

```bash
# Verificar actualizaciones
npm outdated

# Actualizar dependencias
npm update

# Actualizar dependencias de seguridad
npm audit fix
```

---

## 📞 Soporte

Para preguntas sobre seguridad o reportar vulnerabilidades:

- **Email:** rudamachorugby@gmail.com
- **Documentación:** Este archivo y README.md
- **Supabase:** https://supabase.com/docs

---

**Última actualización:** Abril 2026
**Revisado por:** Equipo de desarrollo de Ruda Macho Rugby Club