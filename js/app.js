import { clickMenuHambur, cargarNumeritoEnIcono } from "./funciones.js";
clickMenuHambur();

//const path_img_section = "./assets";

let articulos = []; 

fetch("./js/articulos.json")
    .then(response => response.json())
    .then(data => {
        articulos = data;
        cargarArticulos(articulos);
    });

const containerArticulos = document.querySelector("#container_articulos");
let btnAgregar = document.querySelectorAll(".agregar_articulo");
const numerito = document.querySelector("#numerito");





//Recorro el array que le paso como argumento de la funcion. Dicho argumento contendrá todos los articulos cargados desde el json.
//También creo un tag div donde voy a ir armando la card de cada uno de los articulos almacenados
function cargarArticulos(arrayArticulos)
{
    containerArticulos.innerHTML = "";
    arrayArticulos.forEach(articulo => 
    {
        const div = document.createElement("div");
        div.classList.add("articulo");
        div.innerHTML = `
            <img class="img_articulo" src="${articulo.imagen}" alt="${articulo.titulo}">
            <div class="detalles_articulo">
                <h3 class="titulo_articulo">${articulo.titulo}</h3>
                <p class="articulo-precio">$${articulo.precio}</p>
                <p class="articulo-precio-oferta">$${articulo.precio_oferta}</p>
                <!--<button class="agregar_articulo" id="${articulo.codigo}">Agregar al Carrito</button>-->
                <div class="button-group">
                    <span><a class="btn-detalles" href="../pages/articulo.html?codigo=${articulo.codigo}"><i class="fa-regular fa-eye" title="Ver Detalles"></i></a></span>
                    <span><i class="fa-regular fa-heart" id="icn_fav" title="Agregar a Favoritos"></i></span>
                </div>
                <button class="agregar_articulo" id="${articulo.codigo}">Agregar al Carrito</button>
        </div>`;
        containerArticulos.append(div);
    });

    updateBotonAgregar();
}






function updateBotonAgregar() 
{
    btnAgregar = document.querySelectorAll(".agregar_articulo");
    btnAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });    
}

    
let articulosEnCarrito;
let articulosEnCarritoLS = localStorage.getItem("articulos-en-carrito");

if (articulosEnCarritoLS) 
{
    articulosEnCarrito = JSON.parse(articulosEnCarritoLS);
    cargarNumeritoEnIcono(articulosEnCarrito);
} else 
{
    articulosEnCarrito = [];
}


function agregarAlCarrito(e) 
{
    Toastify(
    {
        text: "Articulo Agregado",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #FC5B6F, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
            },
        onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const articuloAgregado = articulos.find(articulo => articulo.codigo === idBoton);
        
    //si el articulo que cliqueo para agregar al carrito ya existe en el carrito, entonces actualizo la cantidad en lugar de agregar otra entrada (otro contenedor) en la pagina de carrito
    if(articulosEnCarrito.some(articulo => articulo.codigo === idBoton)) 
    {
        const index = articulosEnCarrito.findIndex(articulo => articulo.codigo === idBoton);
        articulosEnCarrito[index].cantidad++;
    }
    else
    {
        articuloAgregado.cantidad = 1;
        articulosEnCarrito.push(articuloAgregado);
    }

    cargarNumeritoEnIcono(articulosEnCarrito);

    localStorage.setItem("articulos-en-carrito", JSON.stringify(articulosEnCarrito));
}