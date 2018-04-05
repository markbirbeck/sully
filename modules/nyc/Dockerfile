FROM node:8-alpine

LABEL maintainer="mark.birbeck@gmail.com"
LABEL version="0.1.0"

# The Node inspector port needs to be exposed if using that
# feature:
#
EXPOSE 9229

# Create and set the working directory for the unit under test:
#
WORKDIR /usr/src/uut

# Install Mocha, Chai and friends, plus nyc:
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

RUN npm install -g \
  nyc

# Basic behaviour is to run nyc and mocha:
#
ENTRYPOINT ["nyc"]
CMD [ \
  "--all", "--cache", \
  "--", \
  "mocha", "--inspect", "--recursive", "--reporter", "dot" \
]
