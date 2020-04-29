// const txtRow = document.getElementById('row-input');
// const txtCol = document.getElementById('col-input');
//
// const ID_ENTER = 13;
//
// function submit(e) {
//   if (e.charCode == ID_ENTER) {
//     if (txtRow.value.length == 0 || txtCol.value.length == 0) {
//       return;
//     }
//     addMove(txtRow.value, txtCol.value);
//   }
// }

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
