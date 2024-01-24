const ship = document.getElementById("ship");
const block = document.querySelector(".block");
let isMoving = false;
let mouseX, mouseY;

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
    if (event.key === "w" && !isMoving) {
        isMoving = true;
        moveShip();
    }
}

function handleKeyUp(event) {
    if (event.key === "w") {
        isMoving = false;
    }
}

function moveShip() {
    if (isMoving) {
        const shipRect = ship.getBoundingClientRect();
        const shipX = shipRect.left + shipRect.width / 2;
        const shipY = shipRect.top + shipRect.height / 2;

        const angleRad = Math.atan2(mouseY - shipY, mouseX - shipX);
        const speed = 1;
        const deltaX = Math.cos(angleRad) * speed;
        const deltaY = Math.sin(angleRad) * speed;

        const newShipX = shipRect.left + deltaX;
        const newShipY = shipRect.top + deltaY;

        if (
            newShipX >= block.offsetLeft &&
            newShipX + shipRect.width <= block.offsetLeft + block.offsetWidth &&
            newShipY >= block.offsetTop &&
            newShipY + shipRect.height <= block.offsetTop + block.offsetHeight
        ) {
            ship.style.left = `${newShipX}px`;
            ship.style.top = `${newShipY}px`;
        }

        requestAnimationFrame(moveShip);
    }
}

// Functie om willekeurige cirkels toe te voegen
function createCircle() {
    const circle = document.createElement("div");
    circle.className = "ball";

    // Kies een willekeurige grootte (klein, medium of groot)
    const sizeClass = getRandomSizeClass();
    circle.classList.add(sizeClass);

    document.body.appendChild(circle);

    const circleRect = circle.getBoundingClientRect();

    // Bepaal de initiële x- en y-posities binnen het .block
    const x = Math.random() * (block.offsetWidth - circleRect.width) + block.offsetLeft;
    const y = Math.random() * (block.offsetHeight - circleRect.height) + block.offsetTop;

    // Voeg grootteklasse toe aan cirkel
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    const speed = Math.random() * 2 + 1;
    const angle = Math.random() * 2 * Math.PI;

    moveCircle(circle, speed, angle);
}

// Functie om de beweging van de cirkels te regelen
function moveCircle(circle, speed, angle) {
    function move() {
        const circleRect = circle.getBoundingClientRect();
        const newX = circleRect.left + Math.cos(angle) * speed;
        const newY = circleRect.top + Math.sin(angle) * speed;

        if (
            newX > block.offsetLeft + block.offsetWidth ||
            newX + circleRect.width < block.offsetLeft ||
            newY > block.offsetTop + block.offsetHeight ||
            newY + circleRect.height < block.offsetTop
        ) {
            circle.remove();
        } else {
            circle.style.left = `${newX}px`;
            circle.style.top = `${newY}px`;
            requestAnimationFrame(move);
        }
    }

    move();
}

// Functie om willekeurige grootteklasse te krijgen
function getRandomSizeClass() {
    const sizeOptions = ["small", "medium", "large"];
    const randomIndex = Math.floor(Math.random() * sizeOptions.length);
    return sizeOptions[randomIndex];
}

// Hoe snel cirkels verschijnen
setInterval(createCircle, 100);
