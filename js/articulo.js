import { clickMenuHambur, cargarNumeritoEnIcono } from "./funciones.js";
clickMenuHambur();

//obtengo por parametro de la URL el codigo del articulo 
const params = new URLSearchParams(window.location.search);
const codArticulo = params.get('codigo');

let articulos = [];

const contenedorArticulo = document.querySelector("#container_articulo");

let botonAgregar = document.querySelectorAll(".agregar_articulo_carrito");
let botonIrCarrito = document.getElementById("link_ir_a_carrito");


//Solución que encontré para poder hacer uso de los botones. Puesto que de otro modo me los tomaba como null
//En base a esta función explico algo mas en la función recuperarInfoArticulo
function updateBotones() 
{
    botonAgregar = document.querySelectorAll(".agregar_articulo_carrito");
    botonAgregar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
    });

    botonIrCarrito = document.getElementById("link_ir_a_carrito");
    botonIrCarrito.addEventListener("click", () => {
        window.location.href="../pages/carrito.html"
    });
}

let articulosEnCarrito = localStorage.getItem("articulos-en-carrito");
articulosEnCarrito = JSON.parse(articulosEnCarrito);



//Esto me hubiese gustado sacarlo de este script y ponerlo en funciones.js porque es común en muchos. Sinceramente probé varias cosas para poder hacerlo pero no me dió resultado. Creo que el problema es de asincronismo.
//Lo que queria lograr es lo siguiente: 
//const articulos = cargarArticulos(url);
//el argumento de url es el path en donde se encuentre el json
//la variable articulos va a tener todos los articulos cargados desde el json
fetch("../data/articulos.json")
.then(response => response.json())
.then(data => {
    articulos = data;
    recuperarInfoArticulo(codArticulo);
});
////////////////////////////////////////

cargarNumeritoEnIcono(articulosEnCarrito);



//Del array obtenido, donde se encuantran todos los articulos que hay almacenados en el json, recorro en busca de encontrar el articulo que paso por parametro a esta funcion. Esto es para seleccionar únicamente un articulo en particular que el usuario ha de clickear para ver mayor info y detalles sobre dicho articulo.
//Básicamente creo una etiqueta div donde voy armando la estructura con su contenido html
//Respecto a la llamada de la funcion updateBotones() fue la solución que le encontré para poder recuperar los botones y poder asignarle los eventos a cada uno. Probé montones de cosas pero al consultar por los botones eran null. Creo que el problema está en los momentos de la creación o el AJAX o el asincronismo (algo de eso es. Como dije probé bastante pero nada funcionó)
function recuperarInfoArticulo(codigo)
{
    const articuloSeleccionado = articulos.find(articulo => articulo.codigo === codigo);
    contenedorArticulo.innerHTML = "";
    const divN = document.createElement("div");
    divN.classList.add("div_articulo");
    divN.innerHTML = 
    `
        <div class="div_img img_a"><img class="img_articulo" src="${articuloSeleccionado.imagen2}" alt="${articuloSeleccionado.titulo}"></div>
        <div class="div_descripcion">
            <p class="descripcion_articulo descripcion_a">${articuloSeleccionado.descripcion}</p>
        </div>
        <div class="div_titulo titulo_a"><h5 class="titulo_articulo_detalle">${articuloSeleccionado.titulo}</h5></div>
        <div class="div_detalles detalles_a">
            <p class="precio_articulo_detalle">$${articuloSeleccionado.precio}</p>
            <p class="precio_oferta_articulo_detalle">$${articuloSeleccionado.precio_oferta}</p>
            <p class="marca_articulo_detalle"><span class="span_detalle">Marca:</span> ${articuloSeleccionado.marca}</p>
            <p class="color_articulo_detalle"><span class="span_detalle">Color:</span> ${articuloSeleccionado.color}</p>
            <p class="talle_articulo_detalle"><span class="span_detalle">Talle:</span> ${articuloSeleccionado.talle}</p>
        </div>    
        <div class="container_btn botones">
            <button class="agregar_articulo_carrito" id="${articuloSeleccionado.codigo}">Agregar al Carrito</button>
            <button class="link_ir_a_carrito" id="link_ir_a_carrito"><i class="fa-solid fa-cart-shopping icn-cart"></i> Ir al Carrito</button>
        </div>  
    </div>     
    `;

    contenedorArticulo.append(divN);
    updateBotones(); 
}


//Al hacer clic sobre un elemento que indique que se va a agregar un articulo al carrito, esta función hará esto justamente; y además le agrego un modal (Toastify) donde se le indica y da noción al usuario que dicho articulo fue agregado al carrito satisfactoriamente.
//La lógica que empleo es si el articulo que cliqueo para agregar al carrito ya existe en el carrito, entonces actualizo la cantidad en lugar de agregar otra entrada (otro contenedor) en la pagina de carrito
function agregarAlCarrito(e) 
{
    Toastify(
    {
        text: "Articulo agregado",
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