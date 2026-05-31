let API_URL = "http://localhost:3000/api";
let seccionActiva = "proyectos";
let usuarioActual = new URLSearchParams(window.location.search).get("id");

// funcion que carga los datos del usuario loggeado en el perfil
function cargarPerfil() {
    // trae el id del usuario a mostrar
    
    // si no hay usuario retorna
    if (!usuarioActual) {
        alert("No se ha encontrado un usuario. Por favor, seleccione otro usuario.");
        return;
    }

    //fetch para traer los datos del usuario
    fetch(`${API_URL}/estudiantes/${usuarioActual}`)
    .then(res => res.json())
    .then(usuario => {
        // elementos del perfil
        let perfilAvatar = document.getElementById("perfil-avatar");
        let perfilNombre = document.getElementById("perfil-nombre");
        let perfilCarrera = document.getElementById("perfil-carrera");
        let perfilSemestre = document.getElementById("perfil-semestre");
        let perfilDescripcion = document.getElementById("perfil-descripcion");
        let perfilGithub = document.getElementById("perfil-github");
        let perfilLinkedin = document.getElementById("perfil-linkedin");
        let perfilTelefono = document.getElementById("perfil-telefono");
        let perfilCv = document.getElementById("perfil-cv");

        //toma ls iniciales de las primeras dos palabras del nombre
        let iniciales = usuario.nombre.split(" ")[0][0].toUpperCase(); // toma la primera letra de la primera palabra del nombre, el primer [0] es para tomar la primera palabra, el segundo [0] es para tomar la primera letra de esa palabra
        iniciales += usuario.nombre.split(" ").length > 1 ? usuario.nombre.split(" ")[1][0].toUpperCase() : ""; // si el nombre tiene mas de una palabra, toma la primera letra de la segunda palabra, si no tiene mas de una palabra, no agrega nada

        // carga los datos al perfil
        perfilAvatar.textContent = iniciales;
        perfilNombre.textContent = usuario.nombre;

        perfilCarrera.textContent = usuario.carrera || "Carrera no especificada";

        perfilSemestre.textContent = usuario.semestre ? `Semestre ${usuario.semestre}` : "Semestre no especificado";

        perfilDescripcion.textContent = usuario.descripcion || "Descripcion no disponible";

        //muetra enlaces si hay, si no los oculta
        if (usuario.github) {
            perfilGithub.href = usuario.github;
            perfilGithub.textContent = "GitHub";
            perfilGithub.classList.remove("oculto");
        } else {
            perfilGithub.classList.add("oculto");
        }

        if (usuario.linkedin) {
            perfilLinkedin.href = usuario.linkedin;
            perfilLinkedin.textContent = "LinkedIn";
            perfilLinkedin.classList.remove("oculto");
        } else {
            perfilLinkedin.classList.add("oculto");
        }

        if (usuario.telefono) {
            perfilTelefono.textContent = usuario.telefono;
            perfilTelefono.classList.remove("oculto");
        } else {
            perfilTelefono.classList.add("oculto");
        }

        if (usuario.cv_url) {
            perfilCv.href = usuario.cv_url;
            perfilCv.textContent = "Ver CV";
            perfilCv.classList.remove("oculto");
        } else {
            perfilCv.classList.add("oculto");
        }

        if (seccionActiva === "proyectos") cargarProyectos();
        if (seccionActiva === "habilidades") cargarHabilidades();
        if (seccionActiva === "experiencias") cargarExperiencias();
    })
    .catch(error => {
        console.error("Error al cargar el perfil:", error);
        alert("Hubo un error al cargar el perfil. Por favor, intente nuevamente.");
    });
}

// funcion para cargar los proyectos del usuario a mostrar
function cargarProyectos() {
    // trae el contenedor de los proyectos
    let contenedor = document.getElementById("lista-proyectos");
    // limpia el contenedor antes de volver a cargar los proyectos
    contenedor.innerHTML = "";

    // pide al backend los proyectos del usuario actual
    fetch(`${API_URL}/estudiantes/${usuarioActual}/proyectos`)
    // convierte la respuesta a json
    .then(res => res.json())
    .then(proyectos => {

        if (proyectos.length === 0) {
            contenedor.innerHTML = "<p class='mensaje-vacio'>Este usuario no tiene proyectos.</p>";
            return;
        }

        // recorre todos los proyectos del usuario
        proyectos.forEach(proyecto => {
            // crea una carta para el proyecto
            let card = document.createElement("div");
            // le agrega css
            card.classList.add("proyecto-card");
            // mete la informacion basica del proyecto en la carta
            card.innerHTML = `
                <div class="proyecto-card-header">
                    <h3>${proyecto.nombre} ${proyecto.destacado ? "⭐" : ""}</h3>
                </div>
                <p>${proyecto.descripcion}</p>
                ${proyecto.repo_url
                    ? `<a href="${proyecto.repo_url}" target="_blank">Repositorio</a>`
                    : ""
                }
                <div class="tecnologias-proyecto"></div>
            `;
            // mete la carta al contenedor
            contenedor.appendChild(card);
            
            // pide las tecnologias del proyecto actual
            fetch(`${API_URL}/proyectos/${proyecto.id}/tecnologias`)
            // convierte la respuesta a json
            .then(res => res.json())
            .then(tecnologias => {
                // trae el contenedor donde iran las tags de tecnologias
                let contenedorTags = card.querySelector(".tecnologias-proyecto");
                // recorre todas las tecnologias del proyecto
                tecnologias.forEach(t => {
                    // crea una etiqueta para cada tecnologia
                    let tag = document.createElement("span");
                    // le agrega css
                    tag.classList.add("tag");
                    // pone el nombre de la tecnologia
                    tag.textContent = t.nombre;
                    // mete la tag al contenedor
                    contenedorTags.appendChild(tag);
                });
            })
            .catch(error => {
                console.error("Error al cargar las tecnologias del proyecto:", error);
            });
        });
    })
    .catch(error => {
        console.error("Error al cargar los proyectos:", error);
        alert("Hubo un error al cargar los proyectos. Por favor, intente nuevamente.");
    });
}

