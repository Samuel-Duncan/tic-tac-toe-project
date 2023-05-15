const Player = (name, marker) => ({ name, marker });

const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push('');
      }
    }
  };

  resetBoard();

  const getBoard = () => board;
  const getRowsAndColumns = () => [rows, columns];

  return { getBoard, getRowsAndColumns, resetBoard };
})();

const Gameplay = (() => {
  const players = [];
  let activePlayer;
  const board = Gameboard.getBoard();

  const checkForWinner = () => {
    const winningCombinations = [
      // Rows
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      // Columns
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      // Diagonals
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    const isX = (marker) => marker === 'X';
    const isO = (marker) => marker === 'O';
    // eslint-disable-next-line max-len
    const winnerX = winningCombinations.some((combination) => combination.every((marker) => isX(marker)));
    // eslint-disable-next-line max-len
    const winnerO = winningCombinations.some((combination) => combination.every((marker) => isO(marker)));
    const winner = [winnerX, winnerO];

    return winner;
  };

  const checkForTie = () => board.every((element) => element.every((marker) => marker !== ''));

  let switchPlayerTurn;

  return {
    switchPlayerTurn, checkForWinner, checkForTie, players, activePlayer,
  };
})();

const Display = (() => {
  const rows = Gameboard.getRowsAndColumns()[0];
  const columns = Gameboard.getRowsAndColumns()[1];
  const board = Gameboard.getBoard();
  const container = document.getElementById('gameboard');
  const winnerDisplay = document.querySelector('.displayWinner');
  const restartButton = document.getElementById('restart');
  const startButton = document.getElementById('start');
  const formContainer = document.getElementById('form-container');
  const form = document.querySelector('form');

  // NEEDS WORK
  const getPlayerNames = () => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      Gameplay.players = [];
      restartGame();
      const player1Name = form.player1.value;
      const player2Name = form.player2.value;
      // Create a new instance of Player using the form values

      // Add the new player to the players array in the Gameplay module
      Gameplay.players.push(Player(player1Name, 'X'));
      Gameplay.players.push(Player(player2Name, 'O'));
      [Gameplay.activePlayer] = Gameplay.players;
      Gameplay.switchPlayerTurn = () => {
        Gameplay.activePlayer = Gameplay.activePlayer === Gameplay.players[0] ? Gameplay.players[1] : Gameplay.players[0];
      };
      formContainer.classList.toggle('hide-display');
    });
  };
  getPlayerNames();
  // Render the board to the DOM
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = board[i][j];
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-column', j);
      container.appendChild(cell);
      cell.addEventListener('click', handleClick);
    }
  }

  function displayWinner() {
    winnerDisplay.textContent = `${Gameplay.activePlayer.name} is the winner!`;
  }

  function clearWinner() {
    winnerDisplay.textContent = '';
  }

  function displayTie() {
    winnerDisplay.textContent = 'It\'s a tie! Play again!';
  }

  function handleClick(event) {
    const clickedCell = event.target;
    const row = clickedCell.getAttribute('data-row');
    const column = clickedCell.getAttribute('data-column');

    if (clickedCell.textContent === '') {
      board[row][column] = Gameplay.activePlayer.marker;
      clickedCell.textContent = board[row][column];
      const onWin = Gameplay.checkForWinner().some((win) => win === true);
      if (onWin) {
        Gameplay.checkForWinner();
        displayWinner();
      }
      if (Gameplay.checkForTie()) {
        displayTie();
      }
      if (onWin && Gameplay.checkForTie()) {
        Gameplay.checkForWinner();
        displayWinner();
      }
      Gameplay.switchPlayerTurn();
    }
  }

  const startGame = () => {
    formContainer.classList.toggle('hide-display');
    restartGame();
  };

  const restartGame = () => {
    const cells = document.querySelectorAll('.cell');
    Gameboard.resetBoard();
    clearWinner();
    cells.forEach((cell) => {
      cell.textContent = '';
    });
  };

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', restartGame);

  return {
    clearWinner,
  };
})();
