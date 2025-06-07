 // Variables to manage speed up and clock state
  let isSpedUp = false;
  let timeOffset = 0; // in milliseconds, accumulates the "extra" time during speedup
  const speedMultiplier = 150;
  const speedUpDuration = 2000000; //  seconds in milliseconds
  let clockIntervalId; // To store the ID of the interval (either normal or fast)
  let speedUpTimeoutId; // To store the ID of the timeout that ends the speedup
  let lastTickTime = Date.now(); // To calculate deltaTime for accurate offset accumulation

  /**
   * Updates the clock hands to a specific given time.
   * @param {Date} displayTime The Date object representing the time to display.
   */
  function setClockHands(displayTime) {
    const now = displayTime; // This function now expects the exact time to display
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // Center of the clock
    const cx = 100, cy = 100;

    // Lengths of hands
    const hourLen = 50;
    const minLen = 60;
    const secLen = 80;

    // Angles in radians (0 degrees is 3 o'clock)
    // Offset by -90 degrees to make 0 degrees 12 o'clock
    const hourAngle = ((hour + minute / 60 + second / 3600) * 30 - 90) * Math.PI / 180;
    const minAngle = ((minute + second / 60) * 6 - 90) * Math.PI / 180;
    const secAngle = (second * 6 - 90) * Math.PI / 180;

    // Calculate end points of hands
    const hourX = cx + hourLen * Math.cos(hourAngle);
    const hourY = cy + hourLen * Math.sin(hourAngle);
    const minX = cx + minLen * Math.cos(minAngle);
    const minY = cy + minLen * Math.sin(minAngle);
    const secX = cx + secLen * Math.cos(secAngle);
    const secY = cy + secLen * Math.sin(secAngle);

    // Get hand elements
    const hourHandEl = document.getElementById('hourHand');
    const minuteHandEl = document.getElementById('minuteHand');
    const secondHandEl = document.getElementById('secondHand');

    // Update SVG attributes if elements exist
    if (hourHandEl) {
      hourHandEl.setAttribute('x2', hourX);
      hourHandEl.setAttribute('y2', hourY);
    }
    if (minuteHandEl) {
      minuteHandEl.setAttribute('x2', minX);
      minuteHandEl.setAttribute('y2', minY);
    }
    if (secondHandEl) {
      secondHandEl.setAttribute('x2', secX);
      secondHandEl.setAttribute('y2', secY);
    }
  }

  /**
   * This function is called at each interval (tick) to update the clock.
   * It calculates the effective time to display based on whether the clock is sped up.
   */
  function tick() {
    const currentTime = Date.now(); // Real current time
    
    if (isSpedUp) {
      const deltaTime = currentTime - lastTickTime; // Time elapsed since last fast tick
      // Accumulate (multiplier-1) extra time because one part of real time already passes
      timeOffset += deltaTime * (speedMultiplier - 1); 
    }
    
    lastTickTime = currentTime; // Update for the next tick's deltaTime calculation
    
    // The time to display is the real current time plus any accumulated offset
    setClockHands(new Date(currentTime + timeOffset));
  }

  /**
   * Starts or restarts the clock at its normal speed.
   */
  function startNormalClock() {
    isSpedUp = false; 
    // timeOffset should be 0 when starting normal clock after speedup
    lastTickTime = Date.now(); // Initialize for consistent deltaTime calculation
    
    clearInterval(clockIntervalId); // Clear any existing interval
    clockIntervalId = setInterval(tick, 1000); // Tick every 1 second
    tick(); // Call immediately to set hands to current time
  }

  /**
   * Starts the clock in its sped-up state.
   */
  function startFastClock() {
    isSpedUp = true;
    // timeOffset starts from its current value (which should be 0 if transitioning from normal)
    lastTickTime = Date.now(); // Reset for accurate delta calculation at the start of speedup
    
    clearInterval(clockIntervalId); // Stop normal/previous ticking
    // Tick more frequently for smoother animation during speedup
    clockIntervalId = setInterval(tick, 1000 / speedMultiplier); 
    tick(); // Update hands immediately for responsiveness
  }

  // Find the clock container element to attach the click listener
  const clockContainer = document.querySelector('.circle');

  if (clockContainer) {
    clockContainer.addEventListener('click', () => {
      if (isSpedUp) {
        // --- Clock is currently sped up, revert to normal time immediately ---
        clearTimeout(speedUpTimeoutId);   // Cancel the scheduled return to normal
        clearInterval(clockIntervalId);     // Stop the fast ticking interval
        
        timeOffset = 0;                  // Reset any accumulated time offset
        setClockHands(new Date());       // Immediately set hands to the *actual* current time
        
        startNormalClock();              // Resume normal clock operation (this will set isSpedUp to false)
      } else {
        // --- Clock is normal, so speed it up ---
        startFastClock(); // Switch to fast clock mode (this will set isSpedUp to true)

        // Set a timeout to automatically return to normal speed
        clearTimeout(speedUpTimeoutId); // Clear any pre-existing timeout just in case
        speedUpTimeoutId = setTimeout(() => {
          // This block runs if the speedUpDuration completes without another click
          clearInterval(clockIntervalId); // Stop the fast ticking
          
          timeOffset = 0; // Reset the accumulated time offset
          setClockHands(new Date()); // Explicitly update hands to the current *real* time

          startNormalClock(); // Resume normal clock ticking
        }, speedUpDuration);
      }
    });
  }

  // Initial clock start when the script loads
  startNormalClock();