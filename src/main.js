import "./style.css";
import { buscarRecetas, ErrorBusqueda } from "./api.js";
import { prepararRecetas, filtrarPorCategoria, resumirCategorias } from "./logica.js";
import { iniciarRender } from "./render.js";

const formulario = document.querySelector("#formulario-busqueda");
const entrada = document.querySelector("#busqueda");
const botonReintentar = document.querySelector("#boton-reintentar");
const categoria = document.querySelector("#categoria");
const contenedorRecetas = document.querySelector("#recetas");
const botonCerrarDetalle = document.querySelector("#cerrar-detalle");

const {
  cambiarCarga,
  mostrarEstado,
  mostrarError,
  mostrarRecetas,
  mostrarCategorias,
  mostrarResumen,
  mostrarDetalle,
  ocultarDetalle,
} = iniciarRender({
  mensaje: document.querySelector("#mensaje"),
  estadoResultados: document.querySelector("#estado-resultados"),
  tituloResultados: document.querySelector("#titulo-resultados"),
  iconoEstado: document.querySelector("#icono-estado"),
  contenedorRecetas,
  botonReintentar,
  selectorCategoria: categoria,
  resumen: document.querySelector("#resumen"),
  resumenCategorias: document.querySelector("#resumen-categorias"),
  detalle: document.querySelector("#detalle"),
  nombreDetalle: document.querySelector("#detalle-nombre"),
  origenDetalle: document.querySelector("#detalle-origen"),
  ingredientesDetalle: document.querySelector("#detalle-ingredientes"),
  sinIngredientes: document.querySelector("#sin-ingredientes"),
  instruccionesDetalle: document.querySelector("#detalle-instrucciones"),
});

let idBusquedaActual = 0;
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
  // También una búsqueda vacía invalida cualquier respuesta anterior pendiente.
  const idBusqueda = ++idBusquedaActual;

  limpiarResultados();

  if (!nombre) {
    cambiarCarga(false);
    mostrarEstado("Falta el primer ingrediente.", "Escribe el nombre de un plato para buscar recetas.");
    entrada.focus();
    return;
  }

  ultimaBusqueda = nombre;
  cambiarCarga(true);
  mostrarEstado("Un momento, estamos en la cocina.", `Buscando recetas para «${nombre}»…`);

  try {
    const datos = await buscarRecetas(nombre);
    if (idBusqueda !== idBusquedaActual) return;

    recetasCargadas = prepararRecetas(datos);
    const categorias = resumirCategorias(recetasCargadas);
    mostrarCategorias(categorias);
    mostrarResumen(categorias);
    actualizarResultados();
  } catch (error) {
    if (idBusqueda !== idBusquedaActual) return;

    console.error("Error al buscar recetas:", error);
    mostrarError(error instanceof ErrorBusqueda ? error.message : undefined);
  } finally {
    // Una petición antigua no puede quitar la carga ni recuperar el foco.
    if (idBusqueda === idBusquedaActual) {
      cambiarCarga(false);
      entrada.focus();
    }
  }
}

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nombre = entrada.value.trim();
  entrada.value = nombre;
  await realizarBusqueda(nombre);
});

botonReintentar.addEventListener("click", async () => {
  entrada.value = ultimaBusqueda;
  await realizarBusqueda(ultimaBusqueda);
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
