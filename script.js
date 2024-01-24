const ship = document.getElementById("ship");
const block = document.querySelector(".block");
let mouseX, mouseY;

document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("keydown", handleKeyDown);

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
    if (event.key === " ") {
        fireBullet();
    }
}

function fireBullet() {
    const bullet = document.createElement("div");
    bullet.className = "bullet";

    const shipRect = ship.getBoundingClientRect();
    const shipX = shipRect.left + shipRect.width / 2;
    const shipY = shipRect.top + shipRect.height / 2;

    // Aanpassing van de beginpositie van de kogel
    bullet.style.left = `${shipX}px`;
    bullet.style.top = `${shipY + 10}px`; // Pas dit aan zoals gewenst

    document.body.appendChild(bullet);

    const speed = 5;
    const angleRad = Math.atan2(mouseY - shipY, mouseX - shipX);
    const deltaX = Math.cos(angleRad) * speed;
    const deltaY = Math.sin(angleRad) * speed;

    function moveBullet() {
        const bulletRect = bullet.getBoundingClientRect();
        const newBulletX = bulletRect.left + deltaX;
        const newBulletY = bulletRect.top + deltaY;

        if (
            newBulletX > block.offsetLeft + block.offsetWidth ||
            newBulletX + bulletRect.width < block.offsetLeft ||
            newBulletY > block.offsetTop + block.offsetHeight ||
            newBulletY + bulletRect.height < block.offsetTop
        ) {
            bullet.remove();
        } else {
            bullet.style.left = `${newBulletX}px`;
            bullet.style.top = `${newBulletY}px`;
            requestAnimationFrame(moveBullet);
        }
    }

    moveBullet();
}
