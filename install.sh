#!/bin/bash

# Get the current user's home directory
HOME_DIR=$(eval echo ~$USER)

# Check if the file already exists in the home directory
if [ -f "$HOME_DIR/skipped-tests-finder.js" ]; then
    echo "Error: skipped-tests-finder.js already exists in your home directory."
    exit 1
fi

# Copy the script into the user's home directory
cp skipped-tests-finder.js "$HOME_DIR/"

# Check if the copy operation was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to copy skipped-tests-finder.js to your home directory."
    exit 1
fi

echo "skipped-tests-finder has been installed in $HOME_DIR (your home directory)"
echo "To run skipped-tests-finder, go to your home directory (\"cd\"), and run the command \"node skipped-tests-finder.js\""