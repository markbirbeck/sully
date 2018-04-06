sully
=====

A server to monitor a Node project and test, lint and check code coverage on file changes.

# Using Sully

The easiest way to launch Sully is to use the `makefile`, and then run:

```shell
make run UUT=${PWD}/../myproject
```

The `UUT` variable needs to point to the directory containing your project.

A Docker container will be launched containing a `blessed` session, which in turn contains three windows. The master process is watching for file changes in the directory that begins wherever `UUT` refers to. If any files change then each of the Docker containers referred to in the three windows is re-run.

To shut the top-level container down use `[Esc]`, '`q`' or `[Ctrl]+C`.

# Building the Docker Images

The Dockerfiles are in a subdirectory so that `.dockerignore` doesn't get stupid. Each of the Docker images can be built by way of the `makefile`:

```shell
make build-nyc
make build-repolinter
make build-standardjs
make build-sully
```

To build all of the images in one go, do:

```shell
make build
```
