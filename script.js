const Player = (name, marker) => ({ name, marker });

const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push('');
    }
  }

  const getBoard = () => board;
  const getRowsAndColumns = () => [rows, columns];

  return { getBoard, getRowsAndColumns };
})();

const Gameplay = (() => {
  const playerX = Player('Player X', 'X');
  const playerO = Player('Player O', 'O');
  const players = [playerX, playerO];
  let activePlayer = players[0];
  let activePlayerMarker = activePlayer.marker;
  const winningCells = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    activePlayerMarker = activePlayerMarker === players[0].marker ? players[1].marker : players[0].marker;
  };

  const getActivePlayer = () => activePlayer;

  const getActivePlayerMarker = () => activePlayerMarker;

  return { switchPlayerTurn, getActivePlayer, getActivePlayerMarker };
})();

const Display = (() => {
  const rows = Gameboard.getRowsAndColumns()[0];
  const columns = Gameboard.getRowsAndColumns()[1];
  const board = Gameboard.getBoard();
  const container = document.getElementById('gameboard');

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

  function handleClick(event) {
    const clickedCell = event.target;
    const row = clickedCell.getAttribute('data-row');
    const column = clickedCell.getAttribute('data-column');
    const activePlayerMarker = Gameplay.getActivePlayerMarker();
    if (clickedCell.textContent === '') {
      board[row][column] = activePlayerMarker;
      clickedCell.textContent = board[row][column];
      Gameplay.switchPlayerTurn();
    }
  }
})();
