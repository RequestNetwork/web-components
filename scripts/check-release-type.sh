#!/usr/bin/env bash

# This script checks if we need a stable or next release
PACKAGE_VERSION="$(node -p -e "require('./package.json').version")"
PACKAGE_NAME="$(node -p -e "require('./package.json').name")"

# Check if current version exists in npm
FOUND_VERSION=$(npm view $PACKAGE_NAME versions | grep "'$PACKAGE_VERSION'")

if [ -z "$FOUND_VERSION" ]; then
    echo 'stable' # New version in package.json, do stable release
else
    # Check if there are changes since last release
    git diff --quiet HEAD~1 HEAD -- .
    if [ $? -eq 1 ]; then
        echo "next" # Changes detected, do next release
    else
        echo 'none' # No changes, no release needed
    fi
fi
