# Get the current user's home directory
$HOME_DIR = [System.Environment]::GetFolderPath("UserProfile")

# Check if the file already exists in the home directory
if (Test-Path -Path "$HOME_DIR\skipped-tests-finder.js") {
    Write-Host "Error: skipped-tests-finder.js already exists in your home directory."
    exit 1
}

# Copy the script into the user's home directory
Copy-Item "skipped-tests-finder.js" -Destination "$HOME_DIR"

# Check if the copy operation was successful
if ($?) {
    Write-Host "Error: Failed to copy skipped-tests-finder.js to your home directory."
    exit 1
}

Write-Host "skipped-tests-finder has been installed in $HOME_DIR (your home directory)"
Write-Host "To run skipped-tests-finder, go to your home directory ('cd'), and run the command 'node skipped-tests-finder.js'"
