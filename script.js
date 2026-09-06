/* =========================================
   GUESS X
   NUMBER GUESSING GAME
========================================= */


/* ================= GAME SETTINGS ================= */

const difficulties = {

    easy: {
        max: 50,
        attempts: 10
    },

    medium: {
        max: 100,
        attempts: 8
    },

    hard: {
        max: 500,
        attempts: 6
    }

};


/* ================= GAME VARIABLES ================= */

let difficulty = "easy";

let secretNumber;

let maxNumber = 50;

let maxAttempts = 10;

let attemptsLeft = 10;

let guesses = [];

let score = 0;

let streak = 0;

let seconds = 0;

let timerInterval;

let gameActive = true;

let hintUsed = false;


/* ================= ELEMENTS ================= */

const guessInput = document.getElementById("guessInput");

const guessBtn = document.getElementById("guessBtn");

const message = document.getElementById("message");

const attemptsDisplay = document.getElementById("attempts");

const timerDisplay = document.getElementById("timer");

const streakDisplay = document.getElementById("streak");

const scoreDisplay = document.getElementById("score");

const rangeDisplay = document.getElementById("rangeDisplay");

const progress = document.getElementById("progress");

const attemptText = document.getElementById("attemptText");

const history = document.getElementById("history");

const guessCount = document.getElementById("guessCount");

const hint = document.getElementById("hint");


/* ================= START GAME ================= */

function newGame() {

    secretNumber =
        Math.floor(Math.random() * maxNumber) + 1;

    attemptsLeft = maxAttempts;

    guesses = [];

    score = 0;

    seconds = 0;

    gameActive = true;

    hintUsed = false;


    clearInterval(timerInterval);

    timerInterval = setInterval(updateTimer, 1000);


    attemptsDisplay.textContent = attemptsLeft;

    scoreDisplay.textContent = score;

    timerDisplay.textContent = "00:00";

    rangeDisplay.textContent = `1 - ${maxNumber}`;

    attemptText.textContent =
        `${attemptsLeft} / ${maxAttempts}`;

    progress.style.width = "100%";


    history.innerHTML = `
        <div class="empty-history">
            Your guesses will appear here...
        </div>
    `;

    guessCount.textContent = "0 guesses";

    message.textContent =
        "Enter a number to begin your challenge!";

    hint.textContent =
        "Think carefully. Your first hint will appear after your guess.";

    guessInput.value = "";

    guessInput.disabled = false;

    guessBtn.disabled = false;

    guessInput.focus();

}


/* ================= DIFFICULTY ================= */

function setDifficulty(level, button) {

    difficulty = level;

    maxNumber = difficulties[level].max;

    maxAttempts = difficulties[level].attempts;


    document
        .querySelectorAll(".difficulty-btn")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");


    newGame();

}


/* ================= TIMER ================= */

function updateTimer() {

    seconds++;

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;

}


/* ================= GUESS ================= */

