const API_BASE = window.location.origin.includes('onrender.com') || (window.location.hostname === 'localhost' && window.location.port === '3000')
    ? ''
    : 'https://proyecto-final-8j4x.onrender.com';

const URL_API = `${API_BASE}/personas`;
let API_KEY_IMGBB = '385c7634aedac86d2eb5819ab58fc146';

async function obtenerApiKeyImgBB() {
    try {
        const res = await fetch(`${API_BASE}/api/config`);
        if (res.ok) {
            const config = await res.json();
            if (config.imgbbApiKey) API_KEY_IMGBB = config.imgbbApiKey;
        }
    } catch (_) {}
    return API_KEY_IMGBB;
}

obtenerApiKeyImgBB();

async function subirImagen(file) {
    mostrarMensaje("Subiendo imagen...", "info");
    try {
        const apiKey = await obtenerApiKeyImgBB();
        const formdata = new FormData();
        formdata.append('image', file);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formdata
        });
        const data = await res.json();

        if (data.success) return data.data.url;
        mostrarMensaje(`Error ImgBB: ${data.error.message}`, "error");
    } catch (_) {
        mostrarMensaje("Error al subir la imagen", "error");
    }
    return null;
}

function mostrarJuegos(juegos) {
    const cont = document.querySelector("#listadoJuegos");
    if (!Array.isArray(juegos) || juegos.length === 0) {
        cont.innerHTML = '<p class="sin-registros">No se encontraron registros.</p>';
        return;
    }

    cont.innerHTML = juegos.map(j => `
        <div class="card-juego">
            <img src="${j.imagen || 'https://placehold.co/300x400?text=Sin+Imagen'}" alt="${j.titulo}" onerror="this.src='https://placehold.co/300x400?text=Sin+Imagen'">
            <div class="info">
                <h4>${j.titulo}</h4>
                <p>Año: ${j.anio}</p>
                <p>Género: ${j.genero}</p>
            </div>
            <div class="botones">
                <button class="btn-modificar" onclick="cargarFormModificar('${j.id}')">Modificar</button>
                <button class="btn-eliminar" onclick="eliminarJuego('${j.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

async function cargarJuegos() {
    try {
        const res = await fetch(URL_API);
        if (!res.ok) throw new Error();
        const juegos = await res.json();
        mostrarJuegos(juegos);
    } catch (_) {
        mostrarJuegos([]);
    }
}

async function agregarJuego(nuevoJuego) {
    try {
        const res = await fetch(URL_API, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(nuevoJuego)
        });
        if (!res.ok) throw new Error();
        mostrarMensaje("Juego agregado con éxito", "success");
        await cargarJuegos();
    } catch (_) {
        mostrarMensaje("Error al agregar el juego", "error");
    }
}

async function cargarFormModificar(id) {
    try {
        const res = await fetch(`${URL_API}/${id}`);
        if (!res.ok) throw new Error();
        const juego = await res.json();

        const form = document.querySelector("#form-modificar");
        form.idJuego.value = juego.id;
        form.titulo.value = juego.titulo;
        form.anio.value = juego.anio;
        form.genero.value = juego.genero;
        form.imagenActual.value = juego.imagen || '';

        document.querySelector("#modal-modificar").style.display = "flex";
    } catch (_) {
        mostrarMensaje("Error al cargar el juego para modificar", "error");
    }
}

async function modificarJuego(id, juegoEditado) {
    try {
        const res = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(juegoEditado)
        });
        if (!res.ok) throw new Error();
        mostrarMensaje("Juego modificado", "success");
        await cargarJuegos();
    } catch (_) {
        mostrarMensaje("Error al modificar", "error");
    }
}

async function eliminarJuego(id) {
    if (!confirm("¿Estás seguro de eliminar este juego?")) return;
    try {
        const res = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        mostrarMensaje("Juego eliminado", "success");
        await cargarJuegos();
    } catch (_) {
        mostrarMensaje("Error al eliminar", "error");
    }
}

async function buscarJuegos(titulo, genero) {
    try {
        const params = new URLSearchParams();
        if (titulo && titulo.trim()) params.append('titulo', titulo.trim());
        if (genero && genero.trim()) params.append('genero', genero.trim());

        const query = params.toString() ? `?${params.toString()}` : '';
        const res = await fetch(`${URL_API}/buscar${query}`);
        if (!res.ok) throw new Error();
        const juegos = await res.json();
        mostrarJuegos(juegos);
    } catch (_) {
        mostrarMensaje("Error en la búsqueda", "error");
    }
}
