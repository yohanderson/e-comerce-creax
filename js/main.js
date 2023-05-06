var link = document.querySelector('link[rel="shortcut icon"]');
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // El navegador está en modo oscuro
  link.href = "./source/icon-blanco.png";
} else {
  // El navegador está en modo claro
  link.href = "./source/icon.png";
}

let products = [];

fetch("./js/products.json")
    .then(response => response.json())
    .then(data => {
        products = data;
        loadProducts(products);
    })


const containerProducts = document.querySelector("#container-products");
const buttonsCategories = document.querySelectorAll(".button-categories");
const titulePrincipal = document.querySelector(".titule-principal");
let buttonsAdd = document.querySelectorAll(".product-add");
const number = document.querySelector("#number");


buttonsCategories.forEach(button => button.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function loadProducts(productsChosen) {

    containerProducts.innerHTML = "";

    productsChosen.forEach(product => {

        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${product.titule}">
            <div class="product-details">
                <h3 class="product-titule">${product.titule}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="product-add" id="${product.id}">Agregar</button>
            </div>
        `;

        containerProducts.append(div);
    })

    updateButtonsAdd();
}


buttonsCategories.forEach(button => {
    button.addEventListener("click", (e) => {

        buttonsCategories.forEach(button => button.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "home") {
            const productCategory = products.find(product => product.category.id === e.currentTarget.id);
            titulePrincipal.innerText = productCategory.category.name;
            const productsButton = products.filter(product => product.category.id === e.currentTarget.id);
            loadProducts(productsButton);
        } else {
            titulePrincipal.innerText = "Home";
            loadProducts(products);
        }

    })
});

function updateButtonsAdd() {
    buttonsAdd = document.querySelectorAll(".product-add");

    buttonsAdd.forEach(button => {
        button.addEventListener("click", addToCart);
    });
}

let productsInCart;

let productsInCartLS = localStorage.getItem("products-in-cart");

if (productsInCartLS) {
    productsInCart = JSON.parse(productsInCartLS);
    updateNumber();
} else {
    productsInCart = [];
}

function addToCart(e) {

    Toastify({
        text: "Product agregado",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "grey",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: "0.6rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
          },
        onClick: function(){} 
      }).showToast();

    const idButton = e.currentTarget.id;
    const productAdd = products.find(product => product.id === idButton);

    if(productsInCart.some(product => product.id === idButton)) {
        const index = productsInCart.findIndex(product => product.id === idButton);
        productsInCart[index].amount++;
    } else {
        productAdd.amount = 1;
        productsInCart.push(productAdd);
    }

    updateNumber();

    localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));
}

function updateNumber() {
    let newNumber = productsInCart.reduce((acc, product) => acc + product.amount, 0);
    number.innerText = newNumber;
}