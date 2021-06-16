# [Rummikub](https://rummi.uk) online multiplayer game

Implementation of [Rummikub](https://en.wikipedia.org/wiki/Rummikub) game variation. 
Was built using React + bunch of libraries "just for fun". First attempt on this technology, 
so the code is a little bit messy, hope to refactor someday :)

Some differences from original rules:
1. Tile with value "1" could be placed after "13" in a run (but not "2" after "1" in this case)
2. After first move ("initial meld") is done, player should pick two tile instead of one 
   (in case if he forced/wants to skip his turn)
   

### Known limitations:
- Turn timeout handled on client-side, so there is a way to bypass it
