document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const dealButton = document.getElementById('deal-button');
    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    const playAgainButton = document.getElementById('play-again-button');

    const messageEl = document.getElementById('message');
    const dealerScoreEl = document.getElementById('dealer-score');
    const playerScoreEl = document.getElementById('player-score');
    const dealerHandEl = document.getElementById('dealer-hand');
    const playerHandEl = document.getElementById('player-hand');

    // --- Game Variables ---
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const values = {
        "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
        "J": 10, "Q": 10, "K": 10, "A": 11 // Ace value handled dynamically
    };
    const suitSymbols = {
        "Hearts": "♥",
        "Diamonds": "♦",
        "Clubs": "♣",
        "Spades": "♠"
    };


    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let playerScore = 0;
    let dealerScore = 0;
    let gameInProgress = false; // Use this instead of gameOver/playerStood

    // --- Core Game Functions ---

    function createDeck() {
        deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push({ suit, rank, value: values[rank] });
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function dealCard(hand) {
        if (deck.length < 1) {
            updateMessage("Reshuffling deck...");
            createDeck();
            shuffleDeck(deck);
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
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    }

    // --- Rendering Functions ---

    function createCardElement(card, isHidden = false) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', card.suit.toLowerCase());
        if (isHidden) {
            cardDiv.classList.add('hidden');
            cardDiv.innerHTML = `<span>&nbsp;</span><span class="suit-display">&nbsp;</span>`; // Keep structure but hide content
        } else {
            const suitSymbol = suitSymbols[card.suit];
            cardDiv.innerHTML = `
                <span>${card.rank}</span>
                <span class="suit-display">${suitSymbol}</span>
            `;
        }
        return cardDiv;
    }


    function renderHand(hand, element, hideOneCard = false) {
        element.innerHTML = ''; // Clear previous cards
        hand.forEach((card, index) => {
            const isHidden = hideOneCard && index === 0; // Only hide the first card if requested
            element.appendChild(createCardElement(card, isHidden));
        });
    }

    function updateScores(hideDealer = true) {
        playerScore = calculateHandValue(playerHand);
        dealerScore = calculateHandValue(dealerHand);

        playerScoreEl.textContent = playerScore;
        dealerScoreEl.textContent = hideDealer ? '?' : dealerScore;
    }

    function updateMessage(msg) {
        messageEl.textContent = msg;
    }

    function updateButtonStates(deal = false, hit = false, stand = false, playAgain = false) {
        dealButton.disabled = !deal;
        hitButton.disabled = !hit;
        standButton.disabled = !stand;
        playAgainButton.style.display = playAgain ? 'inline-block' : 'none';

        // Special case: Hide deal button when play again is visible
        dealButton.style.display = playAgain ? 'none' : 'inline-block';
    }

    // --- Game Logic Flow ---

    function startGame() {
        gameInProgress = true;
        deck = createDeck();
        shuffleDeck(deck);
        playerHand = [];
        dealerHand = [];

        // Initial Deal
        dealCard(playerHand);
        dealCard(dealerHand); // Dealer's hidden card
        dealCard(playerHand);
        dealCard(dealerHand); // Dealer's visible card

        renderHand(playerHand, playerHandEl);
        renderHand(dealerHand, dealerHandEl, true); // Hide dealer's first card

        updateScores(true); // Hide dealer score initially

        // Check for initial player Pontoon/Blackjack
        if (playerScore === 21) {
            updateMessage("Pontoon! (Blackjack!) Dealer's turn...");
            // Proceed directly to dealer's turn if player gets blackjack
            stand();
        } else {
             updateMessage("Your turn. Hit or Stand?");
             updateButtonStates(false, true, true, false); // Enable Hit/Stand
        }
    }

    function playerHit() {
        if (!gameInProgress) return;

        dealCard(playerHand);
        renderHand(playerHand, playerHandEl);
        updateScores(true); // Keep dealer score hidden

        if (playerScore > 21) {
            updateMessage("You busted! Dealer wins.");
            endGame(false); // Player lost
        } else if (playerScore === 21) {
             updateMessage("Score is 21! Dealer's turn...");
             stand(); // Automatically stand on 21
        } else {
            // Keep buttons enabled, message already set in startGame or previous hit
        }
    }

    function stand() {
        if (!gameInProgress) return;
        gameInProgress = false; // Player's turn is over
        updateMessage("Dealer's turn...");
        updateButtonStates(false, false, false, false); // Disable controls during dealer turn

        // Short delay before dealer plays for better UX
        setTimeout(dealerTurn, 800);
    }

    function dealerTurn() {
        renderHand(dealerHand, dealerHandEl, false); // Reveal dealer's hand
        updateScores(false); // Show dealer score

        // Dealer hits until score is 17 or more
        function hitLoop() {
            if (dealerScore < 17) {
                updateMessage("Dealer hits...");
                dealCard(dealerHand);
                renderHand(dealerHand, dealerHandEl, false);
                updateScores(false);

                 if (dealerScore > 21) {
                     updateMessage("Dealer busted! You win!");
                     endGame(true); // Player won
                 } else {
                      // Add a delay between dealer hits
                      setTimeout(hitLoop, 800);
                 }
            } else {
                 determineWinner(); // Dealer stands
            }
        }

        hitLoop(); // Start the dealer hitting loop (or determine winner immediately if >= 17)
    }

    function determineWinner() {
         updateMessage("Comparing hands..."); // Optional intermediate message
         renderHand(dealerHand, dealerHandEl, false); // Ensure dealer hand is revealed
         updateScores(false); // Ensure dealer score is revealed

         let finalMessage = "";
         if (playerScore > 21) { // Should have been caught earlier, but double-check
             finalMessage = "You busted! Dealer wins.";
         } else if (dealerScore > 21) {
             finalMessage = "Dealer busted! You win!";
         } else if (playerScore > dealerScore) {
             finalMessage = "You win!";
         } else if (dealerScore > playerScore) {
             finalMessage = "Dealer wins!";
         } else {
             finalMessage = "It's a push (tie)!";
         }
         updateMessage(finalMessage);
         endGame(false); // Indicate game is over, but player didn't necessarily win
    }


    function endGame(playerWon) { // playerWon only relevant for bust scenarios handled earlier
        gameInProgress = false;
        updateButtonStates(false, false, false, true); // Show Play Again
    }

    function resetGameUI() {
        playerHandEl.innerHTML = '';
        dealerHandEl.innerHTML = '';
        playerScoreEl.textContent = '0';
        dealerScoreEl.textContent = '?';
        updateMessage("Press Deal to Start.");
        updateButtonStates(true, false, false, false); // Only Deal enabled
    }

    // --- Event Listeners ---
    dealButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', playerHit);
    standButton.addEventListener('click', stand);
    playAgainButton.addEventListener('click', resetGameUI);

    // --- Initial Setup ---
    resetGameUI(); // Set the initial state when the page loads
});