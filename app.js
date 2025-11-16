// Game State
let gameState = "setup"; // setup, playing, reveal, finished
let players = [];
let currentPlayerIndex = 0;
let currentQuestion = "";
let isFlipped = false;
let outcome = null;

// DOM Elements
const setupScreen = document.getElementById("setupScreen");
const playingScreen = document.getElementById("playingScreen");
const revealScreen = document.getElementById("revealScreen");
const finishedScreen = document.getElementById("finishedScreen");
const playerInputs = document.getElementById("playerInputs");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const startGameBtn = document.getElementById("startGameBtn");
const flipCard = document.getElementById("flipCard");
const questionText = document.getElementById("questionText");
const revealBtn = document.getElementById("revealBtn");
const outcomeCard = document.getElementById("outcomeCard");
const outcomeEmoji = document.getElementById("outcomeEmoji");
const outcomeText = document.getElementById("outcomeText");
const nextPlayerBtn = document.getElementById("nextPlayerBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const newPlayersBtn = document.getElementById("newPlayersBtn");

// Initialize
function init() {
    addPlayerInput();
    setupEventListeners();
}

function setupEventListeners() {
    addPlayerBtn.addEventListener("click", addPlayerInput);
    startGameBtn.addEventListener("click", startGame);
    flipCard.addEventListener("click", handleCardClick);
    revealBtn.addEventListener("click", handleReveal);
    nextPlayerBtn.addEventListener("click", nextPlayer);
    playAgainBtn.addEventListener("click", playAgain);
    newPlayersBtn.addEventListener("click", newPlayers);
}

function addPlayerInput() {
    const playerCount = playerInputs.children.length;
    if (playerCount >= 15) {
        addPlayerBtn.style.display = "none";
        return;
    }

    const inputWrapper = document.createElement("div");
    inputWrapper.className = "flex gap-2";
    
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Spelare ${playerCount + 1}`;
    input.className = "flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground";
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.className = "shrink-0 w-10 h-10 border border-border rounded-lg hover:bg-muted transition-colors text-foreground text-xl";
    removeBtn.addEventListener("click", () => {
        inputWrapper.remove();
        if (playerInputs.children.length < 15) {
            addPlayerBtn.style.display = "flex";
        }
    });

    inputWrapper.appendChild(input);
    if (playerCount > 0) {
        inputWrapper.appendChild(removeBtn);
    }
    
    playerInputs.appendChild(inputWrapper);

    if (playerCount + 1 >= 15) {
        addPlayerBtn.style.display = "none";
    }
}

function getPlayerNames() {
    const inputs = playerInputs.querySelectorAll("input");
    const names = [];
    inputs.forEach(input => {
        const name = input.value.trim();
        if (name) names.push(name);
    });
    return names;
}

function startGame() {
    players = getPlayerNames();
    if (players.length === 0) return;

    currentPlayerIndex = 0;
    currentQuestion = getRandomQuestion();
    isFlipped = false;
    outcome = null;
    gameState = "playing";

    showScreen("playing");
    updatePlayerInfo();
    questionText.textContent = currentQuestion;
}

function handleCardClick() {
    if (gameState !== "playing") return;
    
    isFlipped = !isFlipped;
    flipCard.classList.toggle("flipped");

    if (isFlipped) {
        setTimeout(() => {
            revealBtn.classList.remove("hidden");
        }, 500);
    } else {
        revealBtn.classList.add("hidden");
    }
}

function handleReveal() {
    outcome = getRandomOutcome();
    gameState = "reveal";
    
    showScreen("reveal");
    updateRevealScreen();
}

function updatePlayerInfo() {
    document.getElementById("playerCounter").textContent = `${currentPlayerIndex + 1} / ${players.length}`;
    document.getElementById("currentPlayerName").textContent = players[currentPlayerIndex];
}

function updateRevealScreen() {
    document.getElementById("revealPlayerCounter").textContent = `${currentPlayerIndex + 1} / ${players.length}`;
    document.getElementById("revealPlayerName").textContent = players[currentPlayerIndex];

    if (outcome === "berätta") {
        outcomeCard.className = "mb-6 animate-zoom-in p-8 text-center shadow-elevated rounded-lg bg-secondary text-secondary-foreground";
        outcomeEmoji.textContent = "Berätta";
        outcomeText.textContent = "Dags att berätta varför!";
    } else {
        outcomeCard.className = "mb-6 animate-zoom-in p-8 text-center shadow-elevated rounded-lg bg-success text-success-foreground";
        outcomeEmoji.textContent = "Skipp";
        outcomeText.textContent = "Du slipper denna gång!";
    }
}

function nextPlayer() {
    if (currentPlayerIndex < players.length - 1) {
        currentPlayerIndex++;
        currentQuestion = getRandomQuestion();
        isFlipped = false;
        outcome = null;
        gameState = "playing";

        flipCard.classList.remove("flipped");
        revealBtn.classList.add("hidden");
        questionText.textContent = currentQuestion;

        showScreen("playing");
        updatePlayerInfo();
    } else {
        gameState = "finished";
        showScreen("finished");
    }
}

function playAgain() {
    currentPlayerIndex = 0;
    currentQuestion = getRandomQuestion();
    isFlipped = false;
    outcome = null;
    gameState = "playing";

    flipCard.classList.remove("flipped");
    revealBtn.classList.add("hidden");
    questionText.textContent = currentQuestion;

    showScreen("playing");
    updatePlayerInfo();
}

function newPlayers() {
    players = [];
    currentPlayerIndex = 0;
    isFlipped = false;
    outcome = null;
    gameState = "setup";

    playerInputs.innerHTML = "";
    addPlayerInput();
    addPlayerBtn.style.display = "flex";

    showScreen("setup");
}

function showScreen(screen) {
    setupScreen.classList.add("hidden");
    playingScreen.classList.add("hidden");
    revealScreen.classList.add("hidden");
    finishedScreen.classList.add("hidden");

    switch(screen) {
        case "setup":
            setupScreen.classList.remove("hidden");
            break;
        case "playing":
            playingScreen.classList.remove("hidden");
            break;
        case "reveal":
            revealScreen.classList.remove("hidden");
            break;
        case "finished":
            finishedScreen.classList.remove("hidden");
            break;
    }
}

// Start the app
init();
