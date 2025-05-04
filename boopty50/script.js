// --- START OF FILE script.js ---

document.addEventListener('DOMContentLoaded', () => {
    // Keep existing element references
    const bow = document.getElementById('bow');
    const present = document.getElementById('present');
    const confettiContainer = document.getElementById('confetti-container');
    const messageElement = document.getElementById('message');
    const birthdayMusic = document.getElementById('birthday-music');
    const candlesContainer = document.getElementById('candles-container');
    const flames = document.querySelectorAll('.flame');

    // Get references to candle divs by ID
    const candle5Div = document.getElementById('candle-5');
    const candle0Div = document.getElementById('candle-0');

    // --- *** ADD THIS BACK IN *** ---
    // Define confetti colors
    const confettiColors = ['#ffd700', '#ff69b4', '#00ced1', '#ff4500', '#9acd32', '#1e90ff', '#f0f'];
    // --- ************************** ---

    let isOpened = false;
    let allFlamesOut = false; // Flag to prevent multiple replacements

    // Add event listeners
    if (bow) bow.addEventListener('click', openPresent);
    else console.error("Bow element not found!");

    flames.forEach(flame => {
        if (flame) {
            flame.addEventListener('click', extinguishFlame);
        } else {
            console.warn("Found an undefined element in flames NodeList");
        }
    });
    if (flames.length === 0) console.warn("No flame elements found on load!");


    // Modified extinguishFlame function
    function extinguishFlame(event) {
        console.log("Flame clicked:", event.target);
        const clickedFlame = event.target;

        if (!clickedFlame.classList.contains('extinguished')) {
            clickedFlame.classList.add('extinguished');
            console.log("Added 'extinguished' class to:", clickedFlame);
            checkAllFlamesExtinguished(); // Check if all flames are now out
        } else {
            console.log("Flame was already extinguished.");
        }
    }

    // Function to check flame status
    function checkAllFlamesExtinguished() {
        if (allFlamesOut) return;

        let extinguishedCount = 0;
        flames.forEach(flame => {
            if (flame && flame.classList.contains('extinguished')) { // Add safety check for flame
                extinguishedCount++;
            }
        });

        console.log(`Extinguished count: ${extinguishedCount} / ${flames.length}`);

        // Make sure flames.length is greater than 0 before comparing
        if (flames.length > 0 && extinguishedCount === flames.length) {
            console.log("All flames are out! Replacing candles.");
            allFlamesOut = true;
            replaceCandlesWithImages();
        }
    }

    // Function to replace numbers with images
    function replaceCandlesWithImages() {
        if (!candle5Div || !candle0Div) {
             console.error("Cannot find candle divs for replacement.");
             return;
        }

        const ploverImg = document.createElement('img');
        ploverImg.src = 'plover.png';
        ploverImg.alt = 'Plover';
        ploverImg.className = 'candle-image';

        const sedgeImg = document.createElement('img');
        sedgeImg.src = 'sedge.png';
        sedgeImg.alt = 'Sedge Warbler';
        sedgeImg.className = 'candle-image';

        candle5Div.innerHTML = '';
        candle5Div.appendChild(ploverImg);
        candle5Div.classList.add('image-shown');

        candle0Div.innerHTML = '';
        candle0Div.appendChild(sedgeImg);
        candle0Div.classList.add('image-shown');

        setTimeout(() => {
            ploverImg.classList.add('visible');
            sedgeImg.classList.add('visible');
        }, 50);
    }


    // openPresent function (starts the main sequence)
    function openPresent() {
        if (isOpened) return;
        isOpened = true;
        console.log("Bow clicked, starting sequence..."); // Add log

        if (present) {
             present.classList.add('present-opened');
        } else {
             console.error("Present element not found!");
        }


        // Main sequence timeout
        setTimeout(() => {
            console.log("Executing main sequence timeout..."); // Add log
            try { // Add try...catch block for debugging
                createConfetti();

                if (birthdayMusic) {
                    birthdayMusic.play().catch(error => {
                        console.error("Audio play failed:", error);
                        // Provide feedback to user maybe? Button?
                    });
                } else {
                    console.error("Birthday music element not found!");
                }


                if (messageElement) {
                    messageElement.textContent = "Happy 50th birthday, Boopty!";
                } else {
                    console.error("Message element not found!");
                }


                const messageAppearDelay = 500;
                const messageTransitionDuration = 1000;

                // Message visibility timeout
                setTimeout(() => {
                    if (messageElement) messageElement.classList.add('message-visible');
                     console.log("Message should be visible now.");

                    const candlesAppearDelay = messageAppearDelay + messageTransitionDuration + 300;

                    // Candles visibility timeout
                    setTimeout(() => {
                        if (candlesContainer) {
                            candlesContainer.classList.add('visible');
                            console.log("Candles container made visible.");
                        } else {
                            console.error("Candles container element NOT FOUND when trying to make visible!");
                        }
                    }, candlesAppearDelay);

                }, messageAppearDelay);

                // Present removal timeout
                setTimeout(() => {
                    if (present) present.style.display = 'none';
                }, 500);

                // Confetti cleanup timeout
                // Make sure clearConfetti is defined BEFORE this!
                 setTimeout(clearConfetti, 7000);

            } catch (error) {
                 console.error("Error inside main sequence timeout:", error); // Catch errors here
            }

        }, 100); // Small delay after click before animations start
    }

    // createConfetti function (Full screen-filling version)
    function createConfetti() {
        console.log("Creating confetti..."); // Add log
        if (!confettiContainer) {
             console.error("Confetti container not found in createConfetti");
             return;
        }

        // *** confettiColors definition needs to be accessible here (moved it above) ***

        const containerRect = confettiContainer.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const originX = screenWidth / 2;
        const originY = screenHeight / 2;
        const confettiCount = 300;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');

            // Using confettiColors defined earlier
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

            confettiContainer.appendChild(confetti);

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
    } // End of createConfetti function

    // --- *** ADD THIS FUNCTION DEFINITION BACK IN *** ---
    // Function to clear confetti elements
    function clearConfetti() {
        console.log("Clearing confetti..."); // Add log
        if (confettiContainer) {
            confettiContainer.innerHTML = ''; // Clear the container
        } else {
             console.error("Cannot clear confetti, container not found.");
        }
    }
    // --- ******************************************* ---


    // Safety checks for candle divs (already present)
     if (!candle5Div) console.error("Candle 5 div not found!");
     if (!candle0Div) console.error("Candle 0 div not found!");
     // Add checks for other essential elements too
     if (!messageElement) console.error("Message element not found!");
     if (!birthdayMusic) console.error("Birthday music element not found!");
     if (!candlesContainer) console.error("Candles container element not found!");


}); // End of DOMContentLoaded