// funcion que inserta datos de ejemplo
function inicializarDatos() {
  // si ya se inicializaron los datos no hace nada
  if (localStorage.getItem("datosInicializados")) {
    return;
  }

  // usuarios de ejemplo
  let usuario1 = {
    id: 1,
    nombre: "Fernando Buelna",
    correo: "a12345678@unisierra.edu.mx",
    contrasena: "12345678",
    carrera: "Ing en Sistemas",
    semestre: 6,
    descripcion: "Estudiante de Ingeieria en Sistemas",
  };

  let usuario2 = {
    id: 2,
    nombre: "Carlos Diaz",
    correo: "a87654321@unisierra.edu.mx",
    contrasena: "87654321",
    carrera: "Ing en Sistemas",
    semestre: 4,
    descripcion: "Estudiante de Ingeieria en Sistemas",
  };

  let usuario3 = {
    id: 3,
    nombre: "Diego Cordova",
    correo: "a11223344@unisierra.edu.mx",
    contrasena: "11223344",
    carrera: "Ing en Sistemas",
    semestre: 6,
    descripcion: "Estudiante de Ingeieria en Sistemas",
  };

  let usuario4 = {
    id: 4,
    nombre: "Cristal Arvayo",
    correo: "a44332211@unisierra.edu.mx",
    contrasena: "44332211",
    carrera: "Ing en Sistemas",
    semestre: 6,
    descripcion: "Estudiante de Ingeieria en Sistemas",
  };

  // guardar usuarios
  localStorage.setItem("usuario_1", JSON.stringify(usuario1));
  localStorage.setItem("usuario_2", JSON.stringify(usuario2));
  localStorage.setItem("usuario_3", JSON.stringify(usuario3));
  localStorage.setItem("usuario_4", JSON.stringify(usuario4));

  // indice de correos para buscar usuarios por correo
  let indiceCorreos = {
    "a12345678@unisierra.edu.mx": 1,
    "a87654321@unisierra.edu.mx": 2,
    "a11223344@unisierra.edu.mx": 3,
    "a44332211@unisierra.edu.mx": 4,
  };
  localStorage.setItem("indiceCorreos", JSON.stringify(indiceCorreos));

  // proyectos de Fernando
  let proyectos1 = [
    {
      id: 1001,
      nombre: "Sistema de inventario",
      descripcion: "Sistema para gestionar inventario de una tienda",
      repositorio: "https://github.com/fernando/inventario",
      tecnologias: ["Java", "MySQL"],
    },
    {
      id: 1002,
      nombre: "Portafolio personal",
      descripcion: "Mi pagina de portafolio con mis proyectos",
      repositorio: "https://github.com/fernando/portafolio",
      tecnologias: ["HTML", "CSS", "JavaScript"],
    },
  ];

  // proyectos de Carlos
  let proyectos2 = [
    {
      id: 2001,
      nombre: "App de tareas",
      descripcion: "Aplicacion para gestionar tareas",
      repositorio: "https://github.com/carlos/tareas",
      tecnologias: ["React", "Firebase"],
    },
    {
      id: 2002,
      nombre: "API REST",
      descripcion: "API para gestionar usuarios y productos",
      repositorio: "https://github.com/carlos/api-rest",
      tecnologias: ["Node.js", "Express", "MongoDB"],
    },
  ];

  // proyectos de Diego
  let proyectos3 = [
    {
      id: 3001,
      nombre: "Monitor de red",
      descripcion: "Herramienta para monitorear el trafico de red",
      repositorio: "https://github.com/diego/monitor-red",
      tecnologias: ["Python", "Django"],
    },
    {
      id: 3002,
      nombre: "Dashboard admin",
      descripcion: "Panel de administracion con graficas y estadisticas",
      repositorio: "https://github.com/diego/dashboard",
      tecnologias: ["JavaScript", "MySQL"],
    },
  ];

  // proyectos de Cristal
  let proyectos4 = [
    {
      id: 4001,
      nombre: "Calculadora web",
      descripcion: "Calculadora con operaciones basicas hecha en el navegador",
      repositorio: "https://github.com/cristal/calculadora",
      tecnologias: ["HTML", "CSS", "JavaScript"],
    },
    {
      id: 4002,
      nombre: "Blog personal",
      descripcion: "Blog donde comparto mis aprendizajes",
      repositorio: "https://github.com/cristal/blog",
      tecnologias: ["HTML", "CSS"],
    },
  ];

  // guarda los proyectos
  localStorage.setItem("proyectos_1", JSON.stringify(proyectos1));
  localStorage.setItem("proyectos_2", JSON.stringify(proyectos2));
  localStorage.setItem("proyectos_3", JSON.stringify(proyectos3));
  localStorage.setItem("proyectos_4", JSON.stringify(proyectos4));

  // habilidades de Fernando
  let habilidades1 = [
    { id: 101, nombre: "JavaScript", nivel: "Intermedio" },
    { id: 102, nombre: "HTML", nivel: "Avanzado" },
    { id: 103, nombre: "CSS", nivel: "Avanzado" },
  ];
  localStorage.setItem("habilidades_1", JSON.stringify(habilidades1));

  // habilidades de Carlos
  let habilidades2 = [
    { id: 201, nombre: "React", nivel: "Intermedio" },
    { id: 202, nombre: "Node.js", nivel: "Intermedio" },
    { id: 203, nombre: "Firebase", nivel: "Básico" },
  ];
  localStorage.setItem("habilidades_2", JSON.stringify(habilidades2));

  // habilidades de Diego
  let habilidades3 = [
    { id: 301, nombre: "Python", nivel: "Avanzado" },
    { id: 302, nombre: "Django", nivel: "Intermedio" },
    { id: 303, nombre: "MySQL", nivel: "Intermedio" },
  ];
  localStorage.setItem("habilidades_3", JSON.stringify(habilidades3));

  // habilidades de Cristal
  let habilidades4 = [
    { id: 401, nombre: "HTML", nivel: "Avanzado" },
    { id: 402, nombre: "CSS", nivel: "Avanzado" },
    { id: 403, nombre: "Creatividad", nivel: "Avanzado" },
  ];
  localStorage.setItem("habilidades_4", JSON.stringify(habilidades4));

  // experiencias de Fernando
  let experiencias1 = [
    {
      id: 501,
      nombre: "Curso de JavaScript",
      institucion: "Udemy",
      tipo: "Curso",
      fechaInicio: "2024-01-15",
      fechaFin: "2024-03-20",
      descripcion: "Curso completo de JavaScript moderno",
    },
    {
      id: 502,
      nombre: "Hackathon UNISIERRA",
      institucion: "UNISIERRA",
      tipo: "Hackathon",
      fechaInicio: "2024-04-10",
      fechaFin: "2024-04-12",
      descripcion: "Participacion en hackathon universitario",
    },
    {
      id: 503,
      nombre: "Proyecto escolar web",
      institucion: "UNISIERRA",
      tipo: "Proyecto escolar",
      fechaInicio: "2024-08-01",
      fechaFin: "2024-12-01",
      descripcion: "Desarrollo de plataforma de portafolios",
    },
  ];
  localStorage.setItem("experiencias_1", JSON.stringify(experiencias1));

  // experiencias de Carlos
  let experiencias2 = [
    {
      id: 601,
      nombre: "Curso de React",
      institucion: "Platzi",
      tipo: "Curso",
      fechaInicio: "2023-06-01",
      fechaFin: "2023-08-30",
      descripcion: "Fundamentos de React y hooks",
    },
    {
      id: 602,
      nombre: "Certificado Firebase",
      institucion: "Google",
      tipo: "Certificado",
      fechaInicio: "2023-09-01",
      fechaFin: "2023-10-15",
      descripcion: "Certificado de desarrollo con Firebase",
    },
    {
      id: 603,
      nombre: "API REST escolar",
      institucion: "UNISIERRA",
      tipo: "Proyecto escolar",
      fechaInicio: "2024-02-01",
      fechaFin: "2024-06-01",
      descripcion: "Desarrollo de API para proyecto escolar",
    },
  ];
  localStorage.setItem("experiencias_2", JSON.stringify(experiencias2));

  // experiencias de Diego
  let experiencias3 = [
    {
      id: 701,
      nombre: "Curso de Python",
      institucion: "Coursera",
      tipo: "Curso",
      fechaInicio: "2023-03-01",
      fechaFin: "2023-05-30",
      descripcion: "Python para ciencia de datos",
    },
    {
      id: 702,
      nombre: "Curso de Django",
      institucion: "Udemy",
      tipo: "Curso",
      fechaInicio: "2023-07-01",
      fechaFin: "2023-09-01",
      descripcion: "Desarrollo web con Django",
    },
    {
      id: 703,
      nombre: "Monitor de red escolar",
      institucion: "UNISIERRA",
      tipo: "Proyecto escolar",
      fechaInicio: "2024-01-01",
      fechaFin: "No terminada",
      descripcion: "Proyecto de monitoreo de red universitaria",
    },
  ];
  localStorage.setItem("experiencias_3", JSON.stringify(experiencias3));

  // experiencias de Cristal
  let experiencias4 = [
    {
      id: 801,
      nombre: "Curso de HTML y CSS",
      institucion: "freeCodeCamp",
      tipo: "Curso",
      fechaInicio: "2023-08-01",
      fechaFin: "2023-10-01",
      descripcion: "Fundamentos de diseño web",
    },
    {
      id: 802,
      nombre: "Curso de Figma",
      institucion: "Udemy",
      tipo: "Curso",
      fechaInicio: "2024-01-01",
      fechaFin: "2024-02-15",
      descripcion: "Diseño de interfaces con Figma",
    },
    {
      id: 803,
      nombre: "Blog personal escolar",
      institucion: "UNISIERRA",
      tipo: "Proyecto escolar",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-06-01",
      descripcion: "Desarrollo de blog personal",
    },
  ];
  localStorage.setItem("experiencias_4", JSON.stringify(experiencias4));

  // pone el contador en 5 para que el siguiente usuario registrado tenga id 5
  localStorage.setItem("idUsuario", 5);

  localStorage.setItem("datosInicializados", "true");
}

inicializarDatos();
