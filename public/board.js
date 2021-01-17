/*
Handles the board logic.
*/

const canvas = document.getElementById('board');
const log = document.getElementById('game-log');
const ctx = canvas.getContext('2d');

const STONE_COLOR = ['#000000', '#ffffff'];
const GHOST_COLOR = ['#555555', '#e8e8e8'];

/**
 * Equivalent to the processing.js line().
 * @param {number} x1 x-coordinate of first endpoint
 * @param {number} y1 y-coordinate of first endpoint
 * @param {number} x2 x-coordinate of second endpoint
 * @param {number} y2 y-coordinate of second endpoint
 */
function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/**
 * Equivalent to the processing.js ellipse(), radius mode.
 * @param {number} x x-coordinate of centre of ellipse
 * @param {number} y y-coordinate of centre of ellipse
 * @param {number} radiusX horizontal radius
 * @param {number} radiusY vertical radius
 */
function ellipse(x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.moveTo(x + radiusX, y);
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();
}

function circle(x, y, radius) {
  ellipse(x, y, radius, radius);
}


const RADIUS = 16; // stone radius
const SIZE = RADIUS * 2; // space between lines
const MARGIN = 60; // margin on all sides

// regular-sized board:
const ROWS = 19;
const COLS = 19;
const SPECIAL = [3, 9, 15]; // intersections to mark

// smaller board:
// const ROWS = 9;
// const COLS = 9;
// const SPECIAL = [2, 6];

canvas.setAttribute('height', `${2 * MARGIN + (ROWS - 1) * SIZE}`);
canvas.setAttribute('width', `${2 * MARGIN + (COLS - 1) * SIZE}`);

function inRange(r, c) {
  return (0 <= r && r < ROWS && 0 <= c && c < COLS);
}

function getPosition(row, col) {
  return [MARGIN + SIZE * col, MARGIN + SIZE * (ROWS - 1 - row)];
}

function getCoordinate(mouseX, mouseY) {
  let x = mouseX + RADIUS - MARGIN - 7;
  let y = mouseY + RADIUS - MARGIN - 7;
  let col = Math.floor(x / SIZE);
  let row = ROWS - 1 - Math.floor(y / SIZE);
  if (!inRange(row, col)) {
    return [-1, -1];
  }
  return [row, col];
}

function drawBoard(rows, cols) {
  ctx.fillStyle = '#000000';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#000000'; // black for board lines
  for (let i = 0; i < rows; i++) {
    // horizontal
    let p = getPosition(i, 0);
    let q = getPosition(i, cols - 1);
    line(p[0], p[1], q[0], q[1]);
    ctx.fillText(`${i + 1}`, p[0] - 40, p[1] + 5);
    ctx.fillText(`${i + 1}`, q[0] + 40, q[1] + 5);
  }
  for (let i = 0; i < cols; i++) {
    // vertical
    let p = getPosition(0, i);
    let q = getPosition(rows - 1, i);
    line(p[0], p[1], q[0], q[1]);
    ctx.fillText(`${i + 1}`, p[0], p[1] + 45);
    ctx.fillText(`${i + 1}`, q[0], q[1] - 30);
  }
  for (let r of SPECIAL) {
    for (let c of SPECIAL) {
      let p = getPosition(r, c);
      circle(p[0], p[1], 6);
      ctx.fill();
    }
  }
}

function drawStone(row, col, player) {
  let p = getPosition(row, col);
  circle(p[0], p[1], RADIUS);
  ctx.fillStyle = STONE_COLOR[player];
  ctx.fill();
}

function drawGhost(row, col, player) {
  let p = getPosition(row, col);
  circle(p[0], p[1], RADIUS);
  ctx.fillStyle = GHOST_COLOR[player];
  ctx.fill();
}

function cloneBoard(board) {
  let b = Array(board.length);
  for (let i = 0; i < board.length; i++) {
    b[i] = Array(board[i].length);
    for (let j = 0; j < board[i].length; j++) {
      b[i][j] = board[i][j];
    }
  }
  return b;
}

