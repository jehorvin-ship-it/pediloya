// firebase-messaging-sw.js

// Importar scripts necesarios (Firebase lo maneja si configuras bien)
// No siempre son necesarios si usas la v9 modular, pero por compatibilidad:
try {
    importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

    // ¡Usa TU configuración de Firebase aquí! (Solo necesitas las primeras claves)
    const firebaseConfig = {
      apiKey: "AIzaSyBcsps_cdROmgwHRNkHNUbSqO2E26u36Ms",
      authDomain: "pediloya-d210a.firebaseapp.com",
      projectId: "pediloya-d210a",
      storageBucket: "pediloya-d210a.firebasestorage.app", // Necesario para messaging
      messagingSenderId: "165315675643",
      appId: "1:165315675643:web:04eed7c14c533e87f5b75e",
      // databaseURL: "https://pediloya-d210a-default-rtdb.firebaseio.com" // Añade si tienes problemas
    };

    firebase.initializeApp(firebaseConfig);

    // Obtener instancia de Messaging
    const messaging = firebase.messaging();

    // Escuchar mensajes push en segundo plano
    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);

      // Personalizar la notificación
      const notificationTitle = payload.notification.title || 'PediloYa';
      const notificationOptions = {
        body: payload.notification.body || 'Tienes una nueva notificación.',
        icon: payload.notification.icon || '/logo.png' // Puedes usar tu logo
        // Puedes añadir más opciones: badge, image, actions, etc.
        // data: payload.data // Para pasar datos adicionales y actuar al hacer clic
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });

} catch (e) {
    console.error('Error in firebase-messaging-sw.js:', e);
}