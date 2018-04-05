sully
=====

A server to monitor a Node project and test, lint and check code coverage on file changes.

# Using Sully

To launch Sully issue the following command:

```shell
docker run --rm -it -v ${PWD}:/usr/src/uut markbirbeck/sully
```

A Docker container will be launched containing a tmux session, which in turn contains two windows. Each window has a process that is watching for file changes. One will run `mocha` when files change, and the other will run `StandardJS`.

You can interact with the session using normal tmux commands, for example rearranging the windows.

To shut the container down use the tmux command to kill the session, which involves the following:

1. Enter the tmux command prompt with `Ctrl + B` followed by `:`;
2. Type the command `kill-session` followed by `[Enter]`.

# Building the Docker Images

The Dockerfiles are in a subdirectory so that `.dockerignore` doesn't get stupid. Each of the Docker images can be built by way of the `makefile`:

```shell
make build-nyc
make build-standardjs
make build-sully
```

To build all of the images in one go, do:

```shell
make build
```