function equalBoards(a, b) {
  if (a.length != b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i].length != b[i].length) {
      return false;
    }
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] != b[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function updateBoard(ghostRow, ghostCol) {
  ctx.clearRect(0, 0, 700, 700);
  drawBoard(ROWS, COLS);
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (board[i][j] != -1) {
        drawStone(i, j, board[i][j]);
      } else {
        if (i == ghostRow && j == ghostCol) {
          drawGhost(i, j, toMove);
        }
      }
    }
  }
  if (lastMove[0] != -1) {
    let p = getPosition(lastMove[0], lastMove[1]);
    ctx.strokeStyle = STONE_COLOR[toMove];
    circle(p[0], p[1], RADIUS * 3 / 5);
  }
}

var board = Array(ROWS);
for (let i = 0; i < ROWS; i++) {
  board[i] = Array(COLS);
  for (let j = 0; j < COLS; j++) {
    board[i][j] = -1;
  }
}
var lastBoard = cloneBoard(board);

var toMove = 0; // player id of player who is next to move
var lastMove = [-1, -1];

const was = cloneBoard(board);

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
];

/*
The component containing board[sr][sc] is the component for which we are
checking to be captured.
*/
function bfs(board, sr, sc) {
  let player = board[sr][sc];
  if (player == -1) {
    throw new Error('started bfs from an empty square');
    return;
  }
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      was[i][j] = false;
    }
  }
  let que = [[sr, sc]];
  was[sr][sc] = true;
  let air = 0;
  for (let b = 0; b < que.length; b++) {
    let p = que[b];
    for (let d of DIRS) {
      let r = p[0] + d[0];
      let c = p[1] + d[1];
      if (!inRange(r, c) || was[r][c]) {
        continue;
      }
      was[r][c] = true;
      if (board[r][c] == -1) {
        air += 1;
      } else if (board[r][c] == player) {
        que.push([r, c]);
      }
    }
  }
  if (air == 0) {
    for (let p of que) {
      board[p[0]][p[1]] = -1;
    }
    return true; // stones captured
  }
  return false; // no stones were captured
}

function capture(board, row, col) {
  for (let d of DIRS) {
    let r = row + d[0];
    let c = col + d[1];
    if (!inRange(r, c)) {
      continue;
    }
    if (board[r][c] == (board[row][col] ^ 1)) {
      bfs(board, r, c);
    }
  }
}

function move(row, col) {
  if (board[row][col] != -1) {
    return false; // invalid move: square currently contains a stone
  }
  let newBoard = cloneBoard(board);
  newBoard[row][col] = toMove;
  capture(newBoard, row, col);
  if (bfs(newBoard, row, col)) {
    return false; // invalid move: suicidal
  }
  if (equalBoards(lastBoard, newBoard)) {
    return false; // invalid move: Ko rule violation
  }
  // valid move
  // update boards
  lastBoard = cloneBoard(board);
  board = cloneBoard(newBoard);
  // update last move
  lastMove = [row, col];
  log.innerHTML += (toMove == 0 ? 'black' : 'white');
  log.innerHTML += ` placed a stone at (${row + 1}, ${col + 1})<br>`;
  toMove ^= 1;
  updateBoard(-1, -1);
  return true;
}

function loadGame(str) {
  for (let m of str.split('\n')) {
    if (m.length == 0) {
      continue;
    }
    m = m.split(' ');
    let player = move[0];
    let row = m[5];
    row = row.substr(1, row.length - 2);
    let col = m[6];
    col = col.substr(0, col.length - 1);
    row--;
    col--;
    // console.log(`(${row}, ${col})`);
    move(row, col);
  }
}

// let str = `
// black placed a stone at (11, 12)
// white placed a stone at (6, 6)
// black placed a stone at (14, 9)
// white placed a stone at (10, 9)
// black placed a stone at (8, 12)
// white placed a stone at (5, 16)
// black placed a stone at (4, 11)
// `;
//
// loadGame(str);
