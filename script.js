document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Armo la base de datos
    const baseDeDatos = [
        {
            id: 1,
            nombre: "Mochi Vainilla",
            precio: 6,
            description:
                "Dulce de origen japonés, elaborado con una masa blanda de arroz, relleno de helado y espolvoreado con almidón. Sabor Vainilla",
            imagen: "vanilla.jpg",
        },
        {
            id: 2,
            nombre: "Mochi Passion Fruit",
            precio: 10,
            description:
                "Dulce de origen japonés, elaborado con una masa blanda de arroz, relleno de helado y espolvoreado con almidón. Sabor Passion Fruit",
            imagen: "passionfruit.jpg",
        },
        {
            id: 3,
            nombre: "Mochi Matcha",
            precio: 8,
            description:
                "Dulce de origen japonés, elaborado con una masa blanda de arroz, relleno de helado y espolvoreado con almidón. Sabor Matcha",
            imagen: "te-matcha.jpg",
        },
        {
            id: 4,
            nombre: "Mochi Pistaccio",
            precio: 6,
            description:
                "Dulce de origen japonés, elaborado con una masa blanda de arroz, relleno de helado y espolvoreado con almidón. Sabor Pistaccio",
            imagen: "pistaccio.jpg",
        },

        {
            id: 5,
            nombre: "Mochi Yuzu",
            precio: 6,
            description:
                "Este mochi está hecho de helado con jugo puro de yuzu. En la boca, sentimos un toque de jugo de limón prensado cubierto con una deliciosa pasta con sabor a limón.",
            imagen: "yuzu.jpg",
        },

        {
            id: 6,
            nombre: "Mochi Mango",
            precio: 6,
            description:
                "Dulce de origen japonés, elaborado con una masa blanda de arroz, relleno de helado y espolvoreado con almidón. Sabor Frutal Mango",
            imagen: "mango.jpg",
        },
    ];

    // Declaración de variables
    let carrito = [];
    let total = 0;
    const items = document.querySelector("#items");
    const miCarrito = document.querySelector("#carrito");
    const totalCarrito = document.querySelector("#total");

    // Funciones

    /*Armado de las cards con clases de BS para evitar porner una a una en el HTML*/

    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            // Distribución basada en BS para el responsive
            const miNodoHTML = document.createElement("div");
            miNodoHTML.classList.add(
                "card",
                "col-xs-12",
                "col-sm-6",
                "col-md-4",
                "col-lg-3",
                "m-2"
            );

            // Body de las card de los productos
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            // Título del producto
            const cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title");
            cardTitle.textContent = info.nombre;

            // Imagenes
            const cardImg = document.createElement("img");
            cardImg.classList.add("img-fluid");
            cardImg.setAttribute("src", info.imagen);

            // Precio
            const cardPrice = document.createElement("p", "text-right");
            cardPrice.classList.add("card-text");
            cardPrice.textContent = info.precio + "$";

            // Boton de agregar item al carrito
            const addButton = document.createElement("button");
            addButton.classList.add("btn", "btn-warning", "m-1");
            addButton.textContent = "Agregar al carrito";
            addButton.setAttribute("marcador", info.id);
            addButton.addEventListener("click", anadirProductoAlCarrito);

            // Boton de detalles para abrir el Modal
            const productsDetails = document.createElement("button");
            productsDetails.classList.add("btn", "btn-warning", "m-1");
            productsDetails.textContent = "Ver detalles";
            productsDetails.setAttribute("marcador", info.id);
            productsDetails.addEventListener("click", mostrarDetalle);

            // Insertamos todo los items generados anteriormente
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardImg);
            cardBody.appendChild(cardPrice);
            cardBody.appendChild(addButton);
            cardBody.appendChild(productsDetails);
            miNodoHTML.appendChild(cardBody);
            items.appendChild(miNodoHTML);
        });
    }

    //Ventana Modal

    function mostrarDetalle(evento) {
        let id = parseInt(evento.target.getAttribute("marcador"));

        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === id;
        })[0];
        const ventanaModal = document.createElement("div");
        ventanaModal.id = "big";

        //Creamos la imagen de la ventana Modal
        const cardImg = document.createElement("img");
        cardImg.classList.add("img-fluid");
        cardImg.setAttribute("src", miItem.imagen);

        //Creamos la descripción del parrafo de la ventana Modal
        const parrafo = document.createElement("p");
        parrafo.textContent = miItem.description;

        //Botón para agregar productos al carrito
        const addButton = document.createElement("button");
        addButton.classList.add("btn", "btn-warning");
        addButton.textContent = "Agregar al carrito";
        addButton.setAttribute("marcador", id);
        addButton.addEventListener("click", anadirProductoAlCarrito);

        //Creaamos el icono de "close" de la ventana Modal
        const closeButton = document.createElement("a");
        closeButton.textContent = "X";
        closeButton.addEventListener("click", cerrarModal);

        ventanaModal.appendChild(closeButton);
        ventanaModal.appendChild(cardImg);
        ventanaModal.appendChild(parrafo);
        ventanaModal.appendChild(addButton);
        const body = document.querySelector("body");
        body.appendChild(ventanaModal);
    }

    // Función para cerrar la ventana Modal
    function cerrarModal(evento) {
        evento.preventDefault();
        const ventanaModal = document.querySelector("#big");
        ventanaModal.remove();
    }

    //Eventos para añadir productos al carrito
    function anadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute("marcador"));
        calcularTotal();
        renderizarCarrito();
    }

    //Redenrizar los producto en el carrito

    function renderizarCarrito() {
        miCarrito.textContent = "";
        // Se sacan los duplicados por medio de un set y generamos los datos a partir del carrito y luego con un filter obtenemos el item que queremos y evaluamos si coinciden los ID
        const productosDuplicados = [...new Set(carrito)];
        productosDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });

            // Contamos cuantas veces se repite el producto y si los ID coinciden se incremente el contador (sino lo mantenemos)
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? (total += 1) : total;
            }, 0);

            // Creamos el texto y el valor del item del carrito
            const miNodoHTML = document.createElement("li");
            miNodoHTML.classList.add(
                "list-group-item",
                "text-right",
                "mx-0",
                "my-2"
            );
            miNodoHTML.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - $ ${miItem[0].precio}`;

            // Sumamos los nodos
            miCarrito.appendChild(miNodoHTML);
        });
    }

    // Calculamos el precio total en base a productos repetidos
    function calcularTotal() {
        total = 0;
        // Recorremos el array del carrito y renderizamos los precios en HTML
        carrito.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            total = total + miItem[0].precio;
        });
        totalCarrito.textContent = total.toFixed(2);
    }

    renderizarProductos();
    calcularTotal();
    renderizarCarrito();
});
