# Run as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    exit 1
}

$USER_BIN = "$env:USERPROFILE\bin"
$targetPath = "$USER_BIN\skipped-tests-finder"

# Remove the script if it exists
if (Test-Path -Path $targetPath) {
    Write-Host "Removing skipped-tests-finder..."
    Remove-Item -Path $targetPath -Force
    Write-Host "Successfully removed skipped-tests-finder"
} else {
    Write-Host "skipped-tests-finder is not installed in $USER_BIN"
}

# Remove bin directory from PATH if it's empty
if ((Get-ChildItem -Path $USER_BIN -Force | Measure-Object).Count -eq 0) {
    Write-Host "Removing empty bin directory from PATH..."
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $newPath = ($currentPath -split ";" | Where-Object { $_ -ne $USER_BIN }) -join ";"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    $env:Path = $newPath
    
    # Remove empty bin directory
    Remove-Item -Path $USER_BIN -Force
    Write-Host "Removed bin directory from PATH"
}
