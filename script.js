const ship = document.getElementById("ship");
const scoreElement = document.getElementById("score");

let score = 0;

document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("keydown", handleKeyDown);

function handleMouseMove(event) {
    // Haal de muispositie op
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Bepaal de positie van het midden van het schip
    const shipRect = ship.getBoundingClientRect();
    const shipX = shipRect.left + shipRect.width / 2;
    const shipY = shipRect.top + shipRect.height / 2;

    // Bereken de hoek tussen het schip en de muispositie
    const angleRad = Math.atan2(mouseY - shipY, mouseX - shipX);
    const angleDeg = (angleRad * 180) / Math.PI;

    const finalRotation = angleDeg + 90;

    const normalizedRotation = (finalRotation + 360) % 360;

    // Update de rotatie van het schip
    ship.style.transformOrigin = "center";
    ship.style.transform = `translate(-50%, -50%) rotate(${normalizedRotation}deg)`;
}

function handleKeyDown(event) {
    if (event.key === " ") {
        moveBallForward();
    }
}

function moveBallForward() {
    const ball = document.createElement("div");
    ball.className = "ball";
    document.body.appendChild(ball);

    const shipRect = ship.getBoundingClientRect();
    const shipX = shipRect.left + shipRect.width / 2;
    const shipY = shipRect.top + shipRect.height / 2;

    const shipAngleRad = (parseFloat(ship.style.transform.match(/-?\d+/)[0]) * Math.PI) / 180;

    // Bereken de initiële positie van het balletje vanaf de punt van de driehoek
    const ballX = shipX + Math.cos(shipAngleRad) * 20; // 20 is de lengte van de driehoek
    const ballY = shipY + Math.sin(shipAngleRad) * 20; // 20 is de lengte van de driehoek

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    const speed = 2.5;
    const deltaX = Math.cos(shipAngleRad) * speed;
    const deltaY = Math.sin(shipAngleRad) * speed;

    function move() {
        const ballRect = ball.getBoundingClientRect();
        const newX = ballRect.left + deltaX;
        const newY = ballRect.top + deltaY;

        // Controleer of het balletje de randen van het scherm raakt
        if (newX > window.innerWidth || newX < 0 || newY > window.innerHeight || newY < 0) {
            ball.remove();
        } else {
            ball.style.left = `${newX}px`;
            ball.style.top = `${newY}px`;
            requestAnimationFrame(move);
        }
    }

    move();
}

