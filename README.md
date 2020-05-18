# quarantine-go
A project I made during the lockdown.

To run the 2-player server version:
1. Change the IP address in the script.js file to the IP address of the server, and change the port if desired.
2. Ensure Node.js is installed on the host device.
3. Start the server by running `node server.js` (or `nodejs server.js` on Linux) from the command line.
4. Connect to the IP address and port configured in step 1.

As of now, the order of connection determines who is black and who is white.

The 'docs' directory has all of the client files for the game. It is named so because that is the only (is it?) option to host the page, other than hosting from the root of the repository.


## TODO

### Highest priority
**Host this on Heroku!**

This isn't as fun as programming the game elements, but it's definitely has a big long-term benefit.

### High priority
- better connection interface, e.g.:
  - don't make the connection order determine who is black/white
  - allow more than two people at a time, e.g. spectators or game rooms
- add end-of-game components
  - allowing a user to pass
  - counting territory; possibly include different types
- track number of stones placed/captured

### Low priority
- better "invalid move" alert, e.g. include the reason the move was invalid
- allow choosing board size from UI, not just by changing code
  - change the canvas size when board size is changed
- play sound, e.g. stone clacking, when a player makes his/her move
- more robust game log
  - save game to file, load game from file
  - game replays
- add 
