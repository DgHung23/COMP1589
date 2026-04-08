const charityGame = (() => {
    const canvas = document.getElementById("charityGameCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const countdownEl = document.getElementById("charityGameCountdown");
    const survivedEl = document.getElementById("charityGameSurvived");
    const poundsEl = document.getElementById("charityGamePounds");

    const startOverlayEl = document.getElementById("charityGameStart");
    const resultOverlayEl = document.getElementById("charityGameResult");

    const startBtn = document.getElementById("charityGameStartBtn");
    const restartBtn = document.getElementById("charityGameRestartBtn");
    const copyBtn = document.getElementById("charityGameCopyBtn");

    const resultBadgeEl = document.getElementById("charityGameResultBadge");
    const resultTitleEl = document.getElementById("charityGameResultTitle");
    const resultTextEl = document.getElementById("charityGameResultText");
    const resultTimeEl = document.getElementById("charityGameResultTime");
    const resultPoundsEl = document.getElementById("charityGameResultPounds");
    const inviteEl = document.getElementById("charityGameInvite");

    const GAME_DURATION_MS = 5 * 60 * 1000;
    const BASE_SPAWN_INTERVAL_MS = 900;
    const MIN_SPAWN_INTERVAL_MS = 330;

    const turtleImage = new Image();
    turtleImage.src = "./assets/img/turtle.png";

    const garbageImage = new Image();
    garbageImage.src = "./assets/img/sea_garbage.png";

    const state = {
        running: false,
        animationId: null,
        gameStartTime: 0,
        lastFrameTime: 0,
        elapsedMs: 0,
        remainingMs: GAME_DURATION_MS,
        spawnTimerMs: BASE_SPAWN_INTERVAL_MS,
        currentSpawnIntervalMs: BASE_SPAWN_INTERVAL_MS,
        pounds: 0,
        keys: {
            up: false,
            down: false,
            left: false,
            right: false,
        },
        turtle: {
            x: 110,
            y: canvas.height / 2 - 42,
            w: 92,
            h: 74,
            speed: 340,
        },
        garbage: [],
        bubbles: createBubbles(16),
    };

    function createBubbles(total) {
        return Array.from({ length: total }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 2 + Math.random() * 5,
            speed: 12 + Math.random() * 22,
            alpha: 0.18 + Math.random() * 0.2,
        }));
    }

    function resetGame() {
        state.running = false;
        cancelAnimationFrame(state.animationId);

        state.elapsedMs = 0;
        state.remainingMs = GAME_DURATION_MS;
        state.spawnTimerMs = BASE_SPAWN_INTERVAL_MS;
        state.currentSpawnIntervalMs = BASE_SPAWN_INTERVAL_MS;
        state.pounds = 0;
        state.garbage = [];
        state.turtle.x = 110;
        state.turtle.y = canvas.height / 2 - 42;

        updateHud();
        drawScene();
    }

    function startGame() {
        resetGame();

        startOverlayEl.hidden = true;
        resultOverlayEl.hidden = true;

        state.running = true;
        state.gameStartTime = performance.now();
        state.lastFrameTime = state.gameStartTime;

        state.animationId = requestAnimationFrame(loop);
    }

    function endGame(status) {
        state.running = false;

        const finalElapsed = Math.min(state.elapsedMs, GAME_DURATION_MS);
        const finalPounds = Math.floor(finalElapsed / 60000);

        resultTimeEl.textContent = formatTime(finalElapsed);
        resultPoundsEl.textContent = `£${finalPounds}`;

        if (status === "won") {
            resultBadgeEl.textContent = "Mission complete";
            resultTitleEl.textContent = "Amazing! You reached 5 minutes";
            resultTextEl.textContent =
                "You protected the turtle for the full run and generated the maximum £5 charity pledge.";
        } else {
            resultBadgeEl.textContent = "Run ended";
            resultTitleEl.textContent = "The turtle hit sea garbage";
            resultTextEl.textContent = `You survived ${formatTime(finalElapsed)} and generated £${finalPounds} for charity. Invite a friend and see if they can beat your run.`;
        }

        setShareLinks(finalElapsed, finalPounds);
        resultOverlayEl.hidden = false;
        drawScene();
    }

    function setShareLinks(finalElapsed, finalPounds) {
        const pageUrl = `${window.location.origin}${window.location.pathname}#game-charity`;
        const shareText = `I played the GreenWish turtle charity game, survived ${formatTime(finalElapsed)}, and generated a £${finalPounds} charity pledge. Can you beat my run? ${pageUrl}`;

        inviteEl.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        copyBtn.dataset.shareText = shareText;
    }

    function loop(now) {
        if (!state.running) return;

        const dt = Math.min(now - state.lastFrameTime, 32);
        state.lastFrameTime = now;

        state.elapsedMs = now - state.gameStartTime;
        state.remainingMs = Math.max(0, GAME_DURATION_MS - state.elapsedMs);
        state.pounds = Math.floor(
            Math.min(state.elapsedMs, GAME_DURATION_MS) / 60000,
        );

        updateHud();
        updateTurtle(dt);
        updateGarbage(dt);
        updateSpawn(dt);
        updateBubbles(dt);
        drawScene();

        if (hasCollision()) {
            endGame("lost");
            return;
        }

        if (state.remainingMs <= 0) {
            state.pounds = 5;
            poundsEl.textContent = "£5";
            endGame("won");
            return;
        }

        state.animationId = requestAnimationFrame(loop);
    }

    function updateHud() {
        countdownEl.textContent = formatTime(state.remainingMs);
        survivedEl.textContent = formatTime(state.elapsedMs);
        poundsEl.textContent = `£${state.pounds}`;
    }

    function updateTurtle(dt) {
        let dx = 0;
        let dy = 0;

        if (state.keys.up) dy -= 1;
        if (state.keys.down) dy += 1;
        if (state.keys.left) dx -= 1;
        if (state.keys.right) dx += 1;

        if (dx !== 0 || dy !== 0) {
            const length = Math.hypot(dx, dy) || 1;
            dx /= length;
            dy /= length;
        }

        state.turtle.x += dx * state.turtle.speed * (dt / 1000);
        state.turtle.y += dy * state.turtle.speed * (dt / 1000);

        state.turtle.x = clamp(
            state.turtle.x,
            20,
            canvas.width - state.turtle.w - 20,
        );
        state.turtle.y = clamp(
            state.turtle.y,
            20,
            canvas.height - state.turtle.h - 20,
        );
    }

    function updateSpawn(dt) {
        const difficulty = Math.min(state.elapsedMs / GAME_DURATION_MS, 1);
        state.currentSpawnIntervalMs =
            BASE_SPAWN_INTERVAL_MS -
            (BASE_SPAWN_INTERVAL_MS - MIN_SPAWN_INTERVAL_MS) * difficulty;

        state.spawnTimerMs -= dt;

        if (state.spawnTimerMs <= 0) {
            spawnGarbage();
            state.spawnTimerMs = state.currentSpawnIntervalMs;
        }
    }

    function spawnGarbage() {
        const size = 58 + Math.random() * 34;
        const baseSpeed = 220 + Math.random() * 100;
        const difficultyBoost = 110 * (state.elapsedMs / GAME_DURATION_MS);

        state.garbage.push({
            x: canvas.width + size,
            y: 25 + Math.random() * (canvas.height - size - 50),
            w: size,
            h: size,
            speed: baseSpeed + difficultyBoost,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() * 1.6 - 0.8) * 0.9,
        });
    }

    function updateGarbage(dt) {
        state.garbage = state.garbage
            .map((item) => ({
                ...item,
                x: item.x - item.speed * (dt / 1000),
                rotation: item.rotation + item.rotationSpeed * (dt / 1000),
            }))
            .filter((item) => item.x + item.w > -50);
    }

    function updateBubbles(dt) {
        state.bubbles.forEach((bubble) => {
            bubble.y -= bubble.speed * (dt / 1000);
            bubble.x += Math.sin((bubble.y + bubble.r) * 0.02) * 0.2;

            if (bubble.y < -10) {
                bubble.y = canvas.height + 10;
                bubble.x = Math.random() * canvas.width;
            }
        });
    }

    function hasCollision() {
        const turtleHitbox = {
            x: state.turtle.x + 10,
            y: state.turtle.y + 12,
            w: state.turtle.w - 18,
            h: state.turtle.h - 20,
        };

        return state.garbage.some((item) =>
            isOverlapping(turtleHitbox, {
                x: item.x + 8,
                y: item.y + 8,
                w: item.w - 16,
                h: item.h - 16,
            }),
        );
    }

    function isOverlapping(a, b) {
        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
        );
    }

    function drawScene() {
        drawBackground();
        drawBubbles();
        drawSeaFloor();
        drawGarbage();
        drawTurtle();
    }

    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#d9f6e8");
        gradient.addColorStop(0.45, "#8dd8cc");
        gradient.addColorStop(1, "#2d8e88");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(255,255,255,0.10)";
        for (let i = 0; i < 5; i += 1) {
            ctx.beginPath();
            ctx.ellipse(180 + i * 220, 80, 130, 30, -0.45, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawBubbles() {
        state.bubbles.forEach((bubble) => {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${bubble.alpha})`;
            ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawSeaFloor() {
        ctx.fillStyle = "#355f49";
        ctx.fillRect(0, canvas.height - 44, canvas.width, 44);

        ctx.fillStyle = "#4d8b64";
        for (let i = 0; i < canvas.width; i += 85) {
            ctx.beginPath();
            ctx.moveTo(i, canvas.height - 44);
            ctx.quadraticCurveTo(
                i + 12,
                canvas.height - 90,
                i + 24,
                canvas.height - 44,
            );
            ctx.quadraticCurveTo(
                i + 30,
                canvas.height - 78,
                i + 42,
                canvas.height - 44,
            );
            ctx.fill();
        }
    }

    function drawTurtle() {
        if (turtleImage.complete && turtleImage.naturalWidth > 0) {
            ctx.drawImage(
                turtleImage,
                state.turtle.x,
                state.turtle.y,
                state.turtle.w,
                state.turtle.h,
            );
            return;
        }

        ctx.fillStyle = "#2f8f66";
        ctx.beginPath();
        ctx.ellipse(
            state.turtle.x + state.turtle.w / 2,
            state.turtle.y + state.turtle.h / 2,
            state.turtle.w / 2,
            state.turtle.h / 2.2,
            0,
            0,
            Math.PI * 2,
        );
        ctx.fill();
    }

    function drawGarbage() {
        state.garbage.forEach((item) => {
            ctx.save();
            ctx.translate(item.x + item.w / 2, item.y + item.h / 2);
            ctx.rotate(item.rotation);

            if (garbageImage.complete && garbageImage.naturalWidth > 0) {
                ctx.drawImage(
                    garbageImage,
                    -item.w / 2,
                    -item.h / 2,
                    item.w,
                    item.h,
                );
            } else {
                ctx.fillStyle = "#5a6b73";
                ctx.fillRect(-item.w / 2, -item.h / 2, item.w, item.h);
            }

            ctx.restore();
        });
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function isEditableTarget(target) {
        if (!(target instanceof HTMLElement)) return false;

        return (
            target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
        );
    }

    function handleKeyChange(event, isPressed) {
        if (isEditableTarget(event.target)) {
            return;
        }

        const key = event.key.toLowerCase();

        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                "w",
                "a",
                "s",
                "d",
            ].includes(key)
        ) {
            event.preventDefault();
        }

        if (key === "arrowup" || key === "w") state.keys.up = isPressed;
        if (key === "arrowdown" || key === "s") state.keys.down = isPressed;
        if (key === "arrowleft" || key === "a") state.keys.left = isPressed;
        if (key === "arrowright" || key === "d") state.keys.right = isPressed;
    }

    window.addEventListener("keydown", (event) => handleKeyChange(event, true));
    window.addEventListener("keyup", (event) => handleKeyChange(event, false));

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", startGame);

    copyBtn.addEventListener("click", async () => {
        const text =
            copyBtn.dataset.shareText || `${window.location.href}#game-charity`;

        try {
            await navigator.clipboard.writeText(text);
            copyBtn.textContent = "Copied";
            setTimeout(() => {
                copyBtn.textContent = "Copy challenge link";
            }, 1600);
        } catch (error) {
            copyBtn.textContent = "Copy failed";
            setTimeout(() => {
                copyBtn.textContent = "Copy challenge link";
            }, 1600);
        }
    });

    resetGame();
})();