// funcion para cargar las habilidades del usuario a mostrar
function cargarHabilidades() {
    // trae el contenedior de las habilidades y lo limpia para cargar las habilidades
    let contenedor = document.getElementById("lista-habilidades");
    contenedor.innerHTML = "";

    // fecht para traer las habilidades del usuario actual
    fetch(`${API_URL}/estudiantes/${usuarioActual}/habilidades`)
    .then(res => res.json())
    .then(habilidades => {
        if (habilidades.length === 0) {
            contenedor.innerHTML = "<p class='mensaje-vacio'>Este usuario no tiene habilidades.</p>";
            return;
        }

        // recorre las habilidades
        habilidades.forEach(habilidad => {
            let card = document.createElement("div"); // crea una carta para cada habilidad
            card.classList.add("habilidad-card"); //le pone css
            // a cada carta le agrega el contenido y los botones de editar y eliminar
            card.innerHTML = `
                <h4>${habilidad.nombre}</h4>
                <p>Nivel: ${habilidad.nivel}</p>
            `;
            contenedor.appendChild(card);// mete la carta al contenedor de habilidades
        });
        })
        .catch(error => {
            console.error("Error al cargar las habilidades:", error);
            alert("Hubo un error al cargar las habilidades. Por favor, intente nuevamente.");
        });
}

// funcion para cargar las experiencias
function cargarExperiencias() {
    //trae el contenedor de experiencias y lo limpia para cargar las experiencias guardadas
    let contenedor = document.getElementById("lista-experiencias");
    contenedor.innerHTML = "";

    fetch(`${API_URL}/estudiantes/${usuarioActual}/experiencias`)
    .then(res => res.json())
    .then(experiencias => {
        if (experiencias.length === 0) {
            contenedor.innerHTML = "<p class='mensaje-vacio'>Este usuario no tiene experiencias.</p>";
            return;
        }

        // recorre las experiencias guardadas
        experiencias.forEach(experiencia => {
            let card = document.createElement("div");// crea un div para la carta de la experiencia
            card.classList.add("experiencia-card");// le agrega css
            // mete la informacion de la experiencia en la carta y botones para editar y eliminar
            card.innerHTML = `
                <h4>${experiencia.titulo}</h4>
                <h3>Institucion: ${experiencia.institucion || "No especificada"}</h3>
                <h2>Tipo: ${experiencia.tipo}</h2>
                <p>Fecha Inicio: ${experiencia.fecha_inicio || "No especificada"}, Fecha Fin: ${experiencia.fecha_fin || "En curso"}</p>
                <p>Descripcion: ${experiencia.descripcion || "No especificada"}</p>
                `;
            contenedor.appendChild(card);// mete la carta al contenedor de experiencias
        });
    })
    .catch(error => {
        console.error("Error al cargar las experiencias:", error);
        alert("Hubo un error al cargar las experiencias. Por favor, intente nuevamente.");
    });
}

// cambiar de seccione con el sidebar
function navegarSecciones() {
    let items = document.querySelectorAll(".sidebar-item");

    items.forEach(function(item) {
        item.addEventListener("click", function(event) {
            items.forEach(i => i.classList.remove("activo"));
            this.classList.add("activo");
            seccionActiva = this.getAttribute("data-seccion");

            document.getElementById("seccion-proyectos").classList.add("oculto");
            document.getElementById("seccion-habilidades").classList.add("oculto");
            document.getElementById("seccion-experiencias").classList.add("oculto");
            document.getElementById(`seccion-${seccionActiva}`).classList.remove("oculto");

            // carga los datos de la seccion seleccionada
            if (seccionActiva === "proyectos") cargarProyectos();
            if (seccionActiva === "habilidades") cargarHabilidades();
            if (seccionActiva === "experiencias") cargarExperiencias();
        });
    });
}

cargarPerfil();
navegarSecciones();