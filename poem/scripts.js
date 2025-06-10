document.addEventListener('DOMContentLoaded', function() {
  // Select all elements that are designated as overlay triggers
  const overlayTriggers = document.querySelectorAll('[data-overlay-target]');

  overlayTriggers.forEach(trigger => {
    const overlayId = trigger.dataset.overlayTarget; // Gets the value of data-overlay-target
    const overlayElement = document.getElementById(overlayId);

    if (overlayElement) {
      trigger.addEventListener('click', function(e) {
        e.stopPropagation();

        // Optional: Close any other active overlays first
        document.querySelectorAll('.overlay.active').forEach(activeOverlay => {
          if (activeOverlay !== overlayElement) { // Don't close if it's the one we're opening
            activeOverlay.classList.remove('active');
          }
        });
        
        overlayElement.classList.add('active');
      });

      // Add click listener to the overlay itself to close it
      overlayElement.addEventListener('click', function(e) {
        // Only close if the click is directly on the overlay, not its children
        if (e.target === overlayElement) { 
          overlayElement.classList.remove('active');
        }
      });

    } else {
      console.warn(`Overlay with ID "${overlayId}" not found for trigger:`, trigger);
    }
  });

  /* Optional: Add a way to close overlays with the Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
      document.querySelectorAll('.overlay.active').forEach(activeOverlay => {
        activeOverlay.classList.remove('active');
      });
    }
  }); */
});


/* coal mine overlay script 

document.addEventListener('DOMContentLoaded', function() {
  const coalSpan = document.querySelector('.coal');
  const coalOverlay = document.getElementById('coal-overlay');

  if (coalSpan && coalOverlay) {
    coalSpan.addEventListener('click', function(e) {
      e.stopPropagation();
      coalOverlay.classList.add('active');
    });

    coalOverlay.addEventListener('click', function() {
      coalOverlay.classList.remove('active');
    });
  }
}); */







/* light switch script */


// Highlight/dark mode toggle for .light.dark
const lightDarkSpan = document.querySelector('.light.dark');
const darkOverlay = document.getElementById('dark-overlay');
const bloodspot = document.querySelector('.bloodspot');
if (lightDarkSpan && darkOverlay) {
  let isDark = false;

  function toggleDark() {
    isDark = !isDark;
    if (isDark) {
      darkOverlay.style.display = 'block';
      bloodspot.style.display = 'inline'; // show blood
      lightDarkSpan.classList.add('highlighted');
      // Optionally, scroll to the span
      lightDarkSpan.scrollIntoView({behavior: "smooth", block: "center"});
    } else {
      darkOverlay.style.display = 'none';
      bloodspot.style.display = 'none'; // hide blood
      lightDarkSpan.classList.remove('highlighted');
    }
  }

  lightDarkSpan.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDark();
  });

  // Clicking the overlay also restores the page
  /* darkOverlay.addEventListener('click', toggleDark); */
}

/* fire and flood overlay script - click fire to start and flood to remove*/



const flameOverlay = document.getElementById('flame-overlay');
const fireSpan = document.querySelector('.fire');
const floodSpan = document.querySelector('.flood');
const waveOverlay = document.getElementById('wave-overlay');

if (flameOverlay && fireSpan && floodSpan && waveOverlay) {
  fireSpan.addEventListener('click', (e) => {
    e.stopPropagation();
    flameOverlay.classList.add('active');
    floodSpan.classList.add('overlay-active');
  });

  floodSpan.addEventListener('click', (e) => {
    e.stopPropagation();
    // Show wave overlay
    waveOverlay.style.display = 'block';
    // Remove flames after a split second
    setTimeout(() => {
      flameOverlay.classList.remove('active');
    }, 100);

    // remove water after 4.5 seconds

    setTimeout(() => {
            floodSpan.classList.remove('overlay-active');
            flameOverlay.classList.remove('active'); /* if user clicks flames again whilst flood on they will be removed */
      waveOverlay.style.display = 'none';
    }, 4500);
  });
}






  //meteor script

