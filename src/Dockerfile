FROM node:8

LABEL maintainer="mark.birbeck@gmail.com"

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

# Basic behaviour is to run Mocha:
#
ENTRYPOINT ["mocha"]

# Unless overridden, the default parameters will:
#
#  --inspect      Enable Node inspector
#  --reporter min Minimal reporting output
#  --resursive    Run any tests found in the main directory and subdirectories
#  --watch        Watch for file changes
#
CMD ["--inspect", "--watch", "--recursive", "--reporter", "min"]
