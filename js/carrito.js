var link = document.querySelector('link[rel="shortcut icon"]');
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  // El navegador está en modo oscuro
  link.href = "./source/icon-blanco.png";
} else {
  // El navegador está en modo claro
  link.href = "./source/icon.png";
}

let productsInCart = localStorage.getItem("products-in-cart");
productsInCart = JSON.parse(productsInCart);

const containerCartEmpty = document.querySelector("#cart-empty");
const containerCartProducts = document.querySelector("#cart-products");
const containerCartActions = document.querySelector("#cart-actions");
const containerCartBuying = document.querySelector("#cart-buying");
let buttonsDelete = document.querySelectorAll(".cart-product-delete");
const buttonEmpty = document.querySelector("#cart-actions-empty");
const containerTotal = document.querySelector("#total");
const buttonBuy = document.querySelector("#cart-actions-buy");
const cartTableSpecifications = document.querySelector(".cart-table-specifications");

function loadProductsCart() {
  if (productsInCart && productsInCart.length > 0) {
    containerCartEmpty.classList.add("disabled");
    containerCartProducts.classList.remove("disabled");
    containerCartActions.classList.remove("disabled");
    containerCartBuying.classList.add("disabled");

    containerCartProducts.innerHTML = "";

    productsInCart.forEach((product) => {
      const div = document.createElement("div");
      div.classList.add("cart-product");
      div.innerHTML = `
                <img class="cart-product-image" src="${product.image}" alt="${
        product.titule
      }">
                <div class="cart-product-titule">
                    <h3>${product.titule}</h3>
                </div>
                <div class="cart-product-amount">
                    <p>${product.amount}</p>
                </div>
                <div class="cart-product-price">
                    <p>$${product.price}</p>
                </div>
                <div class="cart-product-subtotal">
                    <p>$${product.price * product.amount}</p>
                </div>
                <button class="cart-product-delete" id="${
                  product.id
                }"><i class="bi bi-trash-fill"></i></button>
            `;

      containerCartProducts.append(div);
    });

    updateButtonsDelete();
    updateTotal();
  } else {
    containerCartEmpty.classList.remove("disabled");
    containerCartProducts.classList.add("disabled");
    containerCartActions.classList.add("disabled");
    containerCartBuying.classList.add("disabled");
  }
}

loadProductsCart();

function updateButtonsDelete() {
  buttonsDelete = document.querySelectorAll(".cart-product-delete");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

function removeFromCart(e) {
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();

  const idButton = e.currentTarget.id;
  const index = productsInCart.findIndex((product) => product.id === idButton);

  productsInCart.splice(index, 1);
  loadProductsCart();

  localStorage.setItem("products-In-cart", JSON.stringify(productsInCart));
}

buttonEmpty.addEventListener("click", emptyCart);
function emptyCart() {
  Swal.fire({
    title: "¿Estás seguro?",
    icon: "question",
    html: `Se van a borrar ${productsInCart.reduce(
      (acc, product) => acc + product.amount,
      0
    )} products.`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      productsInCart.length = 0;
      localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));
      loadProductsCart();
    }
  });
}

function updateTotal() {
  const totalCalculator = productsInCart.reduce(
    (acc, product) => acc + product.price * product.amount,
    0
  );
  total.innerText = `$${totalCalculator}`;
}

buttonBuy.addEventListener("click", buyCart);
function buyCart() {
  productsInCart.length = 0;
  localStorage.setItem("products-in-cart", JSON.stringify(productsInCart));

  cartTableSpecifications.classList.add("disabled");
  containerCartEmpty.classList.add("disabled");
  containerCartProducts.classList.add("disabled");
  containerCartActions.classList.add("disabled");
  containerCartBuying.classList.remove("disabled");
}
