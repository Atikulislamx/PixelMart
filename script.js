// ============================================================
// PixelMart Demo Store
// Purpose: learn Meta Pixel / GTM / analytics event tracking.
// ============================================================

const products = [
  { id: "J001", name: "Rose Gold Necklace", category: "jewelry", price: 1850, emoji: "📿", description: "A delicate everyday necklace for a clean, elegant look." },
  { id: "J002", name: "Pearl Drop Earrings", category: "jewelry", price: 1290, emoji: "💎", description: "Classic pearl-inspired drop earrings for special occasions." },
  { id: "J003", name: "Golden Charm Bracelet", category: "jewelry", price: 1590, emoji: "✨", description: "A minimal charm bracelet with a warm golden finish." },
  { id: "J004", name: "Silver Heart Ring", category: "jewelry", price: 990, emoji: "💍", description: "A simple heart-detail ring designed for everyday wear." },
  { id: "C001", name: "Velvet Matte Lipstick", category: "cosmetics", price: 650, emoji: "💄", description: "A demo lipstick product with a smooth matte finish." },
  { id: "C002", name: "Glow Face Serum", category: "cosmetics", price: 1150, emoji: "🧴", description: "A fictional lightweight serum for your testing catalog." },
  { id: "C003", name: "Soft Blush Palette", category: "cosmetics", price: 890, emoji: "🌸", description: "A fictional multi-shade blush palette for demo purchases." },
  { id: "C004", name: "Luxe Beauty Kit", category: "cosmetics", price: 2250, emoji: "🎀", description: "A fictional beauty bundle created for e-commerce testing." }
];

let cart = JSON.parse(localStorage.getItem("pixelmart_cart") || "[]");
let activeCategory = "all";
let currentSearch = "";

const $ = (selector) => document.querySelector(selector);

function money(value) {
  return `৳${Number(value).toLocaleString("en-BD")}`;
}

// Meta Pixel helper.
// If the Pixel base code is not installed, this safely logs the event
// instead of breaking the website.
function trackEvent(eventName, params = {}) {
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, params);
  }
  console.log(`[Meta Pixel] ${eventName}`, params);
}

// Optional custom event for your own debugging / GTM practice.
function pushDataLayer(eventName, data = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...data });
  console.log("[dataLayer]", eventName, data);
}

function productById(id) {
  return products.find(product => product.id === id);
}

function saveCart() {
  localStorage.setItem("pixelmart_cart", JSON.stringify(cart));
  renderCart();
}

function filteredProducts() {
  return products.filter(product => {
    const categoryMatch = activeCategory === "all" || product.category === activeCategory;
    const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    const searchMatch = text.includes(currentSearch.toLowerCase());
    return categoryMatch && searchMatch;
  });
}

function renderProducts() {
  const grid = $("#productGrid");
  const items = filteredProducts();

  grid.innerHTML = items.map(product => `
    <article class="product-card">
      <div class="product-image" data-view="${product.id}" title="View ${product.name}">
        ${product.emoji}
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="product-price">${money(product.price)}</div>
        <div class="product-actions">
          <button class="secondary-button" data-view="${product.id}">View</button>
          <button class="primary-button" data-add="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");

  $("#emptyState").classList.toggle("hidden", items.length > 0);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#checkoutTotal").textContent = money(total);

  if (!cart.length) {
    $("#cartItems").innerHTML = `<p class="empty-state">Your demo cart is empty. Add a product to start testing.</p>`;
    $("#checkoutButton").disabled = true;
    return;
  }

  $("#checkoutButton").disabled = false;

  $("#cartItems").innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-thumb">${item.emoji}</div>
      <div>
        <strong>${item.name}</strong>
        <small>${money(item.price)}</small>
        <div class="qty">
          <button data-decrease="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button data-increase="${item.id}">+</button>
        </div>
      </div>
      <button class="remove" data-remove="${item.id}">Remove</button>
    </div>
  `).join("");
}

function addToCart(id) {
  const product = productById(id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();

  trackEvent("AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "BDT"
  });

  pushDataLayer("add_to_cart", {
    ecommerce: {
      currency: "BDT",
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: 1 }]
    }
  });

  openCart();
}

