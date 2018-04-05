const fs = require('fs');

/**
 * First check that we can reach Docker:
 */

const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const stats  = fs.statSync(socket);

console.log('sully: Checking Docker status');
if (!stats.isSocket()) {
  throw new Error('Are you sure the docker is running?');
}
console.log('sully: Docker is available');

/**
 * Set up a connection to Docker via the API, and then launch the
 * harness container:
 */

const docker = new require('dockerode')({
  socketPath: socket
});

const run = (image, cmd, options) => {
  return docker.run(image, cmd, process.stdout, options)
  .then(container => {
    console.log(container.output.StatusCode)
    return container.remove()
  })
  .then(data => {
    console.log('container removed')
  })
  .catch(err => {
    console.log(err)
  })
}

/**
 * These are JS-related tasks. At some point we'll detect that the project is a
 * JS project and run these. We'll also detect that there is no .eslint file so
 * we'll run StandardJS:
 */

const uut = process.argv[2] || process.env['UUT'];
const options = {
  Binds: [`${uut}:/usr/src/uut`]
}

run('markbirbeck/repolinter', [], options)
run('markbirbeck/standardjs', [], options)
run('markbirbeck/nyc', [], options)
