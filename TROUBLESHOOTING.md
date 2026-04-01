# TROUBLESHOOTING.md - Ruda Macho Website

> Guía de problemas comunes y soluciones encontradas durante el desarrollo.

---

## 📋 Índice

1. [Netlify Deploy](#netlify-deploy)
2. [GitHub](#github)
3. [Cache y CDN](#cache-y-cdn)
4. [PWA e Icons](#pwa-e-icons)
5. [Mobile / iOS Safari](#mobile--ios-safari)
6. [Emojis y Encoding](#emojis-y-encoding)
7. [Google Maps Embed](#google-maps-embed)
8. [Supabase / Auth](#supabase--auth)

---

## Netlify Deploy

### Error: "JSONHTTPError: Forbidden"

**Síntoma:** `netlify deploy --prod` devuelve error 403 Forbidden.

**Causas:**
1. Token de autenticación expirado
2. Cambio de cuenta de Netlify
3. Rate limiting (demasiados deploys rápidos)

**Solución:**
```bash
# 1. Desautenticar
netlify logout

# 2. Autenticar de nuevo
netlify login

# 3. Seleccionar cuenta correcta si hay múltiples
netlify switch

# 4. Verificar que el proyecto está linkeado
netlify status

# 5. Deploy
netlify deploy --prod
```

### Error: "Project not linked"

**Síntoma:** `netlify deploy` dice que no hay proyecto linkeado.

**Solución:**
```bash
# Linkear por nombre
netlify link --name rudamachorugby

# O por ID (más preciso)
netlify link --id cf633968-0df0-43d8-94f3-1a61769ddff8
```

### Deploy exitoso pero cambios no visibles

**Síntoma:** Deploy dice "Success" pero el sitio no muestra cambios.

**Causa:** Cache del navegador o CDN de Netlify.

**Solución:**
1. **URL única de deploy:** Usar la URL que genera cada deploy (ej: `https://69cc3810...--rudamachorugby.netlify.app`)
2. **Hard refresh:** `Ctrl + Shift + R` o `Cmd + Shift + R`
3. **Incógnito:** Abrir en ventana de incógnito
4. **Limpiar cookies del sitio** en configuración del navegador

**Pro tip:** Cada deploy tiene una URL única que siempre tiene el contenido más reciente.

---

## GitHub

### Dos ramas con el mismo contenido (main + master)

**Síntoma:** Push a `master` pero GitHub muestra `main` por defecto.

**Causa:** Repo creado con `master` y luego GitHub cambió a `main` como default.

**Solución:**
```bash
# 1. Cambiar a rama main
git checkout main

# 2. Fusionar master en main
git merge master

# 3. Push a main
git push origin main

# 4. Eliminar master local
git branch -d master

# 5. Eliminar master remoto
git push origin --delete master
```

### Push dice "Everything up-to-date" pero GitHub no actualiza

**Causa:** Push a rama incorrecta o desincronizada.

**Solución:**
```bash
# Verificar ramas remotas
git branch -vv
git remote show origin

# Forzar actualización
git fetch origin
git status

# Si todo está bien, forzar push
git push origin main --force
```

---

## Cache y CDN

### Cambios no se reflejan en producción

**Diagnóstico:**
```bash
# Verificar que los cambios están en el código local
cat app/page.tsx | grep "texto-nuevo"

# Verificar que el build local funciona
npm run build
npm run start
```

**Solución:**
1. Verificar que el archivo correcto está modificado
2. Usar URL única de deploy (no la principal)
3. Limpiar cache del navegador
4. Forzar deploy limpio: `Remove-Item -Recurse -Force .next; netlify deploy --prod`

---

## PWA e Icons

### Iconos PWA se ven con fondo incorrecto

**Problema:** Iconos muestran fondo verde en lugar del logo.

**Causa:** apple-touch-icon generado con fondo verde del sitio.

**Solución:**
```javascript
// scripts/generate-icons.mjs
// Usar fondo oscuro (#0D0D0D) para todos los iconos
const background = sharp({
  create: {
    width: size,
    height: size,
    channels: 4,
    background: { r: 13, g: 13, b: 13, alpha: 1 } // #0D0D0D
  }
});
```

### manifest.json no se actualiza

**Solución:**
1. Verificar que manifest.json está en `public/`
2. Verificar cache del navegador
3. Limpiar service worker: `navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()))`

---

## Mobile / iOS Safari

### Header se mueve durante scroll en iOS

**Síntoma:** Header fixed se "despega" o se mueve al hacer scroll en iPhone.

**Causa:** iOS Safari no respeta `position: fixed` durante scroll dinámico.

**Solución:**
```css
/* Cambiar de fixed a sticky */
.header {
  position: sticky;  /* no fixed */
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* En globals.css para mejor rendering */
.header {
  will-change: transform;
  transform: translateZ(0);
}

/* Body NO debe tener padding-top */
body {
  /* padding-top: 64px; <- ELIMINAR */
}
```

### Zoom no deseado en inputs

**Solución:**
```tsx
// layout.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
```

---

## Emojis y Encoding

### Emojis aparecen como "?? en código

**Síntoma:** Emojis se ven correctamente en editor pero como `??` en producción.

**Causa:** Encoding incorrecto del archivo.

**Solución:**
1. Verificar que el archivo está guardado como UTF-8
2. En VS Code: Click derecho en archivo → "Reopen with Encoding" → UTF-8
3. Si persiste, reescribir los emojis manualmente

### Función JavaScript con emojis no funciona

**Diagnóstico:**
```javascript
// Verificar que la función se define antes de usarse
// Verificar que los emojis están en string válido
function createEmoji(event, emoji) {
  console.log('Emoji recibido:', emoji); // Debe mostrar el emoji
  const el = document.createElement('div');
  el.textContent = emoji; // Funciona con emojis
}
```

---

## Google Maps Embed

### Link corto no funciona como iframe embed

**Problema:** `https://maps.app.goo.gl/xxx` NO funciona en `<iframe src="...">`.

**Causa:** Links cortos son redirecciones, no URLs de embed.

**Solución:**
1. Ir a Google Maps con el link corto
2. Click en "Compartir" → "Incorporar un mapa"
3. Copiar la URL del iframe (empieza con `https://www.google.com/maps/embed?pb=...`)

**Código correcto:**
```tsx
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.08..."
  width="100%"
  height="400"
  style={{ border: 0 }}
  allowFullScreen
/>
```

### Ubicación incorrecta en el mapa

**Solución:**
1. Abrir Google Maps y buscar la ubicación exacta
2. Click en "Compartir" → "Incorporar un mapa"
3. Copiar el iframe completo con la URL actualizada

---

## Supabase / Auth

### RLS bloquea acceso a datos

**Síntoma:** `new row violates row-level security policy`

**Causa:** Políticas RLS no permiten INSERT/UPDATE.

**Solución:**
```sql
-- Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'perfiles';

-- Agregar política de INSERT para usuarios autenticados
CREATE POLICY "usuarios_pueden_crear_perfil"
ON perfiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Agregar política de UPDATE para propio usuario
CREATE POLICY "usuarios_pueden_editar_perfil"
ON perfiles FOR UPDATE
USING (auth.uid() = id);
```

### Usuario autenticado pero perfil no carga

**Diagnóstico:**
```typescript
// Verificar que el perfil existe
const { data, error } = await supabase
  .from('perfiles')
  .select('*')
  .eq('id', user.id)
  .single();

console.log('Perfil:', data);
console.log('Error:', error);
```

**Causas comunes:**
1. Perfil no creado por trigger
2. RLS bloqueando SELECT
3. Columna `id` no coincide con `auth.uid()`

---

## 🚨 Quick Reference

| Problema | Solución rápida |
|----------|-----------------|
| Netlify 403 | `netlify logout && netlify login` |
| Cambios no visibles | Usar URL única del deploy |
| Header se mueve iOS | `position: sticky` |
| Emojis "?? | Guardar como UTF-8 |
| Maps embed no funciona | Usar URL de embed, no link corto |
| RLS error | Agregar política INSERT/UPDATE |
| GitHub no actualiza | `git push origin main --force` |
| PWA no actualiza | Network-first en service worker (v2+) |
| Formularios ilegibles | Forzar `text-gray-900 bg-white` en inputs |
| SQL con datos personales | Eliminar del repo + `git filter-branch` |

---

## 📱 PWA (Progressive Web App)

### Service Worker no actualiza cambios

**Síntoma:** PWA instalada no muestra cambios después de deploy.

**Causa:** Service worker con cache-first agresivo.

**Solución:** Usar estrategia network-first para páginas HTML:

```javascript
// sw.js - Network-first para páginas
if (event.request.mode === 'navigate') {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guardar en cache para offline
        cache.put(event.request, response.clone());
        return response;
      })
      .catch(() => caches.match(event.request))
  );
}
```

**Cache versioning:** Cambiar `CACHE_NAME` para invalidar cache anterior:

```javascript
const CACHE_NAME = 'ruda-macho-v2'; // Nuevo número = invalida cache anterior
```

---

## 🔐 Seguridad del Repositorio

### Datos personales en archivos SQL

**Problema:** Nombres de jugadores en archivos SQL commiteados.

**Solución:**
```bash
# 1. Eliminar archivos del repo
git rm --cached supabase/migrations/importar_*.sql

# 2. Actualizar .gitignore
echo "supabase/migrations/importar_*.sql" >> .gitignore

# 3. Eliminar del historial
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch supabase/migrations/importar_*.sql" \
  --prune-empty --tag-name-filter cat -- --all

# 4. Forzar push
git push origin main --force
```

### Claves NEXT_PUBLIC_* en repositorio público

**¿Es seguro?** Sí, por diseño.

- `NEXT_PUBLIC_SUPABASE_URL` → Visible en el navegador, pero protegido por RLS
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Clave pública de solo lectura
- `SUPABASE_SERVICE_ROLE_KEY` → NUNCA commitear, solo en `.env.local`

La seguridad está en las políticas RLS de Supabase, no en ocultar estas claves.

---

*Última actualización: 2026-04-01*
*Proyecto: Ruda Macho Rugby Club*