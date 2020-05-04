/*
Server code.
*/

const express = require('express');
const app = express();
app.use(express.static('public'));

const PORT = 8000;
const server = app.listen(PORT);

const socket_io = require('socket.io');
const io = socket_io(server);

const ids = [];

io.on('connect', socket => {
  console.log('new socket with id ' + socket.id);
  socket.emit('player_assignment', { playerNumber: ids.length });
  ids.push(socket.id);
  
  socket.on('move', data => {
    // console.log(data);
    socket.broadcast.emit('opponent_moved', data);
  });
  
  socket.on('disconnect', () => {
    console.log('socket id ' + socket.id + ' disconnected');
  })
});
