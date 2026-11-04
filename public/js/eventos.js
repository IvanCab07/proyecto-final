document.addEventListener("DOMContentLoaded", () => {
    cargarJuegos();

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

    window.addEventListener("click", (e) => {
        if (e.target === modalAgregar) modalAgregar.style.display = "none";
        if (e.target === modalModificar) modalModificar.style.display = "none";
    });

    const formAgregar = document.querySelector("#form-agregar");
    formAgregar.addEventListener("submit", async (e) => {
        e.preventDefault();
        let urlImg = "";
        if (formAgregar.imagenFile.files.length > 0) {
            urlImg = await subirImagen(formAgregar.imagenFile.files[0]);
            if (!urlImg) return;
        }

        await agregarJuego({
            titulo: formAgregar.titulo.value,
            anio: Number(formAgregar.anio.value),
            genero: formAgregar.genero.value,
            imagen: urlImg
        });

        formAgregar.reset();
        modalAgregar.style.display = "none";
    });

    const formBuscar = document.querySelector("#form-buscar");
    formBuscar.addEventListener("submit", (e) => {
        e.preventDefault();
        buscarJuegos(formBuscar.titulo.value, formBuscar.genero.value);
    });

    document.querySelector("#btn-limpiar-filtros").addEventListener("click", () => {
        formBuscar.reset();
        cargarJuegos();
    });

    const formModificar = document.querySelector("#form-modificar");
    formModificar.addEventListener("submit", async (e) => {
        e.preventDefault();
        let urlImg = formModificar.imagenActual.value;
        if (formModificar.imagenFile.files.length > 0) {
            const nuevaUrlImg = await subirImagen(formModificar.imagenFile.files[0]);
            if (!nuevaUrlImg) return;
            urlImg = nuevaUrlImg;
        }

        await modificarJuego(formModificar.idJuego.value, {
            titulo: formModificar.titulo.value,
            anio: Number(formModificar.anio.value),
            genero: formModificar.genero.value,
            imagen: urlImg
        });

        formModificar.reset();
        modalModificar.style.display = "none";
    });
});
