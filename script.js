// ============================
// AMAZON CLONE - JAVASCRIPT
// CART + WISHLIST + FILTER
// ============================


// ============================
// ELEMENTS
// ============================

const searchInput = document.querySelector(".Search-input");
const searchIcon = document.querySelector(".Search-icon");
const boxes = document.querySelectorAll(".box");


// ============================
// SEARCH
// ============================

function searchProducts() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        document.querySelector("#categoryFilter").value;

    boxes.forEach(function (box) {

        const text =
            box.innerText.toLowerCase();

        const category =
            box.dataset.category;

        const matchesSearch =
            searchText === "" ||
            text.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            box.style.display = "";
        } else {
            box.style.display = "none";
        }

    });
}


searchIcon.addEventListener(
    "click",
    searchProducts
);


searchInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            searchProducts();
        }

    }
);


// ============================
// CATEGORY FILTER
// ============================

const categoryFilter =
    document.querySelector("#categoryFilter");


categoryFilter.addEventListener(
    "change",
    searchProducts
);


// ============================
// BACK TO TOP
// ============================

const backToTop =
    document.querySelector(".foot-panel1");


backToTop.addEventListener(
    "click",
    function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// ============================
// AMAZON INDIA LINK
// ============================

const indiaLink =
    document.querySelector(".hero-msg a");


indiaLink.addEventListener(
    "click",
    function () {

        window.open(
            "https://www.amazon.in/",
            "_blank"
        );

    }
);


// ==================================================
// CART
// ==================================================

let cart =
    JSON.parse(
        localStorage.getItem("amazonCart")
    ) || [];


const cartElement =
    document.querySelector(".nav-cart");


const cartCountElement =
    document.createElement("span");


cartCountElement.className =
    "cart-count";


cartElement.appendChild(
    cartCountElement
);


// ============================
// CART COUNT
// ============================

function updateCartCount() {

    const totalItems =
        cart.reduce(
            function (total, item) {
                return total + item.quantity;
            },
            0
        );

    cartCountElement.textContent =
        totalItems;
}


// ============================
// SAVE CART
// ============================

function saveCart() {

    localStorage.setItem(
        "amazonCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


// ============================
// ADD TO CART
// ============================

const addCartButtons =
    document.querySelectorAll(
        ".add-cart-btn"
    );


addCartButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const productName =
                    this.dataset.name;

                const productPrice =
                    Number(this.dataset.price);


                const existingProduct =
                    cart.find(
                        function (item) {
                            return item.name === productName;
                        }
                    );


                if (existingProduct) {

                    existingProduct.quantity++;

                } else {

                    cart.push({
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });

                }


                saveCart();


                const originalText =
                    this.textContent;


                this.textContent =
                    "Added ✓";


                this.style.backgroundColor =
                    "#7fda8a";


                const buttonElement = this;


                setTimeout(
                    function () {

                        buttonElement.textContent =
                            originalText;

                        buttonElement.style.backgroundColor =
                            "";

                    },
                    1000
                );

            }
        );

    }
);


// ============================
// CART CLICK
// ============================

cartElement.addEventListener(
    "click",
    function () {

        showCart();

    }
);


// ============================
// SHOW CART
// ============================

