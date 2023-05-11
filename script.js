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
  const playerX = Player('Player X', 'X');
  const playerO = Player('Player O', 'O');
  const players = [playerX, playerO];
  let activePlayer = players[0];
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

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  return {
    switchPlayerTurn, getActivePlayer, checkForWinner, checkForTie,
  };
})();

const Display = (() => {
  const rows = Gameboard.getRowsAndColumns()[0];
  const columns = Gameboard.getRowsAndColumns()[1];
  const board = Gameboard.getBoard();
  const container = document.getElementById('gameboard');
  const winnerDisplay = document.createElement('div');
  const restartButton = document.getElementById('restart');

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
    winnerDisplay.textContent = `${Gameplay.getActivePlayer().name} is the winner!`;
    container.appendChild(winnerDisplay);
  }

  function clearWinner() {
    winnerDisplay.textContent = '';
  }

  function displayTie() {
    winnerDisplay.textContent = 'It\'s a tie! Play again!';
    container.appendChild(winnerDisplay);
  }

  function handleClick(event) {
    const clickedCell = event.target;
    const row = clickedCell.getAttribute('data-row');
    const column = clickedCell.getAttribute('data-column');
    const activePlayerMarker = Gameplay.getActivePlayer().marker;

    if (clickedCell.textContent === '') {
      board[row][column] = activePlayerMarker;
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
        Gameplay.switchPlayerTurn();
      }
      Gameplay.switchPlayerTurn();
    }
  }

  const restartGame = () => {
    const cells = document.querySelectorAll('.cell');
    Gameboard.resetBoard();
    clearWinner();
    cells.forEach((cell) => {
      cell.textContent = '';
    });
    Gameplay.switchPlayerTurn();
  };

  restartButton.addEventListener('click', restartGame);

  return { clearWinner, restartButton };
})();
