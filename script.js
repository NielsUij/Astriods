const ship = document.getElementById("ship");
const block = document.querySelector(".block");
let mouseX, mouseY;
let firing = false;
let firerate = 1; // Tijd in milliseconden tussen elke kogel

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

    ball.style.left = `${startX}px`;
    ball.style.top = `${startY}px`;

    moveBall(ball, speed);
}

function moveBall(ball, speed) {
    function move() {
        const ballRect = ball.getBoundingClientRect();
        const newX = ballRect.left;
        const newY = ballRect.top + speed;

        if (newY > block.offsetTop + block.offsetHeight || newX < 0 || newX > window.innerWidth) {
            ball.remove();
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

    // Remove the original ball
    ball.remove();
}

function fireBullet() {
    const bullet = document.createElement("div");
    bullet.className = "bullet";

    const shipRect = ship.getBoundingClientRect();
    const shipX = shipRect.left + shipRect.width / 2;
    const shipY = shipRect.top + shipRect.height / 2;

    bullet.style.left = `${shipX}px`;
    bullet.style.top = `${shipY + 10}px`;

    document.body.appendChild(bullet);

    const speed = 5;
    const angleRad = Math.atan2(mouseY - shipY, mouseX - shipX);
    const deltaX = Math.cos(angleRad) * speed;
    const deltaY = Math.sin(angleRad) * speed;

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
        fireBullet();
        setTimeout(autoFire, firerate);
    }
}

// Start met een paar grote balletjes binnen de block
createBall("medium", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, block.offsetTop - 15);
createBall("large", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, block.offsetTop - 15);
createBall("large", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, block.offsetTop - 15);

// Voeg elke 10 seconden een groot balletje toe
setInterval(() => {
    createBall("large", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, block.offsetTop - 15);
}, 10 * 1000);

// Voeg elke 5 seconden een medium balletje toe
setInterval(() => {
    createBall("medium", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, block.offsetTop - 15);
}, 5 * 1000);

// Voeg elke 3 seconden een klein balletje toe vanaf de bovenrand
setInterval(() => {
    createBall("small", Math.random() * (block.offsetWidth - 30) + block.offsetLeft + 15, block.offsetTop - 15);
}, 3 * 1000);

// Voeg elke 5 seconden een klein balletje toe vanaf de linkerkant
setInterval(() => {
    createBall("small", 0, Math.random() * (block.offsetHeight - 30) + block.offsetTop + 15);
}, 5 * 1000);

// Voeg elke 5 seconden een klein balletje toe vanaf de rechterkant
setInterval(() => {
    createBall("small", window.innerWidth - 30, Math.random() * (block.offsetHeight - 30) + block.offsetTop + 15);
}, 5 * 1000);
