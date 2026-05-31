let API_URL = "http://localhost:3000/api";
// crea y regresa la tarjeta de un proyecto
function crearTarjetaProyecto(proyecto) {
    let tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-proyecto");

    tarjeta.innerHTML = `
        <div class="tarjeta-etiqueta">
            <span class="etiqueta-proyecto">Proyecto</span>
        </div>
        <div class="tarjeta-nombre">
            <span class="nombre-tarjeta">${proyecto.nombre}</span>
        </div>
        <div class="tarjeta-sub">
            <span class="sub-tarjeta">
                ${proyecto.descripcion || "Sin descripcion"}
            </span>
        </div>
        <div class="tarjeta-tags">
            ${proyecto.tecnologias.map(tecnologia => `<span class="tag">${tecnologia}</span>`).join("")}
        </div>
    `;

    tarjeta.style.cursor = "pointer";

    tarjeta.addEventListener("click", () => {
        window.location.href =
            `perfil-publico.html?id=${proyecto.estudiante_id}`;
    });

    return tarjeta;
}

// carga todos los proyectos desde la API
async function cargarProyectos() {
    let contenedor = document.getElementById("contenedor-tarjetas");
    contenedor.innerHTML = "";
    try {
        // pide proyectos al backend
        let respuesta = await fetch(`${API_URL}/proyectos`);
        let proyectos = await respuesta.json();

        // si no hay proyectos
        if (!proyectos.length) {
            contenedor.innerHTML = "<p>No hay proyectos registrados.</p>";
            return;
        }

        // agrega proyectos
        proyectos.forEach(proyecto => {
            contenedor.appendChild(
                crearTarjetaProyecto(proyecto)
            );
        });

    } catch (error) {
        contenedor.innerHTML = "<p>Error al cargar proyectos.</p>";
    }
}

// inicia la carga
cargarProyectos();