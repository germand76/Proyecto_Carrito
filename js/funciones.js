//cambio el icono hamburguesa por una X. Cuando se hace clic sobre el menu hamburguesa se despliga el menu propiamente dicho y allí cambio el icono por un X para indicar que desde allí, haciendo clic también, se cierra el menu
export const clickMenuHambur = () =>
{
    const menuHambur = document.querySelector(".menu_hamburguer");
    const icons = menuHambur.querySelector("i");
    const nav = document.querySelector(".navegacion");
    menuHambur.addEventListener("click", () =>
    {
        if(icons.classList.contains("fa-bars"))
        {
            icons.classList.remove("fa-bars");
            icons.classList.add("fa-xmark");
        }
        else
        { 
            icons.classList.remove("fa-xmark"); 
            icons.classList.add("fa-bars");
        }
        nav.classList.toggle("nav-reponsive");
    });
}

//funcion que encontré para poder formatear numeros
export let formatearNumero = (numero, decimales, separadorMiles, separadorDecimales) =>
{
    const partes = numero.toFixed(decimales).toString().split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, separadorMiles); // Regex para el separador de miles
    return partes.join(separadorDecimales);
}


//Recorro los articulos que tengo (o no) cargados en el carrito, que previamente se fue almacenando en el Local Storage para obtener la cantidad de articulos que justamente hay en el carrito. Una vez obtenido el numero (la cantidad de articulos que tengo añadido en el carrito), los inserto en una etiqueta html para que sea mostrado
export const cargarNumeritoEnIcono = (ls) =>
{
    let nuevoNumerito = ls.reduce((acc, articulo) => acc + articulo.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}



