const ship = document.getElementById("ship");

document.addEventListener("mousemove", handleMouseMove);

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

    // Werk de rotatie van het schip bij met 90 graden
    const finalRotation = angleDeg + 90;

    // Zorg ervoor dat de rotatie binnen het bereik van 0 tot 360 graden blijft
    const normalizedRotation = (finalRotation + 360) % 360;

    // Update de rotatie van het schip
    ship.style.transformOrigin = "center center";
    ship.style.transform = `translate(-50%, -50%) rotate(${normalizedRotation}deg)`;
}