function showCart() {

    const oldModal =
        document.querySelector(".cart-modal");


    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");


    modal.className =
        "cart-modal";


    modal.innerHTML = `

        <div class="cart-box">

            <div class="cart-header">

                <h2>
                    Shopping Cart
                </h2>

                <button
                    class="close-cart"
                    aria-label="Close cart">
                    ×
                </button>

            </div>


            <div class="cart-items">

                ${createCartItems()}

            </div>


            <div class="cart-footer">

                <h3>
                    Subtotal:
                    ₹${calculateTotal().toFixed(2)}
                </h3>

                <button class="checkout-btn">
                    Proceed to Checkout
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    const closeButton =
        modal.querySelector(".close-cart");


    closeButton.addEventListener(
        "click",
        function () {

            modal.remove();

        }
    );


    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {
                modal.remove();
            }

        }
    );


    // INCREASE
    modal.querySelectorAll(
        ".increase"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);

                    cart[index].quantity++;

                    saveCart();

                    modal.remove();

                    showCart();

                }
            );

        }
    );


    // DECREASE
    modal.querySelectorAll(
        ".decrease"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);


                    if (
                        cart[index].quantity > 1
                    ) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(index, 1);

                    }


                    saveCart();

                    modal.remove();

                    showCart();

                }
            );

        }
    );


    // REMOVE
    modal.querySelectorAll(
        ".remove-item"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);

                    cart.splice(index, 1);

                    saveCart();

                    modal.remove();

                    showCart();

                }
            );

        }
    );


    // CHECKOUT
const checkoutButton =
    modal.querySelector(".checkout-btn");


checkoutButton.addEventListener(
    "click",
    function () {

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }

        modal.remove();

        openCheckout();

    }
);

}

// ============================
// CREATE CART ITEMS
// ============================

function createCartItems() {

    if (cart.length === 0) {

        return `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <h3>
                    Your Amazon Cart is empty
                </h3>

                <p>
                    Add some products to get started.
                </p>

            </div>

        `;

    }


    return cart.map(
        function (item, index) {

            const itemTotal =
                item.price * item.quantity;


            return `

                <div class="cart-item">

                    <div class="cart-item-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₹${item.price.toFixed(2)}
                        </p>

                    </div>


                    <div class="quantity">

                        <button
                            class="decrease"
                            data-index="${index}">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="increase"
                            data-index="${index}">
                            +
                        </button>

                    </div>


                    <strong class="item-total">

                        ₹${itemTotal.toFixed(2)}

                    </strong>


                    <button
                        class="remove-item"
                        data-index="${index}">
                        Remove
                    </button>

                </div>

            `;

        }
    ).join("");

}


// ============================
// CALCULATE TOTAL
// ============================

function calculateTotal() {

    return cart.reduce(
        function (total, item) {

            return total +
                (
                    item.price *
                    item.quantity
                );

        },
        0
    );

}


// ==================================================
// WISHLIST
// ==================================================

let wishlist =
    JSON.parse(
        localStorage.getItem("amazonWishlist")
    ) || [];


// ============================
// SAVE WISHLIST
// ============================

function saveWishlist() {

    localStorage.setItem(
        "amazonWishlist",
        JSON.stringify(wishlist)
    );

}


// ============================
// CHECK WISHLIST
// ============================

function isInWishlist(productName) {

    return wishlist.some(
        function (item) {
            return item.name === productName;
        }
    );

}


// ============================
// UPDATE WISHLIST BUTTONS
// ============================

function updateWishlistButtons() {

    const wishlistButtons =
        document.querySelectorAll(
            ".wishlist-btn"
        );


    wishlistButtons.forEach(
        function (button) {

            const productName =
                button.dataset.name;


            if (
                isInWishlist(productName)
            ) {

                button.classList.add(
                    "active"
                );

                button.textContent =
                    "♥ Added to Wishlist";

            } else {

                button.classList.remove(
                    "active"
                );

                button.textContent =
                    "♡ Add to Wishlist";

            }

        }
    );

}


// ============================
// WISHLIST BUTTON CLICK
// ============================

const wishlistButtons =
    document.querySelectorAll(
        ".wishlist-btn"
    );


wishlistButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const productName =
                    this.dataset.name;


                const productPrice =
                    Number(this.dataset.price);


                const existingProduct =
                    wishlist.find(
                        function (item) {

                            return item.name ===
                                productName;

                        }
                    );


                if (existingProduct) {

                    wishlist =
                        wishlist.filter(
                            function (item) {

                                return item.name !==
                                    productName;

                            }
                        );

                } else {

                    wishlist.push({

                        name: productName,

                        price: productPrice

                    });

                }


                saveWishlist();

                updateWishlistButtons();

            }
        );

    }
);


// ============================
// WISHLIST ICON
// ============================

// Wishlist icon automatically create
// Account ke paas show hoga.

const wishlistElement =
    document.createElement("div");


wishlistElement.className =
    "nav-wishlist border";


wishlistElement.innerHTML = `

    <i class="fa-solid fa-heart"></i>

    <span>
        Wishlist
    </span>

`;


const signinElement =
    document.querySelector(
        ".nav-signin"
    );


signinElement.parentNode.insertBefore(
    wishlistElement,
    signinElement
);


// ============================
// WISHLIST CLICK
// ============================

wishlistElement.addEventListener(
    "click",
    function () {

        showWishlist();

    }
);


// ============================
// SHOW WISHLIST
// ============================

function showWishlist() {

    const oldModal =
        document.querySelector(
            ".wishlist-modal"
        );


    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");


    modal.className =
        "wishlist-modal";


    modal.innerHTML = `

        <div class="wishlist-box">

            <div class="wishlist-header">

                <h2>
                    My Wishlist
                </h2>

                <button
                    class="close-wishlist">
                    ×
                </button>

            </div>


            <div class="wishlist-items">

                ${createWishlistItems()}

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    modal.querySelector(
        ".close-wishlist"
    ).addEventListener(
        "click",
        function () {

            modal.remove();

        }
    );

    closeButton.addEventListener(
        "click",
        function () {
            modal.remove();

        }
    );        

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {
                modal.remove();
            }

        }
    );


    // REMOVE FROM WISHLIST
    modal.querySelectorAll(
        ".wishlist-remove-btn"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    wishlist.splice(
                        index,
                        1
                    );


                    saveWishlist();

                    modal.remove();

                    updateWishlistButtons();

                    showWishlist();

                }
            );

        }
    );


    // MOVE TO CART
    modal.querySelectorAll(
        ".wishlist-cart-btn"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    const product =
                        wishlist[index];


                    const existingProduct =
                        cart.find(
                            function (item) {

                                return item.name ===
                                    product.name;

                            }
                        );


                    if (existingProduct) {

                        existingProduct.quantity++;

                    } else {

                        cart.push({

                            name: product.name,

                            price: product.price,

                            quantity: 1

                        });

                    }


                    saveCart();


                    wishlist.splice(
                        index,
                        1
                    );


                    saveWishlist();


                    modal.remove();

                    updateWishlistButtons();

                    showWishlist();

                }
            );

        }
    );

}


