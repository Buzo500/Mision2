const mensaje = document.querySelector("#mensaje");

export function mostrarMensaje(texto) {
  mensaje.textContent = texto;
}
