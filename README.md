sully
=====

A server running in Docker that tests your code and watches for changes.

# Building the Docker Image

The Dockerfile is in a subdirectory so that `.dockerignore` doesn't get stupid. To build you'd do something like this:

```shell
docker build ./src -t markbirbeck/sully
```
