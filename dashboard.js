// SUPABASE CONNECTION
const SUPABASE_URL = "https://yotxhnqienfkzozozdac.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bcFs3yr8QcC6Hc0v1WIdsA_o_vGDdnl";
const CART_WEBHOOK_URL = "https://pranesh500.app.n8n.cloud/webhook/shopease-cart-event ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
const customerWelcome =
    document.getElementById("customerWelcome");

const logoutButton =
    document.getElementById("logoutButton");
let currentUser = null;
async function checkLogin() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error || !data.session) {

        window.location.href = "login.html";
        return;

    }
    currentUser = {
    userId: data.session.user.id,
    email: data.session.user.email,
    name: data.session.user.user_metadata.full_name
};
    const customerName =
        data.session.user.user_metadata.full_name;

    customerWelcome.textContent =
        "Welcome back, " + (customerName || "Customer") + "!";

}
let cart = [];
const products = [
    {
        id: 1,
        name: "Crochet",
        image: "images/crochet.jpeg",
        price: 1500,
        description: "Softness."
        
    },
    {
        id: 2,
        image: "images/Cute babyy.jpeg",
        name: "BABY DOLL",
        price: 1000000000000000000,
        description: "Cute."
    
    },
    {
        image: "images/ribbon.jpeg",
        id: 3,
        name: "RIBBON",
        price: 999,
        description: "tie it!"
    },
    {
        image: "images/Cap.jpeg",
        id: 4,
        name: "CAP",
        price: 1500,
        description: "make yourself warm"
    }
        ,
    {
        id: 5,
        name: "EARPODSS COVER",
        price: 500,
        description: "Cover your earpod.",
        image: "images/earpodss.jpeg"
    },
    {
        id: 6,
        name: "EARRING",
        price: 10000,
        description: "Wear it & be a beauty!",
        image: "images/earring.jpeg"
    },
    {
        id: 7,
        name: "GREETING CARD",
        price: 50000,
        description: "To your loved one!",
        image: "images/greetingcard.jpeg"
    },
   {
        id: 8,
        name: "CUTE COUPLES",
        price: 1000000000000,
        description: "Always loving!.",
        image: "images/us.jpeg"
    },
    {
        id: 9,
        name: "KITKAT",
        price: 1000,
        description: "Take a break",
        image: "images/kitkat.jpeg"
    },
      {
        id: 10,
        name: "CHOCOLATE",
        price: 10000,
        description: "too much love.",
        image: "images/little.jpeg"
    },
       {
        id: 11,
        name: "Present",
        price: 10000,
        description: "For your loved one!.",
        image: "images/silk.jpeg"
    },
       {
        id: 12,
        name: "SURPRISE",
        price: 100000000000000000000,
        description: "Only for you!",
        image: "images/present.jpeg"
    },
   
];
checkLogin();
const productContainer =
    document.getElementById("productContainer");

products.forEach(function(product) {

    const productCard = document.createElement("div");

    productCard.className = "product-card";

    productCard.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <h4>₹${product.price}</h4>

    <button class="add-to-cart"
        data-id="${product.id}">
        Add to Cart
    </button>
    <button class="order-product"
    data-id="${product.id}">
    Order
</button>
`;

    productContainer.appendChild(productCard);

});
document.querySelectorAll(".add-to-cart").forEach(function(button) {

    button.addEventListener("click", function() {

        const productId = Number(button.dataset.id);

        const selectedProduct = products.find(function(product) {
            return product.id === productId;
        });

        const cartEventId = crypto.randomUUID();

cart.push({
    ...selectedProduct,
    cartEventId: cartEventId
});
        fetch(CART_WEBHOOK_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        eventType: "ADD_TO_CART",
        eventId: cartEventId,
        userId: currentUser.userId,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        eventTime: new Date().toISOString()
    })
})
.then(function(response) {

    if (!response.ok) {
        throw new Error("Webhook returned HTTP " + response.status);
    }

    console.log("Cart event sent to n8n!");

})
.catch(function(error) {
    console.log("Cart event failed:", error);
});

        document.getElementById("cartCount").textContent =
            cart.length;

        alert(selectedProduct.name + " added to cart!");

    });

});
document.querySelectorAll(".order-product").forEach(function(button) {

    button.addEventListener("click", function() {

        const productId = Number(button.dataset.id);

        const selectedProduct = products.find(function(product) {
            return product.id === productId;
        });

        const cartIndex = cart.findIndex(function(product) {
            return product.id === productId;
        });

      if (cartIndex === -1) {

    alert("Please add this product to your cart first!");
    return;

}

const cartItem = cart[cartIndex];

fetch(CART_WEBHOOK_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        eventType: "ORDER_PLACED",
        eventId: cartItem.cartEventId,
        userId: currentUser.userId,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        eventTime: new Date().toISOString()
    })
})
.then(function(response) {

    if (!response.ok) {
        throw new Error("Webhook returned HTTP " + response.status);
    }

    console.log("Order event sent to n8n!");

})
.catch(function(error) {
    console.log("Order event failed:", error);
});

cart.splice(cartIndex, 1);

        document.getElementById("cartCount").textContent =
            cart.length;

        alert("Order placed successfully for " + selectedProduct.name + "!");

    });

});
logoutButton.addEventListener("click", async function() {

    const { error } = await supabaseClient.auth.signOut({
    scope: "local"
});

    if (error) {
        alert("Logout failed. Please try again.");
        return;
    }

    window.location.href = "login.html";

});