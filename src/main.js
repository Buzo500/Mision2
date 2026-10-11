import "./style.css";
import { buscarRecetas } from "./api.js";
import { prepararRecetas } from "./logica.js";
import {
  cambiarCarga,
  mostrarEstado,
  mostrarError,
  mostrarRecetas,
} from "./render.js";

const formulario = document.querySelector("#formulario-busqueda");
const entrada = document.querySelector("#busqueda");
const botonReintentar = document.querySelector("#boton-reintentar");

let cargando = false;
let ultimaBusqueda = "";

mostrarEstado("La mesa está puesta.", "Busca un plato y encuentra inspiración para tu próxima comida.");

async function realizarBusqueda(nombre) {
  if (cargando) return;

  if (!nombre) {
    mostrarEstado("Falta el primer ingrediente.", "Escribe el nombre de un plato para buscar recetas.");
    return;
  }

  ultimaBusqueda = nombre;
  cargando = true;
  cambiarCarga(true);
  mostrarEstado("Un momento, estamos en la cocina.", `Buscando recetas para «${nombre}»…`);

  try {
    const datos = await buscarRecetas(nombre);
    const recetas = prepararRecetas(datos);
    mostrarRecetas(recetas, nombre);
  } catch (error) {
    console.error("Error al buscar recetas:", error);
    mostrarError();
  } finally {
    // También se recuperan los controles si la petición falla.
    cargando = false;
    cambiarCarga(false);
  }
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nombre = entrada.value.trim();
  entrada.value = nombre;
  await realizarBusqueda(nombre);
  entrada.focus();
});

botonReintentar.addEventListener("click", async () => {
  entrada.value = ultimaBusqueda;
  await realizarBusqueda(ultimaBusqueda);
  entrada.focus();
});
