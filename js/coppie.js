let questions = [];
let currentQuestionIndex = 0;
let scores = { him: 0, her: 0 };
const goalScore = 10; // Punteggio per vincere

// Carica le domande da un file JSON
async function loadQuestions() {
  try {
    const response = await fetch('js/questions.json');
    const data = await response.json();
    questions = data.questions;
    shuffleQuestions();
  } catch (error) {
    console.error("Errore nel caricamento delle domande:", error);
  }
}

// Mescola le domande
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

// Avvia il gioco
function startGame() {
  const nameHim = document.getElementById('name-him').value || "Lui";
  const nameHer = document.getElementById('name-her').value || "Lei";

  document.getElementById('label-him').innerText = nameHim;
  document.getElementById('label-her').innerText = nameHer;

  document.getElementById('name-input').style.display = "none";
  document.getElementById('game-content').style.display = "block";

  // Carica e mostra la prima domanda
  loadQuestions().then(() => nextQuestion());
}

// Aggiorna il punteggio e la barra di progresso
function updateScore(player) {
  scores[player]++;
  const progressBar = document.getElementById(`progress-${player}`);
  const progress = (scores[player] / goalScore) * 100;
  progressBar.style.width = `${progress}%`;

  if (scores[player] >= goalScore) {
    declareWinner(player);
  }
}

// Dichiara il vincitore
function declareWinner(player) {
  document.getElementById('question-container').innerHTML = 
    `<h2 class="winner-message">${document.getElementById(`label-${player}`).innerText} vince!</h2>`;
  disableButtons();
}

// Disabilita i pulsanti dopo il termine del gioco
function disableButtons() {
  document.querySelectorAll('button').forEach(button => button.disabled = true);
}

// Mostra la prossima domanda
function nextQuestion() {
  if (currentQuestionIndex < questions.length) {
    const questionData = questions[currentQuestionIndex];
    document.getElementById('category').innerText = `Categoria: ${questionData.category}`;
    document.getElementById('question').innerText = questionData.question;
    currentQuestionIndex++;
  } else {
    document.getElementById('question-container').innerHTML = "<h2>Gioco completato!</h2>";
  }
}
