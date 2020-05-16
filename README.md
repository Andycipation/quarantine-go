# quarantine-go
A project I made during the lockdown.

To run the 2-player server version, change the IP address in the script.js file to the IP address of the server, and run
`node server.js` (or `nodejs server.js` on Linux?) from the command line to start the server. Then, connect to the IP address in the server file.

As of now, the order of connection determines who is black and who is white.

The stuff in the 'docs' directory is all for the offline version hosted on my GitHub pages, at https://andrewdongandy.github.io/quarantine-go/.

TODO:
- allow a player to pass
- better connection interface, e.g.:
  - don't make connection order determine who is black/white
  - allow more than 2 people at a time
- better "invalid move" alert, e.g. include the reason the move was invalid
- allow choosing board size from UI, not just by changing code
