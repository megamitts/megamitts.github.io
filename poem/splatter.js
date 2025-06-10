document.body.addEventListener('click', function(event) {
    // --- Elements to IGNORE for splattering ---
    // If the click originated on or inside any of these, don't splatter.
    const ignoreSplatterOn = [
        '.circle_fake',        // Your clock
        'button',         // Any buttons
        'a',              // Any links
        'input',          // Any input fields
        'textarea',       // Any text areas
        'select'          // Any select dropdowns
        // Add other selectors for elements you don't want splatters on
    ];

    for (const selector of ignoreSplatterOn) {
        if (event.target.closest(selector)) {
            // console.log('Splatter ignored: click on or inside', selector);
            return; // Stop if the click was on an ignored element
        }
    }

    // --- Create the splatter image element ---
    const splatterImage = document.createElement('img');
    splatterImage.src = 'ink-splatter.png'; // Ensure this path is correct!

    // --- Style the splatter ---
    splatterImage.style.position = 'absolute';
    splatterImage.style.pointerEvents = 'none';
    splatterImage.style.zIndex = '1000'; // Should be on top

    const baseSize = 20 + Math.random() * 30; // Random size between 20px and 50px
    splatterImage.style.width = `${baseSize}px`;
    splatterImage.style.height = 'auto'; // Maintain aspect ratio

    const randomRotation = Math.random() * 360; // 0-359 degrees

    // Position using pageX/pageY for coordinates relative to the whole document
    // This is generally more reliable than clientX/Y if there's scrolling.
    splatterImage.style.left = `${event.pageX}px`;
    splatterImage.style.top = `${event.pageY}px`;

    splatterImage.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;
    splatterImage.style.transformOrigin = 'center center';

    // --- Add to body ---
    document.body.appendChild(splatterImage);
    // console.log('Splatter added at:', event.pageX, event.pageY);

    // --- Optional: Fade out and remove ---
    splatterImage.style.opacity = '0.7'; // Start slightly transparent if you like
    splatterImage.style.transition = 'opacity 1s ease-out 20s'; // Fade after 2s, over 1s

    // Set opacity to 0 to trigger the fade after the delay
    // Need a tiny delay for the transition to register properly if opacity is set immediately
    setTimeout(() => {
        splatterImage.style.opacity = '0';
    }, 50); // Small delay

    // Remove from DOM after transition
    splatterImage.addEventListener('transitionend', function() {
        if (splatterImage.parentNode) {
            splatterImage.parentNode.removeChild(splatterImage);
            // console.log('Splatter removed');
        }
    });

    // Fallback removal in case transitionend doesn't fire (e.g., element hidden before transition)
    setTimeout(() => {
        if (splatterImage.parentNode) {
            splatterImage.parentNode.removeChild(splatterImage);
        }
    }, 22000); // Remove after x seconds regardless
});
