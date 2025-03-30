// AI pontoon

// --- Game Setup ---

// Use prompt-sync for Node.js environment
// In a browser environment, the built-in prompt will work (though it's blocking)
// If running in Node.js, uncomment the next line and run 'npm install prompt-sync'
// const prompt = require('prompt-sync')();

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const values = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 10, "Q": 10, "K": 10, "A": 11 // Ace value handled dynamically
};

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let playerStood = false;

// --- Core Functions ---

function createDeck() {
    deck = []; // Reset deck
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank, value: values[rank] });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    // Fisher-Yates (Knuth) Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
    return deck;
}

function dealCard(hand) {
    if (deck.length < 1) {
        console.log("Reshuffling deck...");
        createDeck();
        shuffleDeck(deck);
        // Basic prevention, might need more robust logic for edge cases
        if (deck.length < 1) throw new Error("Deck error after reshuffle!");
    }
    const card = deck.pop();
    hand.push(card);
    return card;
}

function calculateHandValue(hand) {
    let score = 0;
    let aceCount = 0;
    for (const card of hand) {
        score += card.value;
        if (card.rank === "A") {
            aceCount++;
        }
    }
    // Adjust for Aces if score is over 21
    while (score > 21 && aceCount > 0) {
        score -= 10; // Change an Ace's value from 11 to 1
        aceCount--;
    }
    return score;
}

function getHandString(hand, hideOneCard = false) {
    if (hideOneCard) {
        if (hand.length === 0) return "[Hidden]";
        // Show only the second card if hiding
        return `[Hidden], ${hand[1].rank} of ${hand[1].suit}`;
    }
    return hand.map(card => `${card.rank} of ${card.suit}`).join(', ');
}

function displayGameState(hideDealerCard = true) {
    console.log("\n--------------------");

    // Dealer's Hand
    const dealerHandStr = getHandString(dealerHand, hideDealerCard);
    const dealerVisibleScore = hideDealerCard ? (dealerHand.length > 1 ? dealerHand[1].value : 0) : dealerScore;
    console.log(`Dealer's Hand: ${dealerHandStr} ${hideDealerCard ? '(Score: ?)' : `(Score: ${dealerScore})`}`);

    // Player's Hand
    const playerHandStr = getHandString(playerHand);
    console.log(`Your Hand: ${playerHandStr} (Score: ${playerScore})`);

    console.log("--------------------");
}

function checkBust(score) {
    return score > 21;
}

function determineWinner() {
    gameOver = true;
    playerStood = true; // Ensure game ends
    dealerScore = calculateHandValue(dealerHand); // Final dealer score

    console.log("\n--- Final Results ---");
    displayGameState(false); // Show all cards

    if (playerScore > 21) {
        console.log("You busted! Dealer wins.");
    } else if (dealerScore > 21) {
        console.log("Dealer busted! You win!");
    } else if (playerScore > dealerScore) {
        console.log("You win!");
    } else if (dealerScore > playerScore) {
        console.log("Dealer wins!");
    } else {
        console.log("It's a push (tie)!");
    }
}

// --- Game Logic Flow ---

function playerTurn() {
    while (!gameOver && !playerStood) {
        displayGameState(true); // Show current state, hide dealer's first card

        if (playerScore === 21 && playerHand.length === 2) {
             console.log("Pontoon! (Blackjack!)");
             // In some rules, this is an automatic win or higher payout
             // For simplicity here, we let the dealer play, but could end early.
             playerStood = true;
             break; // Move to dealer's turn
        }

        if (playerScore > 21) {
             console.log("You busted!");
             gameOver = true;
             determineWinner(); // Player bust ends game immediately
             break;
        }

        // Use browser prompt or Node.js prompt-sync
        let choice = '';
        while (choice !== 'h' && choice !== 's') {
             choice = prompt("Hit (h) or Stand (s)? ").toLowerCase();
        }


        if (choice === 'h') {
            const newCard = dealCard(playerHand);
            playerScore = calculateHandValue(playerHand);
            console.log(`You drew: ${newCard.rank} of ${newCard.suit}`);
             if (checkBust(playerScore)) {
                 displayGameState(true); // Show the busting hand
                 console.log("You busted!");
                 gameOver = true;
                 determineWinner();
             }
        } else if (choice === 's') {
            playerStood = true;
            console.log("You stand.");
        }
    }
}

function dealerTurn() {
    if (gameOver) return; // Don't run if player already busted

    console.log("\n--- Dealer's Turn ---");
    dealerScore = calculateHandValue(dealerHand);
    displayGameState(false); // Reveal dealer's hidden card

    while (dealerScore < 17) {
        console.log("Dealer hits.");
        const newCard = dealCard(dealerHand);
        dealerScore = calculateHandValue(dealerHand);
        console.log(`Dealer drew: ${newCard.rank} of ${newCard.suit}`);
        displayGameState(false);

        if (checkBust(dealerScore)) {
            console.log("Dealer busted!");
            gameOver = true;
            // Winner determined after loop
            break;
        }
        // Pause slightly for better flow (optional)
        // setTimeout(() => {}, 1000); // Doesn't work well with synchronous prompt
    }

    if (!gameOver) {
         if (dealerScore >= 17 && dealerScore <= 21) {
              console.log("Dealer stands.");
         }
    }

    determineWinner();
}

function resetGame() {
     deck = [];
     playerHand = [];
     dealerHand = [];
     playerScore = 0;
     dealerScore = 0;
     gameOver = false;
     playerStood = false;
     console.log("\n===== New Game =====");
}

function playGame() {
    resetGame();
    console.log("Welcome to Pontoon (Text Blackjack)!");

    createDeck();
    shuffleDeck(deck);

    // Initial Deal
    dealCard(playerHand);
    dealCard(dealerHand); // Dealer's hidden card
    dealCard(playerHand);
    dealCard(dealerHand); // Dealer's visible card

    playerScore = calculateHandValue(playerHand);
    // Don't calculate full dealer score until needed

    // Check for initial player Blackjack/Pontoon
    if (playerScore === 21) {
         displayGameState(true); // Show the Pontoon
         console.log("Pontoon! (Blackjack!)");
         playerStood = true; // Player automatically stands
         // Dealer still needs to play unless house rules say player auto-wins
    }

    // Start Player's Turn if game isn't over
    if (!gameOver) {
         playerTurn();
    }

    // Start Dealer's Turn if player stood and didn't bust
    if (playerStood && !gameOver) {
         dealerTurn();
    }

    // Ask to play again
    let playAgainChoice = '';
     while (playAgainChoice !== 'y' && playAgainChoice !== 'n') {
         playAgainChoice = prompt("Play Again? (y/n): ").toLowerCase();
     }

    if (playAgainChoice === 'y') {
        playGame(); // Recursive call to start a new game
    } else {
        console.log("Thanks for playing!");
    }
}

// --- Start the Game ---
// If running in Node.js with prompt-sync, this line will start the game automatically.
// If running in a browser console, paste the code, then type playGame() and press Enter.
playGame();

// Note: If not using prompt-sync in Node.js, you would need a different way
// to handle input, like the 'readline' module for async input.
// The current structure assumes a synchronous prompt function exists.
