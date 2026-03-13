# Paleta de Colores - Ruda Rugby Club

## Colores Primarios (Basados en camiseta del equipo)

### Verde Principal
- **Nombre:** Ruda Green
- **Hex:** #1B5E20
- **RGB:** rgb(27, 94, 32)
- **Uso:** Header, botones primarios, énfasis principal

### Amarillo/Dorado Principal
- **Nombre:** Ruda Gold
- **Hex:** #FFC107
- **RGB:** rgb(255, 193, 7)
- **Uso:** Botones CTA, acentos, highlights, iconos importantes

## Colores Secundarios

### Verde Oscuro (Fondos)
- **Nombre:** Forest Dark
- **Hex:** #0D3320
- **RGB:** rgb(13, 51, 32)
- **Uso:** Fondos oscuros, modo oscuro, contraste

### Verde Claro (Hover/Estados)
- **Nombre:** Light Green
- **Hex:** #4CAF50
- **RGB:** rgb(76, 175, 80)
- **Uso:** Hover states, badges, indicadores de éxito

### Amarillo Claro
- **Nombre:** Light Gold
- **Hex:** #FFD54F
- **RGB:** rgb(255, 213, 79)
- **Uso:** Hover en botones dorados, destacados suaves

## Colores de Soporte

### Negro/Texto
- **Nombre:** Rugby Black
- **Hex:** #1A1A1A
- **RGB:** rgb(26, 26, 26)
- **Uso:** Texto principal, títulos

### Gris Oscuro
- **Nombre:** Dark Gray
- **Hex:** #424242
- **RGB:** rgb(66, 66, 66)
- **Uso:** Texto secundario, bordes

### Gris Claro (Fondos)
- **Nombre:** Light Gray
- **Hex:** #F5F5F5
- **RGB:** rgb(245, 245, 245)
- **Uso:** Fondos de secciones, cards

### Blanco
- **Hex:** #FFFFFF
- **Uso:** Fondos limpios, texto sobre verde oscuro

## Uso en Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ruda: {
          green: '#1B5E20',
          'green-dark': '#0D3320',
          'green-light': '#4CAF50',
          gold: '#FFC107',
          'gold-light': '#FFD54F',
          black: '#1A1A1A',
        }
      }
    }
  }
}
```

## Combinaciones Recomendadas

### Header/Navbar
- Fondo: Verde Principal (#1B5E20)
- Texto: Blanco (#FFFFFF)
- Hover/Activo: Amarillo (#FFC107)

### Botones Primarios (CTA)
- Fondo: Amarillo (#FFC107)
- Texto: Negro (#1A1A1A)
- Hover: Amarillo Claro (#FFD54F)

### Botones Secundarios
- Fondo: Verde (#1B5E20)
- Texto: Blanco (#FFFFFF)
- Hover: Verde Claro (#4CAF50)

### Cards/Secciones
- Fondo: Blanco (#FFFFFF) o Gris Claro (#F5F5F5)
- Borde: Verde (#1B5E20) sutil
- Títulos: Verde Oscuro (#0D3320)

### Alertas/Estados
- Éxito: Verde Claro (#4CAF50)
- Advertencia: Amarillo (#FFC107)
- Error: Rojo (fuera de paleta, usar #D32F2F)
- Info: Azul (fuera de paleta, usar #1976D2)

## Assets Disponibles

### Video de Carga
- **Archivo:** Animación_de_Carga_Minimalista_y_Fluida.mp4
- **Uso:** Pantalla de carga/splash screen
- **Duración estimada:** ~3-5 segundos
- **Implementación:** Reproducir al inicio, fade out cuando cargue la app

### Logo
- **Archivo:** Logo Ruda Macho.png
- **Uso:** Header, favicon, footer, meta tags
- **Preferencia:** Usar sobre fondos claros o verde oscuro

## Assets Disponibles

### Logos (Confirmados - en carpeta assets/)
- **Logo Ruda Macho:** `Logo Ruda Macho.png` — Logo principal del club
- **Logo Ruda School:** `Logo Ruda School.png` — Logo de la plataforma de aprendizaje
- **Ambos logos usan:** Verde y Amarillo/Dorado (confirman la paleta)

### Video de Carga
- **Archivo:** `assets/Animación_de_Carga_Minimalista_y_Fluida.mp4`
- **Uso:** Pantalla de carga/splash screen
- **Estado:** ✅ Agregado

## Notas de Diseño

- El verde representa el campo de rugby, naturaleza, fuerza
- El amarillo/dorado representa energía, victoria, pasión
- Mantener contraste alto para accesibilidad (WCAG AA)
- Usar el amarillo con moderación (solo para CTA y destacados)
- El verde oscuro puede usarse para modo oscuro completo
