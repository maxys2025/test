import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

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

let currentRoomId = null;  // Stanza attuale
let questions = [];
let currentQuestionIndex = 0;

let player1Name = "";
let player2Name = "";

// Funzione per caricare il file JSON delle domande
async function loadQuestions() {
  const response = await fetch('questions.json');
  const data = await response.json();

  const categories = data.domande;
  questions = [];

  for (const category in categories) {
    categories[category].forEach(item => {
      questions.push({
        question: item.question,
        category: item.category
      });
    });
  }

  shuffle(questions);
  showNextQuestion();
}

// Funzione per mescolare le domande
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Funzione per mostrare la domanda
function showQuestion(questionObj) {
  document.getElementById("question-text").textContent = questionObj.question;
  document.getElementById("category-text").textContent = `Categoria: ${questionObj.category}`;
}

// Funzione per passare alla prossima domanda
function showNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
    currentQuestionIndex++;
  } else {
    alert("Hai finito le domande!");
  }
}

// Funzione per ottenere i giocatori dalla stanza
async function getPlayers() {
  const roomRef = doc(db, 'rooms', currentRoomId);
  const roomSnapshot = await getDocs(collection(roomRef, 'players'));

  const players = roomSnapshot.docs.map(doc => doc.data());
  if (players.length === 2) {
    player1Name = players[0].name;
    player2Name = players[1].name;

    document.getElementById("player1-status").textContent = `Giocatore 1: ${player1Name}`;
    document.getElementById("player2-status").textContent = `Giocatore 2: ${player2Name}`;
  } else {
    document.getElementById("player2-status").textContent = "In attesa di un altro giocatore...";
  }
}

// Funzione per creare o unirsi a una stanza
async function createOrJoinRoom(playerName) {
  // Controlliamo se esiste una stanza con un solo giocatore
  const roomsSnapshot = await getDocs(collection(db, 'rooms'));
  let roomRef;
  let roomId;

  // Se c'è una stanza con un solo giocatore, uniamoci a quella
  const availableRoom = roomsSnapshot.docs.find(doc => doc.data().players.length === 1);
  
  if (availableRoom) {
    roomId = availableRoom.id;
    roomRef = doc(db, 'rooms', roomId);
  } else {
    // Altrimenti creiamo una nuova stanza
    const newRoomRef = await addDoc(collection(db, 'rooms'), {
      players: [],
      createdAt: serverTimestamp()
    });
    roomId = newRoomRef.id;
    roomRef = newRoomRef;
  }

  // Aggiungiamo il giocatore alla stanza
  await updateDoc(roomRef, {
    players: arrayUnion({ name: playerName, joinedAt: serverTimestamp() })
  });

  currentRoomId = roomId;
  getPlayers();  // Recupera e mostra i giocatori
  loadQuestions();  // Carica le domande
}

// Gestione delle risposte
document.getElementById("send-answer").addEventListener("click", async () => {
  const answer = document.getElementById("answer-input").value.trim();
  if (answer) {
    const playerName = player1Answered ? player2Name : player1Name;

    // Aggiungi la risposta alla chat
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p><strong>${playerName}</strong>: ${answer}</p>`;
    document.getElementById("answer-input").value = ""; // Reset dell'input

    // Salva la risposta nel database
    const roomRef = doc(db, 'rooms', currentRoomId);
    await updateDoc(roomRef, {
      answers: arrayUnion(answer)
    });

    // Verifica se entrambi i giocatori hanno risposto
    if (player1Answered && player2Answered) {
      document.getElementById("next-button").style.display = "inline-block"; // Mostra il tasto "Next"
    }
  } else {
    alert("Per favore, scrivi una risposta!");
  }
});

document.getElementById("send-answer").addEventListener("click", async () => {
  const playerName = prompt("Inserisci il tuo nome:");
  if (playerName) {
    await createOrJoinRoom(playerName);
  }
});