// ============================
// CREATE WISHLIST ITEMS
// ============================

function createWishlistItems() {

    if (wishlist.length === 0) {

        return `

            <div class="empty-wishlist">

                <i class="fa-solid fa-heart"></i>

                <h3>
                    Your Wishlist is empty
                </h3>

                <p>
                    Add products you love.
                </p>

            </div>

        `;

    }


    return wishlist.map(
        function (item, index) {

            return `

                <div class="wishlist-item">

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="wishlist-price">
                        ₹${item.price.toFixed(2)}
                    </p>


                    <div class="wishlist-actions">

                        <button
                            class="wishlist-cart-btn"
                            data-index="${index}">
                            Add to Cart
                        </button>


                        <button
                            class="wishlist-remove-btn"
                            data-index="${index}">
                            Remove
                        </button>

                    </div>

                </div>

            `;

        }
    ).join("");

}


// ============================
// SHOPPING CARD LINKS
// ============================

const shopLinks =
    document.querySelectorAll(
        ".box-content p"
    );


shopLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                const title =
                    this.parentElement
                        .querySelector("h2")
                        .innerText;


                alert(
                    "You selected: " +
                    title
                );

            }
        );

    }
);


// ============================
// INITIAL LOAD
// ============================

updateCartCount();

updateWishlistButtons();


// ===============================
// STEP 4 - SIGN IN
// ===============================


// ===============================
// USER DATA
// ===============================

let currentUser =
    JSON.parse(
        localStorage.getItem("amazonUser")
    ) || null;


// ===============================
// ACCOUNT ELEMENTS
// ===============================

const accountBtn =
    document.querySelector("#accountBtn");

const accountGreeting =
    document.querySelector("#accountGreeting");


// ===============================
// UPDATE ACCOUNT UI
// ===============================

function updateAccountUI() {

    if (currentUser) {

        accountGreeting.textContent =
            `Hello, ${currentUser.name}`;

    } else {

        accountGreeting.textContent =
            "Hello, sign in";

    }

}


// ===============================
// OPEN LOGIN MODAL
// ===============================

function openLogin() {

    // Agar already open hai
    if (document.querySelector(".login-modal")) {
        return;
    }


    // Account menu close karo
    const accountMenu =
        document.querySelector(".account-dropdown");

    if (accountMenu) {
        accountMenu.remove();
    }


    const modal =
        document.createElement("div");

    modal.className =
        "login-modal";


    modal.innerHTML = `

        <div class="login-box">

            <button
                class="close-login"
                id="closeLoginBtn">
                ×
            </button>

            <h2>
                Sign in
            </h2>

            <label>
                Name
            </label>

            <input
                type="text"
                id="loginName"
                placeholder="Enter your name"
            >

            <label>
                Email
            </label>

            <input
                type="email"
                id="loginEmail"
                placeholder="Enter your email"
            >

            <button
                class="login-btn"
                id="loginSubmitBtn">
                Sign in
            </button>

        </div>

    `;


    document.body.appendChild(modal);


    // ============================
    // CLOSE BUTTON
    // ============================

    const closeButton =
        modal.querySelector(
            "#closeLoginBtn"
        );


    closeButton.addEventListener(
        "click",
        function () {

            modal.remove();

        }
    );


    // ============================
    // CLICK OUTSIDE MODAL
    // ============================

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                modal.remove();

            }

        }
    );


    // ============================
    // SIGN IN BUTTON
    // ============================

    const submitButton =
        modal.querySelector(
            "#loginSubmitBtn"
        );


    submitButton.addEventListener(
        "click",
        signIn
    );

}


