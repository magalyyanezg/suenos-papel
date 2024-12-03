document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatContainer = document.getElementById('chat-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const profileContainer = document.getElementById('profile-container');

    if('serviceWorker' in navigator){
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado con exito: ', registration);
            })
            .catch(error => {
                console.log('Fallo en el registro del Service Worker:', error);
            })
        })
    }
  
    // Listen for chat form submission
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = document.getElementById('chat-message').value;
        if (message) {
          db.collection('messages').add({
            text: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
          document.getElementById('chat-message').value = '';
        }
      });
  
      // Load chat messages
      db.collection('messages').orderBy('timestamp').onSnapshot((snapshot) => {
        chatContainer.innerHTML = '';
        snapshot.forEach((doc) => {
          const message = doc.data();
          chatContainer.innerHTML += `<p>${message.text}</p>`;
        });
      });
    }
  
    // Listen for authentication state changes
    auth.onAuthStateChanged((user) => {
      if (user && profileContainer) {
        profileContainer.innerHTML = `
          <h2>${user.displayName || 'Usuario'}</h2>
          <img src="${user.photoURL || 'default-profile.png'}" alt="Foto de perfil">
          <p>${user.email}</p>
          <button id="logout-button">Cerrar Sesión</button>
        `;
        document.getElementById('logout-button').addEventListener('click', () => {
          auth.signOut();
        });
      }
    });
  
    // Handle login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        auth.signInWithEmailAndPassword(email, password)
          .then(() => {
            console.log('Logged in');
          })
          .catch((error) => {
            console.error('Login error:', error);
          });
      });
    }
  
    // Handle register form submission
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = registerForm['register-username'].value;
        const email = registerForm['register-email'].value;
        const password = registerForm['register-password'].value;
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            return user.updateProfile({
              displayName: username,
              photoURL: 'default-profile.png'  // Set a default profile photo URL if desired
            });
          })
          .then(() => {
            console.log('Registered and profile updated');
          })
          .catch((error) => {
            console.error('Register error:', error);
          });
      });
    }
  });
  