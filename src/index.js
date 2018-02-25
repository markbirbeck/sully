const { spawn } = require('child_process');

/**
 *
 * Run Mocha:
 */

const runMocha = () => {
  spawn('mocha', [
      '--inspect',         // Enable Node inspector
      '--recursive',       // Run any tests found in the main directory and subdirectories
      '--reporter', 'min', // Minimal reporting output
      '--watch'            // Watch for file changes
    ],
    { stdio: 'inherit' }
  );
};


/**
 * Run Mocha once on first run:
 */

runMocha();