// ===============================
// SIGN IN FUNCTION
// ===============================

function signIn() {

    const nameInput =
        document.querySelector(
            "#loginName"
        );

    const emailInput =
        document.querySelector(
            "#loginEmail"
        );


    if (!nameInput || !emailInput) {
        return;
    }


    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();


    // ============================
    // VALIDATION
    // ============================

    if (name === "") {

        alert(
            "Please enter your name."
        );

        nameInput.focus();

        return;

    }


    if (email === "") {

        alert(
            "Please enter your email."
        );

        emailInput.focus();

        return;

    }


    // ============================
    // SAVE USER
    // ============================

    currentUser = {

        name: name,

        email: email

    };


    localStorage.setItem(
        "amazonUser",
        JSON.stringify(currentUser)
    );


    // ============================
    // UPDATE NAVBAR
    // ============================

    updateAccountUI();


    // ============================
    // CLOSE MODAL
    // ============================

    const modal =
        document.querySelector(
            ".login-modal"
        );

    if (modal) {
        modal.remove();
    }


    // ============================
    // SUCCESS
    // ============================

    alert(
        `Welcome ${name}! 🎉`
    );

}


// ===============================
// ACCOUNT DROPDOWN
// ===============================

function openAccountMenu() {

    const oldMenu =
        document.querySelector(
            ".account-dropdown"
        );


    // Toggle
    if (oldMenu) {

        oldMenu.remove();

        return;

    }


    const menu =
        document.createElement("div");

    menu.className =
        "account-dropdown";


    // ============================
    // LOGGED IN
    // ============================

    if (currentUser) {

        menu.innerHTML = `

            <h3>
                Hello, ${currentUser.name}
            </h3>

            <p>
                📧 ${currentUser.email}
            </p>

            <p>
                Your Account
            </p>

            <p>
                Your Orders
            </p>

            <p>
                Your Wishlist
            </p>

            <button
                id="signOutBtn">
                Sign Out
            </button>

        `;


        document.body.appendChild(menu);


        // SIGN OUT
        document.querySelector(
            "#signOutBtn"
        ).addEventListener(
            "click",
            signOut
        );


    } else {

        // ============================
        // NOT LOGGED IN
        // ============================

        menu.innerHTML = `

            <h3>
                Welcome to Amazon
            </h3>

            <p>
                Sign in to access your account,
                orders and wishlist.
            </p>

            <button
                id="signInBtn">
                Sign In
            </button>

        `;


        document.body.appendChild(menu);


        // SIGN IN
        document.querySelector(
            "#signInBtn"
        ).addEventListener(
            "click",
            openLogin
        );

    }

}


// ===============================
// SIGN OUT
// ===============================

function signOut() {

    currentUser = null;


    localStorage.removeItem(
        "amazonUser"
    );


    updateAccountUI();


    const menu =
        document.querySelector(
            ".account-dropdown"
        );

    if (menu) {
        menu.remove();
    }


    alert(
        "You have been signed out."
    );

}


// ===============================
// ACCOUNT BUTTON
// ===============================

if (accountBtn) {

    accountBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            openAccountMenu();

        }
    );

}


// ===============================
// CLOSE ACCOUNT MENU
// WHEN CLICKING OUTSIDE
// ===============================

document.addEventListener(
    "click",
    function (event) {

        const menu =
            document.querySelector(
                ".account-dropdown"
            );


        if (
            menu &&
            !menu.contains(event.target) &&
            !accountBtn.contains(event.target)
        ) {

            menu.remove();

        }

    }
);


// ===============================
// INITIAL LOAD
// ===============================

updateAccountUI();

// ==================================================
// STEP 5 - DELIVERY LOCATION
// ==================================================


// ===============================
// LOCATION DATA
// ===============================

let savedLocation =
    JSON.parse(
        localStorage.getItem("amazonLocation")
    ) || null;


// ===============================
// LOCATION ELEMENTS
// ===============================

const locationBtn =
    document.querySelector("#locationBtn");

const locationText =
    document.querySelector("#locationText");


// ===============================
// UPDATE LOCATION UI
// ===============================

