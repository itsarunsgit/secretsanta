function generateSecretSanta(group) {
  const participants = [...group.participants];
  let shuffled = [...participants];
  
  do {
    shuffled.sort(() => Math.random() - 0.5);
  } while (shuffled.some((p, i) => p.id === participants[i].id));

  participants.forEach((p, i) => {
    p.receiverId = shuffled[i].id;
  });

  group.participants = participants;
}
