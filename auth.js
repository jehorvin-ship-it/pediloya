// ======================================================
//             auth.js (Cerebro de Autenticación)
// ======================================================

// --- ¡Pega tu configuración de Firebase aquí! ---
const firebaseConfig = {
  apiKey: "AIzaSyBcsps_cdROmgwHRNkHNUbSqO2E26u36Ms",
  authDomain: "pediloya-d210a.firebaseapp.com",
  projectId: "pediloya-d210a",
  storageBucket: "pediloya-d210a.firebasestorage.app",
  messagingSenderId: "165315675643",
  appId: "1:165315675643:web:04eed7c14c533e87f5b75e",
  databaseURL: "https://pediloya-d210a-default-rtdb.firebaseio.com"
};
// ----------------------------------------------

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database(); // <-- ¡LÍNEA AÑADIDA PARA REALTIME DATABASE!

/**
 * Función global para obtener el estado del usuario.
 * Devuelve una promesa que se resuelve con:
 * - El objeto de usuario (si está logueado)
 * - null (si no está logueado)
 */
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    // onAuthStateChanged es un "oyente"
    // Se dispara en cuanto carga la página con el estado del usuario
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe(); // Dejamos de escuchar
      resolve(user); // Devolvemos el usuario (o null)
    }, reject); // Devolvemos error si falla Firebase
  });
}

/**
 * Función para cerrar la sesión del usuario.
 * Devuelve una promesa.
 */
function logOut() {
  return auth.signOut();
}

/**
 * Devuelve el número de teléfono del usuario en formato local (88889999)
 * o null si no está logueado.
 */
async function getUserPhone() {
    try {
        const user = await getCurrentUser();
        if (user && user.phoneNumber) {
            // El número de Firebase viene como "+50588889999"
            // Lo limpiamos para dejarlo en formato local
            return user.phoneNumber.replace('+505', '');
        } else {
            return null; // No hay usuario o no tiene número
        }
    } catch (error) {
        console.error("Error obteniendo el teléfono del usuario:", error);
        return null;
    }
}

// EN auth.js (Añadir al final)

/**
 * Actualiza el header basado en el estado de login.
 * Muestra/oculta el icono de perfil/logout.
 * Añade/quita la clase 'logged-in' al body.
 */
function updateHeaderAuthState() {
    auth.onAuthStateChanged(user => {
        const profileButton = document.getElementById('profile-logout-button'); // Busca el botón del icono

        if (user) {
            // Usuario está logueado
            document.body.classList.add('logged-in'); // Añadir clase al body
            if (profileButton) {
                profileButton.style.display = 'block'; // Asegurar que sea visible (aunque CSS lo hace)
                // Añadir el listener para cerrar sesión SOLO si no existe ya
                if (!profileButton.dataset.listenerAttached) {
                     profileButton.addEventListener('click', async () => {
                        try {
                            console.log("Cerrando sesión...");
                            await logOut();
                            console.log("Sesión cerrada, recargando...");
                            window.location.reload(); // Recargar la página actual
                        } catch (error) {
                            console.error("Error al cerrar sesión desde header:", error);
                            alert("Hubo un problema al cerrar sesión.");
                        }
                    });
                    profileButton.dataset.listenerAttached = 'true'; // Marcar que ya tiene listener
                }
            }
        } else {
            // Usuario NO está logueado
            document.body.classList.remove('logged-in'); // Quitar clase del body
            if (profileButton) {
                profileButton.style.display = 'none'; // Ocultar botón (CSS lo debería hacer)
            }
        }
    });
}

// Llamar a la función una vez al cargar auth.js para configurar el estado inicial
updateHeaderAuthState();

