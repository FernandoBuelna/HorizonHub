PRAGMA foreign_keys = ON;

-- TABLA: estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    carrera TEXT,
    semestre INTEGER,
    descripcion TEXT,
    telefono TEXT,
    github TEXT,
    linkedin TEXT,
    cv_url TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: categorias
-- Compartida por habilidades y tecnologias
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL
);

-- TABLA: habilidades
CREATE TABLE IF NOT EXISTS habilidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    categoria_id INTEGER NOT NULL,

    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- TABLA: estudiante_habilidades
CREATE TABLE IF NOT EXISTS estudiante_habilidades (
    estudiante_id INTEGER,
    habilidad_id INTEGER,
    nivel TEXT CHECK(nivel IN ('basico','intermedio','avanzado')) DEFAULT 'basico',

    PRIMARY KEY (estudiante_id, habilidad_id),

    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (habilidad_id) REFERENCES habilidades(id) ON DELETE CASCADE
);

-- TABLA: proyectos 
CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante_id INTEGER,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    repo_url TEXT,
    destacado INTEGER DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

-- TABLA: tecnologias
CREATE TABLE IF NOT EXISTS tecnologias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    categoria_id INTEGER NOT NULL,

    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- TABLA: proyecto_tecnologia
CREATE TABLE IF NOT EXISTS proyecto_tecnologia (
    proyecto_id INTEGER,
    tecnologia_id INTEGER,

    PRIMARY KEY (proyecto_id, tecnologia_id),

    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
    FOREIGN KEY (tecnologia_id) REFERENCES tecnologias(id) ON DELETE CASCADE
);

-- TABLA: experiencias
CREATE TABLE IF NOT EXISTS experiencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante_id INTEGER,
    institucion TEXT,
    titulo TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    descripcion TEXT,
    tipo TEXT CHECK(tipo IN ('carrera','curso','hackathon','otro')) DEFAULT 'otro',

    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
);

-- DATOS: categorias
INSERT OR IGNORE INTO categorias (nombre) VALUES
    ('Lenguajes de programación'),
    ('Frameworks y librerías'),
    ('Herramientas y DevOps'),
    ('Bases de datos'),
    ('Diseño UI/UX'),
    ('Soft skills');

-- DATOS: habilidades
INSERT OR IGNORE INTO habilidades (nombre, categoria_id) VALUES
    -- Lenguajes (1)
    ('JavaScript', 1),
    ('TypeScript', 1),
    ('Python', 1),
    ('Java', 1),
    ('C++', 1),
    ('PHP', 1),
    ('Go', 1),
    ('Rust', 1),
    -- Frameworks (2)
    ('React', 2),
    ('Vue', 2),
    ('Angular', 2),
    ('Node.js', 2),
    ('Express', 2),
    ('Django', 2),
    ('Laravel', 2),
    ('Next.js', 2),
    -- Herramientas (3)
    ('Git', 3),
    ('Docker', 3),
    ('GitHub Actions', 3),
    ('Linux', 3),
    ('Postman', 3),
    ('Webpack', 3),
    -- Bases de datos (4)
    ('MySQL', 4),
    ('PostgreSQL', 4),
    ('SQLite', 4),
    ('MongoDB', 4),
    ('Firebase', 4),
    ('Redis', 4),
    -- Diseño (5)
    ('Figma', 5),
    ('Adobe XD', 5),
    ('Canva', 5),
    ('CSS Avanzado', 5),
    ('Tailwind CSS', 5),
    -- Soft skills (6)
    ('Trabajo en equipo', 6),
    ('Comunicación', 6),
    ('Resolución de problemas', 6),
    ('Liderazgo', 6),
    ('Gestión del tiempo', 6);

-- DATOS: tecnologias
-- Soft skills no aplica a proyectos
INSERT OR IGNORE INTO tecnologias (nombre, categoria_id) VALUES
    -- Lenguajes (1)
    ('JavaScript', 1),
    ('TypeScript', 1),
    ('Python', 1),
    ('Java', 1),
    ('C++', 1),
    ('PHP', 1),
    ('Go', 1),
    -- Frameworks (2)
    ('React', 2),
    ('Vue', 2),
    ('Angular', 2),
    ('Node.js', 2),
    ('Express', 2),
    ('Django', 2),
    ('Laravel', 2),
    ('Next.js', 2),
    -- Herramientas (3)
    ('Git', 3),
    ('Docker', 3),
    ('GitHub Actions', 3),
    ('Linux', 3),
    ('Postman', 3),
    -- Bases de datos (4)
    ('MySQL', 4),
    ('PostgreSQL', 4),
    ('SQLite', 4),
    ('MongoDB', 4),
    ('Firebase', 4),
    ('Redis', 4),
    -- Diseño (5)
    ('Figma', 5),
    ('Adobe XD', 5),
    ('CSS Avanzado', 5),
    ('Tailwind CSS', 5);