// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDjDMlNNyZcg-iUx6ENAi8Gs1Pfo0sgdYo",
  authDomain: "prova-gioco-domande-v3.firebaseapp.com",
  projectId: "prova-gioco-domande-v3",
  storageBucket: "prova-gioco-domande-v3.firebasestorage.app",
  messagingSenderId: "813944839795",
  appId: "1:813944839795:web:20c71d4113566009f11406"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Inizializza Firestore
const db = firebase.firestore();

// Aggiungi un documento di test
db.collection('test').add({
  name: 'Giocatore1',
  score: 0,
  joinedAt: firebase.firestore.FieldValue.serverTimestamp()
})
.then(() => {
  console.log('Documento aggiunto con successo!');
})
.catch((error) => {
  console.error('Errore durante l\'aggiunta del documento:', error);
});

// Salva il nome del giocatore
document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Previene il comportamento predefinito del form

  const playerName = document.getElementById('player-name').value.trim();

  if (playerName) {
    // Aggiungi il nome al database
    db.collection('players').add({
      name: playerName,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        alert(`Benvenuto, ${playerName}! Aspettiamo un altro giocatore...`);
        window.location.href = 'game.html'; // Reindirizza al gioco
      })
      .catch((error) => {
        console.error('Errore durante il salvataggio del nome:', error);
        alert('C\'è stato un problema. Riprova!');
      });
  } else {
    alert('Per favore, inserisci un nome!');
  }
});
