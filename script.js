const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const replayBtn = document.getElementById("replayBtn");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;


const ChangeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    replayBtn.style.display = "block";
};

// 🎮 التحكم
const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// 🔁 إعادة اللعبة
const resetGame = () => {
    gameOver = false;
    snakeX = 5;
    snakeY = 10;
    snakeBody = [];
    velocityX = 0;
    velocityY = 0;
    score = 0;

    scoreElement.innerText = `Score: ${score}`;
    ChangeFoodPosition();
};

// ▶️ زرار Replay
replayBtn.addEventListener("click", () => {
    clearInterval(setIntervalId); // مهم
    resetGame();
    replayBtn.style.display = "none";
    setIntervalId = setInterval(initGame, 125);
});

// 🎮 أزرار الموبايل
controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});

// 📱 Swipe للموبايل
let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let diffX = endX - startX;
    let diffY = endY - startY;

    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) changeDirection({ key: "ArrowRight" });
        else changeDirection({ key: "ArrowLeft" });
    } else {
        if (diffY > 0) changeDirection({ key: "ArrowDown" });
        else changeDirection({ key: "ArrowUp" });
    }
});

document.addEventListener("touchmove", (e) => {
    e.preventDefault();
}, { passive: false });

// 🚀 تشغيل اللعبة
const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // 🍎 أكل
    if (snakeX === foodX && snakeY === foodY) {
        ChangeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);

        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // 🐍 جسم الثعبان
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // الحركة
    snakeX += velocityX;
    snakeY += velocityY;

    // 🧨 خبط في الحيط
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // 🐍 رسم الثعبان + خبط في نفسه
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        if (i !== 0 &&
            snakeBody[0][1] === snakeBody[i][1] &&
            snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
};

// 🔥 بداية اللعبة
ChangeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
