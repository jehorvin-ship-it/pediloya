// ======================================================
//             auth.js (Cerebro de Autenticaci�n)
// ======================================================

// --- �Pega tu configuraci�n de Firebase aqu�! ---
const firebaseConfig = {
  apiKey: "AIzaSyBcsps_cdROmgwHRNkHNUbSqO2E26u36Ms",
  authDomain: "pediloya-d210a.firebaseapp.com",
  projectId: "pediloya-d210a",
  storageBucket: "pediloya-d210a.firebasestorage.app",
  messagingSenderId: "165315675643",
  appId: "1:165315675643:web:04eed7c14c533e87f5b75e"
};
// ----------------------------------------------

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/**
 * Funci�n global para obtener el estado del usuario.
 * Devuelve una promesa que se resuelve con:
 * - El objeto de usuario (si est� logueado)
 * - null (si no est� logueado)
 */
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    // onAuthStateChanged es un "oyente"
    // Se dispara en cuanto carga la p�gina con el estado del usuario
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe(); // Dejamos de escuchar
      resolve(user); // Devolvemos el usuario (o null)
    }, reject); // Devolvemos error si falla Firebase
  });
}

/**
 * Funci�n para cerrar la sesi�n del usuario.
 * Devuelve una promesa.
 */
function logOut() {
  return auth.signOut();
}

/**
 * Devuelve el n�mero de tel�fono del usuario en formato local (88889999)
 * o null si no est� logueado.
 */
async function getUserPhone() {
    try {
        const user = await getCurrentUser();
        if (user && user.phoneNumber) {
            // El n�mero de Firebase viene como "+50588889999"
            // Lo limpiamos para dejarlo en formato local
            return user.phoneNumber.replace('+505', '');
        } else {
            return null; // No hay usuario o no tiene n�mero
        }
    } catch (error) {
        console.error("Error obteniendo el tel�fono del usuario:", error);
        return null;
    }
}