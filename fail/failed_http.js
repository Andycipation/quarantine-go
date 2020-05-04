/*
For connecting to a server.
*/

const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const PORT = 8000;

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const scriptFile = fs.readFileSync('script.js');
const boardFile = fs.readFileSync('board.js');
const favicon = fs.readFileSync('favicon.ico');

const requestListener = function(req, res) {
  console.log(req.url);
  switch (req.url) {
    case '/':
      res.writeHead(200, 'utf8');
      res.end(fs.readFileSync('index.html'));
      break;
    case '/style.css':
      res.writeHead(200, { 'content-type': 'text/css' }, 'utf8');
      res.end(css);
      break;
    case '/script.js':
      res.writeHead(200, { 'content-type': 'text/js' }, 'utf8');
      res.end(scriptFile);
      break;
    case '/board.js':
      res.writeHead(200, { 'content-type': 'text/js' }, 'utf8');
      res.end(boardFile);
      break;
    case '/favicon.ico':
      res.writeHead(200, { 'content-type': 'image/ico' }, 'utf8');
      res.end(favicon);
      break;
    default:
      console.warn('unknown request: ' + req.url);
  }
}

const server = http.createServer(requestListener);

server.listen(PORT);

const options = {
  host: '192.168.2.16',
  port: 8000,
  path: '/index.html?'
};

const req = http.request();