function viewProduct(id) {
  const product = productById(id);
  if (!product) return;

  $("#productModalContent").innerHTML = `
    <div class="modal-product">
      <div class="modal-product-image">${product.emoji}</div>
      <div>
        <div class="product-category">${product.category}</div>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <h3>${money(product.price)}</h3>
        <button class="primary-button full" data-modal-add="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;

  $("#productModal").classList.remove("hidden");

  // Standard Meta ecommerce-style ViewContent event.
  trackEvent("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "BDT"
  });

  pushDataLayer("view_item", {
    ecommerce: {
      currency: "BDT",
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: 1 }]
    }
  });
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#overlay").classList.remove("hidden");
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#overlay").classList.add("hidden");
}

function startCheckout() {
  if (!cart.length) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  trackEvent("InitiateCheckout", {
    content_ids: cart.map(item => item.id),
    num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
    value: total,
    currency: "BDT"
  });

  pushDataLayer("begin_checkout", {
    ecommerce: {
      currency: "BDT",
      value: total,
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }
  });

  closeCart();
  $("#checkoutModal").classList.remove("hidden");
}

document.addEventListener("click", (event) => {
  const view = event.target.closest("[data-view]");
  const add = event.target.closest("[data-add]");
  const modalAdd = event.target.closest("[data-modal-add]");
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");

  if (view) viewProduct(view.dataset.view);
  if (add) addToCart(add.dataset.add);
  if (modalAdd) {
    addToCart(modalAdd.dataset.modalAdd);
    $("#productModal").classList.add("hidden");
  }

  if (increase) {
    const item = cart.find(x => x.id === increase.dataset.increase);
    if (item) item.quantity++;
    saveCart();
  }

  if (decrease) {
    const item = cart.find(x => x.id === decrease.dataset.decrease);
    if (item) item.quantity = Math.max(1, item.quantity - 1);
    saveCart();
  }

  if (remove) {
    cart = cart.filter(x => x.id !== remove.dataset.remove);
    saveCart();
  }
});

$("#cartButton").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);

$("#closeProductModal").addEventListener("click", () => $("#productModal").classList.add("hidden"));
$("#closeCheckoutModal").addEventListener("click", () => $("#checkoutModal").classList.add("hidden"));

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderProducts();
  });
});

let searchTimer;
$("#searchInput").addEventListener("input", (event) => {
  currentSearch = event.target.value.trim();
  renderProducts();

  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    if (currentSearch) {
      trackEvent("Search", {
        search_string: currentSearch
      });

      pushDataLayer("search", {
        search_term: currentSearch
      });
    }
  }, 500);
});

$("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = `PM-${Date.now()}`;

  // This is intentionally fake. Never send real card information to Meta.
  trackEvent("AddPaymentInfo", {
    content_ids: cart.map(item => item.id),
    value: total,
    currency: "BDT"
  });

  trackEvent("Purchase", {
    content_ids: cart.map(item => item.id),
    content_type: "product",
    num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
    value: total,
    currency: "BDT",
    order_id: orderId
  });

  pushDataLayer("purchase", {
    ecommerce: {
      transaction_id: orderId,
      currency: "BDT",
      value: total,
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }
  });

  $("#checkoutContent").innerHTML = `
    <div style="text-align:center;padding:25px 0">
      <div style="font-size:65px">🎉</div>
      <p class="eyebrow">DEMO PURCHASE COMPLETE</p>
      <h2>Order ${orderId}</h2>
      <p class="muted">This order is completely fake. No payment was processed.</p>
      <p><strong>Total: ${money(total)}</strong></p>
      <button class="primary-button full" id="finishOrder">Back to Store</button>
    </div>
  `;

  cart = [];
  saveCart();

  $("#finishOrder").addEventListener("click", () => {
    $("#checkoutModal").classList.add("hidden");
    window.location.hash = "#shop";
    window.location.reload();
  });
});

// Initial page render.
renderProducts();
renderCart();

console.log("%cPixelMart Tracking Lab", "font-size:20px;font-weight:bold");
console.log("Tip: open Meta Pixel Helper + DevTools Console while testing events.");