function updateLocationUI() {

    if (savedLocation) {

        locationText.textContent =
            savedLocation.pincode;

    } else {

        locationText.textContent =
            "India";

    }

}


// ===============================
// OPEN LOCATION MODAL
// ===============================

function openLocationModal() {

    if (
        document.querySelector(
            ".location-modal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement("div");

    modal.className =
        "location-modal";


    modal.innerHTML = `

        <div class="location-box">

            <div class="location-header">

                <h2>
                    Choose your location
                </h2>

                <button
                    class="close-location"
                    id="closeLocationBtn">
                    ×
                </button>

            </div>


            <p>
                Enter your pincode to see
                products available for delivery.
            </p>


            <label>
                Pincode
            </label>


            <input
                type="text"
                class="pincode-input"
                id="pincodeInput"
                placeholder="Enter 6-digit pincode"
                maxlength="6"
                inputmode="numeric"
            >


            <p
                class="location-error"
                id="locationError">
            </p>


            <button
                class="save-location-btn"
                id="saveLocationBtn">
                Save Location
            </button>

        </div>

    `;


    document.body.appendChild(modal);


    // ============================
    // EXISTING PINCODE
    // ============================

    const input =
        modal.querySelector(
            "#pincodeInput"
        );


    if (savedLocation) {

        input.value =
            savedLocation.pincode;

    }


    // ============================
    // CLOSE
    // ============================

    modal.querySelector(
        "#closeLocationBtn"
    ).addEventListener(
        "click",
        function () {

            modal.remove();

        }
    );


    // ============================
    // CLICK OUTSIDE
    // ============================

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );


    // ============================
    // SAVE LOCATION
    // ============================

    modal.querySelector(
        "#saveLocationBtn"
    ).addEventListener(
        "click",
        saveLocation
    );


    // ============================
    // ENTER KEY
    // ============================

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                saveLocation();

            }

        }
    );


    input.focus();

}


// ===============================
// SAVE LOCATION FUNCTION
// ===============================

function saveLocation() {

    const input =
        document.querySelector(
            "#pincodeInput"
        );

    const error =
        document.querySelector(
            "#locationError"
        );


    if (!input || !error) {
        return;
    }


    const pincode =
        input.value.trim();


    // ============================
    // VALIDATE PINCODE
    // ============================

    if (!/^[0-9]{6}$/.test(pincode)) {

        error.textContent =
            "Please enter a valid 6-digit pincode.";

        input.focus();

        return;

    }


    // ============================
    // SAVE
    // ============================

    savedLocation = {

        pincode: pincode

    };


    localStorage.setItem(
        "amazonLocation",
        JSON.stringify(savedLocation)
    );


    // ============================
    // UPDATE HEADER
    // ============================

    updateLocationUI();


    // ============================
    // CLOSE MODAL
    // ============================

    const modal =
        document.querySelector(
            ".location-modal"
        );

    if (modal) {

        modal.remove();

    }


    // ============================
    // SUCCESS
    // ============================

    alert(
        `Delivery location saved: ${pincode}`
    );

}


// ===============================
// LOCATION BUTTON
// ===============================

if (locationBtn) {

    locationBtn.addEventListener(
        "click",
        openLocationModal
    );

}


// ===============================
// INITIAL LOCATION UI
// ===============================

updateLocationUI();

/* =========================
   STEP 6 - PRODUCT DETAILS
========================= */

const productCards = document.querySelectorAll(".box");

productCards.forEach(function (box) {

    box.addEventListener("click", function (event) {

        // Buttons par click karne par details modal mat kholo
        if (
            event.target.closest(".add-cart-btn") ||
            event.target.closest(".wishlist-btn")
        ) {
            return;
        }

        const titleElement = box.querySelector("h2");
        const imageElement = box.querySelector(".box-img");

        if (!titleElement || !imageElement) return;

        const title = titleElement.textContent.trim();
        const image = imageElement.src;

        let price = 0;

        const addCartButton = box.querySelector(".add-cart-btn, .wishlist-btn");
        if (addCartButton && addCartButton.dataset.price) {
            price = Number (
                addCartButton.dataset.price
                .replace(/₹/g, "")
                .replace(/,/g, "")
                .trim()
            );
        }
        
        if (!price) {
            const cardText = box.innerText;
            const priceMatch = cardText.match(/₹\s?([\d,]+)/);

            if (priceMatch) {
                price = Number(
                    priceMatch[1].replace(/,/g, "")
                );
            }
        }
        
        openProductDetails(title, image, price);
    });

});


