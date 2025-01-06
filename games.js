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
const db = firebase.firestore();

let questions = [];
let currentQuestionIndex = 0;
let player1Answered = false;
let player2Answered = false;

let player1Name = "";
let player2Name = "";

// Funzione per caricare il file JSON delle domande
async function loadQuestions() {
  const response = await fetch('questions.json');  // Assicurati che il file sia nella stessa directory
  const data = await response.json();

  // Estrai tutte le domande dalla categoria "domande"
  const categories = data.domande;
  
  // Combina tutte le domande delle sottocategorie in un unico array
  questions = [];
  for (const category in categories) {
    categories[category].forEach((item) => {
      questions.push({
        question: item.question,
        category: item.category
      });
    });
  }
  
  // Mescola le domande per avere un ordine casuale
  shuffle(questions);
  showNextQuestion();
}

// Funzione per mescolare un array (randomizza l'ordine)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Funzione per mostrare una domanda e la sua categoria
function showQuestion(questionObj) {
  document.getElementById("question-text").textContent = questionObj.question;
  document.getElementById("category-text").textContent = `Categoria: ${questionObj.category}`;
}

// Funzione per passare alla prossima domanda
function showNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
    currentQuestionIndex++;
    document.getElementById("next-button").style.display = "none"; // Nascondi il pulsante finché non è pronto
    player1Answered = false;
    player2Answered = false;
  } else {
    alert("Hai finito le domande!");
  }
}

// Gestione delle risposte
document.getElementById("send-answer").addEventListener("click", async () => {
  const answer = document.getElementById("answer-input").value.trim();
  if (answer) {
    const playerName = player1Answered ? player2Name : player1Name; // Determina chi ha risposto
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

    // Verifica se entrambi i giocatori hanno risposto
    if (player1Answered && player2Answered) {
      document.getElementById("next-button").style.display = "inline-block"; // Mostra il tasto "Next"
    }
  } else {
    alert("Per favore, scrivi una risposta!");
  }
});

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

// Carica i dati dei giocatori e le domande
getPlayers();
loadQuestions();
