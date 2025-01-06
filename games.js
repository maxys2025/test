import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getFirestore, collection, doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

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

// Recupera l'ID della stanza e il nome del giocatore dal localStorage
const currentRoomId = localStorage.getItem("roomId");
const playerName = localStorage.getItem("playerName");

let questions = [];
let currentQuestionIndex = 0;
let player1Name = "";
let player2Name = "";

// Funzione per caricare il file JSON delle domande
async function loadQuestions() {
  const response = await fetch('questions.json');  // Carica il file JSON
  const data = await response.json();

  const categories = data.domande;
  questions = [];

  // Estrai le domande e aggiungile all'array
  for (const category in categories) {
    categories[category].forEach(item => {
      questions.push({
        question: item.question,
        category: item.category
      });
    });
  }

  shuffle(questions);  // Mescola le domande
  showNextQuestion();  // Mostra la prima domanda
}

// Funzione per mescolare l'array delle domande
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];  // Swap
  }
}

// Funzione per mostrare la domanda
function showQuestion(questionObj) {
  document.getElementById("question-text").textContent = questionObj.question;
  document.getElementById("category-text").textContent = `Categoria: ${questionObj.category}`;
}

// Funzione per passare alla domanda successiva
function showNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
    currentQuestionIndex++;
  } else {
    alert("Hai finito le domande!");
  }
}

// Funzione per aggiornare lo stato dei giocatori e caricare le domande
async function getPlayers() {
  const roomRef = doc(db, 'rooms', currentRoomId);
  const roomSnapshot = await getDoc(roomRef);  // Ottieni la stanza
  const roomData = roomSnapshot.data();

  if (!roomData) {
    alert("Errore: la stanza non esiste.");
    window.location.href = "index.html";  // Torna indietro se la stanza non esiste
    return;
  }

  const players = roomData.players || [];
  
  // Controlla se ci sono due giocatori
  if (players.length === 2) {
    player1Name = players[0].name;
    player2Name = players[1].name;

    document.getElementById("player1-status").textContent = `Giocatore 1: ${player1Name}`;
    document.getElementById("player2-status").textContent = `Giocatore 2: ${player2Name}`;

    loadQuestions();  // Inizia il gioco
  } else {
    document.getElementById("player2-status").textContent = "In attesa di un altro giocatore...";
  }
}

// Funzione per aggiornare la stanza con le risposte dei giocatori
async function updateRoomWithAnswers(playerName, answer) {
  const roomRef = doc(db, 'rooms', currentRoomId);

  // Aggiungi la risposta dei giocatori nel database
  await updateDoc(roomRef, {
    answers: arrayUnion({
      playerName: playerName,
      answer: answer,
      timestamp: serverTimestamp()
    })
  });

  // Verifica se entrambi i giocatori hanno risposto
  const roomSnapshot = await getDoc(roomRef);
  const roomData = roomSnapshot.data();
  const totalAnswers = roomData.answers ? roomData.answers.length : 0;

  if (totalAnswers === 2) {
    document.getElementById("next-button").style.display = "inline-block";  // Mostra il pulsante per la prossima domanda
  }
}

// Carica i dati dei giocatori e mostra lo stato
getPlayers();