function makeGuess() {

    if (!gameActive) return;


    const guess =
        Number(guessInput.value);


    if (!guessInput.value) {

        message.textContent =
            "⚠️ Please enter a number.";

        return;

    }


    if (
        guess < 1 ||
        guess > maxNumber
    ) {

        message.textContent =
            `⚠️ Enter a number between 1 and ${maxNumber}.`;

        return;

    }


    if (guesses.includes(guess)) {

        message.textContent =
            "🔁 You already tried that number!";

        return;

    }


    guesses.push(guess);

    attemptsLeft--;


    addHistory(guess);


    attemptsDisplay.textContent =
        attemptsLeft;

    attemptText.textContent =
        `${attemptsLeft} / ${maxAttempts}`;


    const percentage =
        (attemptsLeft / maxAttempts) * 100;

    progress.style.width =
        percentage + "%";


    /* ================= CORRECT ================= */

    if (guess === secretNumber) {

        gameActive = false;

        clearInterval(timerInterval);

        streak++;

        calculateScore();

        streakDisplay.textContent =
            `${streak} 🔥`;

        scoreDisplay.textContent =
            score;


        message.textContent =
            "🎯 PERFECT! You found the secret number!";


        hint.textContent =
            `The secret number was ${secretNumber}. Incredible!`;


        setTimeout(showWinModal, 500);

        return;

    }


    /* ================= WRONG ================= */

    if (guess < secretNumber) {

        message.textContent =
            "📈 Too low! Try a higher number.";

        hint.textContent =
            getDistanceHint(guess);

    } else {

        message.textContent =
            "📉 Too high! Try a lower number.";

        hint.textContent =
            getDistanceHint(guess);

    }


    /* ================= GAME OVER ================= */

    if (attemptsLeft <= 0) {

        gameActive = false;

        clearInterval(timerInterval);

        streak = 0;

        streakDisplay.textContent =
            "0 🔥";


        message.textContent =
            `💀 Game Over! The number was ${secretNumber}.`;

        hint.textContent =
            "Don't give up. Hit New Game and try again!";


        guessInput.disabled = true;

        guessBtn.disabled = true;

    }


    guessInput.value = "";

    guessInput.focus();

}


/* ================= DISTANCE HINT ================= */

function getDistanceHint(guess) {

    const distance =
        Math.abs(secretNumber - guess);


    const range =
        maxNumber;


    if (distance <= range * .05) {

        return "🔥 EXTREMELY HOT! You're incredibly close!";

    }

    if (distance <= range * .15) {

        return "🌡️ HOT! You're getting very close.";

    }

    if (distance <= range * .3) {

        return "😎 Warm! You're moving in the right direction.";

    }

    return "❄️ COLD! You're still far from the secret number.";

}


/* ================= HISTORY ================= */

function addHistory(guess) {

    const empty =
        history.querySelector(".empty-history");

    if (empty) empty.remove();


    const item =
        document.createElement("div");

    item.classList.add("history-item");


    if (guess === secretNumber) {

        item.classList.add("correct");

        item.textContent =
            `🎯 ${guess}`;

    }

    else if (guess > secretNumber) {

        item.classList.add("high");

        item.textContent =
            `↓ ${guess}`;

    }

    else {

        item.classList.add("low");

        item.textContent =
            `↑ ${guess}`;

    }


    history.appendChild(item);


    guessCount.textContent =
        `${guesses.length} guess${guesses.length === 1 ? "" : "es"}`;

}


/* ================= SCORE ================= */

function calculateScore() {

    const attemptBonus =
        attemptsLeft * 100;

    const speedBonus =
        Math.max(0, 500 - seconds * 5);

    const difficultyMultiplier = {

        easy: 1,

        medium: 1.5,

        hard: 2

    };


    score = Math.floor(
        (
            500 +
            attemptBonus +
            speedBonus
        )
        *
        difficultyMultiplier[difficulty]
    );


    /* Hint penalty */

    if (hintUsed) {

        score = Math.floor(score * .85);

    }

}


/* ================= HINT ================= */

function showHint() {

    if (!gameActive) return;


    hintUsed = true;


    const randomHint =
        Math.floor(Math.random() * 3);


    if (randomHint === 0) {

        hint.textContent =
            secretNumber % 2 === 0
                ? "🔢 Hint: The secret number is EVEN."
                : "🔢 Hint: The secret number is ODD.";

    }

    else if (randomHint === 1) {

        const half =
            Math.floor(maxNumber / 2);

        hint.textContent =
            secretNumber <= half
                ? `📍 Hint: It's somewhere between 1 and ${half}.`
                : `📍 Hint: It's somewhere between ${half + 1} and ${maxNumber}.`;

    }

    else {

        const lastDigit =
            secretNumber % 10;

        hint.textContent =
            `🔍 Hint: The number ends with ${lastDigit}.`;

    }

}


/* ================= WIN MODAL ================= */

