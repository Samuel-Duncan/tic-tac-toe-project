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
  const playerX = Player('Player 1', 'X');
  const playerO = Player('Player 2', 'O');
  const players = [playerX, playerO];
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;
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
    }
  }
})();
