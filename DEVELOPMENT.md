# Working the yosonJS library
1. Fork it
1. Clone it ( `https://github.com/yosonjs/yosonjs.git` )
1. Go to directory ( `cd yosonjs` )
1. Install the npm packages ( `npm install` )
1. Run grunt in terminal(`grunt`)

### Directory Structure
the library have the next structure:
* `src/` have the sources of yOSON
    * `comps/` have the components of yOSON
    * `core.js` the core of yOSON
    * `yoson.js` have only by now the namespace
* `test/` have the specs of testing of yOSON components
    * `helper/` have the helpers of the specs
    * `scripts/` have the aditional scripts for testing with the components
    * `spec/` have the specs of testing of yOSON components and core
* `dist/` its the version joined of components and core of yosonjs generated when all its passed and tested successfully

### Running Specs
The Specs of yOSON by now running only in the terminal

1. Run grunt in terminal(`grunt`)

### Generate the minified version
Needs pass the hint validation and all specs

1. Run grunt in terminal(`grunt`)
