'use client'

import Link from 'next/link'
import { useState } from 'react'

const secciones = [
  {
    id: 'historia',
    titulo: '📜 Historia y Espíritu del Rugby',
    icono: '🏉',
    xp: 15,
    contenido: `
## El Origen Legendario

<div class="flex flex-col md:flex-row gap-6 items-start mb-6">
  <div class="w-full md:w-2/5">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Webb_Ellis_Statue_-_Rugby_School.jpg/640px-Webb_Ellis_Statue_-_Rugby_School.jpg"
      alt="Estatua de William Webb Ellis en Rugby School"
      class="w-full rounded-xl border-2 border-ruda-gold/30 shadow-lg"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
    />
    <div style="display:none" class="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-6 text-center">
      <div class="text-6xl mb-4">🏃‍♂️🏉</div>
      <h4 class="text-amber-900 font-black text-lg">William Webb Ellis</h4>
    </div>
    <p class="text-xs text-gray-500 mt-2 text-center italic">Estatua en Rugby School, Inglaterra</p>
  </div>
  <div class="flex-1">
    <p class="mb-4">Cuenta la leyenda que en <strong>1823</strong>, durante un partido de fútbol en un colegio de la ciudad de <strong>Rugby, Inglaterra</strong>, un joven llamado <strong>William Webb Ellis</strong> levantó la pelota y corrió hacia la línea de meta oponente.</p>
    
    <div class="bg-ruda-gold/10 border-l-4 border-ruda-gold p-4 rounded-r-lg mb-4">
      <p class="text-ruda-gold font-bold italic">"Con un desprecio despreocupado por las reglas del fútbol, como se jugaba en su tiempo, tomó primero la pelota en sus brazos y corrió con ella..."</p>
      <p class="text-gray-400 text-sm mt-2">— Placa conmemorativa, Rugby School</p>
    </div>
    
    <p>Este acto rebelde, aunque históricamente discutido, dio origen a la leyenda del rugby. Lo cierto es que en la <strong>Rugby School</strong> se desarrolló un nuevo estilo de juego que permitía tomar la pelota con las manos.</p>
  </div>
</div>

### ¿Mito o Realidad?

Aunque la historia de Webb Ellis es probablemente un <strong>mito de origen</strong> (no hay evidencia directa del evento), representa perfectamente el espíritu del rugby:

- **Innovación**: Romper las reglas para crear algo nuevo
- **Valentía**: Arriesgarse a ser diferente  
- **Pasión**: Jugar con el corazón antes que con la cabeza

### La Expansión del Rugby

**1845**: Primer reglamento escrito en Rugby School  
**1871**: Fundación de la Rugby Football Union (RFU) en Inglaterra  
**1900**: Rugby en los Juegos Olímpicos de París  
**1987**: Primera Copa del Mundo de Rugby (Nueva Zelanda)  
**1995**: El rugby se vuelve profesional  
**2023**: 200 años de la leyenda de Webb Ellis

### El Rugby en Argentina

El rugby llegó a Argentina en el <strong>siglo XIX</strong> con inmigrantes británicos. La Unión Argentina de Rugby (UAR) se fundó en **1899**, siendo una de las más antiguas del mundo. Hoy somos potencia mundial, con los Pumas entre los mejores equipos del planeta.

---

## El Espíritu del Rugby

El rugby no solo se juega ajustándose a las Leyes, sino también dentro del <strong>espíritu de las Leyes</strong>. Esto significa:

### 🤝 Respeto mutuo
- Antes del partido, nos saludamos
- Después del partido, compartimos un trago con el rival
- El árbitro se llama "señor" o "señora"

### ⚖️ Integridad
- No simulamos faltas
- No discutimos las decisiones
- Jugamos limpio, siempre

### 💪 Disciplina
- Control emocional en todo momento
- Cumplimiento de las normas
- Compromiso con el equipo

### 🔥 Pasión
- Dar el 100% en cada entrenamiento
- Defender los colores con orgullo
- Disfrutar cada momento en la cancha

### ❤️ Solidaridad
- El compañero es lo primero
- Todos somos iguales en el vestuario
- "Un equipo, una familia"

---

> 🏆 <strong>El Trofeo Webb Ellis</strong> es el nombre de la Copa del Mundo de Rugby, entregado cada 4 años al campeón mundial. Representa el legado de ese joven que, con un simple acto de rebeldía, creó uno de los deportes más hermosos del mundo.
    `
  },
  {
    id: 'valores',
    titulo: '💎 Los 5 Valores del Rugby',
    icono: '✋',
    xp: 15,
    contenido: `
## Valores de World Rugby

En <strong>2009</strong>, las Uniones miembro de World Rugby formalizaron los valores que definen nuestro deporte:

---

### 1. Integridad ⚖️

<strong>Definición:</strong> Honestidad, rectitud y coherencia entre lo que se piensa, se dice y se hace.

**En la cancha:**
- No hacemos trampas
- No simulamos faltas
- Aceptamos las decisiones del árbitro

**En Ruda Macho:**
- "Ganamos limpio o perdemos con honor. No hay otra forma."

---

### 2. Pasión 🔥

<strong>Definición:</strong> Emoción intensa que nos impulsa a dar lo mejor de nosotros.

**En la cancha:**
- Entrenamos con la misma intensidad que jugamos
- Defendemos cada balón como si fuera el último
- Celebramos los tries de nuestros compañeros

**En Ruda Macho:**
- "Nuestra lucha es jugando" — lo damos todo en cada entrenamiento del miércoles.

---

### 3. Solidaridad 🤝

<strong>Definición:</strong> Unión y apoyo mutuo entre los miembros de un grupo.

**En la cancha:**
- El que llega primero ayuda al último
- No dejamos solo a un compañero en el tackle
- Todos cargamos las bolsas después del entreno

**En Ruda Macho:**
- Somos familia. El vestuario es sagrado.

---

### 4. Disciplina 📋

<strong>Definición:</strong> Autocontrol, orden y cumplimiento de las normas.

**En la cancha:**
- Llegamos a tiempo a los entrenamientos
- Respetamos el silencio cuando habla el capitán
- Solo el capitán habla con el árbitro

**En Ruda Macho:**
- "La disciplina es el puente entre las metas y los logros."

---

### 5. Respeto 🙏

<strong>Definición:</strong> Reconocimiento del valor de las personas y las instituciones.

**En la cancha:**
- Respetamos al rival (sin ellos no hay partido)
- Respetamos al árbitro (su autoridad es absoluta)
- Respetamos el juego (su espíritu nos une)

**En Ruda Macho:**
- Antes y después del partido, todos somos amigos.

---

## Aplicación Práctica

| Situación | Valor aplicado |
|-----------|----------------|
| Un rival cae al suelo | Solidaridad — Lo ayudamos a levantarse |
| El árbitro cobra en contra | Respeto — Aceptamos sin discutir |
| Un compañero hace un error | Integridad — Lo apoyamos, no lo criticamos |
| Podemos hacer una falta y no nos ven | Integridad — No la hacemos |
| Entrenamiento cansador | Pasión — Damos el 100% igual |
| Llegar tarde al entreno | Disciplina — Llegamos 15 min antes |

---

### 📜 El Documento del Juego

World Rugby creó el <strong>Documento del Juego</strong> para garantizar que el rugby mantenga su carácter único. Todos los jugadores, entrenadores, árbitros y aficionados deberían conocerlo y vivirlo.

> "El rugby es un juego que se juega con el corazón, pero también con la cabeza y el alma."
    `
  },
  {
    id: 'evolucion',
    titulo: '📈 Evolución del Rugby',
    icono: '📊',
    xp: 15,
    contenido: `
## Hitos Históricos del Rugby

### 🏫 1845 — Primer Reglamento
Los estudiantes de la Rugby School formalizaron las primeras reglas escritas. El juego comenzaba a diferenciarse del fútbol soccer.

**Cambios clave:**
- Se permitía tomar la pelota con las manos
- Se podía correr con ella
- No se podía pasar hacia adelante

---

### 🏛️ 1871 — Rugby Football Union (RFU)
La fundación de la RFU en Inglaterra marcó el inicio de la organización moderna del rugby.

**Logros importantes:**
- Unificación de reglas para todos los clubes
- Primera selección nacional (Inglaterra vs. Escocia)
- Estandarización del número de jugadores (15)

---

### 🌍 Siglo XX — Expansión Internacional
El rugby se expandió por todo el mundo, especialmente en países del Commonwealth.

**Países que adoptaron el rugby:**
- 🇳🇿 Nueva Zelanda (All Blacks, 1903)
- 🇿🇦 Sudáfrica (Springboks, 1906)
- 🇦🇺 Australia (Wallabies, 1908)
- 🇫🇷 Francia (1906)
- 🇦🇷 Argentina (Pumas, 1910)

---

### 💰 1995 — Era Profesional
La abolición del amateurismo transformó el rugby para siempre.

**Antes (Amateurismo):**
- Jugadores no cobraban
- Se valoraba el "espíritu del juego"
- Difícil competir contra el rugby league

**Después (Profesionalismo):**
- Jugadores pueden vivir del rugby
- Mayor inversión en instalaciones
- Mejor calidad de juego
- Rugby más espectacular

**Jugadores icónicos de la era profesional:**
- Jonah Lomu (Nueva Zelanda)
- Martin Johnson (Inglaterra)
- Richie McCaw (Nueva Zelanda)
- Agustín Pichot (Argentina)

---

### 🔬 Rugby Moderno

Hoy el rugby combina:
- **Fuerza física**: Entrenamiento de élite
- **Estrategia**: Análisis táctico avanzado
- **Tecnología**: TMO (Television Match Official)
- **Seguridad**: Protocolos de conmoción cerebral

**Innovaciones recientes:**
- 🎥 TMO para tries y tarjetas
- 🧠 Protocolos de conmoción cerebral
- 📊 Análisis de datos en tiempo real
- 🏥 Cuidado integral del jugador

---

## Rugby en Números

| Dato | Cifra |
|------|-------|
| Países afiliados a World Rugby | 128 |
| Jugadores registrados en el mundo | 10+ millones |
| Espectadores de la Copa del Mundo 2019 | 857 millones |
| Años de historia | 200+ |
| Valor económico mundial | Miles de millones USD |
    `
  },
  {
    id: 'objetivo',
    titulo: '🎯 Objetivo del Juego',
    icono: '🏆',
    xp: 10,
    contenido: `
## ¿Cómo se juega al Rugby?

### El Propósito

Llevar la pelota más allá de la <strong>línea de try contraria</strong> y apoyarla en el suelo (<strong>try</strong>), o patearla entre los postes.

---

### Duración del Partido

- **80 minutos** totales
- Dos tiempos de **40 minutos** cada uno
- Descanso de **10 minutos** al medio tiempo
- Gana el equipo que suma más puntos

**¿Qué pasa si hay empate?**
- En fase regular: Empate
- En eliminatorias: Tiempo extra (20 min), muerte súbita, o sorteo

---

### Elementos del Juego

**La pelota:**
- Forma ovalada (prolate spheroid)
- Longitud: 280-300 mm
- Circunferencia: 740-770 mm
- Peso: 410-460 gramos

**La cancha:**
- Largo: 100 metros (entre try zones)
- Ancho: 70 metros
- Zonas de try: 10 metros cada una
- Postes: Altura mínima 3.4 metros

**Los jugadores:**
- 15 jugadores por equipo (Rugby XV)
- 8 reservas (sustitutos)
- 1 capitán por equipo

---

### Conceptos Básicos

**📍 Posesión:**
El equipo que tiene la pelota está atacando.

**🛡️ Defensa:**
El equipo sin la pelota intenta recuperarla mediante tackles.

**🔄 Cambio de posesión:**
- Cuando se comete una falta
- Cuando la pelota sale del campo
- Cuando se marca un try o se patea

---

> 💡 <strong>Dato clave:</strong> En rugby, a diferencia del fútbol, el juego no se detiene cuando un jugador cae. El tackle es parte del juego, y desde ahí se forman los rucks y mauls.
    `
  },
  {
    id: 'puntuacion',
    titulo: '🏆 Sistema de Puntuación',
    icono: '📊',
    xp: 15,
    contenido: `
## Formas de Puntuar en Rugby

| Acción | Puntos | Descripción | ¿Cuándo usarla? |
|--------|--------|-------------|-----------------|
| 🏉 **Try** | **5** | Apoyar la pelota en el "in-goal" rival | Cuando superamos la defensa |
| 🦶 **Conversión** | **2** | Patada a los postes después de try | Siempre tras un try |
| 🚩 **Penal** | **3** | Patada tras falta grave del rival | Cuando tenemos buena posición |
| ⚡ **Drop Goal** | **3** | Patada de sobrepique en juego | Últimos minutos o no avanzamos |

---

### 🏉 El Try (5 puntos)

<strong>Definición:</strong> Apoyar la pelota con presión firme en el suelo de la zona de try (in-goal) del rival.

**Reglas del try:**
- La pelota debe tocar el suelo
- Debe haber presión firme (no basta con soltarla)
- El jugador debe tener control
- Se puede marcar con una mano

**El try más famoso de la historia:**
El de Gareth Edwards para los Barbarians vs. All Blacks en 1973, considerado el mejor try de todos los tiempos.

---

### 🦶 La Conversión (2 puntos)

<strong>Definición:</strong> Patada a los postes que se ejecuta después de un try.

**Cómo se ejecuta:**
- Se coloca el balón en línea con donde se marcó el try
- Se puede usar un tee o tierra
- El jugador patea hacia los postes
- Debe pasar entre los palos y por encima del travesaño

**Estrategia:**
- Try cerca de los postes = conversión fácil
- Try en la banda = conversión difícil (ángulo)

---

### 🚩 El Penal (3 puntos)

<strong>Definición:</strong> Patada a los postes otorgada tras una infracción grave del rival.

**Opciones al cobrar un penal:**
1. **Patear al arco** (3 puntos)
2. **Patear al lateral** (ganar terreno, line-out)
3. **Tap y correr** (seguir jugando)
4. **Scrum** (formación fija)

**¿Cuándo patear al arco?**
- Estamos cerca de los postes
- Necesitamos puntos urgentemente
- No tenemos ventaja clara

---

### ⚡ El Drop Goal (3 puntos)

<strong>Definición:</strong> Patada de sobrepique durante el juego abierto.

**Características:**
- Se debe soltar el balón y patear antes de que toque el suelo
- Puede hacerse en cualquier momento del juego
- Muy usado en los últimos minutos para ganar

**Drop goals históricos:**
- Jonny Wilkinson vs. Australia, final del Mundial 2003
- Stephen Donald vs. Francia, final del Mundial 2011

---

## Estrategia de Puntuación 💡

### La Regla de Oro

> **"Siempre buscar el try primero. El try vale más que la patida."**

**¿Por qué?**
- El try demuestra dominio territorial
- Requiere superar la defensa (habilidad)
- Genera momentum para el equipo
- Try + conversión = 7 puntos (más que 2 penales)

### Matriz de Decisión

| Situación | Mejor opción |
|-----------|--------------|
| Ventaja numérica | Ir por el try |
| Últimos 5 minutos y ganamos por 1-2 puntos | Patear el drop |
| Penal frontal a 30 metros | Patear los 3 puntos |
| En las 22 del rival y el scrum es fuerte | Formar el scrum |
| Lluvia y barro | Juego cerrado, no riesgos |

---

### Comparación de Puntos

- **Try + Conversión** = 7 puntos
- **2 Penales** = 6 puntos  
- **1 Penal + 1 Drop** = 6 puntos
- **Try sin conversión** = 5 puntos

<strong>Conclusión:</strong> Un try vale más que dos penales. Siempre priorizá el try.
    `
  },
  {
    id: 'reglas',
    titulo: '📋 Reglas Fundamentales',
    icono: '📖',
    xp: 20,
    contenido: `
## Reglas Básicas de Movimiento

### ❌ Pase Adelante Prohibido

<strong>Regla:</strong> La pelota solo puede pasarse con las manos hacia atrás o hacia el costado.

**¿Qué pasa si se pasa adelante?**
- Se cobra <strong>knock-on</strong> ("as de manos")
- Se otorga un <strong>scrum</strong> al rival
- Se reinicia el juego desde donde ocurrió

**Excepciones:**
- El pase puede ir "hacia adelante" si el jugador que pasa está corriendo hacia atrás (efecto inercial)
- Un rebote adelante accidental no es knock-on si no se toca con las manos

**Consejo:** Cuando dudes, pasá hacia atrás. Mejor perder terreno que perder la posesión.

---

### 🏃 Tackle (Placaje)

<strong>Regla:</strong> Solo se puede tacklear al portador de la pelota y siempre por debajo de la línea de los hombros.

**Zonas permitidas:**
- ✅ Piernas
- ✅ Cintura  
- ✅ Pecho (pero no hombros ni cuello)

**Zonas prohibidas:**
- ❌ Cuello
- ❌ Cabeza
- ❌ Por encima de los hombros

**Sanciones por tackle alto:**
- Penal y tarjeta amarilla (advertencia)
- Tarjeta roja (expulsión) si hay contacto directo con la cabeza

**¿Qué hace el tackleado?**
1. Suelta inmediatamente la pelota
2. Intenta caer hacia atrás (no hacia adelante)
3. Rueda hacia un costado para liberar el balón

**¿Qué hace el tackleador?**
1. Suelta inmediatamente al jugador
2. Se levanta rápidamente
3. Intenta robar el balón o formar el ruck

---

### 🔄 Ruck (Raque)

<strong>Definición:</strong> Formación que ocurre cuando un jugador tackleado suelta el balón y jugadores de ambos equipos se unen sobre él.

**Reglas del ruck:**
- Debe haber al menos un jugador de cada equipo
- Los jugadores deben estar de pie
- No se puede tocar el balón con las manos
- Solo se puede entrar por el "túnel" (detrás del último pie)

**Offside en el ruck:**
- Los defensas deben estar detrás de la línea del último pie
- Entrar por el costado es penal

**Duración:** El ruck termina cuando el balón sale o cuando el árbitro ordena "use it!"

---

### 🏗️ Maul (Maul)

<strong>Definición:</strong> Formación donde el portador de la pelota es sostenido por compañeros y oponentes, pero no cae al suelo.

**Características:**
- El balón no toca el suelo
- Debe haber al menos 3 jugadores (2 defensas + 1 atacante con balón)
- Se puede avanzar empujando
- El maul puede terminar en try si cruza la línea

**Estrategia:**
- Los backs deben unirse rápidamente
- Se empuja de forma coordinada
- El portador debe proteger bien el balón

---

### 🏗️ Scrum (Melé)

<strong>Definición:</strong> Formación fija de 8 jugadores de cada equipo que se reinicia el juego tras ciertas infracciones.

**Cuándo se forma un scrum:**
- Knock-on (pase adelante)
- Forward pass
- Pelota atrapada en el ruck
- Decisiones del árbitro

**Estructura:**
- **Primera línea:** 2 pilares + 1 hooker
- **Segunda línea:** 2 locks (segundas líneas)
- **Tercera línea:** 2 flankers + 1 número 8

**Objetivo:** Empujar al rival para ganar la posesión del balón.

**En Argentina:** Las reglas de empuje en juveniles son más estrictas para evitar lesiones cervicales.

---

### 🎯 Line-out (Touch)

<strong>Definición:</strong> Formación para reiniciar el juego cuando la pelota sale por los costados.

**Cómo funciona:**
- Dos jugadores de cada equipo saltan
- Un tercero lanza la pelota por el medio
- Los saltadores intentan atraparla

**Posiciones:**
- Lanzador: Suele ser el hooker
- Saltadores: Los más altos (generalmente locks)
- Apoyo: Flankers y backs

**Variantes:**
- Lanzamiento largo (a los 5)
- Lanzamiento corto (a los 2)
- Lanzamiento al medio

---

## Infracciones Comunes

| Infracción | Descripción | Sanción |
|------------|-------------|---------|
| **Offside** | Estar por delante de la línea de la pelota/último pie | Penal |
| **Knock-on** | Dejar caer o pasar la pelota hacia adelante | Scrum rival |
| **Tackle alto** | Tacklear por encima de los hombros | Penal + tarjeta |
| **No soltar** | No liberar el balón tras ser tackleado | Penal |
| **Entrada lateral** | Entrar al ruck por el costado | Penal |
| **Cuchara** | Hacer tropezar al rival por debajo del tobillo | Penal + tarjeta |
| **Manos en ruck** | Tocar el balón con las manos en el ruck | Penal |

---

### 📍 Offside (Fuera de juego)

<strong>Definición:</strong> Estar en posición adelantada respecto a la pelota o al último pie en un ruck/maul.

**Offside en defensa:**
- Debes estar detrás de la línea de la pelota
- En el ruck, detrás del último pie
- Si estás offside, no podés participar hasta que te "on-sidees"

**Cómo volver on-side:**
- Retroceder detrás de la línea de la pelota
- Esperar a que un compañero te adelante

---

> 🧠 <strong>Consejo para principiantes:</strong> Si no estás seguro de tu posición, preguntate: "¿Estoy detrás de la pelota?" Si la respuesta es no, retrocedé. Mejor estar seguro que cometer un offside.
    `
  },
  {
    id: 'castigos',
    titulo: '⚖️ Castigos y Sanciones',
    icono: '🃏',
    xp: 15,
    contenido: `
## Sistema de Sanciones en Rugby

### 🎯 Penal (Penalidad)

<strong>Definición:</strong> Infracción que otorga al equipo rival una ventaja significativa.

**Opciones al cobrar un penal:**

1. **🏃 Seguir jugando (Ventaja)**
   - El árbitro permite que el juego continúe si hay oportunidad clara
   - Si no se aprovecha, se vuelve atrás al penal

2. **🦶 Patear al arco (3 puntos)**
   - Penal directo entre los postes
   - Desde donde ocurrió la infracción

3. **📍 Patear al lateral**
   - Gana terreno para el line-out
   - Útil cuando estás lejos de los postes

4. **🏗️ Formar un scrum**
   - Si tu scrum es fuerte
   - Para mantener la presión

5. **⚡ Tap y correr**
   - Tocar rápidamente con el pie y seguir jugando
   - Sorprender a la defensa desorganizada

**Faltas que resultan en penal:**
- Offside
- Tackle alto
- Manos en el ruck
- Retener el balón en el suelo
- Entrada lateral al ruck
- Obstrucción

---

### 🟨 Tarjeta Amarilla

<strong>Definición:</strong> Sanción temporal. El jugador sale del campo por 10 minutos.

**Situaciones que generan amarilla:**
- Tackle peligroso (cabeza/cuello)
- Offside deliberado cerca de la try line
- Infracciones repetidas
- Juego antideportivo
- Obstrucción profesional

**Consecuencias:**
- El equipo juega con 14 durante 10 minutos
- El jugador puede volver después del tiempo
- No hay sustituto durante la sanción

**Estrategia con uno menos:**
- Defender con 14 es difícil
- Priorizar la posesión del balón
- No cometer más faltas (puede venir la roja)

---

### 🟥 Tarjeta Roja

<strong>Definición:</strong> Expulsión definitiva. El jugador no puede volver al partido.

**Situaciones que generan roja:**
- Tackle directo a la cabeza con fuerza
- Agresión (golpes, patadas)
- Insultos graves al árbitro
- Faltas de juego limpio extremas
- Tarjeta amarilla + falta grave posterior

**Consecuencias:**
- El equipo juega con 14 todo el partido
- No puede ser reemplazado
- Puede haber sanciones posteriores (fechas de suspensión)

**Casos famosos:**
- 1995: Jonah Lomu no fue expulsado nunca (leyenda)
- 2019: Varias tarjetas rojas en el Mundial por tackles altos

---

### ⚠️ Ventaja (Advantage)

<strong>Definición:</strong> El árbitro permite que el juego continúe si el equipo afectado tiene oportunidad de ganar ventaja.

**Tipos de ventaja:**

1. **Ventaja territorial**
   - El equipo avanza más metros que si se cobrara el penal

2. **Ventaja de posesión**
   - El equipo mantiene el balón cuando podría perderlo

3. **Ventaja táctica**
   - Se crea una oportunidad de try

**Señales del árbitro:**
- Brazo extendido hacia el equipo con ventaja
- Grita "Advantage!" o "¡Ventaja!"
- Si no hay ventaja, baja el brazo y vuelve a la falta original

**Consejo:** Aprovechá la ventaja para arriesgar. Si fallás, volvés al penal.

---

## Protocolo de Sanciones

### Progresión típica:

1. **Primera falta** → Aviso verbal del árbitro
2. **Repetición** → Penal
3. **Falta grave o reiterada** → Tarjeta amarilla
4. **Falta extremadamente grave** → Tarjeta roja

### Comunicación con el árbitro:

<strong>Regla de oro:</strong> Solo el capitán puede hablar con el árbitro.

**Lo que SÍ podés decir:**
- "Sí, señor" (aceptar la decisión)
- "¿En qué podemos mejorar, señor?" (pregunta respetuosa)

**Lo que NO podés decir:**
- Discutir las decisiones
- Insultar o cuestionar
- Gesticular en desacuerdo

---

> 🏉 <strong>Recuerda:</strong> En rugby, el respeto al árbitro es sagrado. Su palabra es ley en la cancha. Incluso cuando no estamos de acuerdo, aceptamos y seguimos jugando. Eso es lo que nos diferencia.
    `
  }
]

