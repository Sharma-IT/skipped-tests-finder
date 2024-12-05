#!/bin/bash

# Check if the symbolic link exists
if [ -L "/usr/local/bin/skipped-tests-finder" ] || [ -f "/usr/local/bin/skipped-tests-finder" ]; then
    echo "Removing skipped-tests-finder..."
    sudo rm "/usr/local/bin/skipped-tests-finder"
    if [ $? -eq 0 ]; then
        echo "Successfully uninstalled skipped-tests-finder"
    else
        echo "Error: Failed to remove skipped-tests-finder. Make sure you have sudo privileges."
        exit 1
    fi
else
    echo "skipped-tests-finder is not installed in /usr/local/bin"
fi
