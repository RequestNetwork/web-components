#!/usr/bin/env bash

# This script checks if the current version of the package is already published on npm
PACKAGE_VERSION="$(node -p -e "require('./package.json').version")"
PACKAGE_NAME="$(node -p -e "require('./package.json').name")"

FOUND_VERSION=$(npm view $PACKAGE_NAME versions | grep $PACKAGE_VERSION)

echo "Checking if $PACKAGE_NAME@$PACKAGE_VERSION is already published..."

if [ -z "$FOUND_VERSION" ]; then
    exit 1
else
    exit 0
fi
