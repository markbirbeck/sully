FROM node:8-alpine

LABEL maintainer="mark.birbeck@gmail.com"
LABEL version="0.1.0"

# Create and set the working directory for the unit under test:
#
WORKDIR /usr/src/uut

# Install StandardJS:
#
# Note that modules are installed globally so that they don't
# interfere with the Node modules directory used for the
# UUT, allowing a volume to be mapped in for that:
#
ENV NODE_PATH /usr/local/lib/node_modules

RUN npm install -g \
  standard

# Basic behaviour is to run standardjs:
#
ENTRYPOINT ["standard"]
CMD ["--env", "mocha"]
