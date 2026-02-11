// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
    // Movement thresholds and timings
    MOUSE_PROXIMITY_THRESHOLD: 100, // pixels before "No" button moves
    BUTTON_JUMP_COOLDOWN: 100,      // milliseconds between jumps
    
    // Display thresholds
    NO_MOVES_FOR_PIG: 6,             // Number of "No" moves before showing crying pig
    
    // Animation delays (milliseconds)
    JOHN_WICK_DURATION: 5000,
    SUCCESS_CELEBRATION_DURATION: 7000,
    TRANSITION_TO_PENGU_DURATION: 9000,
    YES_HOVER_DELAY: 600,
    
    // Button positions
    NO_BUTTON_LEFT_POSITION: 0.1,   // 10% from left
    NO_BUTTON_RIGHT_POSITION: 0.7,  // 70% from left
    
    // Confetti settings
    CONFETTI_PARTICLE_COUNT: 100,
    CONFETTI_SPREAD: 70,
    CONFETTI_ORIGIN_Y: 0.6,
    CONFETTI_COLORS: ['#ff0000', '#ff69b4', '#ffffff']
};

// ============================================================================
// DOM ELEMENT REFERENCES
// ============================================================================

const elements = {
    // Envelope components
    seal: document.getElementById('seal'),
    envelope: document.getElementById('envelope'),
    addressee: document.getElementById('addressee'),
    
    // Buttons
    yesButton: document.getElementById('yesButton'),
    yesButton2: document.getElementById('yesButton2'),
    noButton: document.getElementById('noButton'),
    cancelButton: document.getElementById('cancel'),
    cancelButton2: document.getElementById('cancel2'),
    
    // Containers
    buttonContainer: document.getElementById('buttonContainer'),
    flipBoxInner: document.getElementById('flip-box-inner'),
    letter: document.querySelector('.letter'),
    
    // Images and GIFs
    pigGif: document.getElementById('pigGif'),
    spongeGif: document.getElementById('spongeGif'),
    amifatCat: document.getElementById('amifatcat-in-love'),
    coolPengu: document.getElementById('cool-pengu'),
    
    // Content sections
    yay: document.getElementById('yay'),
    ehhh: document.getElementById('ehhhh'),
    johnWick: document.getElementById('johnWick'),
    yesHell: document.getElementById('yesHell'),
    yesBack: document.getElementById('yesBack')
};

// ============================================================================
// APPLICATION STATE
// ============================================================================

