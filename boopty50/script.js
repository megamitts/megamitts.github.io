document.addEventListener('DOMContentLoaded', () => {
    // Keep references to existing elements
    const bow = document.getElementById('bow');
    const present = document.getElementById('present');
    const confettiContainer = document.getElementById('confetti-container');
    const messageElement = document.getElementById('message');
    const birthdayMusic = document.getElementById('birthday-music');
    const candlesContainer = document.getElementById('candles-container');
    let isOpened = false;

    const confettiColors = ['#ffd700', '#ff69b4', '#00ced1', '#ff4500', '#9acd32', '#1e90ff', '#f0f'];
    // const confettiCount = 300;

    // --- NEW: Get flame elements ---
    const flames = document.querySelectorAll('.flame');

    // Add event listener to the bow
    bow.addEventListener('click', openPresent);

    // --- NEW: Add event listeners to each flame ---
    flames.forEach(flame => {
        flame.addEventListener('click', extinguishFlame);
    });

    // The function to handle clicking a flame
    function extinguishFlame(event) {
        console.log("Flame clicked:", event.target); // Add this line!
        const clickedFlame = event.target;
        if (!clickedFlame.classList.contains('extinguished')) {
            clickedFlame.classList.add('extinguished');
            console.log("Added 'extinguished' class to:", clickedFlame); // Add this line!
        } else {
            console.log("Flame was already extinguished."); // Add this line!
        }
    }

    // The main function when the bow is clicked (keep existing logic)
    function openPresent() {
        if (isOpened) return;
        isOpened = true;

        present.classList.add('present-opened');

        setTimeout(() => {
            createConfetti();

            birthdayMusic.play().catch(error => {
                console.error("Audio play failed:", error);
            });

            messageElement.textContent = "Happy 50th birthday boopty!";

            const messageAppearDelay = 500;
            const messageTransitionDuration = 1000;

            setTimeout(() => {
                messageElement.classList.add('message-visible');

                const candlesAppearDelay = messageAppearDelay + messageTransitionDuration + 300;

                setTimeout(() => {
                    // Check if candlesContainer exists before adding class
                    if (candlesContainer) {
                         console.log("Attempting to add candles visible class NOW");
                         candlesContainer.classList.add('visible');
                         console.log("Added 'visible' to candlesContainer:", candlesContainer.classList);
                    } else {
                         console.error("Candles container element NOT FOUND when trying to make visible!");
                    }
                }, candlesAppearDelay);

            }, messageAppearDelay);

            setTimeout(() => {
                if(present) present.style.display = 'none';
            }, 500);
            setTimeout(clearConfetti, 6000);

        }, 100);
    }

    // createConfetti function (keep existing logic)
    function createConfetti() {
       // ... (keep existing screen-filling confetti code) ...
        const containerRect = confettiContainer.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const originX = screenWidth / 2;
        const originY = screenHeight / 2;
        const confettiCount = 300; // Or your preferred count

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const size = Math.random() * 5 + 8;
            const fallDuration = Math.random() * 3 + 3.5;
            const fallDelay = Math.random() * 0.5;

            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size * 1.5}px`;
            confetti.style.opacity = 0;
            confetti.style.left = `${originX + Math.random() * 40 - 20}px`;
            confetti.style.top = `${originY + Math.random() * 40 - 20}px`;
            if (confettiContainer) confettiContainer.appendChild(confetti); // Add safety check

            const targetX = Math.random() * screenWidth;
            const targetY = Math.random() * screenHeight;
            const explosionTranslateX = targetX - originX;
            const explosionTranslateY = targetY - originY;

            confetti.animate([
                { opacity: 1, transform: `translate(0, 0) rotateZ(0deg)` },
                { opacity: 1, offset: 0.25, transform: `translate(${explosionTranslateX}px, ${explosionTranslateY}px) rotateZ(${Math.random() * 720}deg)` },
                { opacity: 0, transform: `translate(${explosionTranslateX}px, ${screenHeight + 100}px) rotateZ(${Math.random() * 1080 + 720}deg)` }
            ], {
                duration: fallDuration * 1000,
                delay: fallDelay * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });
        }
    }


    // clearConfetti function (keep existing logic)
    function clearConfetti() {
        if (confettiContainer) confettiContainer.innerHTML = ''; // Add safety check
        console.log("Confetti cleared");
    }

    // Add safety checks for element existence when getting references
     if (!bow) console.error("Bow element not found!");
     if (!present) console.error("Present element not found!");
     if (!confettiContainer) console.error("Confetti container not found!");
     if (!messageElement) console.error("Message element not found!");
     if (!birthdayMusic) console.error("Birthday music element not found!");
     if (!candlesContainer) console.error("Candles container element not found!");
     if (flames.length === 0) console.warn("No flame elements found!");


}); // End of DOMContentLoaded