#!/usr/bin/env bash

# This script takes the package directory as an argument
PACKAGE_DIR=$1

# Change to the specific package directory
cd $PACKAGE_DIR

# Check if the current version of the package is already published on npm
PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")

echo "Checking if $PACKAGE_NAME@$PACKAGE_VERSION is already published..."

FOUND_VERSION=$(npm view $PACKAGE_NAME versions --json | grep -o "\"$PACKAGE_VERSION\"")

if [ -z "$FOUND_VERSION" ]; then
    IS_NEW_VERSION=true
else
    IS_NEW_VERSION=false
fi

echo "is-release-needed=$IS_NEW_VERSION" >> $GITHUB_OUTPUT