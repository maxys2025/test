// script.js

let questions = []; // Array che conterrà le domande

// Carica le domande dal file JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();

        // Mostra una domanda casuale all'inizio
        displayRandomQuestion();
    } catch (error) {
        console.error('Errore nel caricamento delle domande:', error);
    }
}

// Mostra una domanda casuale da tutte le categorie
function displayRandomQuestion() {
    if (questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        displayQuestion(questions[randomIndex]);
    }
}

// Mostra una domanda casuale di una categoria specifica
function displayCategoryQuestion(category) {
    const categoryQuestions = questions.filter(q => q.category === category);
    if (categoryQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
        displayQuestion(categoryQuestions[randomIndex]);
    } else {
        displayQuestion({ question: "Nessuna domanda disponibile per questa categoria.", category });
    }
}

// Mostra la domanda e la categoria nel question-box
function displayQuestion(questionObj) {
    const questionBox = document.getElementById('question-box');
    questionBox.innerHTML = `<strong>${questionObj.category}</strong><br>${questionObj.question}`;
}

// Event listeners per i pulsanti
document.getElementById('random-question-btn').addEventListener('click', displayRandomQuestion);
document.getElementById('category-past').addEventListener('click', () => displayCategoryQuestion('Passato e Ricordi '));
document.getElementById('category-dreams').addEventListener('click', () => displayCategoryQuestion('Sogni e Obiettivi'));
document.getElementById('category-values').addEventListener('click', () => displayCategoryQuestion('Valori e credenze'));
document.getElementById('category-lifestyle').addEventListener('click', () => displayCategoryQuestion('Stili di Vita e Preferenze'));
document.getElementById('category-intimacy').addEventListener('click', () => displayCategoryQuestion('Sesso e Intimità '));

// Carica le domande all'avvio del sito
loadQuestions();
