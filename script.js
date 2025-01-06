// Importa le funzioni necessarie da Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);

// Inizializza Firestore
const db = getFirestore(app);

// Aggiungi un documento di test
async function addTestDocument() {
  try {
    await addDoc(collection(db, 'test'), {
      name: 'Giocatore1',
      score: 0,
      joinedAt: serverTimestamp()
    });
    console.log('Documento aggiunto con successo!');
  } catch (error) {
    console.error('Errore durante l\'aggiunta del documento:', error);
  }
}

// Salva il nome del giocatore
document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Previene il comportamento predefinito del form

  const playerName = document.getElementById('player-name').value.trim();

  if (playerName) {
    try {
      // Aggiungi il nome al database
      await addDoc(collection(db, 'players'), {
        name: playerName,
        joinedAt: serverTimestamp()
      });
      alert(`Benvenuto, ${playerName}! Aspettiamo un altro giocatore...`);
      window.location.href = 'game.html'; // Reindirizza al gioco
    } catch (error) {
      console.error('Errore durante il salvataggio del nome:', error);
      alert('C\'è stato un problema. Riprova!');
    }
  } else {
    alert('Per favore, inserisci un nome!');
  }
});

// Esegui il test per aggiungere un documento di esempio
addTestDocument();
