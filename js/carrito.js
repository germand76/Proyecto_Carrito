import { clickMenuHambur, formatearNumero, cargarNumeritoEnIcono } from "./funciones.js";
clickMenuHambur();

//recupero datos almacenados en el local storage
let articulosEnCarrito = localStorage.getItem("articulos-en-carrito");
articulosEnCarrito = JSON.parse(articulosEnCarrito);

const contenedorCarritoVacio = document.getElementById("container_carrito_vacio");
const contenedorCarritoArticulos = document.querySelector("#container_articulos_en_carrito");
const contenedorTotal = document.getElementById("total_a_pagar");
const contenedorAcciones = document.getElementById("acciones");
const numerito = document.querySelector("#numerito");
let btnBorrarArticulo = document.querySelectorAll(".btn_borrar_articulo");

const btnVaciarCarrito = document.getElementById("btn_vaciar_carrito");
btnVaciarCarrito.addEventListener("click", vaciarCarrito);

const botonComprar = document.getElementById("btn_comprar");
botonComprar.addEventListener("click", comprarCarrito);

cargarArticulosCarrito();
cargarNumeritoEnIcono(articulosEnCarrito);


//En esta funcion corroboro si hay o no articulos en carrito. En ambos casos muestro o no (dependiendo el caso) diferentes contenedores. Para esto recorro los articulos almacenados en el local storage
//En caso que haya al menos un articulo en el carrito creo un tag div en donde voy a armando la card con la info que quiero mostrar para cada articulo
function cargarArticulosCarrito() 
{
    if (articulosEnCarrito && articulosEnCarrito.length > 0) 
    {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoArticulos.classList.remove("disabled");
        contenedorAcciones.classList.remove("disabled");
            
        contenedorCarritoArticulos.innerHTML = "";
    
        articulosEnCarrito.forEach(articulo => 
        {
            const subtotal = formatearNumero(articulo.precio_oferta * articulo.cantidad, 3, ',', '.');
            const div = document.createElement("div");
            div.classList.add("card_articulo_en_carrito");
            div.innerHTML = `
                <img class="carrito_articulo_imagen img_a" src="${articulo.imagen2}" alt="${articulo.titulo}">
                <div class="div_articulo_titulo titulo_a">
                    <h3 class="titulo_articulo_en_carrito">${articulo.titulo}</h3>
                </div>
                <div class="div_articulo_cantidad cantidad_a">
                    <p class="sub_titulo">Cantidad</p>
                    <p>${articulo.cantidad}</p>
                </div>
                <div class="div_articulo_precio precio_a">
                    <p class="sub_titulo">Precio</p>
                    <p>$${articulo.precio_oferta}</p>
                </div>
                <div class="div_articulo_subtotal subtotal_a">
                    <p class="sub_titulo">Subtotal</p>
                    <p>$${subtotal}</p>
                </div>
                <div class="div_eliminar_articulo eliminar_a">
                    <button class="btn_borrar_articulo" title="Eliminar del Carrito" id="${articulo.codigo}"><i class="fa-solid fa-trash"></i></button>
                </div>    
            `;
    
            contenedorCarritoArticulos.append(div);
        })
        updateBotonBorrar();
        actualizarTotal();
    } 
    else{
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoArticulos.classList.add("disabled");
        contenedorAcciones.classList.add("disabled");
        contenedorTotal.classList.add("disabled");
        contenedorAcciones.classList.add("disabled");
    }
}

//Solución que encontré para poder hacer uso del boton. Puesto que de otro modo me lo tomaba como null
function updateBotonBorrar() 
{
    btnBorrarArticulo = document.querySelectorAll(".btn_borrar_articulo");
    btnBorrarArticulo.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}


//funcion en donde se va a borrar un articulo de la lista de articulos que estan en el carrito. Para esto se recorren los articulos almacenados en el local storage y se busca aquel articulo cuyo codigo se quiera eliminar
function eliminarDelCarrito(e) 
{
    Toastify(
    {
        text: "Articulo Eliminado",
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
    const index = articulosEnCarrito.findIndex(articulo => articulo.codigo === idBoton);
    
    articulosEnCarrito.splice(index, 1);
    cargarArticulosCarrito();

    localStorage.setItem("articulos-en-carrito", JSON.stringify(articulosEnCarrito));
    cargarNumeritoEnIcono(articulosEnCarrito);
}


//Con esta funcion se irán a eliminar todos los articulos que se encuentran cargados en el carrito. Con lo cual, también, se limpia (libera) el almacenamiento en el local storage.
//Previo a realizar efectiva la eliminacion de los articulos, se pregunta de forma modal (utilizando sweetAlert) si realmente quiere eliminar los articulos que contiene el carrito  
function vaciarCarrito() 
{
    Swal.fire({
        title: '¿Estás seguro que querés vaciar el carrito?',
        icon: 'question',
        html: `Se van a borrar ${articulosEnCarrito.reduce((acc, articulo) => acc + articulo.cantidad, 0)} articulos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => 
       {
        if (result.isConfirmed) 
        {
            articulosEnCarrito.length = 0;
            localStorage.setItem("articulos-en-carrito", JSON.stringify(articulosEnCarrito));
            cargarArticulosCarrito();
            cargarNumeritoEnIcono(articulosEnCarrito);
        }
       })
}


//Se calcula el total de lo que el usuario debe abonar. O sea, a cada articulo en el carrito se va sumando el resultado de la cantidad elegida del mismo por su precio correspondiente. Ese resultado final se mostrará en el html respectivo como el total a pagar 
function actualizarTotal() 
{
    const totalCalculado = articulosEnCarrito.reduce((acc, articulo) => acc + (articulo.precio_oferta * articulo.cantidad), 0);
    const t = formatearNumero(totalCalculado, 3, ',', '.');
    total.innerText = `$${t}`;
}


//Solo se muestra un modal (sweetAlert) con la confirmación de la compra realizada.
//Se limpia (libera) el almacenamiento en el local storage.
//Una vez aceptado el valor de la opcion del modal, se redirige a la pagina principal en donde se encuentran todos los articulos para poder continuar con el proceso de compra
function comprarCarrito() 
{
    articulosEnCarrito.length = 0;
    localStorage.setItem("articulos-en-carrito", JSON.stringify(articulosEnCarrito));
    
    return Swal.fire('Compra realizada con éxito', 'Muchas gracias por comprar en nuestra tienda!', 'success')
               .then(() => window.location.href="../index.html");

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoArticulos.classList.add("disabled");
    contenedorAcciones.classList.add("disabled");
}


