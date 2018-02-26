const fs = require('fs');
const { spawn } = require('child_process');

/**
 * This script runs tasks under the following conditions:
 *
 *  1. if a source or test file changes then start a timer;
 *  2. if further file changes happen then reset the timer;
 *  3. once the timer expires (i.e., we have gone a certain
 *     amount of time since the last file change) then run
 *     the task and set a flag to say that the task is running;
 *  4. if any further changes happen whilst the task is running then
 *     reset the timer; we don't want to run the task again until this
 *     run is finished but we do want to keep checking whether
 *     the task is still running.
 */

class RunTask {
  constructor(command, args) {
    this.command = command;
    this.args = args;
    this.runInProgress = false;
    this.timeout = null;
  }

  fileChange() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.run.bind(this), 100);
  }

  run() {

    /**
     * If we're already running then wait for a bit before running
     * again:
     */

    if (this.runInProgress) {
      this.timeout = setTimeout(this.run.bind(this), 500);
      return;
    }

    /**
     * Reset the timer variable and indicate that a run is in progress:
     */

    this.timeout = null;
    this.runInProgress = true;

    /**
     *
     * Run the task:
     */

    const task = spawn(this.command, this.args, { stdio: 'inherit' });

    /**
     * Once the run has finished we can reset the 'in progress' flag:
     */

    task.on('exit', (code) => {
      this.runInProgress = false;
    });
  }
}


/**
 * Run Mocha once on first run, and then wait for file changes:
 */

class RunMocha extends RunTask {
  constructor() {
    super('mocha', [
      '--inspect',         // Enable Node inspector
      '--recursive',       // Run any tests found in the main directory and subdirectories
      '--reporter', 'min'  // Minimal reporting output
    ]);
  }
}

const mocha = new RunMocha();
mocha.run();

/**
 * Monitor both the source and the test directories:
 */

['/usr/src/uut', '/usr/src/uut/test']
.forEach(filename => {
  fs.watch(
    filename,
    { encoding: 'buffer' },
    (eventType, filename) => {
      mocha.fileChange();
    }
  );
});

process.on('SIGINT', () => {
  process.exit();
});
