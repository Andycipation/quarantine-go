/*
The client-side logic.
*/


function setupClient() {

const socket = io(); // imported from the .html file
// is there a better way to do this, e.g. using socket.io-client?


let clientTurn = false;
socket.on('player_assignment', data => {
  console.log('player assignment data: ');
  console.log(data);
  clientTurn = (data.playerNumber == 0);
});

socket.on('opponent_moved', data => {
  console.log('opponent move message received');
  console.log(data);
  move(data.row, data.col);
  clientTurn = true;
});

canvas.addEventListener('mousemove', e => {
  if (!clientTurn) {
    return;
  }
  let p = getCoordinate(e.pageX, e.pageY);
  updateBoard(p[0], p[1]); // if p is [-1, -1] then no ghost will show
});

canvas.addEventListener('click', e => {
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
});


const form = document.getElementById('form-chat');
const input = document.getElementById('input');

form.addEventListener('submit', e => {
  console.log('submitted');
  e.preventDefault();
  if (input.value.length > 0) {
    socket.emit('command', input.value);
    input.value = '';
  }
});
  
} // end setupClient


function setupOffline() {

canvas.addEventListener('mousemove', e => {
  let p = getCoordinate(e.pageX, e.pageY);
  updateBoard(p[0], p[1]); // if p is [-1, -1] then no ghost will show
});

canvas.addEventListener('click', e => {
  let p = getCoordinate(e.pageX, e.pageY);
  if (p[0] == -1) {
    return;
  }
  if (!move(p[0], p[1])) { // invalid move
    alert('Invalid move!');
  }
});

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
