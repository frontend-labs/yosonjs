# Working with the yosonJS library
1. Fork it
1. Clone it ( `https://github.com/yosonjs/yosonjs.git` )
1. Go to the directory ( `cd yosonjs` )
1. Install the npm packages ( `npm install` )
1. Run grunt in terminal(`grunt`)

# If `grunt` its not found:
Execute in terminal this command:
* ~ sudo npm install -g grunt-cli

### Directory Structure
the library has the following structure:
* `src/` has the sources of yOSON
    * `comps/` has the yOSON components
    * `core.js` the core of yOSON
    * `yoson.js` at the moment it only has its namespace
* `test/` has the specs of testing of yOSON components
    * `helper/` has the specs helpers
    * `scripts/` has the aditional scripts for testing with the components
    * `spec/` has the testing specs of yOSON components and the core
* `dist/` is the unified version of components and core of yosonjs generated when all has been passed and tested successfully

### Running Specs
The Specs of yOSON running only in the terminal (at the moment)

1. Go to the directory ( `cd yosonjs` )
1. Run grunt in terminal (`grunt`)

### Generate the minified version
It needs to pass the hint validation and all the specs

1. Go to the directory ( `cd yosonjs` )
1. Run grunt in terminal (`grunt`)
