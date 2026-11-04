// URL base del backend desplegado en Render
const RENDER_URL = 'https://proyecto-final-8j4x.onrender.com';

// Determina automáticamente la URL base según cómo se ejecute el frontend:
// - Si se ejecuta desde el backend de Node local (http://localhost:3000), usa '' (rutas relativas locales).
// - Si se ejecuta desde el mismo dominio de Render (https://proyecto-final-8j4x.onrender.com), usa '' (rutas relativas al mismo servidor).
// - Si se abre con Live Server (puertos 5500, 5501, etc.), archivo local (file://) o GitHub Pages, usa la URL de Render.
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '3000'
    ? ''
    : (window.location.origin.includes('onrender.com') ? '' : RENDER_URL);

const URL_API = `${API_BASE}/personas`;
let API_KEY_IMGBB = '385c7634aedac86d2eb5819ab58fc146';

// Cargar configuración pública desde el servidor (.env)
async function obtenerApiKeyImgBB() {
    try {
        const res = await fetch(`${API_BASE}/api/config`);
        if (res.ok) {
            const config = await res.json();
            if (config.imgbbApiKey) {
                API_KEY_IMGBB = config.imgbbApiKey;
            }
        }
    } catch {
        // En caso de error, utiliza el valor por defecto
    }
    return API_KEY_IMGBB;
}

obtenerApiKeyImgBB();

async function subirImagen(file) {
    const formdata = new FormData();
    formdata.append('image', file);

    mostrarMensaje("Subiendo imagen...", "info");
    try {
        const apiKey = await obtenerApiKeyImgBB();
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formdata
        });
        const data = await response.json();

        if (data.success) {
            return data.data.url;
        } else {
            mostrarMensaje(`Error ImgBB: ${data.error.message}`, "error");
            return null;
        }
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        mostrarMensaje("Error al subir la imagen", "error");
        return null;
    }
}

function mostrarJuegos(juegos) {
    const cont = document.querySelector("#listadoJuegos");
    cont.innerHTML = "";

    if (!Array.isArray(juegos) || juegos.length === 0) {
        cont.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">No se encontraron registros.</p>';
        return;
    }

    juegos.forEach(j => {
        cont.innerHTML += `
            <div class="card-juego">
                <img src="${j.imagen || 'https://via.placeholder.com/300x400?text=Sin+Imagen'}" alt="${j.titulo}">
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
        `;
    });
}

async function cargarJuegos() {
    try {
        const res = await fetch(URL_API);
        if (!res.ok) throw new Error('Error al cargar juegos');
        const juegos = await res.json();
        mostrarJuegos(juegos);
    } catch (error) {
        console.error("Error al cargar juegos:", error);
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

        if (!res.ok) throw new Error('Error al agregar');
        await res.text();

        mostrarMensaje("Juego agregado con éxito", "success");
        await cargarJuegos();
    } catch (error) {
        mostrarMensaje("Error al agregar el juego", "error");
        console.error("Error al agregar el juego:", error);
    }
}

async function cargarFormModificar(id) {
    try {
        const res = await fetch(`${URL_API}/${id}`);
        if (!res.ok) throw new Error('Error al cargar el juego');
        const juego = await res.json();

        const form = document.querySelector("#form-modificar");
        form.idJuego.value = juego.id;
        form.titulo.value = juego.titulo;
        form.anio.value = juego.anio;
        form.genero.value = juego.genero;
        form.imagenActual.value = juego.imagen || '';

        document.querySelector("#modal-modificar").style.display = "flex";
    } catch (error) {
        mostrarMensaje("Error al cargar el juego para modificar", "error");
        console.error("Error al cargar formulario:", error);
    }
}

async function modificarJuego(id, juegoEditado) {
    try {
        const res = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(juegoEditado)
        });

        if (!res.ok) throw new Error('Error al modificar');

        mostrarMensaje("Juego modificado", "success");
        await cargarJuegos();
    } catch (error) {
        mostrarMensaje("Error al modificar", "error");
        console.error("Error al modificar el juego:", error);
    }
}

async function eliminarJuego(id) {
    if (!confirm("¿Estás seguro de eliminar este juego?")) return;

    try {
        const res = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Error al eliminar');

        mostrarMensaje("Juego eliminado", "success");
        await cargarJuegos();
    } catch (error) {
        mostrarMensaje("Error al eliminar", "error");
        console.error("Error al eliminar el juego:", error);
    }
}

async function buscarJuegos(titulo, genero) {
    try {
        const params = new URLSearchParams();
        if (titulo && titulo.trim()) params.append('titulo', titulo.trim());
        if (genero && genero.trim()) params.append('genero', genero.trim());

        const queryString = params.toString() ? `?${params.toString()}` : '';
        const res = await fetch(`${URL_API}/buscar${queryString}`);
        if (!res.ok) throw new Error('Error al buscar juegos');

        const juegos = await res.json();
        mostrarJuegos(juegos);
    } catch (error) {
        mostrarMensaje("Error en la búsqueda", "error");
        console.error("Error en la búsqueda:", error);
    }
}