export default function FundamentosPage() {
  const [seccionActiva, setSeccionActiva] = useState<string | null>('historia')
  const [progreso, setProgreso] = useState(0)
  const [completadas, setCompletadas] = useState<string[]>([])

  const toggleSeccion = (id: string) => {
    setSeccionActiva(seccionActiva === id ? null : id)
  }

  const completarSeccion = (id: string, xp: number) => {
    if (!completadas.includes(id)) {
      setCompletadas([...completadas, id])
      setProgreso(prev => Math.min(prev + xp, 100))
    }
  }

  return (
    <div className="min-h-screen bg-ruda-black">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 193, 7, 0.6); }
        }
        .lesson-content h2 { 
          font-size: 1.5rem; 
          font-weight: 900; 
          color: #FFC107; 
          margin: 1.5rem 0 1rem 0;
        }
        .lesson-content h3 { 
          font-size: 1.25rem; 
          font-weight: 700; 
          color: white; 
          margin: 1.25rem 0 0.75rem 0;
        }
        .lesson-content h4 { 
          font-size: 1.1rem; 
          font-weight: 600; 
          color: #FFC107; 
          margin: 1rem 0 0.5rem 0;
        }
        .lesson-content p { 
          color: #D1D5DB; 
          margin-bottom: 0.75rem; 
          line-height: 1.7;
        }
        .lesson-content ul { 
          list-style: disc; 
          margin-left: 1.5rem; 
          color: #D1D5DB;
        }
        .lesson-content li { 
          margin-bottom: 0.5rem; 
        }
        .lesson-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .lesson-content th, .lesson-content td {
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem;
          text-align: left;
        }
        .lesson-content th {
          background: rgba(255,193,7,0.1);
          color: #FFC107;
          font-weight: 600;
        }
        .lesson-content td {
          color: #D1D5DB;
        }
        .lesson-content blockquote {
          border-left: 4px solid #FFC107;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #9CA3AF;
        }
        .lesson-content hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.1);
          margin: 1.5rem 0;
        }
        .lesson-content strong {
          color: white;
          font-weight: 600;
        }
      `}</style>

      {/* Header */}
      <header className="bg-ruda-black/95 backdrop-blur-md border-b border-ruda-gold/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ruda-school" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <span className="text-xl">←</span>
              <span className="hidden sm:inline">Volver a Ruda School</span>
            </Link>
            <div className="text-center">
              <p className="text-ruda-gold text-sm font-bold">NIVEL 1</p>
              <h1 className="text-white font-black text-lg">FUNDAMENTOS</h1>
            </div>
            <div className="w-20">
              <div className="bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-ruda-green to-ruda-gold h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">{progreso}%</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ruda-green/20 via-transparent to-ruda-gold/10" />
        <div className="max-w-4xl mx-auto px-4 py-12 relative">
          <div className="text-center">
            <div className="text-6xl mb-4">🏉</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              FUNDAMENTOS DEL RUGBY
            </h1>
            <p className="text-ruda-gold text-lg mb-6">
              Todo lo que necesitás saber para entender el juego
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-ruda-green/20 text-ruda-gold px-4 py-2 rounded-full text-sm font-bold">
                <span>📚</span>
                <span>{secciones.length} lecciones</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-ruda-gold/20 text-ruda-gold px-4 py-2 rounded-full text-sm font-bold">
                <span>⚡</span>
                <span>{secciones.reduce((acc, s) => acc + s.xp, 0)} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="space-y-4">
          {secciones.map((seccion, index) => (
            <div 
              key={seccion.id}
              className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-white/10 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleSeccion(seccion.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{seccion.icono}</div>
                  <div className="text-left">
                    <h2 className="text-xl font-black text-white">{seccion.titulo}</h2>
                    <p className="text-gray-400 text-sm">Lección {index + 1} de {secciones.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-ruda-gold font-bold text-sm">+{seccion.xp} XP</span>
                  <span className={`text-2xl transition-transform ${seccionActiva === seccion.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {seccionActiva === seccion.id && (
                <div className="px-6 pb-6">
                  <div 
                    className="lesson-content bg-ruda-black/50 rounded-xl p-6 border border-white/5"
                    dangerouslySetInnerHTML={{ __html: seccion.contenido }}
                  />
                  
                  <button
                    onClick={() => completarSeccion(seccion.id, seccion.xp)}
                    disabled={completadas.includes(seccion.id)}
                    className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${
                      completadas.includes(seccion.id)
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-ruda-green text-white hover:bg-ruda-dark-green'
                    }`}
                  >
                    {completadas.includes(seccion.id) 
                      ? '✓ Completado' 
                      : `✓ Marcar como completado (+${seccion.xp} XP)`
                    }
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resumen y Navegación */}
        <div className="mt-8 bg-gradient-to-r from-ruda-green/20 to-ruda-gold/20 rounded-2xl p-6 border border-ruda-gold/30">
          <h3 className="text-xl font-black text-white mb-4">🎓 Resumen del Nivel</h3>
          <ul className="text-gray-300 space-y-2 mb-6">
            <li>✅ Historia y origen del rugby (leyenda de Webb Ellis)</li>
            <li>✅ Los 5 valores del rugby (Integridad, Pasión, Solidaridad, Disciplina, Respeto)</li>
            <li>✅ Evolución histórica del deporte</li>
            <li>✅ Objetivo del juego y duración</li>
            <li>✅ Sistema de puntuación (Try, Conversión, Penal, Drop)</li>
            <li>✅ Reglas fundamentales (pases, tackles, rucks, scrums)</li>
            <li>✅ Sanciones (penales, tarjetas)</li>
          </ul>
          
          <div className="flex justify-between items-center">
            <Link 
              href="/ruda-school"
              className="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
            >
              ← Volver a niveles
            </Link>
            
            <div className="text-center">
              <p className="text-ruda-gold font-bold">{completadas.length}/{secciones.length} lecciones</p>
              <p className="text-gray-400 text-sm">{progreso}% completado</p>
            </div>
            
            <button
              disabled={progreso < 100}
              className="px-6 py-3 bg-ruda-gold text-ruda-black rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
            >
              {progreso >= 100 ? '🎉 Nivel completado!' : `Faltan ${secciones.length - completadas.length}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
