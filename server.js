/*
Server code.
*/

const express = require('express');
const app = express();
app.use(express.static('docs'));

// app.get('*', (req, res) => {
//   res.redirect('https://andrewdongandy.github.io/quarantine-go/');
// });

const PORT = 8000;
const server = app.listen(PORT);

const socket_io = require('socket.io');
const io = socket_io(server);

// assume only 2 players for now
const ids = new Set();

io.on('connect', socket => {
  console.log('new socket with id ' + socket.id);
  socket.emit('player_assignment', { playerNumber: ids.size });
  console.log('sent player assignment ' + ids.size);
  ids.add(socket.id);
  
  socket.on('move', data => {
    // console.log(data);
    socket.broadcast.emit('opponent_moved', data);
  });
  
  socket.on('disconnect', () => {
    console.log('socket id ' + socket.id + ' disconnected');
    ids.delete(socket.id);
  })
});