function openProductDetails(title, image, price) {

    // Existing modal remove
    const oldModal = document.querySelector(".product-modal");

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");

    modal.className = "product-modal";

    modal.innerHTML = `
        <div class="product-modal-box">

            <button class="close-product" id="closeProductBtn">×</button>

            <div class="product-detail">

                <div>
                    <img
                        src="${image}"
                        alt="${title}"
                        class="product-detail-image"
                    >
                </div>

                <div class="product-detail-info">

                    <h1>${title}</h1>

                    <div class="product-rating">
                        ⭐⭐⭐⭐⭐
                        <span>4.5 out of 5</span>
                    </div>

                    <div class="product-detail-price">
                        ₹${price.toLocaleString("en-IN")}
                    </div>

                    <div class="product-delivery">
                        <strong>FREE delivery</strong>
                        <br>
                        Delivery available to your selected location.
                    </div>

                    <div class="product-quantity">

                        <strong>Quantity:</strong>

                        <button id="detailMinus">−</button>

                        <span id="detailQuantity">1</span>

                        <button id="detailPlus">+</button>

                    </div>

                    <div class="product-action">

                        <button
                            class="detail-cart-btn"
                            id="detailAddCart"
                        >
                            🛒 Add to Cart
                        </button>

                        <button
                            class="detail-buy-btn"
                            id="detailBuyNow"
                        >
                            ⚡ Buy Now
                        </button>

                        <button
                            class="detail-wishlist-btn"
                            id="detailWishlist"
                        >
                            ❤️ Wishlist
                        </button>

                    </div>

                </div>

            </div>

            <div class="product-reviews">

                <h3>Customer reviews</h3>

                <div class="review">
                    <div class="review-stars">⭐⭐⭐⭐⭐</div>
                    <strong>Great product</strong>
                    <p>Good quality and worth the price.</p>
                </div>

                <div class="review">
                    <div class="review-stars">⭐⭐⭐⭐</div>
                    <strong>Good value</strong>
                    <p>Product arrived safely and works well.</p>
                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    let quantity = 1;

    const quantityText =
        modal.querySelector("#detailQuantity");


    // Close button
    modal
        .querySelector("#closeProductBtn")
        .addEventListener("click", function () {
            modal.remove();
        });


    // Outside click
    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            modal.remove();
        }

    });


    // Minus
    modal
        .querySelector("#detailMinus")
        .addEventListener("click", function () {

            if (quantity > 1) {
                quantity--;
                quantityText.textContent = quantity;
            }

        });


    // Plus
    modal
        .querySelector("#detailPlus")
        .addEventListener("click", function () {

            quantity++;
            quantityText.textContent = quantity;

        });


    // Add to cart
    modal
        .querySelector("#detailAddCart")
        .addEventListener("click", function () {

            for (let i = 0; i < quantity; i++) {

                cart.push({
                    name: title,
                    price: price
                });

            }

            saveCart();
            updateCartCount();

            alert(`${quantity} × ${title} added to cart 🛒`);

            modal.remove();

        });


    // Wishlist
    modal
        .querySelector("#detailWishlist")
        .addEventListener("click", function () {

            const exists = wishlist.some(function (item) {
                return item.name === title;
            });

            if (!exists) {

                wishlist.push({
                    name: title,
                    price: price
                });

                saveWishlist();
                updateWishlistButtons();

                alert(`${title} added to wishlist ❤️`);

            } else {

                alert("This product is already in your wishlist ❤️");

            }

        });


    // Buy now
    modal
        .querySelector("#detailBuyNow")
        .addEventListener("click", function () {

            alert(
                `Buy Now clicked!\n\n${quantity} × ${title}\nTotal: ₹${(
                    price * quantity
                ).toLocaleString("en-IN")}\n\nCheckout feature will be added next.`
            );

        });

}

/* =========================
   STEP 7 - CHECKOUT
========================= */

let appliedCoupon = "";
let discountAmount = 0;


/* Open Checkout */

function openCheckout() {

    cart = JSON.parse(localStorage.getItem("amazonCart")) || [];

    console.log("CHECKOUT CART:", cart);

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    
    const oldCheckout = document.querySelector(".checkout-modal");

    if (oldCheckout) {
        oldCheckout.remove();
    }

    appliedCoupon = "";
    discountAmount = 0;

    const modal = document.createElement("div");

    modal.className = "checkout-modal";

    modal.innerHTML = `
        <div class="checkout-box">

            <button class="close-checkout" id="closeCheckoutBtn">
                ×
            </button>

            <h1 class="checkout-title">
                Checkout
            </h1>

            <div class="checkout-layout">

                <div>

                    <!-- ADDRESS -->

                    <div class="checkout-section">

                        <h2>1. Delivery address</h2>

                        <div class="checkout-address">

                            <p id="checkoutAddress">
                                Loading address...
                            </p>

                            <button
                                class="change-address-btn"
                                id="changeAddressBtn">
                                Change
                            </button>

                        </div>

                    </div>


                    <!-- CART SUMMARY -->

                    <div class="checkout-section">

                        <h2>2. Review your items</h2>

                        <div id="checkoutItems"></div>

                    </div>


                    <!-- COUPON -->

                    <div class="checkout-section">

                        <h2>3. Apply coupon</h2>

                        <div class="coupon-row">

                            <input
                                type="text"
                                id="couponInput"
                                class="coupon-input"
                                placeholder="Enter coupon code">

                            <button
                                class="apply-coupon-btn"
                                id="applyCouponBtn">
                                Apply
                            </button>

                        </div>

                        <p
                            class="coupon-message"
                            id="couponMessage">
                        </p>

                    </div>


                    <!-- PAYMENT -->

                    <div class="checkout-section">

                        <h2>4. Payment method</h2>

                        <label class="payment-option">

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked>

                            UPI
                        </label>

                        <label class="payment-option">

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Card">

                            Credit / Debit Card
                        </label>

                        <label class="payment-option">

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD">

                            Cash on Delivery
                        </label>

                    </div>

                </div>


                <!-- ORDER SUMMARY -->

                <div class="order-summary">

                    <h2>Order Summary</h2>

                    <div class="summary-row">

                        <span>Items:</span>

                        <span id="checkoutSubtotal">
                            ₹0
                        </span>

                    </div>

                    <div class="summary-row">

                        <span>Delivery:</span>

                        <span>
                            FREE
                        </span>

                    </div>

                    <div class="summary-row summary-discount">

                        <span>Discount:</span>

                        <span id="checkoutDiscount">
                            -₹0
                        </span>

                    </div>

                    <div class="summary-row summary-total">

                        <span>Order Total:</span>

                        <span id="checkoutTotal">
                            ₹0
                        </span>

                    </div>

                    <button
                        class="place-order-btn"
                        id="placeOrderBtn">

                        Place your order

                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    /* Address */

    const checkoutAddress =
        modal.querySelector("#checkoutAddress");

    if (savedLocation) {

        checkoutAddress.innerHTML = `
            <strong>Deliver to</strong><br>
            India - ${savedLocation.pincode}
        `;

    } else {

        checkoutAddress.innerHTML = `
            <strong>Deliver to</strong><br>
            No delivery pincode selected
        `;

    }


    /* Items */

    renderCheckoutItems(modal);


    /* Close */

    modal
        .querySelector("#closeCheckoutBtn")
        .addEventListener("click", function () {

            modal.remove();

        });


    /* Outside click */

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            modal.remove();
        }

    });


    /* Change address */

    modal
        .querySelector("#changeAddressBtn")
        .addEventListener("click", function () {

            modal.remove();

            openLocationModal();

        });


    /* Coupon */

    modal
        .querySelector("#applyCouponBtn")
        .addEventListener("click", function () {

            applyCheckoutCoupon(modal);

        });


    /* Enter coupon */

    modal
        .querySelector("#couponInput")
        .addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                applyCheckoutCoupon(modal);
            }

        });


    /* Place Order */

    modal
        .querySelector("#placeOrderBtn")
        .addEventListener("click", function () {

            placeOrder(modal);

        });

}


