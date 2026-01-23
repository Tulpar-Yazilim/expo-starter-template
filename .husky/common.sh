#!/bin/sh

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Workaround for Windows 10, Git Bash and Yarn
if command_exists winpty && test -t 1; then
    exec </dev/tty
fi

# Load nvm if exists
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use >/dev/null
fi

# Enable corepack if available
if command -v corepack >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1
fi
