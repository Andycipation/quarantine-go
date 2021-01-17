/*
The client-side logic.
*/


function setupClient() {

// const io = require('socket.io-client');
const socket = io(); // imported from the .html file
// is there a better way to do this, e.g. using socket.io-client?

// // const LOCAL_IP = '192.168.2.26'; // Raspberry Pi's IP address
// const LOCAL_IP = 'localhost';
// const PORT = 3000;
// const LINK = `http://${LOCAL_IP}:${PORT}`;

// // const LINK = 'https://quarantine-go.herokuapp.com/';
// // const PORT = process.env.PORT || 3000;
// const socket = io.connect(LINK);

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
  let p = getCoordinate(e.pageX, e.pageY);
  updateBoard(p[0], p[1]); // if p is [-1, -1] then no ghost will show
}

canvas.onclick = function(e) {
  if (!clientTurn) {
    return;
  }
  let p = getCoordinate(e.pageX, e.pageY);
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
  let p = getCoordinate(e.pageX, e.pageY);
  updateBoard(p[0], p[1]); // if p is [-1, -1] then no ghost will show
}

canvas.onclick = function(e) {
  let p = getCoordinate(e.pageX, e.pageY);
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
  console.log('setting up client');
} catch (err) { // offline version
  console.log(err);
  if (err instanceof ReferenceError) {
    setupOffline();
    console.log('setting up offline version');
  } else {
    throw err;
  }
}

updateBoard(-1, -1);
// alert('end of script.js');