function showWinModal() {

    document.getElementById("finalScore")
        .textContent = score;

    document.getElementById("finalAttempts")
        .textContent =
        maxAttempts - attemptsLeft + 1;

    document.getElementById("finalTime")
        .textContent =
        timerDisplay.textContent;


    document.getElementById("winModal")
        .classList.add("show");


    document.getElementById("playerName")
        .focus();

}


function closeWinModal() {

    document.getElementById("winModal")
        .classList.remove("show");

}


/* ================= SAVE SCORE ================= */

function saveScore() {

    let name =
        document.getElementById("playerName")
            .value
            .trim();


    if (!name) {

        name = "Anonymous";

    }


    const leaderboard =
        JSON.parse(
            localStorage.getItem("guessXLeaderboard")
        ) || [];


    leaderboard.push({

        name: name,

        score: score,

        difficulty: difficulty,

        time: timerDisplay.textContent,

        attempts:
            maxAttempts - attemptsLeft + 1,

        date:
            new Date().toLocaleDateString()

    });


    leaderboard.sort(
        (a,b) => b.score - a.score
    );


    leaderboard.splice(10);


    localStorage.setItem(
        "guessXLeaderboard",
        JSON.stringify(leaderboard)
    );


    closeWinModal();

    openLeaderboard();

}


/* ================= LEADERBOARD ================= */

function openLeaderboard() {

    renderLeaderboard();

    document.getElementById("leaderboardModal")
        .classList.add("show");

}


function closeLeaderboard() {

    document.getElementById("leaderboardModal")
        .classList.remove("show");

}


function renderLeaderboard() {

    const leaderboard =
        JSON.parse(
            localStorage.getItem("guessXLeaderboard")
        ) || [];


    const list =
        document.getElementById("leaderboardList");

    const podium =
        document.getElementById("podium");


    /* ================= PODIUM ================= */

    podium.innerHTML = "";


    if (leaderboard.length > 0) {

        const order = [1,0,2];

        order.forEach(index => {

            if (!leaderboard[index]) return;


            const player =
                leaderboard[index];


            const item =
                document.createElement("div");


            item.className =
                `podium-item ${
                    index === 0
                        ? "first"
                        : index === 1
                            ? "second"
                            : "third"
                }`;


            const medals = [
                "🥇",
                "🥈",
                "🥉"
            ];


            item.innerHTML = `

                <div class="medal">
                    ${medals[index]}
                </div>

                <div class="podium-name">
                    ${escapeHTML(player.name)}
                </div>

                <div class="podium-score">
                    ${player.score}
                </div>

            `;


            podium.appendChild(item);

        });

    }


    /* ================= LIST ================= */

    list.innerHTML = "";


    if (leaderboard.length === 0) {

        list.innerHTML = `
            <div class="empty-history">
                No scores yet. Become the first champion! 🏆
            </div>
        `;

        return;

    }


    leaderboard.forEach((player,index) => {

        const row =
            document.createElement("div");

        row.className =
            "leader-row";


        row.innerHTML = `

            <div class="rank">
                #${index + 1}
            </div>

            <div class="player">

                ${escapeHTML(player.name)}

                <small>
                    ${player.difficulty.toUpperCase()}
                    • ${player.time}
                    • ${player.attempts} attempts
                </small>

            </div>

            <div class="player-score">
                ${player.score}
            </div>

        `;


        list.appendChild(row);

    });

}


/* ================= CLEAR LEADERBOARD ================= */

function clearLeaderboard() {

    const confirmClear =
        confirm(
            "Are you sure you want to delete the entire leaderboard?"
        );


    if (!confirmClear) return;


    localStorage.removeItem(
        "guessXLeaderboard"
    );


    renderLeaderboard();

}


/* ================= SECURITY ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ================= ENTER KEY ================= */

guessInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            makeGuess();

        }

    }
);


/* ================= INITIALIZE ================= */

newGame();