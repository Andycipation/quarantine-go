# quarantine-go
A project I made during the lockdown.

To run the 2-player server version:
1. Ensure Node.js is installed on the host device.
2. Start the server by running `node server.js` (or `nodejs server.js` on Linux) from the command line.
3. Connect to the IP address and port of the host.

As of now, the order of connection determines who is black and who is white.


## TODO

### High priority
- better connection interface, e.g.:
  - don't make the connection order determine who is black/white
  - allow more than two people at a time, e.g. spectators or game rooms
- add end-of-game components
  - allowing a user to pass
  - counting territory; possibly include different types
- track number of stones placed/captured
- chat room; this is also useful for endgame stuff

### Low priority
- better "invalid move" alert, e.g. include the reason the move was invalid
- allow choosing board size from UI, not just by changing code
  - change the canvas size when board size is changed
- play sound, e.g. stone clacking, when a player makes his/her move
- more robust game log
  - save game to file, load game from file
  - game replays
  - show a numbered list on the side