/* Render Checkout Items */

function renderCheckoutItems(modal) {

    const itemsContainer =
        modal.querySelector("#checkoutItems");

    const groupedItems = {};

    cart.forEach(function (item) {

        if (!groupedItems[item.name]) {

            groupedItems[item.name] = {
                name: item.name,
                price: Number(item.price),
                quantity: 0
            };

        }

        groupedItems[item.name].quantity++;

    });


    let html = "";

    Object.values(groupedItems).forEach(function (item) {

        const itemTotal =
            item.price * item.quantity;

        html += `
            <div class="checkout-item">

                <div>

                    <div class="checkout-item-name">
                        ${item.name}
                    </div>

                    <div class="checkout-item-qty">
                        Quantity: ${item.quantity}
                    </div>

                </div>

                <div class="checkout-item-price">
                    ₹${itemTotal.toLocaleString("en-IN")}
                </div>

            </div>
        `;

    });


    itemsContainer.innerHTML = html;

    updateCheckoutTotals(modal);

}


/* Calculate Checkout Total */

function getCheckoutSubtotal() {

    return cart.reduce(function (total, item) {

        return total + Number(item.price);

    }, 0);

}


/* Update totals */

function updateCheckoutTotals(modal) {

    const subtotal =
        getCheckoutSubtotal();

    if (discountAmount > subtotal) {
        discountAmount = subtotal;
    }

    const total =
        subtotal - discountAmount;


    modal.querySelector("#checkoutSubtotal")
        .textContent =
        `₹${subtotal.toLocaleString("en-IN")}`;


    modal.querySelector("#checkoutDiscount")
        .textContent =
        `-₹${discountAmount.toLocaleString("en-IN")}`;


    modal.querySelector("#checkoutTotal")
        .textContent =
        `₹${total.toLocaleString("en-IN")}`;

}


