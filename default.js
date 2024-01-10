const container = document.getElementById("container");

async function fetchCards() {
    const url = "https://deckofcardsapi.com/api/deck/new/draw/?count=52";
    const request = new Request(url);

    try {
        const response = await fetch(request);
        const deck = await response.json();

        return deck;
    } catch(error) {
        console.log("Error fetching")
    }
}


async function displayCards() {
    container.textContent = "";

    const deck = await fetchCards();

    for (const card of deck.cards) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        const cardValue = document.createElement("p");
        const cardSuit = document.createElement("p");
        const image = document.createElement("img");

        cardValue.textContent = `Value: ${card.value}`;
        cardSuit.textContent = `Suit: ${card.suit}`;
        image.src = card.images.svg;

        cardDiv.appendChild(cardValue);
        cardDiv.appendChild(cardSuit);
        cardDiv.appendChild(image);

        container.appendChild(cardDiv);
    }
}

displayCards();