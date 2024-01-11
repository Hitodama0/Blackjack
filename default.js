const container = document.getElementById("container");
const pullButton = document.getElementById("pullCard");
const stopPullingButton = document.getElementById("stopPulling");
const resetGameButton = document.getElementById("resetGame");
const playerDeckDiv = document.getElementById("playerDeck");
const computerDeckDiv = document.getElementById("computerDeck");
const valueOneButton = document.getElementById("valueOne");
const valueElevenButton = document.getElementById("valueEleven");
const dialog = document.querySelector("dialog");
const winner = document.getElementById("winner");

let chosenAceValue;
valueOneButton.addEventListener("click", () => {
  chosenAceValue = 1;
  dialog.close();
  chosenAceValue = 0;
});

valueElevenButton.addEventListener("click", () => {
  chosenAceValue = 11;
  dialog.close();
  chosenAceValue = 0;
});

let cardDeck = [];
let playerDeck = [];
let computerDeck = [];
let playerScore = 0;
let computerScore = 0;

async function fetchCards() {
  const url = "https://deckofcardsapi.com/api/deck/new/draw/?count=52";
  const request = new Request(url);

  try {
    const response = await fetch(request);
    const deck = await response.json();

    return deck;
  } catch (error) {
    console.log("Error fetching");
  }
}

async function populateDeck() {
  container.textContent = "";

  const deck = await fetchCards();

  for (const card of deck.cards) {
    cardDeck.push(card);
  }
}

populateDeck();

async function pullCard(deck) {
  let index = Math.floor(Math.random() * deck.length);
  let card = deck.splice(index, 1)[0];
  return card;
}

function calculateScore(card) {
  switch (card.value) {
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;
    case "10":
    case "JACK":
    case "QUEEN":
    case "KING":
      return 10;
    case "ACE":
      return chosenAceValue || 11;
    default:
      return 0;
  }
}

async function playerPullCard() {
  let card = await pullCard(cardDeck);
  playerDeck.push(card);

  if (card.value === "ACE") {
    dialog.showModal();
  }

  playerScore += calculateScore(card);

  playerDeckDiv.textContent = "";
  displayDeck(playerDeck, playerDeckDiv);

  if (playerScore <= 21) {
    await computerPullCard(cardDeck);
  } else {
    endGame();
  }
}

async function computerPullCard(deck) {
  let card = await pullCard(deck);
  card.hidden = true;
  computerDeck.push(card);

  computerDeckDiv.textContent = "";
  displayDeck(computerDeck, computerDeckDiv);

  computerScore += calculateScore(card);

  if (computerScore >= 17) {
    endGame();
  }
}

function resetGame() {
  playerDeck = [];
  computerDeck = [];
  playerScore = 0;
  computerScore = 0;

  playerDeckDiv.textContent = "";
  computerDeckDiv.textContent = "";
  displayDeck(playerDeck, playerDeckDiv);
  displayDeck(computerDeck, computerDeckDiv);

  pullButton.disabled = false;
  winner.textContent = "---";
}

function revealComputerCards() {
  const computerDeckDiv = document.getElementById("computerDeck");
  const computerCards = computerDeckDiv.querySelectorAll("div");

  for (const cardDiv of computerCards) {
    cardDiv.style.visibility = "visible";
  }
}

function endGame() {
  revealComputerCards()
  pullButton.disabled = true;
  if (playerScore > 21) {
    winner.textContent = "Player busted! Computer wins.";
  } else if (computerScore > 21) {
    winner.textContent = "Computer busted! Player wins.";
  } else if (playerScore > computerScore) {
    winner.textContent = "Player wins.";
  } else if (computerScore > playerScore) {
    winner.textContent = "Computer wins.";
  } else {
    winner.textContent = "It's a tie.";
  }
}

function displayDeck(deck, divContainer) {
  divContainer.textContent = "";

  const p = document.createElement("p");
  p.textContent =
    divContainer.id === "playerDeck" ? "Player Deck" : "Computer Deck";
  divContainer.appendChild(p);

  for (const [index, card] of deck.entries()) {
    const div = document.createElement("div");
    const img = document.createElement("img");

    if (card.image) {
      img.src = card.image;
      div.appendChild(img);
      divContainer.appendChild(div);

      if (divContainer.id === "computerDeck" && index > 0) {
        div.style.visibility = "hidden"; 
      }
    } else {
      console.error("Card image not found:", card);
    }
  }

  container.appendChild(divContainer);
}



async function stopPull() {
  pullButton.disabled = true;

  while (computerScore < 17) {
    await computerPullCard(cardDeck);
  }
}

pullButton.addEventListener("click", playerPullCard);

stopPullingButton.addEventListener("click", stopPull);

resetGameButton.addEventListener("click", resetGame);
