FROM node:8

LABEL maintainer="mark.birbeck@gmail.com"
LABEL version="0.2.0"

# The Node inspector port needs to be exposed if using that
# feature:
#
EXPOSE 9229

# Create and set the working directory for the unit under test:
#
WORKDIR /usr/src/uut

# Install Mocha, Chai and friends
#
# Note that they are installed globally so that they don't
# interfere with the Node modules directory used for the
# UUT, allowing a volume to be mapped in for that:
#
ENV NODE_PATH /usr/local/lib/node_modules

RUN npm install -g \
  chai \
  chai-http \
  chai-as-promised \
  mocha

COPY index.js /usr/src/sully/index.js

# Basic behaviour is to run Sully:
#
ENTRYPOINT ["node", "/usr/src/sully/index.js"]
