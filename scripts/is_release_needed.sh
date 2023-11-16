#!/usr/bin/env bash

# This script checks if a new release is needed.
PACKAGE_VERSION="$(node -p -e "require('./package.json').version")"
PACKAGE_NAME="$(node -p -e "require('./package.json').name")"

FOUND_VERSION=$(npm view $PACKAGE_NAME versions | grep \'$PACKAGE_VERSION\')

if $FOUND_VERSION
then
    IS_NEW_VERSION=true
fi

echo "is-release-needed=$(echo $IS_NEW_VERSION)"