document.addEventListener('DOMContentLoaded', function() {
  const bombardmentSpan = document.querySelector('.bombardment');
  const meteorOverlay = document.getElementById('meteor-overlay');

  if (bombardmentSpan && meteorOverlay) {
    let meteorInterval;
    let meteorTimeout;

    // Array of bombardment-related words
    const bombardmentWords = [
      'CRASH', 'BLAST', 'SMASH', 'BANG', 'FIRE', 'BURN', 
      'DESTROY', 'SHATTER', 'EXPLODE', 'IMPACT', 'STRIKE', 'HIT',
      'WAR', 'CHAOS', 'RUIN', 'WRECK', 'CRUSH'
    ];

    function createMeteor() {
      const meteor = document.createElement('div');
      meteor.className = 'meteor';
      
      // Random size variation
      const size = Math.random();
      if (size < 0.3) {
        meteor.classList.add('small');
      } else if (size > 0.8) {
        meteor.classList.add('large');
      }
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight * 0.3;
      
      meteor.style.left = startX + 'px';
      meteor.style.top = startY + 'px';
      
      // Random fall duration
      const duration = 1.5 + Math.random() * 2;
      meteor.style.animationDuration = duration + 's';
      
      meteorOverlay.appendChild(meteor);
      
      setTimeout(() => {
        meteor.classList.add('active');
      }, 100);
      
      setTimeout(() => {
        if (meteor.parentNode) {
          meteor.parentNode.removeChild(meteor);
        }
      }, duration * 1000 + 500);
    }

    function createTextMeteor() {
      const textMeteor = document.createElement('span');
      textMeteor.className = 'text-meteor';
      
      // Random word from the bombardment array
      const randomWord = bombardmentWords[Math.floor(Math.random() * bombardmentWords.length)];
      textMeteor.textContent = randomWord;
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight * 0.3;
      
      textMeteor.style.left = startX + 'px';
      textMeteor.style.top = startY + 'px';
      
      // Random fall duration
      const duration = 2 + Math.random() * 2; // Slightly slower than regular meteors
      textMeteor.style.animationDuration = duration + 's';
      
      meteorOverlay.appendChild(textMeteor);
      
      // Remove after animation
      setTimeout(() => {
        if (textMeteor.parentNode) {
          textMeteor.parentNode.removeChild(textMeteor);
        }
      }, duration * 1000 + 500);
    }

    function startMeteorShower() {
      meteorOverlay.classList.add('active');
      
      // Create regular meteors frequently
      meteorInterval = setInterval(() => {
        createMeteor();
        
        // Sometimes create a text meteor instead (30% chance)
        if (Math.random() < 0.3) {
          createTextMeteor();
        }
      }, 200);
      
      // Stop after 4 seconds
      meteorTimeout = setTimeout(() => {
        clearInterval(meteorInterval);
        
        setTimeout(() => {
          meteorOverlay.classList.remove('active');
          meteorOverlay.innerHTML = '';
        }, 2000);
      }, 4000);
    }

    function stopMeteorShower() {
      clearInterval(meteorInterval);
      clearTimeout(meteorTimeout);
      meteorOverlay.classList.remove('active');
      meteorOverlay.innerHTML = '';
    }

    bombardmentSpan.addEventListener('click', function(e) {
      e.stopPropagation();
      
      if (meteorOverlay.classList.contains('active')) {
        stopMeteorShower();
      } else {
        startMeteorShower();
      }
    });
  }
});

/* barfly trailer script */


document.querySelectorAll('.video-link').forEach(el => {
  el.addEventListener('click', function(e) {
    e.stopPropagation();
    const yt = this.getAttribute('data-yt');
    document.getElementById('youtube-frame').src = yt ;
    document.getElementById('video-overlay').style.display = 'flex';
  });
});
document.getElementById('close-video').onclick = function() {
  document.getElementById('video-overlay').style.display = 'none';
  document.getElementById('youtube-frame').src = '';
};
// Optional: close overlay when clicking outside the video
document.getElementById('video-overlay').addEventListener('click', function(e) {
  if (e.target === this) {
    this.style.display = 'none';
    document.getElementById('youtube-frame').src = '';
  }
});
