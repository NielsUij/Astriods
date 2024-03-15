const ship = document.getElementById("ship");
const ship2 = document.getElementById("ship2");
const ship3 = document.getElementById("ship3");
const block = document.querySelector(".block");
let mouseX, mouseY;
let firing = false;
let firerate = 500; // Tijd in milliseconden tussen elke kogel
let bulletSpeed = 10; // Snelheid van de kogels
let lives = 3; // Initieel aantal levens

// Levensbalk-elementen selecteren
const lifeBar = document.getElementById("life-bar");
const lifeElements = document.querySelectorAll(".life");
const scoreElement = document.getElementById("score");
let score = 0;

document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    const shipRect = ship.getBoundingClientRect();
    const shipX = shipRect.left + shipRect.width / 2;
    const shipY = shipRect.top + shipRect.height / 2;

    const angleRad = Math.atan2(mouseY - shipY, mouseX - shipX);
    const angleDeg = (angleRad * 180) / Math.PI;

    const finalRotation = angleDeg + 90;
    const normalizedRotation = (finalRotation + 360) % 360;

    ship.style.transformOrigin = "center";
    ship.style.transform = `translate(-50%, -50%) rotate(${normalizedRotation}deg)`;

    // Set position for ship2
    const ship2X = shipX - 100; // Offset by 100 pixels to the left of the main ship
    ship2.style.left = `${ship2X}px`;
    ship2.style.top = `${shipY}px`;

    const angleRad2 = Math.atan2(mouseY - shipY, mouseX - ship2X);
    const angleDeg2 = (angleRad2 * 180) / Math.PI;
    const finalRotation2 = angleDeg2 + 90;
    const normalizedRotation2 = (finalRotation2 + 360) % 360;
    ship2.style.transformOrigin = "center";
    ship2.style.transform = `translate(-50%, -50%) rotate(${normalizedRotation2}deg)`;

    // Set position for ship3
    const ship3X = shipX + 100; // Offset by 100 pixels to the right of the main ship
    ship3.style.left = `${ship3X}px`;
    ship3.style.top = `${shipY}px`;

    const angleRad3 = Math.atan2(mouseY - shipY, mouseX - ship3X);
    const angleDeg3 = (angleRad3 * 180) / Math.PI;
    const finalRotation3 = angleDeg3 + 90;
    const normalizedRotation3 = (finalRotation3 + 360) % 360;
    ship3.style.transformOrigin = "center";
    ship3.style.transform = `translate(-50%, -50%) rotate(${normalizedRotation3}deg)`;
}

function handleKeyDown(event) {
    if (event.key === "e" && !firing) {
        firing = true;
        autoFire();
    }
}

function handleKeyUp(event) {
    if (event.key === "e") {
        firing = false;
    }
}

function createBall(sizeClass, startX, startY) {
    const ball = document.createElement("div");
    ball.className = "ball";
    ball.classList.add(sizeClass);

    document.body.appendChild(ball);

    const speed = 2; // constante snelheid

    // Controleer de startpositie en pas deze aan indien nodig
    const adjustedX = Math.max(block.offsetLeft + 15, Math.min(startX, block.offsetLeft + block.offsetWidth - 30));
    const adjustedY = Math.max(0, Math.min(startY, block.offsetTop + block.offsetHeight - 30));

    ball.style.left = `${adjustedX}px`;
    ball.style.top = `${adjustedY}px`; // Start altijd vanaf de bovenrand

    moveBall(ball, speed);
}

function moveBall(ball, speed) {
    function move() {
        const ballRect = ball.getBoundingClientRect();
        const newX = ballRect.left;
        const newY = ballRect.top + speed;

        if (newY > block.offsetTop + block.offsetHeight || newX < 0 || newX > window.innerWidth) {
            ball.remove();
            loseLife(); // Verlies een leven als een balletje onderaan het scherm komt
        } else {
            ball.style.left = `${newX}px`;
            ball.style.top = `${newY}px`;
            requestAnimationFrame(move);
        }
    }

    move();
}

function splitBall(ball) {
    const ballRect = ball.getBoundingClientRect();
    const ballSize = Math.min(ballRect.width, ballRect.height);

    // Check if the ball is "small" and remove it
    if (ball.classList.contains("small")) {
        ball.remove();
        score++; // Verhoog de score wanneer een balletje wordt geraakt
        updateScore(); // Werk de scoreweergave bij
        return;
    }

    if (ball.classList.contains("large")) {
        // If the ball is large, create two medium balls
        createBall("medium", ballRect.left, ballRect.top);
        createBall("medium", ballRect.left, ballRect.top);
    } else if (ball.classList.contains("medium")) {
        // If the ball is medium, create two small balls
        createBall("small", ballRect.left, ballRect.top);
        createBall("small", ballRect.left, ballRect.top);
    }

    score++; // Verhoog de score wanneer een balletje wordt geraakt
    updateScore(); // Werk de scoreweergave bij

    // Remove the original ball
    ball.remove();
}

