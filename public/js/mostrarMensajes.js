function mostrarMensaje(mensaje, tipo = 'info') {
    const p = document.querySelector(".mensajes");
    p.textContent = mensaje;
    p.style.display = "block";
    p.className = `mensajes ${tipo}`;
    setTimeout(() => {
        p.style.display = "none";
        p.className = 'mensajes';
    }, 3000);
}
