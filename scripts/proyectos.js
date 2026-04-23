const regexRepositorio = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/; // regex para los repositorios de github

// funcion para abrir el modal de proyectos y limpiar los campos
function agregarProyecto() {
    tecnologiasSeleccionadas = []; // limpiar tecnologias del proyecto anterior
    // limpiar campos del formulario
    document.getElementById("tags-tecnologias").innerHTML = "";
    document.getElementById("proyecto-nombre").value = "";
    document.getElementById("proyecto-descripcion").value = "";
    document.getElementById("proyecto-repositorio").value = "";
    document.getElementById("proyecto-tecnologias").value = "";
    // abre el modal de proyectos
    document.getElementById("modal-proyecto").classList.remove("oculto");
}

//cerrar el modal de proyectos
function cerrarModal() {
    document.getElementById("modal-proyecto").classList.add("oculto");
}

// funcion para seleccionar las tecnologias de un proyecto
function selectorTecnologias() {
    let select = document.getElementById("proyecto-tecnologias");

    // change detecta cada vez que cambia el valor del select de tecnlogias
    select.addEventListener("change", function() {
        // lee el valor que se selecciono
        let valor = this.value;

        // si no se selecciona nada retorna
        if (valor === "") {
            return;
        }

        // si en la lista ya esta esa tecnologia retorna
        if (tecnologiasSeleccionadas.includes(valor)) {
            alert("Ya has seleccionado esta tecnología.");
            return;
        }

        // mete la seleccionada en la lista
        tecnologiasSeleccionadas.push(valor);

        let contenedor = document.getElementById("tags-tecnologias"); // toma el contenedor para las tecnologias
        let tag = document.createElement("span"); // crea un span para la tecnologia
        tag.classList.add("tag-seleccionado"); // le agrega css
        tag.setAttribute("data-tecnologia", valor); // le agrega un atributo con el nombre de la tecnologia para luego poder eliminarla
        tag.innerHTML = valor + ' <button class="tag-quitar" onclick="quitarTecnologia(this)">X</button>'; // lo mete al span y le pone un boton para poder quitarla
        contenedor.appendChild(tag); // mete el span en el contenedor

        // limpia el select
        this.value = "";
    });
    // recarga los proyects
    cargarProyectos();
}

selectorTecnologias();

// funcion para quitar una tecnologia seleccionada
function quitarTecnologia(boton) {
    let tag = boton.parentElement; // toma el span de la tecnologia
    let tecnologia = tag.getAttribute("data-tecnologia"); // toma el nombre de la tecnologia del atributo data-tecnologia
    tecnologiasSeleccionadas = tecnologiasSeleccionadas.filter(t => t !== tecnologia); // quita la tecnologia de la lista de seleccionadas
    tag.remove();// quita el span del contenedor
}

// funcion para guardar un proyecto nuevo o editado
function guardarProyecto() {
    //lee los valores del modal
    let nombre = document.getElementById("proyecto-nombre").value.trim();
    let descripcion = document.getElementById("proyecto-descripcion").value.trim();
    let repositorio = document.getElementById("proyecto-repositorio").value.trim();
    
    //revisa que no esten vacios
    if (nombre === "" || descripcion === "") {
        alert("Por favor, completa los campos obligatorios.");
        return;
    }

    // revisa que el link del repositorio sea valido si es que se ingreso uno
    if (repositorio !== "" && !regexRepositorio.test(repositorio)) {
        alert("Por favor, introduce un enlace de GitHub valido.");
        return;
    }  

    // revisa si se esta editando o creando un proyecto
    if (proyectoEditarId !== null) {
        let usuarioActual = localStorage.getItem("usuarioActual");
        let clave = "proyectos_" + usuarioActual; // la clave de proyectos es proyectos_idUsuario
        // trae la lista de proyectos o crea una nueva
        let proyectosGuardados = JSON.parse(localStorage.getItem(clave)) || [];
        // encuentra el proyecto que se esta editando y lo actualiza
        let proyectos = proyectosGuardados.findIndex(p => p.id === proyectoEditarId);
        // actualiza el proyecto con los nuevos datos
        proyectosGuardados[proyectos] = {
            id: proyectoEditarId,
            nombre: nombre,
            descripcion: descripcion,
            repositorio: repositorio,
            tecnologias: tecnologiasSeleccionadas
        };
        // guarda el proyecto original pero con los datos editados
        localStorage.setItem(clave, JSON.stringify(proyectosGuardados));
        proyectoEditarId = null; // resetea la variable de proyecto a editar
        cerrarModal();// cierra el modal
        cargarProyectos(); // recarga los proyectos para mostrar los cambios
        return; // retorna
    }

    // si se esta creando uno nuevo, crea el nuevo proyecto
    let proyecto = {
        id: Date.now(),
        nombre: nombre,
        descripcion: descripcion,
        repositorio: repositorio,
        tecnologias: tecnologiasSeleccionadas
    };

    // sigue el mismo camino de editar pero sin buscar el proyecto, solo mete uno nuevo a la lista
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "proyectos_" + usuarioActual;
    let proyectosGuardados = JSON.parse(localStorage.getItem(clave)) || [];
    proyectosGuardados.push(proyecto);
    localStorage.setItem(clave, JSON.stringify(proyectosGuardados));
    cerrarModal();
    cargarProyectos();
}

