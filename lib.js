// ======================================================
//             lib.js (Librería de Funciones Comunes)
// ======================================================

// --- ¡GIDs de las Hojas de Cálculo! ---
const GID_NEGOCIOS = '0'; // Asegúrate de que este sea el GID correcto para 'Negocios'
const GID_PRODUCTOS = '1322681414'; // Asegúrate de que este sea el GID correcto para 'Productos'
const GID_PEDIDOS = '1660428263'; // <-- ¡LÍNEA AÑADIDA! GID para 'Pedidos'
// Añade aquí GIDs para otras hojas si las necesitas (ej: GID_CALIFICACIONES)

// --- URL Base del Script (Asegúrate de que sea la correcta) ---
// Es buena práctica tenerla aquí también, aunque la definas en cada HTML.
// O podrías quitarla de los HTML y leerla desde aquí.
const SCRIPT_URL_GLOBAL = "https://script.google.com/macros/s/AKfycbwXyXzIAelblfS89-_uD29B4M1ksXzeUajIueaAid-11l6AO68GSNmoU7x3QHTu4xr2/exec"; 

// --- Funciones de Utilidad ---

/**
 * Obtiene un parámetro de la URL actual por su nombre.
 * @param {string} name - El nombre del parámetro.
 * @returns {string|null} - El valor del parámetro o null si no se encuentra.
 */
function qParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * Función genérica para obtener datos de una hoja específica usando su GID.
 * Hace la conversión de CSV a JSON directamente.
 * @param {string} gid - El GID de la hoja de cálculo.
 * @returns {Promise<Array<Object>>} - Una promesa que resuelve con un array de objetos (filas).
 */
async function fetchSheetByGid(gid) {
  if (!gid) {
    console.error("fetchSheetByGid: GID no proporcionado.");
    throw new Error("GID no proporcionado.");
  }
  
  // Construye la URL para exportar como CSV
  const sheetId = '1p6zG-wEsq577W6Y_gs2TI04xE8jrQMAui9XYR13MvIo'; // Tu ID de Spreadsheet
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Error al cargar la hoja GID ${gid}: ${response.statusText}`);
    }
    const csvText = await response.text();
    return csvToJson(csvText); // Convierte el CSV a un array de objetos
  } catch (error) {
    console.error(`Error en fetchSheetByGid (${gid}):`, error);
    throw error; // Re-lanza el error para que la función que llama lo maneje
  }
}

/**
 * Convierte texto CSV a un array de objetos JSON.
 * Asume que la primera fila del CSV son los encabezados (claves del JSON).
 * @param {string} csvText - El texto en formato CSV.
 * @returns {Array<Object>} - Un array donde cada objeto representa una fila.
 */
function csvToJson(csvText) {
  const lines = csvText.split(/\r\n|\n/); // Divide por saltos de línea
  if (lines.length < 2) return []; // Si no hay datos o solo encabezados

  const headers = lines[0].split(',').map(header => header.trim()); // Obtiene encabezados limpios
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    // Manejo básico de comas dentro de comillas (no perfecto para CSV complejos)
    const values = [];
    let currentVal = '';
    let inQuotes = false;
    for (let char of currentLine) {
        if (char === '"' && inQuotes && i + 1 < currentLine.length && currentLine[i + 1] === '"') {
            // Manejar comillas dobles escapadas ""
            currentVal += '"';
            i++; // Saltar la siguiente comilla
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(currentVal.trim());
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    values.push(currentVal.trim()); // Añadir el último valor

    // Si la línea estaba vacía o tenía menos valores que encabezados, la saltamos
    if (values.length < headers.length || values.every(val => val === '')) {
        continue;
    }

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      // Si hay menos valores que encabezados, asignar cadena vacía
      obj[headers[j]] = values[j] !== undefined ? values[j] : ""; 
    }
    result.push(obj);
  }
  return result;
}

// Puedes añadir más funciones útiles aquí si las necesitas en varias páginas
// Por ejemplo, formateo de fechas, validaciones, etc.

// EN lib.js (Añadir al final del archivo)

/**
 * Marca el enlace activo en la barra de navegación inferior.
 * @param {string} currentPage - El valor 'data-page' de la página actual.
 */
function setActiveNavbarLink(currentPage) {
    // Esperar a que el DOM esté completamente cargado antes de manipular la barra
    document.addEventListener('DOMContentLoaded', () => {
        const navLinks = document.querySelectorAll('.navbar-bottom .nav-link');
        if (navLinks.length === 0) {
            // Si la barra aún no existe en el DOM, intentar de nuevo un poco después
            // Esto puede pasar si el script lib.js se carga muy rápido en el head
            setTimeout(() => setActiveNavbarLink(currentPage), 100);
            return;
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active'); // Quitar 'active' de todos
            // Usamos dataset.page para leer el atributo data-page="xxx"
            if (link.dataset.page === currentPage) {
                link.classList.add('active'); // Añadir 'active' al enlace correcto
            }
        });
    });
}