function fireBullet(shipElement) {
    const bullet = document.createElement("div");
    bullet.className = "bullet";

    const shipRect = shipElement.getBoundingClientRect();
    const shipX = shipRect.left + shipRect.width / 2;
    const shipY = shipRect.top + shipRect.height / 2;

    bullet.style.left = `${shipX}px`;
    bullet.style.top = `${shipY + 10}px`;

    document.body.appendChild(bullet);

    const angleRad = Math.atan2(mouseY - shipY, mouseX - shipX);
    const deltaX = Math.cos(angleRad) * bulletSpeed;
    const deltaY = Math.sin(angleRad) * bulletSpeed;

    function moveBullet() {
        const bulletRect = bullet.getBoundingClientRect();
        const newBulletX = bulletRect.left + deltaX;
        const newBulletY = bulletRect.top + deltaY;

        // Check for collisions with balls
        const balls = document.querySelectorAll(".ball");
        balls.forEach((ball) => {
            const ballRect = ball.getBoundingClientRect();
            if (
                newBulletX < ballRect.right &&
                newBulletX + bulletRect.width > ballRect.left &&
                newBulletY < ballRect.bottom &&
                newBulletY + bulletRect.height > ballRect.top
            ) {
                // Bullet hits a ball, split the ball
                splitBall(ball);
                bullet.remove();
            }
        });

        if (newBulletY < 0 || newBulletY > block.offsetTop + block.offsetHeight || newBulletX < 0 || newBulletX > window.innerWidth) {
            bullet.remove();
        } else {
            bullet.style.left = `${newBulletX}px`;
            bullet.style.top = `${newBulletY}px`;
            requestAnimationFrame(moveBullet);
        }
    }

    moveBullet();
}

function autoFire() {
    if (firing) {
        fireBullet(ship);
        fireBullet(ship2);
        fireBullet(ship3);
        setTimeout(autoFire, firerate);
    }
}

// Start met een paar grote balletjes binnen de block
createBall("medium", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, 0);
createBall("large", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, 0);
createBall("large", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, 0);

// Voeg elke 10 seconden een groot balletje toe
setInterval(() => {
    createBall("large", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, 0);
}, 10 * 1000);

// Voeg elke 5 seconden een medium balletje toe
setInterval(() => {
    createBall("medium", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, 0);
}, 5 * 1000);

// Voeg elke 3 seconden een klein balletje toe vanaf de bovenrand
setInterval(() => {
    createBall("small", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, 0);
}, 3 * 1000);

// Voeg elke 5 seconden een klein balletje toe vanaf de linkerkant
setInterval(() => {
    createBall("small", 0, Math.random() * (block.offsetHeight - 30) + block.offsetTop + 15);
}, 5 * 1000);

// Voeg elke 5 seconden een klein balletje toe vanaf de rechterkant
setInterval(() => {
    createBall("small", window.innerWidth - 30, Math.random() * (block.offsetHeight - 30) + block.offsetTop + 15);
}, 5 * 1000);

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
    if (score >= 250) {
        winGame(); // Als de score 250 bereikt, roep de winGame-functie aan
    }
    checkScoreForFirerate(); // Controleer de score om de schietsnelheid aan te passen
}

function winGame() {
    alert("Gefeliciteerd, je hebt gewonnen!");
    setTimeout(() => {
        location.reload(); // Herstart de pagina na een vertraging van 1 seconde
    }, 1000);
}

function gameOver() {
    // Voer hier acties uit die moeten gebeuren wanneer het spel voorbij is
    alert("Game Over!");
    setTimeout(() => {
        location.reload(); // Herstart de pagina na een vertraging van 1 seconde
    }, 10);
}

function loseLife() {
    if (lives > 0) {
        lives--;
        lifeElements[lives].style.backgroundColor = "black"; // Verlaag het aantal levens en kleur de corresponderende levensbol zwart
        if (lives === 0) {
            // Als er geen levens meer zijn, stop het spel of voer andere acties uit
            gameOver();
        }
    }
}

function checkScoreForFirerate() {
    if (score >= 10 && score < 25) {
        firerate = 500; // Verhoog de schietsnelheid naar 500 ms
    } else if (score >= 25 && score < 50) {
        firerate = 200; // Verhoog de schietsnelheid naar 200 ms
    } else if (score >= 50 && score < 100) {
        firerate = 50; // Verhoog de schietsnelheid naar 50 ms
    } else if (score >= 100) {
        firerate = 1; // Verhoog de schietsnelheid naar 1 ms
    }
}
