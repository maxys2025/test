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

  // Crea l'oggetto del giocatore
  const playerData = {
    name: playerName,
    joinedAt: serverTimestamp()
  };

  // Aggiungiamo il giocatore alla stanza
  await updateDoc(roomRef, {
    players: arrayUnion(playerData) // Aggiungi l'oggetto giocatore con timestamp
  });

  localStorage.setItem("roomId", roomId); // Salva l'ID della stanza nel localStorage
  localStorage.setItem("playerName", playerName); // Salva il nome del giocatore

  window.location.href = "game.html";  // Reindirizza al gioco
}