const state = {
    noButtonOnRight: true,
    noMoveCount: 0,
    noClickCount: 0,
    canJump: true,
    isFlipped: false,
    yesHoverTimer: null
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates Euclidean distance between two points
 */
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Gets the center coordinates of an element
 */
function getElementCenter(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

/**
 * Hides multiple elements at once
 */
function hideElements(...elements) {
    elements.forEach(element => {
        if (element) element.style.display = 'none';
    });
}

/**
 * Shows an element with a specific display value
 */
function showElement(element, displayValue = 'block') {
    if (element) element.style.display = displayValue;
}

// ============================================================================
// GIF DISPLAY LOGIC
// ============================================================================

/**
 * Updates which GIF should be displayed based on current state
 */
function updateGifDisplay() {
    state.noMoveCount++;
    
    if (state.noMoveCount >= CONFIG.NO_MOVES_FOR_PIG) {
        showElement(elements.pigGif);
        hideElements(elements.spongeGif);
        state.noMoveCount = 0;
    } else if (state.noMoveCount > 0) {
        hideElements(elements.spongeGif);
    }
}

/**
 * Resets GIF display to default state
 */
function resetGifDisplay() {
    state.noMoveCount = 0;
    hideElements(elements.pigGif, elements.spongeGif);
}

/**
 * Shows the excited sponge GIF (when hovering "Yes")
 */
function showExcitedGif() {
    hideElements(elements.pigGif);
    showElement(elements.spongeGif);
    
    // Reset counter if pig was showing
    if (elements.pigGif.style.display === 'block') {
        state.noMoveCount = 0;
    }
}

// ============================================================================
// "NO" BUTTON MOVEMENT LOGIC
// ============================================================================

/**
 * Moves the "No" button to a new random position
 */
function moveNoButton() {
    return;
    const containerRect = elements.buttonContainer.getBoundingClientRect();
    const buttonRect = elements.noButton.getBoundingClientRect();
    
    const maxY = containerRect.height - buttonRect.height;
    const newY = Math.random() * maxY;
    
    // Alternate between left and right positions
    const newX = state.noButtonOnRight 
        ? containerRect.width * CONFIG.NO_BUTTON_LEFT_POSITION
        : containerRect.width * CONFIG.NO_BUTTON_RIGHT_POSITION;
    
    elements.noButton.style.left = newX + 'px';
    elements.noButton.style.top = newY + 'px';
    
    state.noButtonOnRight = !state.noButtonOnRight;
    updateGifDisplay();
}

/**
 * Handles mouse proximity detection for "No" button evasion
 */
function handleMouseProximity(event) {
    if (!state.canJump) return;
    
    const buttonCenter = getElementCenter(elements.noButton);
    const distance = calculateDistance(
        event.clientX, 
        event.clientY, 
        buttonCenter.x, 
        buttonCenter.y
    );
    
    if (distance < CONFIG.MOUSE_PROXIMITY_THRESHOLD) {
        state.canJump = false;
        moveNoButton();
        setTimeout(() => { state.canJump = true; }, CONFIG.BUTTON_JUMP_COOLDOWN);
    }
}

// ============================================================================
// LETTER FLIP ANIMATION
// ============================================================================

/**
 * Flips the letter to show front or back content
 */
function flipLetter() {
    resetGifDisplay();
    hideElements(elements.coolPengu, elements.cancelButton);
    
    if (!state.isFlipped) {
        elements.flipBoxInner.style.transform = 'rotateY(180deg)';
        elements.letter.classList.add('show-back-only');
        state.isFlipped = true;
    } else {
        elements.flipBoxInner.style.transform = 'rotateY(0deg)';
        elements.letter.classList.remove('show-back-only');
        state.isFlipped = false;
    }
}

// ============================================================================
// "NO" BUTTON CLICK HANDLING
// ============================================================================

/**
 * Handles first click on "No" button - shows John Wick warning
 */
function handleFirstNoClick() {
    showElement(elements.johnWick, 'flex');
    hideElements(elements.yesHell, elements.yesBack);
    
    setTimeout(() => {
        flipLetter();
        state.noClickCount++;
    }, CONFIG.JOHN_WICK_DURATION);
}

/**
 * Handles second click on "No" button - shows ultimatum
 */
function handleSecondNoClick() {
    hideElements(elements.johnWick);
    showElement(elements.yesHell, 'flex');
    hideElements(elements.yesBack);
    
    // Replace "No" button with second "Yes" button at same position
    const leftPosition = elements.noButton.style.left;
    hideElements(elements.noButton);
    
    elements.yesButton2.style.left = leftPosition;
    elements.yesButton2.style.borderRadius = '20px';
    elements.yesButton2.style.fontSize = '14px';
    elements.yesButton2.style.padding = '8px 20px';
    showElement(elements.yesButton2);
}

/**
 * Main handler for "No" button clicks
 */
function handleNoClick() {
    flipLetter();
    
    if (state.noClickCount === 0) {
        handleFirstNoClick();
    } else {
        handleSecondNoClick();
    }
}

// ============================================================================
// "YES" BUTTON SUCCESS HANDLING
// ============================================================================

/**
 * Triggers confetti celebration effect
 */
function triggerConfetti() {
    confetti({
        particleCount: CONFIG.CONFETTI_PARTICLE_COUNT,
        spread: CONFIG.CONFETTI_SPREAD,
        origin: { y: CONFIG.CONFETTI_ORIGIN_Y },
        colors: CONFIG.CONFETTI_COLORS
    });
}

/**
 * Shows the initial success message and cat GIF
 */
function showSuccessMessage() {
    showElement(elements.amifatCat);
    showElement(elements.yay);
    hideElements(elements.johnWick, elements.yesHell);
    showElement(elements.yesBack, 'flex');
}

/**
 * Transitions from success message to "Ehhhh..." text
 */
function transitionToEhhh() {
    hideElements(elements.yay, elements.amifatCat);
    showElement(elements.ehhh);
    elements.ehhh.classList.add('fade-in');
}

/**
 * Transitions to the final cool penguin image
 */
function transitionToCoolPengu() {
    elements.ehhh.classList.remove('fade-in');
    hideElements(elements.ehhh);
    
    showElement(elements.coolPengu);
    elements.coolPengu.classList.add('fade-in');
    showElement(elements.cancelButton);
}

/**
 * Main handler for "Yes" button clicks
 */
function handleYesClick() {
    triggerConfetti();
    flipLetter();
    showSuccessMessage();
    
    // Sequence of timed transitions
    setTimeout(transitionToEhhh, CONFIG.SUCCESS_CELEBRATION_DURATION);
    setTimeout(transitionToCoolPengu, CONFIG.TRANSITION_TO_PENGU_DURATION);
}

// ============================================================================
// HOVER EFFECTS
// ============================================================================

/**
 * Starts hover timer for "Yes" button
 */
function handleYesHoverStart() {
    state.yesHoverTimer = setTimeout(showExcitedGif, CONFIG.YES_HOVER_DELAY);
}

/**
 * Cancels hover timer for "Yes" button
 */
function handleYesHoverEnd() {
    if (state.yesHoverTimer) {
        clearTimeout(state.yesHoverTimer);
        state.yesHoverTimer = null;
    }
}

/**
 * Attaches hover listeners to a "Yes" button
 */
function attachYesButtonHoverListeners(button) {
    button.addEventListener('mouseenter', handleYesHoverStart);
    button.addEventListener('mouseleave', handleYesHoverEnd);
}

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================

/**
 * Sets up all event listeners for the application
 */
function initializeEventListeners() {
    // Envelope seal click - opens the envelope
    elements.seal.addEventListener('click', () => {
        elements.envelope.classList.add('open');
        elements.addressee.style.display = 'none';
    });
    
    // "No" button interactions
    elements.buttonContainer.addEventListener('mousemove', handleMouseProximity);
    elements.noButton.addEventListener('mouseenter', moveNoButton);
    elements.noButton.addEventListener('click', handleNoClick);
    
    // "Yes" button clicks
    elements.yesButton.addEventListener('click', handleYesClick);
    elements.yesButton2.addEventListener('click', handleYesClick);
    
    // "Yes" button hover effects
    attachYesButtonHoverListeners(elements.yesButton);
    attachYesButtonHoverListeners(elements.yesButton2);
    
    // Cancel/back buttons
    elements.cancelButton.addEventListener('click', flipLetter);
    elements.cancelButton2.addEventListener('click', flipLetter);
}

/**
 * Initializes the "No" button position
 */
function initializeNoButtonPosition() {
    elements.noButton.style.left = '70%';
    elements.noButton.style.top = '50%';
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

/**
 * Main initialization function - runs when page loads
 */
function initialize() {
    initializeNoButtonPosition();
    initializeEventListeners();
}

// Run initialization when DOM is fully loaded
window.addEventListener('load', initialize);