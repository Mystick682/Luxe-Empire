// Minimal JS for demo: products, filters, cart, mobile menu
const PRODUCTS = [
  {id:1,title:'Elegant Necklace',price:120,category:'necklaces',img:'https://images.unsplash.com/photo-1526178618898-7f5b33f0b2b6?auto=format&fit=crop&w=800&q=80'},
  {id:2,title:'Classic Ring',price:80,category:'rings',img:'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=80'},
  {id:3,title:'Minimal Earrings',price:60,category:'earrings',img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'},
  {id:4,title:'Gold Pendant',price:150,category:'necklaces',img:'https://images.unsplash.com/photo-1526318472351-c75fcf0700b7?auto=format&fit=crop&w=800&q=80'},
  {id:5,title:'Signet Ring',price:95,category:'rings',img:'https://images.unsplash.com/photo-1600180758890-0b7c5b1f7c4f?auto=format&fit=crop&w=800&q=80'},
  {id:6,title:'Hoop Earrings',price:45,category:'earrings',img:'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80'},
  {id:7,title:'Layered Necklace',price:140,category:'necklaces',img:'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80'},
  {id:8,title:'Band Ring',price:70,category:'rings',img:'https://images.unsplash.com/photo-1508624896493-2c8fa1f716f9?auto=format&fit=crop&w=800&q=80'}
];

// Utilities
function q(sel, ctx=document){return ctx.querySelector(sel)}
function qAll(sel, ctx=document){return Array.from(ctx.querySelectorAll(sel))}

// Mobile menu
qAll('#mobileBtn, #mobileBtn2, #mobileBtn3, #mobileBtn4, #mobileBtn5').forEach(btn=>{
  btn?.addEventListener('click', ()=>{
    const menu = document.getElementById('mobileMenu');
    if(menu) menu.classList.toggle('hidden');
  })
});

// Render products in featured and shop
function renderProducts(gridEl, items){
  gridEl.innerHTML = items.map(p=>`
    <div class="product-card bg-white rounded-lg p-3 shadow-sm">
      <a href="product.html?pid=${p.id}" class="block">
        <div class="aspect-1 rounded overflow-hidden">
          <img src="${p.img}" alt="${p.title}">
        </div>
        <h3 class="mt-3 text-sm font-medium">${p.title}</h3>
        <div class="mt-1 text-sm text-gray-600">$${p.price}</div>
      </a>
      <div class="mt-3">
        <button class="addBtn px-3 py-2 bg-black text-white text-sm rounded" data-id="${p.id}">Add</button>
      </div>
    </div>
  `).join('');
}

// Populate featured grid (first 4)
const pruductgrid = document.getElementById('pruductgrid');
if(pruductgrid) renderProducts(pruductgrid, PRODUCTS.slice(0,4));

// Populate featured grid (first 4)
const featuredGrid = document.getElementById('featuredGrid');
if(featuredGrid) renderProducts(featuredGrid, PRODUCTS.slice(0,4));


// Populate shop grid
const shopGrid = document.getElementById('shopGrid');
if(shopGrid) renderProducts(shopGrid, PRODUCTS);

// Filter buttons
qAll('.filterBtn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const f = btn.dataset.filter;
    const items = f === 'all' ? PRODUCTS : PRODUCTS.filter(p=>p.category===f);
    if(shopGrid) renderProducts(shopGrid, items);
  })
});

// Cart - simple localStorage persistence
function getCart(){return JSON.parse(localStorage.getItem('cart||demo')||'[]')}
function saveCart(c){localStorage.setItem('cart||demo', JSON.stringify(c)); updateCartCount();}
function addToCart(id, qty=1){
  const p = PRODUCTS.find(x=>x.id==id); if(!p) return;
  const c = getCart();
  const existing = c.find(i=>i.id==id);
  if(existing) existing.qty += qty; else c.push({id:p.id,title:p.title,price:p.price,qty});
  saveCart(c);
}
function updateCartCount(){
  const c = getCart(); const total = c.reduce((s,i)=>s+i.qty,0);
  q('#cartCount') && (q('#cartCount').textContent = total);
  q('#cartCount2') && (q('#cartCount2').textContent = total);
  q('#cartCount3') && (q('#cartCount3').textContent = total);
  q('#cartCount4') && (q('#cartCount4').textContent = total);
  q('#cartCount5') && (q('#cartCount5').textContent = total);
}
updateCartCount();

