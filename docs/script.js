canvas.onmousemove = function(e) {
  let p = getCoordinate(e.x, e.y);
  if (p[0] == -1) {
    return;
  }
  updateBoard(p[0], p[1]);
}

canvas.onclick = function(e) {
  let p = getCoordinate(e.x, e.y);
  if (p[0] == -1) {
    return;
  }
  move(p[0], p[1]);
}

updateBoard();
