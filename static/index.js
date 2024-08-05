const playGameBtn = document.getElementById("playGameBtn");
const gameDiv = document.getElementById("gameDiv");
const gameForm = document.getElementById("gameForm");
const gameResultsDiv = document.getElementById("gameResultsDiv");
const playerChoiceResult = document.getElementById("playerChoiceResult");
const computerChoiceResult = document.getElementById("computerChoiceResult");
const roundResult = document.getElementById("roundResult");
const playAgainBtn = document.getElementById("playAgainBtn");
const opponentImage = document.getElementById("opponentImage");
const opponentName = document.getElementById("opponentName");
const level = document.getElementById("level");

const totalRounds = 3;
let playerWins = 0;
let computerWins = 0;
let currentRound = 1;
let opponentIndex = 0;
let computerOpponents = [];

function setOpponentImage(imageSrc) {
  opponentImage.src = `/static/${imageSrc}`;
  opponentImage.alt = "Opponent";
}

function setOpponentName(name) {
  opponentName.textContent = name;
}

function showGame() {
  playGameBtn.style.display = "none";
  gameDiv.style.display = "block";
  gameResultsDiv.style.display = "none";
  playerChoiceResult.textContent = "";
  computerChoiceResult.textContent = "";
  roundResult.textContent = "";

  document.getElementById("player_choice").disabled = false;
  document.querySelector("#gameForm button[type='submit']").disabled = false;

  // Fetch the computer opponents data from the server
  fetch("/get_opponents")
    .then((response) => response.json())
    .then((data) => {
      computerOpponents = data;
      startRound();
    })
    .catch((error) => {
      console.error("Error fetching computer opponents:", error);
    });
}

function startRound() {
  playerChoiceResult.textContent = "";
  computerChoiceResult.textContent = "";
  roundResult.textContent = "";

  setOpponentImage(computerOpponents[opponentIndex].image);
  setOpponentName(computerOpponents[opponentIndex].name);
  level.textContent = `Level: ${opponentIndex + 1}`;
  opponentImage.style.display = "block"; // Show the opponent's image
}

function playRound(event) {
  event.preventDefault();
  const playerChoice = document.getElementById("player_choice").value.trim().toLowerCase();

  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      player_choice: playerChoice,
      opponent_index: opponentIndex,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display the player's choice and computer's choice
      playerChoiceResult.textContent = `Player chose: ${playerChoice}`;
      computerChoiceResult.textContent = `Computer chose: ${data.computer_choice}`;

      // Display the result of the round
      roundResult.textContent = data.result;

      // Update game state based on the result
      if (data.result === "Player wins!") {
        playerWins++;
      } else if (data.result === "Computer wins!") {
        computerWins++;
      }

      // Check if we have a winner or need to move to the next round
      if (playerWins >= totalRounds || computerWins >= totalRounds) {
        showGameResults();
      } else {
        currentRound++;
        opponentIndex = (opponentIndex + 1) % computerOpponents.length; // Move to the next opponent
        startRound();
      }

      // Disable the form input and play button until the user clicks "Play Again"
      document.getElementById("player_choice").disabled = true;
      document.querySelector("#gameForm button[type='submit']").disabled = true;
    })
    .catch((error) => {
      console.error("Error playing round:", error);
    });
}

function showGameResults() {
  const resultMessage = document.getElementById("roundResult");
  if (playerWins > computerWins) {
    resultMessage.textContent = "Congratulations! You won the game!";
  } else if (computerWins > playerWins) {
    resultMessage.textContent = "Oops! You lost the game. Better luck next time!";
  } else {
    resultMessage.textContent = "It's a tie! Try again!";
  }

  playGameBtn.style.display = "block";
  gameForm.style.display = "none";
  gameResultsDiv.style.display = "block";
  opponentImage.style.display = "none"; // Hide the opponent's image again

  // Reset game state
  playerWins = 0;
  computerWins = 0;
  currentRound = 1;
  opponentIndex = 0;
}

function playAgain() {
  playGameBtn.style.display = "block";
  gameForm.style.display = "block";
  gameResultsDiv.style.display = "none";
  playerChoiceResult.textContent = "";
  computerChoiceResult.textContent = "";
  roundResult.textContent = "";

  // Enable the form input and play button
  document.getElementById("player_choice").disabled = false;
  document.querySelector("#gameForm button[type='submit']").disabled = false;

  opponentImage.style.display = "none"; // Hide the opponent's image again

  // Reset game state for the next round
  playerWins = 0;
  computerWins = 0;
  currentRound = 1;
  opponentIndex = 0;
}

playGameBtn.addEventListener("click", showGame);
gameForm.addEventListener("submit", playRound);
playAgainBtn.addEventListener("click", playAgain);
