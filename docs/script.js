/*

*/

// const LOCAL_IP = 'localhost';
const LOCAL_IP = '192.168.2.26'; // Raspberry Pi's IP address
const PORT = 8000;


function setupClient() {

const socket = io.connect(`http://${LOCAL_IP}:${PORT}`);

let clientTurn = false;
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

canvas.onmousemove = function(e) {
  if (!clientTurn) {
    return;
  }
  let p = getCoordinate(e.x, e.y);
  updateBoard(p[0], p[1]); // if p is [-1, -1] then no ghost will show
}

canvas.onclick = function(e) {
  if (!clientTurn) {
    return;
  }
  let p = getCoordinate(e.x, e.y);
  if (p[0] == -1) {
    return;
  }
  if (!move(p[0], p[1])) { // invalid move
    alert('Invalid move!');
    return;
  }
  socket.emit('move', { row: p[0], col: p[1] });
  clientTurn = false;
}
  
} // end setupClient


function setupOffline() {

canvas.onmousemove = function(e) {
  let p = getCoordinate(e.x, e.y);
  updateBoard(p[0], p[1]); // if p is [-1, -1] then no ghost will show
}

canvas.onclick = function(e) {
  let p = getCoordinate(e.x, e.y);
  if (p[0] == -1) {
    return;
  }
  if (!move(p[0], p[1])) { // invalid move
    alert('Invalid move!');
  }
}

} // end setupOffline


try {
  setupClient();
} catch (err) { // offline version
  console.log(err);
  if (err instanceof ReferenceError) {
    setupOffline();
  } else {
    throw err;
  }
}

updateBoard(-1, -1);