// Delegate add buttons
document.addEventListener('click', function(e){
  const t = e.target;
  if(t.matches('.addBtn')){
    const id = t.dataset.id; addToCart(Number(id),1);
    t.textContent = 'Added'; setTimeout(()=>t.textContent='Add',900);
  }
  if(t.id === 'cartBtn' || t.id === 'cartBtn2' || t.id === 'cartBtn3' || t.id === 'cartBtn4' || t.id === 'cartBtn5'){
    window.location.href = 'cart.html';
  }
  if(t.id === 'addToCartBtn'){
    const qty = Number(q('#qty').value||1); addToCart(1,qty); // for demo product id 1
    alert('Added to cart');
  }
});

// On product page - load product by query string
(function loadProductPage(){
  const imgEl = q('#productImage'), titleEl = q('#productTitle'), priceEl = q('#productPrice');
  const params = new URLSearchParams(window.location.search); const pid = Number(params.get('pid')||1);
  const p = PRODUCTS.find(x=>x.id===pid);
  if(p && imgEl){ imgEl.src = p.img; titleEl.textContent = p.title; priceEl.textContent = `$${p.price}`; }
})();

// On cart page - render cart items
(function loadCartPage(){
  const el = q('#cartItems'); if(!el) return;
  const c = getCart(); if(c.length===0){ el.innerHTML = '<p>Your cart is empty.</p>'; return; }
  el.innerHTML = c.map(i=>`
    <div class="flex items-center gap-4 border-b py-3">
      <div class="flex-1">
        <div class="font-medium">${i.title}</div>
        <div class="text-sm text-gray-600">$${i.price} x ${i.qty}</div>
      </div>
      <div class="text-right">$${(i.price*i.qty).toFixed(2)}</div>
    </div>
  `).join('');
})();

// Simple contact/newsletter handlers
q('#newsletterForm')?.addEventListener('submit', e=>{ e.preventDefault(); alert('Subscribed — demo'); e.target.reset(); });
q('#contactForm')?.addEventListener('submit', e=>{ e.preventDefault(); alert('Message sent — demo');e.target.reset(); })

document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cartItems");
  const checkoutBtn = document.getElementById("checkoutBtn"); // Checkout button ID
  const totalPriceEl = document.getElementById("totalPrice"); // Make sure you have <span id="totalPrice"></span> in your HTML

  function renderCart() {
    cartContainer.innerHTML = "";

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      cartContainer.innerHTML = <p class="text-gray-500">Your cart is empty.</p>;
      if (checkoutBtn) checkoutBtn.style.display = "none";
      if (totalPriceEl) totalPriceEl.textContent = "$0.00";
      return;
    } else {
      if (checkoutBtn) checkoutBtn.style.display = "block";
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += parseFloat(item.price);

      const itemDiv = document.createElement("div");
      itemDiv.className =
        "flex items-center justify-between border-b py-4 opacity-100 transition-opacity duration-500";
      itemDiv.innerHTML = `
        <div>
          <h2 class="font-semibold">${item.name}</h2>
          <p class="text-gray-600">$${item.price}</p>
        </div>
        <button class="remove-btn text-red-500 hover:underline" data-index="${index}">Remove</button>
      `;
      cartContainer.appendChild(itemDiv);
    });

    if (totalPriceEl) totalPriceEl.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        const itemElement = this.closest("div.flex");

        // Fade out animation
        itemElement.style.opacity = "0";

        setTimeout(() => {
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        }, 500);
      });
    });
  }

  renderCart();
});