// funcion para cargar los proyectos del usuario loggeado
function cargarProyectos() {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "proyectos_" + usuarioActual;
    let proyectosGuardados = JSON.parse(localStorage.getItem(clave)) || [];
    // trae el contenedor de los proyectos
    let contenedor = document.getElementById("lista-proyectos");
    contenedor.innerHTML = ""; //limpia el contenedor

    // por cada proyecto guardado crea una carta con su informacion
    proyectosGuardados.forEach(proyecto => {
        let card = document.createElement("div"); // crea un div para la carta del proyecto
        card.classList.add("proyecto-card"); // le agrega css
        // mete la informacion del proyecto en la carta y botones para editar y eliminar
        card.innerHTML = `
        <div class="proyecto-card-header">
        <h3>${proyecto.nombre}</h3>
        </div>
        <p>${proyecto.descripcion}</p>
        ${proyecto.repositorio ? `<a href="${proyecto.repositorio}" target="_blank">Repositorio</a>` : ""}
        <div class="tecnologias-proyecto">
        ${proyecto.tecnologias.map(t => `<span class="tag-tecnologia">${t}</span>`).join(" ")}
        </div>
        <div class="proyecto-card-botones">
        <button onclick="editarProyecto(${proyecto.id})">✎ Editar</button>
        <button onclick="eliminarProyecto(${proyecto.id})">🗑 Eliminar</button>
        </div>
    `;
        contenedor.appendChild(card); // mete la carta al contenedor
    });
}

// funcion para eliminar un proyecto
function eliminarProyecto(id) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "proyectos_" + usuarioActual;
    let proyectosGuardados = JSON.parse(localStorage.getItem(clave));
    // filtra la lista de proyectos para eliminar el que se selecciono
    proyectosGuardados = proyectosGuardados.filter(p => p.id !== id);
    // guarda la lista sin el proyecto eliminado
    localStorage.setItem(clave, JSON.stringify(proyectosGuardados));
    //recarga los proyectos
    cargarProyectos();
}

// funcion para editar un proyecto, pone la informacion del proyecto seleccionado
function editarProyecto(id) {
    let usuarioActual = localStorage.getItem("usuarioActual");
    let clave = "proyectos_" + usuarioActual;
    let proyectosGuardados = JSON.parse(localStorage.getItem(clave)) || [];
    // encuentra el proyecto que se selecciono para editar
    let proyecto = proyectosGuardados.find(p => p.id === id);

    //llena los cmpos del modal con la informacion del proyecto seleccionado
    document.getElementById("proyecto-nombre").value = proyecto.nombre;
    document.getElementById("proyecto-descripcion").value = proyecto.descripcion;
    document.getElementById("proyecto-repositorio").value = proyecto.repositorio;
    tecnologiasSeleccionadas = proyecto.tecnologias || [];
    let contenedor = document.getElementById("tags-tecnologias"); // toma el contenedor de las tecnologias seleccionadas
    contenedor.innerHTML = ""; //lo limpia
    // por cada tecnologia seleccionada crea un tag con su nombre y un boton para quitarla
    tecnologiasSeleccionadas.forEach(t => {
        let tag = document.createElement("span");
        tag.classList.add("tag-seleccionado");
        tag.setAttribute("data-tecnologia", t);
        tag.innerHTML = t + ' <button class="tag-quitar" onclick="quitarTecnologia(this)">X</button>';
        contenedor.appendChild(tag);// mete el tag al contenedor
    });

    // abre el modal de proyectos para editar
    document.getElementById("modal-proyecto").classList.remove("oculto");
    // guarda el id del proyecto que se esta editando para luego actualizarlo al guardar
    proyectoEditarId = id;
}