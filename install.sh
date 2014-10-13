#!/usr/bin/env bash
#
#Script to create a instance of development
# - install required node packages
# - install git hooks

node= which node 2>&1
if [ $? -ne 0 ]; then
    echo "Please install nodeJS."
    echo "You can be found in http://nodejs.org/"
    exit 1
fi

npm= which npm 2>&1
if [ $? -ne 0 ]; then
    echo "Please install the NPM (Node Packaged Modules)"
fi

echo "Installing required npm packages..."
npm install

echo "Installing git hooks..."
ln -sf validate-commit-msg.js .git/hooks/commit-msg
