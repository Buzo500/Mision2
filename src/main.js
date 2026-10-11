import "./style.css";
import { buscarRecetas } from "./api.js";
import { prepararRecetas, filtrarPorCategoria, resumirCategorias } from "./logica.js";
import {
  cambiarCarga,
  mostrarEstado,
  mostrarError,
  mostrarRecetas,
  mostrarCategorias,
  mostrarResumen,
  mostrarDetalle,
  ocultarDetalle,
} from "./render.js";

const formulario = document.querySelector("#formulario-busqueda");
const entrada = document.querySelector("#busqueda");
const botonReintentar = document.querySelector("#boton-reintentar");
const categoria = document.querySelector("#categoria");
const contenedorRecetas = document.querySelector("#recetas");
const botonCerrarDetalle = document.querySelector("#cerrar-detalle");

let cargando = false;
let ultimaBusqueda = "";
let recetasCargadas = [];
let recetasVisibles = [];
let botonDetalleAbierto = null;

mostrarEstado("La mesa está puesta.", "Busca un plato y encuentra inspiración para tu próxima comida.");

function limpiarResultados() {
  recetasCargadas = [];
  recetasVisibles = [];
  botonDetalleAbierto = null;
  mostrarCategorias([]);
  mostrarResumen([]);
  ocultarDetalle();
}

function actualizarResultados() {
  recetasVisibles = filtrarPorCategoria(recetasCargadas, categoria.value);
  botonDetalleAbierto = null;
  ocultarDetalle();
  mostrarRecetas(recetasVisibles, ultimaBusqueda, categoria.value);
}

async function realizarBusqueda(nombre) {
  if (cargando) return;

  limpiarResultados();

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
    recetasCargadas = prepararRecetas(datos);
    const categorias = resumirCategorias(recetasCargadas);
    mostrarCategorias(categorias);
    mostrarResumen(categorias);
    actualizarResultados();
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

// El filtro y el detalle usan los datos ya recibidos, sin otra petición.
categoria.addEventListener("change", actualizarResultados);

contenedorRecetas.addEventListener("click", (event) => {
  const boton = event.target.closest(".ver-receta");
  if (!boton || !contenedorRecetas.contains(boton)) return;

  // El índice corresponde al array visible después de aplicar el filtro.
  const receta = recetasVisibles[boton.getAttribute("data-indice")];
  if (!receta) return;

  botonDetalleAbierto = boton;
  mostrarDetalle(receta);
});

botonCerrarDetalle.addEventListener("click", () => {
  ocultarDetalle();
  if (botonDetalleAbierto) botonDetalleAbierto.focus();
  botonDetalleAbierto = null;
});
