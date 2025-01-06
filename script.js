document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Previene il comportamento predefinito del form

  const player1 = document.getElementById('player1').value.trim();
  const player2 = document.getElementById('player2').value.trim();

  if (player1 && player2) {
    // Salva i nomi dei giocatori nel localStorage
    localStorage.setItem('player1', player1);
    localStorage.setItem('player2', player2);

    // Reindirizza alla pagina del gioco
    window.location.href = 'game.html';
  } else {
    alert('Per favore, inserisci i nomi di entrambi i giocatori!');
  }
});
