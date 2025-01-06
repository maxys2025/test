import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

let player1Name = "";
let player2Name = "";

// Funzione per ottenere i giocatori
async function getPlayers() {
  const playersSnapshot = await getDocs(collection(db, "players"));
  const players = playersSnapshot.docs.map(doc => doc.data());

  if (players.length === 2) {
    player1Name = players[0].name;
    player2Name = players[1].name;

    document.getElementById("player1-status").textContent = `Giocatore 1: ${player1Name}`;
    document.getElementById("player2-status").textContent = `Giocatore 2: ${player2Name}`;
  } else {
    document.getElementById("player2-status").textContent = "In attesa di un altro giocatore...";
  }
}

// Mostra la domanda
function showQuestion(question) {
  document.getElementById("question-text").textContent = question;
}

// Gestisce la risposta
document.getElementById("send-answer").addEventListener("click", async () => {
  const answer = document.getElementById("answer-input").value.trim();
  if (answer) {
    const playerName = player1Name; // Qui puoi aggiungere logica per capire quale giocatore ha risposto
    const chatBox = document.getElementById("chat-box");

    // Aggiungi la risposta alla chat
    chatBox.innerHTML += `<p><strong>${playerName}</strong>: ${answer}</p>`;
    document.getElementById("answer-input").value = ""; // Reset dell'input

    // Aggiungi la risposta nel database
    const playerDoc = await getDocs(collection(db, "players"));
    playerDoc.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        answers: arrayUnion(answer)
      });
    });

    // Abilita il pulsante per la prossima domanda
    document.getElementById("next-button").style.display = "inline-block";
  } else {
    alert("Per favore, scrivi una risposta!");
  }
});

// Carica i dati dei giocatori e una domanda
getPlayers();
showQuestion("Qual è il tuo colore preferito?");
