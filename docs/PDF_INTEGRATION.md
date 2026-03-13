# Integración de Documentos PDF en la Web

## Objetivo
Permitir que los usuarios vean los documentos PDF directamente en la web (Ruda School) sin necesidad de descargarlos.

## Soluciones Técnicas

### Opción 1: PDF.js (Recomendada)
Usar Mozilla PDF.js para renderizar PDFs en el navegador.

**Instalación:**
```bash
npm install pdfjs-dist
```

**Uso básico:**
```tsx
import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export function PDFViewer({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPDF = async () => {
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: context!, viewport }).promise;
    };
    renderPDF();
  }, [url]);

  return <canvas ref={canvasRef} className="w-full" />;
}
```

**Pros:**
- Renderizado nativo en canvas
- Navegación por páginas
- Zoom y scroll
- Compatible con React/Next.js

**Contras:**
- Archivo worker puede ser pesado
- Requiere configuración adicional

---

### Opción 2: iframe con Google Docs Viewer
Solución simple sin instalar nada.

```tsx
export function PDFViewer({ url }: { url: string }) {
  const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
  
  return (
    <iframe
      src={viewerUrl}
      className="w-full h-[600px] border-0"
      title="PDF Viewer"
    />
  );
}
```

**Pros:**
- Fácil de implementar
- Interfaz familiar
- Funciona en todos los navegadores

**Contras:**
- Depende de Google (no funciona offline)
- Puede tener limitaciones de visualización
- No es tan "nativo" de la app

---

### Opción 3: react-pdf
Librería React específica para PDFs.

**Instalación:**
```bash
npm install react-pdf
```

**Uso:**
```tsx
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

export function PDFViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Página {pageNumber} de {numPages}
      </p>
    </div>
  );
}
```

**Pros:**
- Específico para React
- Componentes listos para usar
- Navegación fácil

**Contras:**
- Bundle size más grande
- Puede requerir configuración de worker

---

## Recomendación para Ruda School

### Para el MVP (Fase 1):
Usar **iframe con Google Docs Viewer** — rápido de implementar, funcional inmediatamente.

### Para Producción (Fase 2):
Migrar a **PDF.js** o **react-pdf** para mejor control visual y experiencia de usuario.

---

## Implementación en Ruda School

### Estructura Propuesta

Cada lección puede tener:
1. **Video introductorio** (YouTube embebido o archivo propio)
2. **Contenido web** (HTML/React propio, reinterpretado del PDF)
3. **PDF de referencia** (visualizable inline)
4. **Quiz** para evaluar comprensión

### Ejemplo de Lección con PDF

```tsx
// Lección: "Fundamentos del Rugby"
export default function FundamentosLesson() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ruda-green mb-4">
        Fundamentos del Rugby
      </h1>
      
      {/* Video introductorio */}
      <VideoPlayer url="/videos/fundamentos-intro.mp4" />
      
      {/* Contenido propio resumido */}
      <div className="my-6 prose">
        <h2>¿Qué es el Rugby?</h2>
        <p>Contenido reinterpretado del PDF para adultos...</p>
        
        <h2>Historia Breve</h2>
        <p>Origen en Rugby School, Inglaterra...</p>
      </div>
      
      {/* PDF de referencia */}
      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">Material de Referencia</h3>
        <PDFViewer url="/assets/Rugby con Luca - dossier.pdf" />
      </div>
      
      {/* Quiz */}
      <Quiz 
        questions={[
          {
            question: "¿Cuántos jugadores hay en cancha?",
            options: ["11", "15", "22", "7"],
            correct: 1
          }
        ]}
      />
    </div>
  );
}
```

---

## Conversión de PDF a Contenido Web

### Estrategia Recomendada

No mostrar el PDF crudo. En su lugar:

1. **Extraer el contenido** del PDF
2. **Reinterpretarlo** para adultos (lenguaje directo, sin infantilismos)
3. **Dividirlo** en lecciones de 5-10 minutos
4. **Enriquecerlo** con:
   - Videos cortos
   - Diagramas interactivos
   - Quizzes
   - Ejercicios prácticos

5. **El PDF original** se mantiene como "Material de Referencia" al final de cada lección

### Ejemplo de Reinterpretación

**Original (PDF infantil/juvenil):**
> "El rugby es un deporte de equipo muy divertido donde todos colaboran..."

**Reinterpretado (adultos 20-40):**
> "El rugby es deporte de contacto total. 15 vs 15. No hay equipamiento de protección. El objetivo es simple: llevar la pelota al try del rival. La colaboración no es opcional — es supervivencia."

---

## Próximos Pasos

1. **Elegir librería** (recomendado: react-pdf para React)
2. **Instalar y configurar** en el proyecto
3. **Crear componente** PDFViewer reutilizable
4. **Extraer contenido** de los PDFs existentes
5. **Crear lecciones** reinterpretadas
6. **Agregar los PDFs** como material de referencia

## Notas

- Los PDFs deben estar en `/public/assets/` para que sean accesibles
- Considerar compresión si los PDFs son muy grandes
- Para contenido educativo extensivo, mejor crear HTML propio que mostrar PDFs largos
- Los PDFs son buenos como "material descargable" de respaldo
