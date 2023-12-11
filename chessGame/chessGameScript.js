var board, game = new Chess();

var config = {
  draggable: true,
  position: 'empty', // Start with an empty board
  pieceTheme: 'chessGame/chessboardjs-1/img/chesspieces/wikipedia/{piece}.png',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

board = Chessboard('chessboard', config);

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('resetButton').addEventListener('click', resetGame);

function startGame() {
  var playerColor = getPlayerColor();
  game.reset();
  board.orientation(playerColor); // Set board orientation based on player color
  board.start(); // Sets up the board with the starting position

  if (isSinglePlayerMode() && playerColor === 'b') {
    makeComputerMove(); // Computer makes the first move if the player is black
  }
}

function resetGame() {
  game.reset();
  board.clear(); // Clears the board
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;
  if (isSinglePlayerMode() && game.turn() !== getPlayerColor()) return false;
}

function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  if (isSinglePlayerMode() && game.turn() !== getPlayerColor()) {
    window.setTimeout(makeComputerMove, 250);
  }
}

function onSnapEnd() {
  board.position(game.fen());
}

function isSinglePlayerMode() {
  return document.getElementById('gameModeSelect').value === 'single';
}

function getPlayerColor() {
  return document.querySelector('input[name="playerColor"]:checked').value;
}

function makeComputerMove() {
  var possibleMoves = game.moves();

  if (game.game_over() || possibleMoves.length === 0) return;

  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board.position(game.fen());
}

// Additional necessary functions
document.getElementById('undoButton').addEventListener('click', undoMove);

function undoMove() {
    game.undo();
    board.position(game.fen());
}

function checkGameOver() {
    if (game.in_checkmate()) {
        alert('Checkmate!');
    } else if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition() || game.insufficient_material()) {
        alert('Draw!');
    }
}
