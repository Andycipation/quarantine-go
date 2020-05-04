const socket = new WebSocket('ws://localhost:8000');

socket.onopen = function(e) {
  console.log('connection established');
}
