#!/bin/bash

# Make script executable
chmod +x bin/skipped-tests-finder

# Remove existing symbolic link if it exists
if [ -L "/usr/local/bin/skipped-tests-finder" ] || [ -f "/usr/local/bin/skipped-tests-finder" ]; then
    echo "Removing existing installation..."
    sudo rm "/usr/local/bin/skipped-tests-finder"
fi

# Create symbolic link in /usr/local/bin
echo "Creating symbolic link in /usr/local/bin (requires sudo access)..."
sudo ln -s "$(pwd)/bin/skipped-tests-finder" /usr/local/bin/skipped-tests-finder

# Check if the symbolic link was created successfully
if [ $? -ne 0 ]; then
    echo "Error: Failed to create symbolic link. Make sure you have sudo privileges."
    exit 1
fi

echo "skipped-tests-finder has been installed globally"
echo "You can now run 'skipped-tests-finder' from any directory"