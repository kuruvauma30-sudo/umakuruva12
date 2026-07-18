/* =========================================================
   KALEIDO — script.js
   ========================================================= */

const CATEGORY_COLORS = {
  Electronics: '#4361EE',
  Fashion:     '#FF5D5D',
  Shoes:       '#06D6A0',
  Accessories: '#9B5DE5',
  Home:        '#FFC93C',
  College:     '#06B6D4'
};

// price is stored as a plain number (rupees). It's formatted with the ₹
// symbol only at render time via formatPrice() — never inside the data —
// otherwise sorting and cart totals break on a string like "₹2499".
const PRODUCTS = [
  { id: 1,  name: "Wireless Headphones",  category: "Electronics", rating: 4.5, price: 2499, image: "https://m.media-amazon.com/images/I/610ub5kytVL.jpg" },
  { id: 2,  name: "Smart Watch",          category: "Electronics", rating: 4.3, price: 3999, image: "https://rukminim2.flixcart.com/image/1366/1366/xif0q/smartwatch/m/4/a/-original-imah2thypdjnzye9.jpeg?q=90" },
  { id: 3,  name: "Casual T-Shirt",       category: "Fashion",     rating: 4.2, price: 799,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCymQLS_rty42aZOJE76bg5cKW2K_qQcyJNQ-RMXuaA&s=10" },
  { id: 4,  name: "Leather Wallet",       category: "Accessories", rating: 4.4, price: 999,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdug9rVdVnHYWd0iF0xvlQHIogg3Dj90RGgk-jOOV3XmAkC0Kcly9D_14&s=10" },
  { id: 5,  name: "Desk Lamp",            category: "Home",        rating: 4.5, price: 799,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyLqBAvA_ivj42nMXUQNt-coB6MeFIJtXXWpZSzpmaaBPZDpn9vGBddrI&s=10" },
  { id: 6,  name: "Running Shoes",        category: "Shoes",       rating: 4.2, price: 2999, image: "https://img.tatacliq.com/images/i27//437Wx649H/MP000000026903643_437Wx649H_202510122251111.jpeg" },
  { id: 7,  name: "Jewellery",            category: "Fashion",     rating: 4.2, price: 599,  image: "https://www.sasitrends.com/cdn/shop/files/2140X-Radiant-temple-matte-gold-bridal-necklace-with-peacock-flower-motifs-for-traditional-wedding-style-Sasitrends_9a60ffd3-3f31-41d2-a063-f43dedd0c359.jpg?v=1771928961&width=1080" },
  { id: 8,  name: "College Bags",         category: "College",     rating: 4.2, price: 1999, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS22uAG9ImcwuRIuGmWqaeOw0IjG6ye5NXJgSgmy6h8CA&s=10" },
  { id: 9,  name: "Women Dress",          category: "Fashion",     rating: 4.2, price: 999,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh0zvK4zuJVuHLhW8L1e6HMlgVOEnw7lOWuMDg6T2PjQ&s=10" },
  { id: 10, name: "Beauty Products",      category: "Fashion",     rating: 4.2, price: 599,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdJ8XM6nHWubGiUOEnesdhSlu-H9ZtQwfJ5PhR0Q5mdg&s=10" },
  { id: 11, name: "Kitchen Products",     category: "Home",        rating: 4.2, price: 999,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ZNJ4ZBcP8eSe3BiJcvcP0mJzEPMWqpxlQ8LW5ss2Iy6Q40aOk8ogH46z&s=10" },
  { id: 12, name: "Toys",                 category: "Home",        rating: 4.2, price: 899,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsVdDrax9SOD8aYZ7tB4neKSreckdoJTrkd8i1T7ujMYgQiex4yqdfKTY&s=10" },
  { id: 13, name: "Farming Products",     category: "Home",        rating: 4.2, price: 899,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQffXhCeMgwS4IZ2pt3FnLPcTAcwTmQ7quBD3dbsh0kJcKUAm53VpplAgI&s=10" },
  { id: 14, name: "Sleeping Beds",        category: "Home",        rating: 4.2, price: 899,  image: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/ciw/2026/6/30/bd89c0f4-e37c-42bb-ae8b-38d66286b34b_1_MN_27da0096-ed85-416c-b0ff-c45d09bdc904.png" },
  { id: 15, name: "Guitar",               category: "Fashion",     rating: 4.2, price: 899,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlNiR61jU22WHrV-hKPsg4bmQXowmdTy_WCyOrJX5teshIoGUuKycf1Scj&s=10" },
];

function formatPrice(n){ return `₹${n.toLocaleString('en-IN')}`; }

/* ---------- state ---------- */
let cart = JSON.parse(localStorage.getItem('kaleido_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('kaleido_wishlist') || '[]');
let activeCategory = 'all';
let searchTerm = '';
let sortMode = 'default';

/* ---------- elements ---------- */
const productGrid   = document.getElementById('productGrid');
const emptyState    = document.getElementById('emptyState');
const cartItemsEl   = document.getElementById('cartItems');
const cartCountEl   = document.getElementById('cartCount');
const wishlistCountEl = document.getElementById('wishlistCount');
const cartItemCountEl = document.getElementById('cartItemCount');
const cartTotalEl   = document.getElementById('cartTotal');
const toastEl       = document.getElementById('toast');

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- persistence ---------- */
function saveCart(){ localStorage.setItem('kaleido_cart', JSON.stringify(cart)); }
function saveWishlist(){ localStorage.setItem('kaleido_wishlist', JSON.stringify(wishlist)); }

/* ---------- toast ---------- */
let toastTimer;
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toastEl.classList.remove('show'), 2200);
}

/* ---------- render products ---------- */
function getFilteredProducts(){
  let list = PRODUCTS.filter(p=>{
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  if(sortMode === 'low-high') list.sort((a,b)=> a.price - b.price);
  if(sortMode === 'high-low') list.sort((a,b)=> b.price - a.price);
  if(sortMode === 'rating')   list.sort((a,b)=> b.rating - a.rating);
  return list;
}

function productCardHTML(p, isWished){
  return `
    <div class="card-media">
      <img src="${p.image}" alt="${p.name}" loading="lazy"
           onerror="this.src='https://placehold.co/500x500/F6F5FB/6B6885?text=${encodeURIComponent(p.name)}'">
      <span class="card-tag" style="background:${CATEGORY_COLORS[p.category] || '#999'}">${p.category}</span>
      <button class="wish-btn ${isWished ? 'active':''}" data-id="${p.id}" aria-label="Toggle wishlist">${isWished ? '♥' : '♡'}</button>
    </div>
    <div class="card-body">
      <h4 class="card-name">${p.name}</h4>
      <div class="card-rating">★★★★★ <span>${p.rating}</span></div>
      <div class="card-footer">
        <span class="card-price">${formatPrice(p.price)}</span>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  `;
}

function renderProducts(){
  const list = getFilteredProducts();
  productGrid.innerHTML = '';
  emptyState.hidden = list.length !== 0;

  list.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = productCardHTML(p, wishlist.includes(p.id));
    productGrid.appendChild(card);
  });
}

/* ---------- cart logic ---------- */
function addToCart(id){
  const product = PRODUCTS.find(p=>p.id === id);
  if(!product) return;
  const existing = cart.find(c=>c.id === id);
  if(existing) existing.qty += 1;
  else cart.push({ id, qty:1 });
  saveCart();
  renderCart();
  showToast(`✓ ${product.name} added to cart`);
}

function changeQty(id, delta){
  const item = cart.find(c=>c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(c=>c.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id){
  cart = cart.filter(c=>c.id !== id);
  saveCart();
  renderCart();
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  let totalItems = 0, totalPrice = 0;

  if(cart.length === 0){
    cartItemsEl.innerHTML = `<p class="cart-empty">Your cart is feeling a little grey. Go add some colour!</p>`;
  }

  cart.forEach(c=>{
    const p = PRODUCTS.find(pr=>pr.id === c.id);
    if(!p) return;
    totalItems += c.qty;
    totalPrice += c.qty * p.price;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${p.image}" alt="${p.name}"
           onerror="this.src='https://placehold.co/120x120/F6F5FB/6B6885?text=${encodeURIComponent(p.name)}'">
      <div class="cart-item-info">
        <h5>${p.name}</h5>
        <span>${formatPrice(p.price)}</span>
        <div class="qty-control">
          <button data-action="dec" data-id="${p.id}">−</button>
          <span>${c.qty}</span>
          <button data-action="inc" data-id="${p.id}">+</button>
          <button class="remove-btn" data-action="remove" data-id="${p.id}">Remove</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartCountEl.textContent = totalItems;
  cartItemCountEl.textContent = totalItems;
  cartTotalEl.textContent = formatPrice(totalPrice);
}

/* ---------- wishlist ---------- */
function toggleWishlist(id){
  const product = PRODUCTS.find(p=>p.id === id);
  if(!product) return;
  if(wishlist.includes(id)){
    wishlist = wishlist.filter(w=>w!==id);
    showToast(`Removed ${product.name} from wishlist`);
  } else {
    wishlist.push(id);
    showToast(`♥ ${product.name} added to wishlist`);
  }
  saveWishlist();
  wishlistCountEl.textContent = wishlist.length;
  renderProducts();
}

/* ---------- event delegation ---------- */
productGrid.addEventListener('click', e=>{
  const addBtn = e.target.closest('.add-btn');
  const wishBtn = e.target.closest('.wish-btn');
  if(addBtn) addToCart(Number(addBtn.dataset.id));
  if(wishBtn) toggleWishlist(Number(wishBtn.dataset.id));
});

cartItemsEl.addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  if(btn.dataset.action === 'inc') changeQty(id, 1);
  if(btn.dataset.action === 'dec') changeQty(id, -1);
  if(btn.dataset.action === 'remove') removeFromCart(id);
});

/* ---------- filters / search / sort ---------- */
document.getElementById('filterRow').addEventListener('click', e=>{
  const chip = e.target.closest('.filter-chip');
  if(!chip) return;
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  activeCategory = chip.dataset.category;
  renderProducts();
});

document.getElementById('searchInput').addEventListener('input', e=>{
  searchTerm = e.target.value;
  renderProducts();
});

document.getElementById('sortSelect').addEventListener('change', e=>{
  sortMode = e.target.value;
  renderProducts();
});

/* ---------- cart drawer ---------- */
const cartDrawer = document.getElementById('cartDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
function openCart(){ cartDrawer.classList.add('open'); drawerOverlay.classList.add('open'); }
function closeCartDrawer(){ cartDrawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCartDrawer);
drawerOverlay.addEventListener('click', closeCartDrawer);
document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  if(cart.length === 0){ showToast('Your cart is empty!'); return; }
  showToast('🎉 Checkout is just a demo — thanks for shopping!');
});

/* ---------- wishlist button (nav) ---------- */
document.getElementById('wishlistBtn').addEventListener('click', ()=>{
  if(wishlist.length === 0){ showToast('Your wishlist is empty — tap ♡ on any product'); return; }
  document.getElementById('filterRow').querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  activeCategory = 'all';
  searchTerm = '';
  document.getElementById('searchInput').value = '';
  productGrid.innerHTML = '';
  const wished = PRODUCTS.filter(p=>wishlist.includes(p.id));
  emptyState.hidden = wished.length !== 0;
  wished.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = productCardHTML(p, true);
    productGrid.appendChild(card);
  });
  showToast('Showing your wishlist');
});

/* ---------- mobile nav ---------- */
document.getElementById('hamburger').addEventListener('click', ()=>{
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click', ()=> document.getElementById('navLinks').classList.remove('open'));
});

/* ---------- theme toggle ---------- */
const themeToggle = document.getElementById('themeToggle');
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('kaleido_theme', theme);
}
applyTheme(localStorage.getItem('kaleido_theme') || 'light');
themeToggle.addEventListener('click', ()=>{
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ---------- navbar shadow on scroll ---------- */
window.addEventListener('scroll', ()=>{
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 10 ? '0 4px 20px -8px rgba(23,22,42,.15)' : 'none';
});

/* ---------- init ---------- */
renderProducts();
renderCart();
wishlistCountEl.textContent = wishlist.length;