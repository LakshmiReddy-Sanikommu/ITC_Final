document.addEventListener('DOMContentLoaded', function () {
  let gridSize = parseInt(document.getElementById('gridSizeSelect').value);
  const grid = document.getElementById('grid');
  const toast = document.getElementById('toast');
  const moveCounter = document.getElementById('moveCounter');
  const timerDisplay = document.getElementById('timer');
  const startButton = document.getElementById('startButton');
  const restartButton = document.getElementById('restartButton');
  let cells = [];
  let moveCount = 0;
  let timerSeconds = 0;
  let timerInterval;

  let gameStarted = false;
  let confettiActive = false; // Track if confetti is currently active
  let confettiInterval;

  // Add Popup Container to HTML
  const popupContainer = document.getElementById('popup-container');

  function createGrid() {
      return new Promise((resolve) => {
          grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
          grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

          for (let i = 0; i < gridSize; i++) {
              cells[i] = [];
              for (let j = 0; j < gridSize; j++) {
                  const cell = document.createElement('div');
                  cell.className = 'cell';
                  cell.dataset.row = i;
                  cell.dataset.col = j;
                  grid.appendChild(cell);
                  cells[i][j] = false;
              }
          }
          // Initialize a random starting pattern
          randomizeGrid();
          resolve(); // Resolve the promise when grid creation is complete
      });
  }

  function toggleCell(event) {
      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      toggleLights(row, col);
      updateGrid();
      checkWin();
  }

  function toggleLights(row, col) {
      cells[row][col] = !cells[row][col];

      const directions = [
          { row: -1, col: 0 },
          { row: 1, col: 0 },
          { row: 0, col: -1 },
          { row: 0, col: 1 }
      ];

      directions.forEach((dir) => {
          const newRow = row + dir.row;
          const newCol = col + dir.col;
          if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
              cells[newRow][newCol] = !cells[newRow][newCol];
          }
      });
  }

  function updateGrid() {
      for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
              const cell = grid.children[i * gridSize + j];
              cell.classList.toggle('active', cells[i][j]);
          }
      }
  }

  function randomizeGrid() {
      for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
              cells[i][j] = Math.random() < 0.5;
          }
      }
      updateGrid();
  }

  function startConfetti() {
      confettiActive = true;
      particlesJS('confetti-container', {
          particles: {
              number: { value: 100 },
              color: { value: '#ffffff' }, // Adjust the color to your preference

              size: { value: 10, random: true }, // Adjust the size of the confetti
              move: {
                  enable: true,
                  speed: 8, // Adjust the speed of the confetti burst
                  direction: 'top', // You can experiment with other directions
                  random: true,
              },
              rotate: {
                  value: 45, // Adjust the rotation of the confetti
                  random: true,
              },
          },
          interactivity: {
              events: {
                  onhover: { enable: false },
              },
          },
      });

      // Optionally, stop confetti after a certain duration
      confettiInterval = setTimeout(() => {
          stopConfetti();
      }, 5000); // Adjust the duration (in milliseconds)
  }

  function stopConfetti() {
      confettiActive = false;
      clearTimeout(confettiInterval);
      // Clear the confetti container
      document.getElementById('confetti-container').innerHTML = '';
  }

  function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
}

  function checkWin() {
      const allLightsOff = cells.every(row => row.every(cell => !cell));
      if (allLightsOff) {
          stopTimer();
          stopGame();

          // Display congratulatory message and game statistics
          const movesUsed = moveCount;
          const timeTaken = timerDisplay.textContent;

          // Create a popup content
          const popupContent = document.createElement('div');
          popupContent.className = 'popup-content';
          popupContent.innerHTML = `
          <h2>Congratulations!</h2>
          <p class="popup-content">You have turned off all the lights! 🏆</p>
          <p class="popup-content">Moves used: ${movesUsed}</p>
          <p class="popup-content">Time taken: ${timeTaken}</p>
          <button class="popup-button" id="startNewGameBtn">Start New Game</button>`;

          const popupContainer = document.getElementById('popup-container');
            while (popupContainer.firstChild) {
                popupContainer.removeChild(popupContainer.firstChild);
            }
          
          // Append content to popup container
          popupContainer.appendChild(popupContent);


          // Show the popup container
          popupContainer.style.display = 'block';

            // Start confetti animation
            startConfetti();
            const startNewGameBtn = document.getElementById('startNewGameBtn');
        if (startNewGameBtn) {
            startNewGameBtn.addEventListener('click', restartGame);
        }
        }
    }

    function updateMoveCounter() {
        moveCount++;
        if (moveCounter) {
            moveCounter.textContent = moveCount;
        }
    }

    function updateTimer() {
        timerSeconds++;
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        if (timerDisplay) {
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }

    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function stopGame() {
        gameStarted = false;
    }

    async function startGame() {
        // Get the selected grid size
        gridSize = parseInt(document.getElementById('gridSizeSelect').value);

        moveCount = 0;
        if (moveCounter) {
            moveCounter.textContent = moveCount;
        }

        timerSeconds = 0;
        stopTimer();
        if (timerDisplay) {
            timerDisplay.textContent = '0:00';
        }

        // Clear the existing grid
        grid.innerHTML = '';
        gameStarted = true;
        stopConfetti();
        popupContainer.style.display = 'none';

        // Reset the grid and other game state
        await createGrid();
    }

    async function restartGame() {
        // Get the selected grid size
        gridSize = parseInt(document.getElementById('gridSizeSelect').value);

        moveCount = 0;
        if (moveCounter) {
            moveCounter.textContent = moveCount;
        }

        timerSeconds = 0;
        stopTimer();
        if (timerDisplay) {
            timerDisplay.textContent = '0:00';
        }

        // Clear the existing grid
        grid.innerHTML = '';
        gameStarted = true;
        stopConfetti();
        popupContainer.style.display = 'none';

        // Reset the grid and other game state
        await createGrid();
    }

    // Event listener for grid cell click
    grid.addEventListener('click', function (event) {
        if (gameStarted && event.target.classList.contains('cell')) {
            toggleCell(event);
            updateMoveCounter();
            if (moveCount === 1) {
                startTimer();
            }
        }
    });

    // Event listener for start button click
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }

    // Event listener for restart button click
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }

    // Initialize the grid and game
    createGrid();
});
