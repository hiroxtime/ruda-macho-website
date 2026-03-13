-- Schema de Base de Datos - Ruda Rugby Club (Versión Completa)
-- PostgreSQL (Supabase)

-- ============================================
-- TABLAS DE USUARIOS Y AUTENTICACIÓN
-- ============================================

-- Roles: jugador, moderador, tesorero, admin
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'jugador', -- jugador, moderador, tesorero, admin
    nombre VARCHAR(200) NOT NULL,
    apellido VARCHAR(200) NOT NULL,
    telefono VARCHAR(50),
    foto_url TEXT,
    activo BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLAS DE JUGADORES
-- ============================================

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- M19, Senior, etc.
    descripcion TEXT,
    edad_minima INTEGER,
    edad_maxima INTEGER,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jugadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_nacimiento DATE NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id),
    posicion VARCHAR(100), -- Scrum-half, Fly-half, Prop, etc.
    fecha_ingreso_club DATE DEFAULT CURRENT_DATE,
    estado VARCHAR(50) DEFAULT 'activo', -- activo, lesionado, inactivo, suspendido
    foto_url TEXT,
    contacto_emergencia_nombre VARCHAR(200),
    contacto_emergencia_telefono VARCHAR(50),
    alergias TEXT,
    observaciones_medicas TEXT,
    numero_camiseta INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLAS DE TEMPORADAS Y PARTIDOS
-- ============================================

CREATE TABLE temporadas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL, -- "2024 - Apertura"
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    temporada_id INTEGER REFERENCES temporadas(id),
    fecha DATE NOT NULL,
    hora TIME,
    rival VARCHAR(200) NOT NULL,
    ubicacion VARCHAR(300),
    es_local BOOLEAN DEFAULT true,
    categoria_id INTEGER REFERENCES categorias(id),
    resultado_ruda INTEGER,
    resultado_rival INTEGER,
    estado VARCHAR(50) DEFAULT 'programado', -- programado, jugado, cancelado, postergado
    goleadores TEXT[], -- Array de nombres
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLAS DE ESTADÍSTICAS
-- ============================================

CREATE TABLE estadisticas_partido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
    partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
    titular BOOLEAN DEFAULT false,
    minutos_jugados INTEGER DEFAULT 0,
    tries INTEGER DEFAULT 0,
    asistencias INTEGER DEFAULT 0,
    conversiones INTEGER DEFAULT 0,
    penales INTEGER DEFAULT 0,
    drops INTEGER DEFAULT 0,
    tackles INTEGER DEFAULT 0,
    tackles_fallidos INTEGER DEFAULT 0,
    carries INTEGER DEFAULT 0,
    metros_ganados INTEGER DEFAULT 0,
    passes INTEGER DEFAULT 0,
    passes_fallidos INTEGER DEFAULT 0,
    lineouts_ganados INTEGER DEFAULT 0,
    lineouts_perdidos INTEGER DEFAULT 0,
    scrums_ganados INTEGER DEFAULT 0,
    scrums_perdidos INTEGER DEFAULT 0,
    turnovers INTEGER DEFAULT 0,
    turnovers_forzados INTEGER DEFAULT 0,
    tarjetas_amarillas INTEGER DEFAULT 0,
    tarjetas_rojas INTEGER DEFAULT 0,
    notas TEXT,
    cargado_por UUID REFERENCES usuarios(id), -- moderador que cargó
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(jugador_id, partido_id)
);

-- Vista para totales por jugador/temporada
CREATE VIEW estadisticas_totales AS
SELECT 
    j.id as jugador_id,
    p.temporada_id,
    COUNT(DISTINCT ep.partido_id) as partidos_jugados,
    SUM(ep.tries) as total_tries,
    SUM(ep.asistencias) as total_asistencias,
    SUM(ep.minutos_jugados) as total_minutos,
    SUM(ep.tarjetas_amarillas) as total_amarillas,
    SUM(ep.tarjetas_rojas) as total_rojas,
    SUM(ep.tackles) as total_tackles
FROM jugadores j
LEFT JOIN estadisticas_partido ep ON j.id = ep.jugador_id
LEFT JOIN partidos p ON ep.partido_id = p.id
GROUP BY j.id, p.temporada_id;

-- ============================================
-- TABLAS DE CUOTAS Y PAGOS
-- ============================================

CREATE TABLE cuotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
    mes INTEGER NOT NULL, -- 1-12
    anio INTEGER NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente', -- pagado, pendiente, atrasado, perdonado
    fecha_vencimiento DATE,
    fecha_pago DATE,
    metodo_pago VARCHAR(100), -- transferencia, efectivo, mercadopago, etc.
    comprobante_url TEXT, -- foto del comprobante
    notas TEXT,
    privado BOOLEAN DEFAULT false, -- TRUE = solo visible para jugador y admin (el "ojito")
    registrado_por UUID REFERENCES usuarios(id), -- tesorero/admin que registró
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(jugador_id, mes, anio)
);

-- ============================================
-- RUDA SCHOOL - SISTEMA DE APRENDIZAJE
-- ============================================

