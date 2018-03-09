FROM node:8-alpine

LABEL maintainer="mark.birbeck@gmail.com"
LABEL version="0.3.0"

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

# Install StandardJS for linting:
#
RUN npm install -g \
  standard

# Install istanbul for code coverage:
#
RUN npm install -g \
  istanbul \
  nyc

# Install tmux and Nodemon as the runtime environment:
#
ENV TERM=xterm-256color

RUN apk add --update --no-cache \
  tmux

RUN npm install -g \
  nodemon

# Basic behaviour is to run Sully:
#
ENTRYPOINT ["tmux"]

CMD [ \
  "set-option", "-g", "remain-on-exit", "on", \
    ";", \
  "new-session", \
    ";", \
  "send-keys", \
    "nodemon ", \
      "-q ", \
      "--watch ", ". ", \
      "--watch ", "test ", \
      "--exec ", "'nyc --all --cache -- mocha --inspect --recursive --reporter min || true'", \
    "C-m", \
    ";", \
  "split-window", \
    "-v", \
    ";", \
  "send-keys", \
    "nodemon ", \
      "-q ", \
      "--watch ", ". ", \
      "--watch ", "test ", \
      "--exec ", "'clear && standard --env mocha || true'", \
    "C-m" \
]
