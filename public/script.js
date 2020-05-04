/*

*/

const LOCAL_IP = 'localhost';
// const LOCAL_IP = '192.168.2.26'; // Raspberry Pi's IP address
const PORT = 8000;
const socket = io.connect(`http://${LOCAL_IP}:${PORT}`);

var clientTurn = false;

canvas.onmousemove = function(e) {
  if (!clientTurn) {
    return;
  }
  let p = getCoordinate(e.x, e.y);
  if (p[0] == -1) {
    return;
  }
  updateBoard(p[0], p[1]);
}

canvas.onclick = function(e) {
  if (!clientTurn) {
    return;
  }
  let p = getCoordinate(e.x, e.y);
  if (p[0] == -1) {
    return;
  }
  move(p[0], p[1]);
  socket.emit('move', { row: p[0], col: p[1] });
  clientTurn = false;
}

socket.on('player_assignment', data => {
  console.log('player assignment data: ');
  console.log(data);
  clientTurn = (data.playerNumber == 0);
});

socket.on('opponent_moved', data => {
  console.log('opponent move message received;');
  console.log(data);
  move(data.row, data.col);
  clientTurn = true;
});

updateBoard();
