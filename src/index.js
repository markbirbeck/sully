const fs = require('fs')

/**
 * First check that we can reach Docker:
 */

const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock'
const stats  = fs.statSync(socket)

console.log('sully: Checking Docker status')
if (!stats.isSocket()) {
  throw new Error('Are you sure that docker is running?')
}
console.log('sully: Docker is available')

/**
 * Set up a connection to Docker via the API, and then launch the
 * harness container:
 */

const docker = new require('dockerode')({
  socketPath: socket
})

/**
 * Set up a writable stream that sends output to a blessed box:
 */

const stream = require('stream')

class BlessedStream extends stream.Writable {
  constructor(logger, screen) {
    super()
    this.logger = logger
    this.screen = screen

    /**
     * Clear the display before each run:
     */

    this.logger.setContent('', true)
    this.screen.render()
  }

 _write(chunk, encoding, done) {
    const str = chunk.toString()

    /**
     * The only way I've been able to get this to work is to append
     * the new input to the end of the current output and then rewrite
     * the whole thing. Anything else (such as pushLine()) gives too many
     * empty lines:
     */

    this.logger.setContent(this.logger.getContent() + str, true)
    this.screen.render()
    done(null)
  }
}

const RunTask = require('./RunTask')

class RunDockerTask extends RunTask {
  constructor(image, cmd, options, log, screen) {
    super(cmd)

    this.image = image
    this.log = log
    this.options = options
    this.screen = screen
  }

  _run(cmd, args) {

    /**
     * When running the Docker command direct the output to a BlessedStream:
     */

    const stream = new BlessedStream(this.log, this.screen)

    return docker.run(this.image, cmd, stream, this.options)
    .then(container => {
      return container.remove()
    })
    .catch(err => {
      console.error(err)
    })
  }
}

/**
 * Create the usual blessed and screen:
 */

const blessed = require('blessed')
const screen = blessed.screen()

const titlebar = blessed.box({
  top: 0,
  left: 0,
  height: '10%',
  width: '100%',
  border: {
    type: 'line',
    fg: 'cyan'
  }
})

const repolinter = blessed.box({
  top: '10%',
  left: 0,
  height: '30%',
  width: '100%',
  keys: true,
  mouse: true,
  alwaysScroll: true,
  scrollable: true,
  border: {
    type: 'line',
    fg: 'cyan'
  },
  scrollbar: {
    ch: ' ',
    bg: 'blue'
  }
})

const standardjs = blessed.box({
  top: '40%',
  left: 0,
  height: '30%',
  width: '100%',
  keys: true,
  mouse: true,
  alwaysScroll: true,
  scrollable: true,
  border: {
    type: 'line',
    fg: 'cyan'
  },
  scrollbar: {
    ch: ' ',
    bg: 'blue'
  }
})

const nyc = blessed.box({
  top: '70%',
  left: 0,
  height: '30%',
  width: '100%',
  keys: true,
  mouse: true,
  alwaysScroll: true,
  scrollable: true,
  border: {
    type: 'line',
    fg: 'cyan'
  },
  scrollbar: {
    ch: ' ',
    bg: 'blue'
  }
})

screen.append(titlebar)
screen.append(repolinter)
screen.append(standardjs)
screen.append(nyc)

screen.render()

/**
 * Allow [ESQ], 'q' or [CTRL]+C to exit:
 */

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
 return process.exit(0)
})

/**
 * These are JS-related tasks. At some point we'll detect that the project is a
 * JS project and run these. We'll also detect that there is no .eslint file so
 * we'll run StandardJS:
 */

const uut = process.argv[2] || process.env['UUT']
const options = {
  Binds: [`${uut}:/usr/src/uut`]
}

titlebar.setContent(`sully has your back at: ${uut}`)
screen.render()

const repolinterTask = new RunDockerTask('markbirbeck/repolinter', [], options, repolinter, screen)
repolinterTask.invokeRun()
const standardjsTask = new RunDockerTask('markbirbeck/standardjs', [], options, standardjs, screen)
standardjsTask.invokeRun()
const nycTask = new RunDockerTask('markbirbeck/nyc', [], options, nyc, screen)
nycTask.invokeRun()

/**
 * Note that we use chokidar because we want to limit the file range. This
 * is because some of the tools (such as nyc) write files out which gets us
 * locked in a loop. If we use normal fs.watch() with globber then we will
 * have to exclude files ourselves, and we won't see new files that are
 * added.
 */

const chokidar = require('chokidar')

/**
 * Monitor both the source and the test directories:
 */

const watcher = chokidar.watch(
  ['/usr/src/uut/', '/usr/src/uut/test/'],
  { ignored: '/usr/src/uut/.nyc_output/' }
)

watcher.on('change', path => {
  [repolinterTask, standardjsTask, nycTask]
  .forEach(taskRunner => {
    taskRunner.invokeRun()
  })
})