CREATE TABLE rs_modulos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL,
    nivel INTEGER DEFAULT 1, -- 1=Fundamentos, 2=Reglas URBA, etc.
    icono VARCHAR(100), -- nombre del icono
    color VARCHAR(7) DEFAULT '#1B5E20', -- hex color
    activo BOOLEAN DEFAULT true,
    xp_total INTEGER DEFAULT 0, -- XP total disponible en el módulo
    tiempo_total_minutos INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rs_lecciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_id INTEGER REFERENCES rs_modulos(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE,
    contenido TEXT, -- HTML o Markdown
    tipo VARCHAR(50) DEFAULT 'texto', -- video, texto, quiz, interactivo
    video_url TEXT,
    orden INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 10,
    tiempo_estimado_minutos INTEGER DEFAULT 5,
    desbloquea_leccion_id UUID REFERENCES rs_lecciones(id), -- lección que desbloquea al completar
    requiere_leccion_id UUID REFERENCES rs_lecciones(id), -- lección que hay que completar antes
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para quizzes dentro de lecciones
CREATE TABLE rs_quiz_preguntas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leccion_id UUID REFERENCES rs_lecciones(id) ON DELETE CASCADE,
    pregunta TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'multiple', -- multiple, verdadero_falso, ordenar
    opciones JSONB, -- [{"texto": "...", "correcta": true}, ...]
    explicacion TEXT, -- explicación de la respuesta correcta
    orden INTEGER,
    xp_reward INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rs_progreso_jugador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
    leccion_id UUID REFERENCES rs_lecciones(id) ON DELETE CASCADE,
    completado BOOLEAN DEFAULT false,
    fecha_completado TIMESTAMP,
    xp_obtenido INTEGER DEFAULT 0,
    tiempo_dedicado_segundos INTEGER DEFAULT 0,
    intentos_quiz INTEGER DEFAULT 0,
    mejor_puntuacion_quiz INTEGER DEFAULT 0,
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(jugador_id, leccion_id)
);

-- Tabla de logros/medallas
CREATE TABLE rs_logros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100),
    tipo VARCHAR(50), -- primer_modulo, streak_7dias, x_tries, etc.
    condicion JSONB, -- {tipo: "streak", dias: 7} o {tipo: "xp", cantidad: 100}
    xp_reward INTEGER DEFAULT 50
);

CREATE TABLE rs_logros_jugador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
    logro_id INTEGER REFERENCES rs_logros(id) ON DELETE CASCADE,
    fecha_obtenido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(jugador_id, logro_id)
);

-- ============================================
-- TABLAS DE ASISTENCIA
-- ============================================

CREATE TABLE asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    tipo VARCHAR(50) DEFAULT 'entrenamiento', -- entrenamiento, partido, evento
    presente BOOLEAN DEFAULT false,
    justificacion TEXT,
    registrado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(jugador_id, fecha, tipo)
);

-- ============================================
-- TABLAS DE NOTICIAS/CONTENIDO
-- ============================================

CREATE TABLE noticias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE,
    contenido TEXT NOT NULL,
    imagen_url TEXT,
    autor_id UUID REFERENCES usuarios(id),
    publicado BOOLEAN DEFAULT false,
    fecha_publicacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_jugadores_user_id ON jugadores(user_id);
CREATE INDEX idx_jugadores_categoria ON jugadores(categoria_id);
CREATE INDEX idx_jugadores_estado ON jugadores(estado);
CREATE INDEX idx_cuotas_jugador ON cuotas(jugador_id);
CREATE INDEX idx_cuotas_estado ON cuotas(estado);
CREATE INDEX idx_cuotas_privado ON cuotas(privado);
CREATE INDEX idx_estadisticas_jugador ON estadisticas_partido(jugador_id);
CREATE INDEX idx_estadisticas_partido ON estadisticas_partido(partido_id);
CREATE INDEX idx_rs_progreso_jugador ON rs_progreso_jugador(jugador_id);
CREATE INDEX idx_rs_progreso_leccion ON rs_progreso_jugador(leccion_id);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);

-- ============================================
-- DATOS INICIALES (SEED)
-- ============================================

INSERT INTO categorias (nombre, descripcion, edad_minima, edad_maxima) VALUES
('M19', 'Juveniles hasta 19 años', 17, 19),
('Senior', 'Plantel principal', 20, 35),
('Veteranos', 'Jugadores mayores de 35', 35, 50);

INSERT INTO rs_modulos (titulo, descripcion, orden, nivel, icono, color, xp_total) VALUES
('Fundamentos del Rugby', 'Aprende qué es el rugby, su historia y reglas básicas', 1, 1, 'book', '#1B5E20', 100),
('Reglas URBA', 'Reglamento específico de la Unión de Rugby de Buenos Aires', 2, 1, 'scale', '#1B5E20', 150),
('Posicionamiento', 'Conoce las posiciones y sus roles en el campo', 3, 2, 'users', '#FFC107', 200),
('Táctica Básica', 'Formaciones, defensa y ataque estructurado', 4, 2, 'map', '#FFC107', 250),
('Técnica Individual', 'Pase, tackle, rucking y kicking', 5, 3, 'target', '#D32F2F', 300);

INSERT INTO rs_logros (titulo, descripcion, icono, tipo, condicion, xp_reward) VALUES
('Primeros Pasos', 'Completa tu primera lección', 'star', 'primera_leccion', '{"tipo": "lecciones", "cantidad": 1}', 25),
('Constancia', 'Mantén un streak de 7 días', 'flame', 'streak', '{"tipo": "streak", "dias": 7}', 100),
('Experto', 'Alcanza 500 XP totales', 'trophy', 'xp_total', '{"tipo": "xp", "cantidad": 500}', 200),
('Fundamentos Completos', 'Termina el módulo 1', 'medal', 'modulo', '{"tipo": "modulo", "modulo_id": 1}', 50);
