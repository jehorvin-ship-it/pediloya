// lib.js - funciones comunes
const SPREADSHEET_ID = '1p6zG-wEsq577W6Y_gs2TI04xE8jrQMAui9XYR13MvIo';
const GID_NEGOCIOS = '0';
const GID_PRODUCTOS = '1322681414';

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i=0;i<text.length;i++){
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') { cell += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push(cell); cell = '';
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (c === '\r' && next === '\n') { i++; }
      row.push(cell); rows.push(row);
      row = []; cell = '';
    } else {
      cell += c;
    }
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
}

async function fetchSheetByGid(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo cargar la hoja. Revisa la publicación/compartir.');
  const txt = await res.text();
  const rows = parseCSV(txt);
  if (rows.length === 0) return [];
  const headers = rows[0].map(h => h.trim());
  const data = rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h,i) => obj[h] = (r[i] || '').trim());
    return obj;
  });
  return data;
}

// util: obtener query param
function qParam(name) {
  const p = new URLSearchParams(window.location.search);
  return p.get(name);
}

// formato moneda simple
function formatoMoney(v) {
  return Number(v || 0).toFixed(2);
}

// codifica mensaje WhatsApp
function waEncode(msg) {
  return encodeURIComponent(msg).replace(/%20/g, '+');
}

// === Carrito ===
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  const index = cart.findIndex(p => p.id === product.id);
  if (index > -1) {
    cart[index].qty += product.qty; // ya existe, sumamos cantidad
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart().filter(p => p.id !== productId);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem("cart");
}
