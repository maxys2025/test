// Monitoraggio dei giocatori
db.collection('players').orderBy('joinedAt').limit(2).onSnapshot((snapshot) => {
  const players = snapshot.docs.map((doc) => doc.data());

  // Mostra i nomi dei giocatori quando entrambi si sono connessi
  if (players.length === 2) {
    document.getElementById('game-status').innerText = 
      `Giocatori pronti: ${players[0].name} e ${players[1].name}!`;
    alert('Entrambi i giocatori sono pronti! Iniziamo il gioco!');
    // Puoi aggiungere qui il codice per iniziare il gioco
  } else {
    document.getElementById('game-status').innerText = 
      `In attesa di un altro giocatore... (${players.length}/2 connessi)`;
  }
});
