const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const plane = {
    x: 440,
    y: 90,
    width: 60,
    height: 40,
    vx: 5,
    vy: 0,
    img: new Image(),
};
plane.img.src = "plane.png";

const getPlaneRotation = (plane) => {
    if (plane.vy < 0) return Math.atan(-plane.vx / plane.vy)
    if (plane.vx >= 0) return Math.PI / 2 + Math.atan(plane.vy / plane.vx)
    return Math.PI + Math.atan(-plane.vx / plane.vy)
}

let lastFrameTime = performance.now();

function next(currentTime = performance.now()) {
    const dt = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    update(dt);
    render();
    requestAnimationFrame(next);
}

function update(dt) {

    // c. Move plane using velocities
    plane.x += plane.vx * dt;
    plane.y += plane.vy * dt;

    // f. Screen wrap-around
    if (plane.x > canvas.width) plane.x = 0;
    if (plane.x + plane.width < 0) plane.x = canvas.width - plane.width;

    if (plane.y > canvas.height) plane.y = 0;
    if (plane.y + plane.height < 0) plane.y = canvas.height - plane.height;
}

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // =============================
    // g. DRAW WITH ROTATION
    // =============================

    const angle = getPlaneRotation(plane);

    ctx.save();

    // Move canvas origin to plane center
    ctx.translate(plane.x + plane.width/2, plane.y + plane.height/2);

    // Rotate
    ctx.rotate(angle);

    // Draw plane image centered at origin
    ctx.drawImage(
        plane.img,
        -plane.width/2,
        -plane.height/2,
        plane.width,
        plane.height
    );

    ctx.restore();
}

// =============================
// EVENTS
// =============================

window.addEventListener("keydown", function(e) {

    // b. W decreases vy by 5
    if (e.key === "w" || e.key === "W") {
        plane.vy -= 5;
    }

    // d. S increases vy by 5
    if (e.key === "s" || e.key === "S") {
        plane.vy += 5;
    }

    // d. A decreases vx
    if (e.key === "a" || e.key === "A") {
        plane.vx -= 5;
    }

    // d. D increases vx
    if (e.key === "d" || e.key === "D") {
        plane.vx += 5;
    }
});

// Start animation
next();
