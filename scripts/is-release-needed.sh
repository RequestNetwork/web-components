#!/usr/bin/env bash

# This script checks if the current version of the package is already published on npm
PACKAGE_VERSION="$(node -p -e "require('./package.json').version")"
PACKAGE_NAME="$(node -p -e "require('./package.json').name")"

FOUND_VERSION=$(npm view $PACKAGE_NAME versions --json | grep -o "\"$PACKAGE_VERSION\"")

if [ -z "$FOUND_VERSION" ]; then
    IS_NEW_VERSION=true
else
    IS_NEW_VERSION=false
fi

echo "is-release-needed=$IS_NEW_VERSION" >> $GITHUB_ENV

