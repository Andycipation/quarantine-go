/*
Server code.
*/

const express = require('express');
const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);

const socket_io = require('socket.io');
const io = socket_io(server);

// assume only 2 players for now
const ids = new Set();

let rooms = 0;

io.on('connection', socket => {
  console.log(`new socket with id ${socket.id}`);
  socket.emit('player_assignment', { playerNumber: ids.size });
  console.log('sent player assignment ' + ids.size);
  ids.add(socket.id);
  socket.join(`room${rooms}`);
  
  socket.on('move', data => {
    // console.log(data);
    socket.broadcast.emit('opponent_moved', data);
  });

  socket.on('command', data => {
    // console.log('got a command');
    // console.log(data);
    data = data.trim().substring(1);
    let command = data.split(' ')[0];
    console.log(`command: ${command}`);
  });
  
  socket.on('disconnect', () => {
    console.log('socket id ' + socket.id + ' disconnected');
    ids.delete(socket.id);
  });
});



console.log('server is up and running')