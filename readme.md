# KR Pano Test

This is a stripped down reproduction of the issue I am running into with krpano 
as described here: https://krpano.com/forum/wbb/index.php?page=Thread&threadID=19347

# setup
- After cloning, run `npm install` to install dependencies.
- run `npm run start` or, if needed, run `npm run start-ssl` if ssl features are required (shouldn't be for this). This will run on localhost port 4000.

# The issue
In 1.21, even though `PanoViewport.krpanoOnReady` is bound, it is never called after `embedpano`,
and no errors are written to the console. When using 1.20.11, this is called successfully. This 
example is meant to illustrate this.

# Project structure
In order to keep the structure as similar as possible to the original, the `test/index.html`
page contains the basic document structure, and the entry point is in `src/init.ts`.

`src/PanoViewport.ts` is the class which contains the krpano objects. The `initialize` method
is what calls `embedpano`.

Note that `vendor/krpano.js` has a line added to the bottom of it to export it as a
module to allow importing into `src/PanoViewer.ts`.

Note that I also included `vendor/krpano-working.js`, which is a 1.20.11 version of the file that works. I left a commented import line at the top of `src/PanoViewer.ts` for easily switching between the two.