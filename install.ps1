# Run as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    exit 1
}

# Create a bin directory in the user's home if it doesn't exist
$USER_BIN = "$env:USERPROFILE\bin"
if (-not (Test-Path -Path $USER_BIN)) {
    New-Item -ItemType Directory -Path $USER_BIN | Out-Null
}

# Add shebang line to the script if it doesn't exist
$scriptContent = Get-Content "skipped-tests-finder.js" -Raw
if (-not ($scriptContent -match "^#!")) {
    $scriptContent = "#!/usr/bin/env node`n" + $scriptContent
    Set-Content "skipped-tests-finder.js" $scriptContent
}

# Remove existing installation if it exists
$targetPath = "$USER_BIN\skipped-tests-finder"
if (Test-Path -Path $targetPath) {
    Write-Host "Removing existing installation..."
    Remove-Item -Path $targetPath -Force
}

# Copy the script to the bin directory
Copy-Item "skipped-tests-finder.js" -Destination $targetPath -Force

# Add the bin directory to PATH if it's not already there
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not ($currentPath -split ";" -contains $USER_BIN)) {
    $newPath = "$currentPath;$USER_BIN"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    $env:Path = $newPath
}

Write-Host "skipped-tests-finder has been installed globally"
Write-Host "You can now run 'skipped-tests-finder' from any directory"
Write-Host "Note: You may need to restart your terminal for the PATH changes to take effect"
