import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, arrayUnion } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

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
const db = getFirestore(app);

// Funzione per creare o unirsi a una stanza con password
async function createOrJoinRoom(playerName, password) {
  const roomsSnapshot = await getDocs(collection(db, 'rooms'));
  let roomRef;
  let roomId;

  // Trova la stanza con la stessa password
  const availableRoom = roomsSnapshot.docs.find(doc => doc.data().password === password && doc.data().players.length === 1);
  
  if (availableRoom) {
    roomId = availableRoom.id;
    roomRef = doc(db, 'rooms', roomId);
    console.log(`Unendosi alla stanza esistente: ${roomId}`);
  } else {
    // Crea una nuova stanza con la password
    const newRoomRef = await addDoc(collection(db, 'rooms'), {
      players: [],
      password: password,
      createdAt: serverTimestamp()
    });
    roomId = newRoomRef.id;
    roomRef = newRoomRef;
    console.log(`Creata nuova stanza: ${roomId}`);
  }

  // Aggiungiamo il giocatore alla stanza
  await updateDoc(roomRef, {
    players: arrayUnion({ name: playerName, joinedAt: serverTimestamp() })
  });

  localStorage.setItem("roomId", roomId); // Salva l'ID della stanza nel localStorage
  localStorage.setItem("playerName", playerName); // Salva il nome del giocatore

  window.location.href = "game.html";  // Reindirizza al gioco
}

// Gestione dell'evento per il login
document.getElementById("join-room").addEventListener("click", async () => {
  const playerName = document.getElementById("player-name").value.trim();
  const roomPassword = document.getElementById("room-password").value.trim();

  if (playerName && roomPassword) {
    await createOrJoinRoom(playerName, roomPassword);
  } else {
    alert("Inserisci sia il nome che la password!");
  }
});
