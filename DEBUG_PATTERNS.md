# Debug Patterns - Ruda Rugby Website

> Quick reference para solucionar problemas comunes en este y futuros proyectos.

---

## 🎨 Modo Oscuro (Dark Mode)

### Patrón de colores suaves para ojos:
```tsx
// Fondos
bg-white dark:bg-gray-800        // Principal
bg-gray-50 dark:bg-gray-700      // Secundario (cards, headers)
bg-gray-100 dark:bg-gray-600      // Inputs, hover states

// Textos
text-gray-900 dark:text-white     // Títulos
text-gray-600 dark:text-gray-300  // Texto normal
text-gray-500 dark:text-gray-400  // Texto secundario, placeholders

// Bordes
border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600

// Estados
bg-yellow-50 dark:bg-yellow-900/20   // Alerta suave
bg-green-50 dark:bg-green-900/20      // Éxito suave
bg-red-50 dark:bg-red-900/20           // Error suave
```

### Checklist de Dark Mode:
- [ ] Headers y navegación
- [ ] Cards y contenedores
- [ ] Inputs y formularios
- [ ] Tablas y grids
- [ ] Textos (títulos, párrafos, secundarios)
- [ ] Bordes y divisores
- [ ] Estados (hover, active, focus)
- [ ] Placeholders
- [ ] Iconos SVG con `stroke="currentColor"`

---

## 📱 Mobile/Touch Fixes

### Cursor personalizado solo en desktop:
```css
@media (hover: hover) and (pointer: fine) {
  * { cursor: url('/assets/cursor.cur'), auto !important; }
}
@media (hover: none) and (pointer: coarse) {
  * { cursor: auto !important; }
}
```

### Bloquear zoom en móvil:
```tsx
// layout.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}
```

```css
/* globals.css */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
  touch-action: pan-x pan-y;
  -webkit-text-size-adjust: 100%;
}
```

### Headers fixed + sticky = conflicto:
- ❌ NO usar `position: fixed` en header global + `position: sticky` en header interno
- ✅ Usar solo UN header fixed global, el resto sin sticky

---

## 🎥 Video Optimization

### Carga rápida de videos:
```tsx
<video
  src={videoSrc}
  autoPlay
  playsInline
  muted              // Necesario para autoplay
  preload="auto"     // Carga anticipada
  onLoadedData={() => setCargando(false)}
  onError={() => {
    setError(true);
    setCargando(false);
    setVideoTerminado(true);
  }}
/>
```

### Fallback de error:
```tsx
{error && (
  <div className="w-full h-full flex items-center justify-center bg-gray-800">
    <span className="text-4xl">🏉</span>
  </div>
)}
```

---

## ⏱️ UX Timing

### Animaciones y transiciones:
| Tipo | Duración recomendada |
|------|---------------------|
| Hover simple | 150-200ms |
| Feedback visual | 300-500ms |
| Animaciones de reacción | 2-3 segundos |
| Animaciones de carga | 3-4 segundos |
| Onboarding completo | 5-8 segundos |

- ❌ 2 segundos es muy rápido para animaciones de reacción
- ✅ 3-4 segundos permite al usuario procesar la información

---

## 🔒 RLS (Row Level Security) - Supabase

### Verificar estado RLS:
```sql
SELECT schemaname, tablename,
  CASE WHEN rowsecurity = true THEN '✅ RLS' ELSE '❌ SIN RLS' END
FROM pg_tables WHERE schemaname = 'public';
```

### Políticas comunes:
```sql
-- Usuarios ven sus propios registros
CREATE POLICY "usuarios_select_propio" ON tabla
  FOR SELECT USING (auth.uid() = user_id);

-- Admins ven todo
CREATE POLICY "admins_select_all" ON tabla
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM perfiles p
            WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador'))
  );
```

### Checklist RLS:
- [ ] Todas las tablas tienen RLS habilitado
- [ ] Políticas SELECT para usuarios propios
- [ ] Políticas SELECT para admins
- [ ] Políticas INSERT/UPDATE según corresponda
- [ ] Verificar que no haya políticas "ALLOW ALL"

---

## 🔄 Animación Una Vez por Sesión

### sessionStorage vs localStorage:
| Característica | sessionStorage | localStorage |
|----------------|---------------|--------------|
| Duración | Sesión actual | Persistente |
| Se borra al... | Cerrar pestaña | Limpiar manualmente |
| Uso típico | Onboarding, animaciones | Preferencias, dark mode |

### Implementación:
```tsx
const [isLoading, setIsLoading] = useState(true)
const [hasAnimated, setHasAnimated] = useState(false)

useEffect(() => {
  const animated = sessionStorage.getItem('mi-animacion-shown')
  if (animated === 'true') {
    setIsLoading(false)
    setHasAnimated(true)
  }
}, [])

const handleComplete = () => {
  setIsLoading(false)
  setHasAnimated(true)
  sessionStorage.setItem('mi-animacion-shown', 'true')
}
```

---

## 🛠️ Flujo de Debug

1. **Detectar error** (usuario reporta o consola)
2. **Buscar en código** con `grep` o `Select-String`
3. **Editar con oldText exacto** (copy-paste del código)
4. **Build local** para verificar sintaxis
5. **Deploy** con `netlify deploy --prod`
6. **Verificar en producción** (hard refresh: Ctrl+Shift+R)
7. **Actualizar memoria** con lecciones aprendidas

### Comandos útiles:
```powershell
# Buscar texto en archivos
Select-String -Path "app/**/*.tsx" -Pattern "texto"

# Build local
npm run build

# Deploy producción
netlify deploy --prod

# Ver logs de build
netlify deploy --prod 2>&1
```

---

## 📝 Memoria

### Archivos de memoria:
- `memory/YYYY-MM-DD.md` - Notas del día (crear cada sesión)
- `MEMORY.md` - Memoria a largo plazo (curada)
- `AGENTS.md` - Contexto del workspace
- `TOOLS.md` - Notas locales específicas

### Actualizar después de cada fix:
1. Qué problema se encontró
2. Qué solución se aplicó
3. Archivos modificados
4. Código clave o patrón utilizado
5. Lección para futuro

---

*Última actualización: 2026-03-25*