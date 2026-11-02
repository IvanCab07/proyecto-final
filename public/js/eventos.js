document.addEventListener("DOMContentLoaded", () => {
    cargarJuegos();

    // Modales
    const modalAgregar = document.querySelector("#modal-agregar");
    const modalModificar = document.querySelector("#modal-modificar");

    document.querySelector("#btn-abrir-agregar").addEventListener("click", () => {
        modalAgregar.style.display = "flex";
    });

    document.querySelectorAll(".btn-cerrar").forEach(btn => {
        btn.addEventListener("click", () => {
            modalAgregar.style.display = "none";
            modalModificar.style.display = "none";
        });
    });

    // Agregar
    const formAgregar = document.querySelector("#form-agregar");
    formAgregar.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const fileInput = formAgregar.imagenFile;
        let urlImg = "";
        
        if (fileInput.files.length > 0) {
            urlImg = await subirImagen(fileInput.files[0]);
            if (!urlImg) return; // Si falla la subida, se detiene
        }

        const nuevoJuego = {
            titulo: formAgregar.titulo.value,
            anio: Number(formAgregar.anio.value),
            genero: formAgregar.genero.value,
            imagen: urlImg
        };

        agregarJuego(nuevoJuego);
        formAgregar.reset();
        modalAgregar.style.display = "none";
    });

    // Buscar
    const formBuscar = document.querySelector("#form-buscar");
    formBuscar.addEventListener("submit", (event) => {
        event.preventDefault();
        buscarJuegos(formBuscar.titulo.value, formBuscar.genero.value);
    });

    document.querySelector("#btn-limpiar-filtros").addEventListener("click", () => {
        formBuscar.reset();
        cargarJuegos();
    });

    // Modificar
    const formModificar = document.querySelector("#form-modificar");
    formModificar.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const fileInput = formModificar.imagenFile;
        let urlImg = formModificar.imagenActual.value; // imagen previa
        
        if (fileInput.files.length > 0) {
            const nuevaUrlImg = await subirImagen(fileInput.files[0]);
            if (nuevaUrlImg) {
                urlImg = nuevaUrlImg;
            } else {
                return; // fallo subida
            }
        }

        const juegoEditado = {
            titulo: formModificar.titulo.value,
            anio: Number(formModificar.anio.value),
            genero: formModificar.genero.value,
            imagen: urlImg
        };

        modificarJuego(formModificar.idJuego.value, juegoEditado);
        formModificar.reset();
        modalModificar.style.display = "none";
    });
});
