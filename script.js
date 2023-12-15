const ship = document.getElementById("ship");
const block = document.querySelector(".block");
let isMoving = false;

document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

function handleMouseMove(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

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

        const mouseX = shipX;
        const mouseY = shipY;

        const angleRad = Math.atan2(mouseY - shipY, mouseX - shipX);
        const speed = 2.5;
        const deltaX = Math.cos(angleRad) * speed;
        const deltaY = Math.sin(angleRad) * speed;

        // Bereken de nieuwe positie van het schip
        const newShipX = shipRect.left + deltaX;
        const newShipY = shipRect.top + deltaY;

        // Controleer of het schip binnen de grenzen van .block blijft
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
