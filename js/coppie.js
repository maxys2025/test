let questions = [];
let selectedQuestions = [];
let currentQuestionIndex = 0;
let scores = { him: 0, her: 0 };
const questionsPerCategory = 5; // Numero di domande per categoria

// Carica le domande da un file JSON
async function loadQuestions() {
  try {
    const response = await fetch('js/questions.json');
    const data = await response.json();
    questions = data.questions;
    prepareQuestions();
  } catch (error) {
    console.error("Errore nel caricamento delle domande:", error);
  }
}

// Prepara un set di domande casuali per ogni categoria
function prepareQuestions() {
  const categories = {}; // Oggetto per raggruppare le domande per categoria

  // Raggruppa le domande per categoria
  questions.forEach(question => {
    if (!categories[question.category]) {
      categories[question.category] = [];
    }
    categories[question.category].push(question);
  });

  // Estrai domande casuali da ogni categoria
  for (const category in categories) {
    const shuffled = [...categories[category]].sort(() => Math.random() - 0.5); // Mescola
    selectedQuestions.push(...shuffled.slice(0, questionsPerCategory)); // Aggiungi le prime N domande
  }

  shuffleQuestions(); // Mescola tutte le domande selezionate
}

// Mescola le domande
function shuffleQuestions() {
  selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
}

// Avvia il gioco
async function startGame() {
  const nameHim = document.getElementById('name-him').value || "Lui";
  const nameHer = document.getElementById('name-her').value || "Lei";

  document.getElementById('label-him').innerText = nameHim;
  document.getElementById('label-her').innerText = nameHer;

  document.getElementById('name-input').style.display = "none"; 
  document.getElementById('game-content').style.display = "block";

  await loadQuestions(); // Carica le domande e prepara il set
  updateQuestionCounter(); // Aggiorna il contatore
  nextQuestion(); // Mostra la prima domanda
}

// Mostra la prossima domanda
function nextQuestion() {
  if (currentQuestionIndex < selectedQuestions.length) {
    const questionData = selectedQuestions[currentQuestionIndex];
    document.getElementById('category').innerText = `Categoria: ${questionData.category}`;
    document.getElementById('question').innerText = questionData.question;
    currentQuestionIndex++;
    updateQuestionCounter(); // Aggiorna il contatore
  } else {
    endGame(); // Termina il gioco e calcola il vincitore
  }
}

// Aggiorna il contatore delle domande
function updateQuestionCounter() {
  const counterElement = document.getElementById('question-counter');
  counterElement.innerText = `${currentQuestionIndex}/${selectedQuestions.length}`;
}

// Aggiorna il punteggio e la barra di progresso
function updateScore(player) {
  scores[player]++;
  const progressBar = document.getElementById(`progress-${player}`);
  const progress = (currentQuestionIndex / selectedQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;

  // Mostra la prossima domanda o termina il gioco
  nextQuestion();
}

// Dichiara il vincitore
function endGame() {
  const himScore = scores.him;
  const herScore = scores.her;

  let winnerMessage;
  if (himScore > herScore) {
    winnerMessage = `${document.getElementById('label-him').innerText} vince con ${himScore} risposte corrette!`;
  } else if (herScore > himScore) {
    winnerMessage = `${document.getElementById('label-her').innerText} vince con ${herScore} risposte corrette!`;
  } else {
    winnerMessage = "È un pareggio! Entrambi avete dato lo stesso numero di risposte corrette.";
  }

  // Mostra il messaggio di vittoria e disabilita i pulsanti
  document.getElementById('question-container').innerHTML = 
    `<h2 class="winner-message">${winnerMessage}</h2>`;
  disableButtons();
}

// Disabilita i pulsanti dopo il termine del gioco
function disableButtons() {
  document.querySelectorAll('button').forEach(button => button.disabled = true);
}