/* Coupon */

function applyCheckoutCoupon(modal) {

    const input =
        modal.querySelector("#couponInput");

    const message =
        modal.querySelector("#couponMessage");

    const code =
        input.value.trim().toUpperCase();

    const subtotal =
        getCheckoutSubtotal();


    if (code === "") {

        message.textContent =
            "Please enter a coupon code.";

        message.style.color = "#b12704";

        return;

    }


    if (code === "SAVE10") {

        discountAmount =
            Math.round(subtotal * 0.10);

        appliedCoupon = "SAVE10";

        message.textContent =
            `Coupon applied! You saved ₹${discountAmount}.`;

        message.style.color = "#067d62";

    }

    else if (code === "SAVE50") {

        discountAmount =
            Math.min(50, subtotal);

        appliedCoupon = "SAVE50";

        message.textContent =
            `Coupon applied! You saved ₹${discountAmount}.`;

        message.style.color = "#067d62";

    }

    else {

        discountAmount = 0;
        appliedCoupon = "";

        message.textContent =
            "Invalid coupon. Try SAVE10 or SAVE50.";

        message.style.color = "#b12704";

    }


    updateCheckoutTotals(modal);

}


/* Place Order */

function placeOrder(modal) {

    if (!cart || cart.length === 0) {

        alert("Your cart is empty.");

        modal.remove();

        return;

    }


    const selectedPayment =
        modal.querySelector(
            'input[name="paymentMethod"]:checked'
        );


    const paymentMethod =
        selectedPayment
            ? selectedPayment.value
            : "UPI";


    if (!savedLocation) {

        alert(
            "Please select your delivery pincode first."
        );

        modal.remove();

        openLocationModal();

        return;

    }


    const subtotal =
        getCheckoutSubtotal();

    const total =
        subtotal - discountAmount;


    const order = {

        orderId:
            "AMZ" +
            Date.now(),

        items: [...cart],

        subtotal: subtotal,

        discount: discountAmount,

        total: total,

        coupon: appliedCoupon,

        paymentMethod: paymentMethod,

        pincode: savedLocation.pincode,

        date: new Date().toLocaleString("en-IN")

    };


    /* Save order */

    const orders =
        JSON.parse(
            localStorage.getItem("amazonOrders")
        ) || [];

    orders.push(order);

    localStorage.setItem(
        "amazonOrders",
        JSON.stringify(orders)
    );


    /* Empty cart */

    cart = [];

    saveCart();
    updateCartCount();


    /* Remove checkout */

    modal.remove();


    /* Success popup */

    showOrderSuccess(order);

}


/* Order Success */

function showOrderSuccess(order) {

    const success =
        document.createElement("div");

    success.className =
        "order-success";

    success.innerHTML = `

        <div class="order-success-box">

            <i class="fa-solid fa-circle-check"></i>

            <h2>
                Order placed successfully!
            </h2>

            <p>
                Thank you for shopping with us.
            </p>

            <p>
                <strong>Order ID:</strong>
                ${order.orderId}
            </p>

            <p>
                <strong>Total:</strong>
                ₹${order.total.toLocaleString("en-IN")}
            </p>

            <p>
                <strong>Payment:</strong>
                ${order.paymentMethod}
            </p>

            <button
                class="success-continue-btn"
                id="successContinueBtn">

                Continue Shopping

            </button>

        </div>

    `;

    document.body.appendChild(success);


    success
        .querySelector("#successContinueBtn")
        .addEventListener("click", function () {

            success.remove();

        });

}

console.log("STEP 7 LOADED");