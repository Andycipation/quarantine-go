/*
Handles the board logic.
*/

const canvas = document.getElementById('board');
const log = document.getElementById('game-log');
const ctx = canvas.getContext('2d');

const STONE_COLOR = ['#000000', '#ffffff'];
const GHOST_COLOR = ['#383838', '#e8e8e8'];

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


const SIZE = 32;
const RADIUS = SIZE / 2;
const MARGIN = 60;

// regular-sized board:
const ROWS = 19;
const COLS = 19;
const SPECIAL = [3, 9, 15]; // intersections to mark

// smaller board:
// const ROWS = 9;
// const COLS = 9;
// const SPECIAL = [2, 6];

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
  ctx.strokeStyle = '#000000'; // black for board color
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
    ctx.fillText(`${i + 1}`, p[0], p[1] + 50);
    ctx.fillText(`${i + 1}`, q[0], q[1] - 30);
  }
  for (let r of SPECIAL) {
    for (let c of SPECIAL) {
      let p = getPosition(r, c);
      ellipse(p[0], p[1], 6, 6);
      ctx.fillStyle = '#000000';
      ctx.fill();
    }
  }
}

function drawStone(row, col, color) {
  let p = getPosition(row, col);
  ellipse(p[0], p[1], RADIUS, RADIUS);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

function placeStone(row, col, player) {
  if (player == -1) {
    return;
  }
  drawStone(row, col, STONE_COLOR[player]);
}

function showGhost(row, col) {
  drawStone(row, col, GHOST_COLOR[toMove]);
}

const board = [];
for (let i = 0; i < ROWS; i++) {
  const row = [];
  for (let j = 0; j < COLS; j++) {
    row.push(-1);
  }
  board.push(row);
}

var toMove = 0;
var lastMove = [-1, -1];
const moves = [];

function updateBoard(ghostRow, ghostCol) {
  ctx.clearRect(0, 0, 700, 700);
  drawBoard(ROWS, COLS);
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (i == ghostRow && j == ghostCol && board[i][j] == -1) {
        showGhost(i, j);
      } else {
        placeStone(i, j, board[i][j]);
      }
    }
  }
  if (lastMove[0] != -1) {
    let p = getPosition(lastMove[0], lastMove[1]);
    ctx.strokeStyle = STONE_COLOR[toMove];
    ellipse(p[0], p[1], RADIUS * 3 / 5, RADIUS * 3 / 5);
  }
}

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
];

function bfs(sr, sc, player) {
  if (board[sr][sc] != player) {
    return;
  }
  let was = [];
  for (let i = 0; i < ROWS; i++) {
    let row = [];
    for (let j = 0; j < COLS; j++) {
      row.push(false);
    }
    was.push(row);
  }
  let q = [
    [sr, sc]
  ];
  let ptr = 0;
  let air = 0;
  while (ptr < q.length) {
    let p = q[ptr++];
    for (let d of DIRS) {
      let r = p[0] + d[0];
      let c = p[1] + d[1];
      if (!inRange(r, c) || was[r][c]) {
        continue;
      }
      was[r][c] = true;
      if (board[r][c] == -1) {
        air++;
      } else if (board[r][c] == player) {
        q.push([r, c]);
      }
    }
  }
  if (air == 0) {
    for (let p of q) {
      board[p[0]][p[1]] = -1;
    }
  }
}

function capture(row, col) {
  for (let d of DIRS) {
    let r = row + d[0];
    let c = col + d[1];
    if (inRange(r, c)) {
      bfs(r, c, board[row][col] ^ 1);
    }
  }
}

function move(row, col) {
  if (board[row][col] != -1) {
    return false;
  }
  log.innerHTML += (toMove == 0 ? 'black' : 'white');
  log.innerHTML += ` placed a stone at (${row + 1}, ${col + 1})<br>`;
  lastMove = [row, col];
  board[row][col] = toMove;
  moves.push([row, col]);
  capture(row, col);
  bfs(row, col, board[row][col]);
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

// exports.move = move;
