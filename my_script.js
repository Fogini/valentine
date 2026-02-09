const seal = document.getElementById('seal');
const envelope = document.getElementById('envelope');
const addressee = document.getElementById('addressee')
const noButton = document.getElementById('noButton');
const buttonContainer = document.getElementById('buttonContainer');
const yesButton = document.getElementById('yesButton');
const pigImage = document.getElementById('pigGif');
const spongeGif = document.getElementById('spongeGif');
const paperFlip = document.getElementById('paperFlip');
const yay = document.getElementById("yay");
const amifatCat = document.getElementById("amifatcat-in-love");
const ehhh = document.getElementById("ehhhh");
const coolPengu = document.getElementById("cool-pengu");
const cancelButton = document.getElementById("cancel")

let noButtonOnRight = true;
let times_no = 0;
let canJump = true;
let hoverTimer;
let flipped = false;


seal.addEventListener('click', () => {
    envelope.classList.add('open');
    addressee.style.display = "none";
    }
);

function moveNoButton() {
    const containerRect = buttonContainer.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();
    
    const maxY = containerRect.height - buttonRect.height;
    let newX, newY;
    
    newY = Math.random() * maxY;
    
    if (noButtonOnRight) {
        newX = containerRect.width * 0.1;
    } else {
        newX = containerRect.width * 0.7;
    }
    // Logic for Pig visibility
    times_no++;
    if (times_no >= 6) {
        pigImage.style.display = "block";
        spongeGif.style.display = "none";
        times_no = 0; // Reset counter
    }
    else if (times_no > 0) {
        spongeGif.style.display = "none";
    }
    
    noButton.style.left = newX + 'px';
    noButton.style.top = newY + 'px';
    noButtonOnRight = !noButtonOnRight;
}

// Run away logic
buttonContainer.addEventListener('mousemove', function(e) {
    if (!canJump) return;
    const buttonRect = noButton.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    const distance = Math.sqrt(Math.pow(e.clientX - buttonCenterX, 2) + Math.pow(e.clientY - buttonCenterY, 2));
    
    if (distance < 100) {
        canJump = false;
        moveNoButton();
        setTimeout(() => { canJump = true; }, 100);
    }
});

noButton.addEventListener('mouseenter', moveNoButton);
noButton.addEventListener('click', (e) => { e.preventDefault(); 
    moveNoButton(); 
    pigImage.style.display = "block";
    spongeGif.style.display = "none";
});

yesButton.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => {
        pigImage.style.display = "none";
        spongeGif.style.display = "block";
        if (pigImage.style.display == "block") {
            times_no = 0;
        }
    }, 600);
        
});

yesButton.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
});

function flipLetter() {

    const flip = document.getElementById("flip-box-inner");

    times_no = 0;
    coolPengu.style.display = "none";
    pigImage.style.display = "none";
    cancelButton.style.display = "none";
    spongeGif.style.display = "none";

    if (!flipped) {
        amifatCat.style.display = "block";
        yay.style.display = "block";
        flip.style.transform = "rotateY(180deg)";
        document.querySelector(".letter").classList.add("show-back-only");
        flipped = true;
    }
    else {
        flip.style.transform = "rotateY(0deg)";
        document.querySelector(".letter").classList.remove("show-back-only");
        flipped = false;
    }
}

yesButton.addEventListener('click', () => {

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#ff69b4', '#ffffff']
    });
    flipLetter();
    setTimeout(() => {
        yay.style.display = "none";
        amifatCat.style.display = "none";

        ehhh.style.display = "block";
        ehhh.classList.add("fade-in");
    }, 7000);

    // 2 seconds later: hide ehhh, show coolPengu
    setTimeout(() => {
        ehhh.classList.remove("fade-in");
        ehhh.style.display = "none";

        coolPengu.style.display = "block";
        coolPengu.classList.add("fade-in");

        cancelButton.style.display = "block";
    }, 9000);
});

cancelButton.addEventListener('click', () => {
    flipLetter();
});

// Init position
window.onload = () => {
    noButton.style.left = '70%';
    noButton.style.top = '50%';
};