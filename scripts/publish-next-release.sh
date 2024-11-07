#!/usr/bin/env bash

PACKAGE_VERSION="$(node -p -e "require('./package.json').version")"
PACKAGE_NAME="$(node -p -e "require('./package.json').name")"

# Increment patch version
PATCH_VERSION=$(echo $PACKAGE_VERSION | awk -F. '{print $3}')
NEW_PATCH=$((PATCH_VERSION + 1))
BASE_VERSION=$(echo $PACKAGE_VERSION | awk -F. '{print $1"."$2".'$NEW_PATCH'"}')

# Get latest next version number
LATEST_NEXT=$(npm view $PACKAGE_NAME dist-tags.next)

if [ -z "$LATEST_NEXT" ]; then
    # No next version exists, start at 1
    NEXT_NUMBER=1
else
    # Extract and increment the next number
    CURRENT_NEXT_NUMBER=$(echo $LATEST_NEXT | grep -oE '[0-9]+$')
    NEXT_NUMBER=$((CURRENT_NEXT_NUMBER + 1))
fi

# Update package.json with next version
npm version "${BASE_VERSION}-next.${NEXT_NUMBER}" --no-git-tag-version

# Publish with next tag
npm publish --tag next
