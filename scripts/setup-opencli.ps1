param(
    [string]$PackageName = "@jackwener/opencli",
    [switch]$SkipInstall,
    [switch]$SkipDoctor,
    [switch]$SkipSmokeTest,
    [string[]]$SmokeTestArgs = @("google", "search", "opencli browser bridge", "--limit", "3", "-f", "json")
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "[edge-knowledge-hunter] $Message"
}

function Assert-Command {
    param([string]$Name)
    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if (-not $command) {
        throw "Required command not found in PATH: $Name"
    }
    return $command
}

Write-Step "Checking npm availability"
Assert-Command -Name "npm" | Out-Null

Write-Step "Browser prerequisite: install and enable the Chrome extension named 'Browser Bridge' before running doctor"

if (-not $SkipInstall) {
    Write-Step "Installing $PackageName globally via npm"
    & npm install -g $PackageName
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed with exit code $LASTEXITCODE"
    }
}

$opencliCommand = Get-Command opencli -ErrorAction SilentlyContinue
if (-not $opencliCommand) {
    $npmPrefix = (& npm prefix -g).Trim()
    $expectedShim = Join-Path $npmPrefix "opencli.cmd"
    throw "opencli was not found in PATH after install. Expected shim near: $expectedShim"
}

Write-Step "opencli command found at $($opencliCommand.Source)"
& opencli --version
if ($LASTEXITCODE -ne 0) {
    throw "opencli --version failed with exit code $LASTEXITCODE"
}

if (-not $SkipDoctor) {
    Write-Step "Running opencli doctor"
    & opencli doctor
    if ($LASTEXITCODE -ne 0) {
        throw "opencli doctor failed with exit code $LASTEXITCODE"
    }
}

if (-not $SkipSmokeTest) {
    Write-Step "Running smoke test: opencli $($SmokeTestArgs -join ' ')"
    & opencli @SmokeTestArgs
    if ($LASTEXITCODE -ne 0) {
        throw "opencli smoke test failed with exit code $LASTEXITCODE. Verify Browser Bridge is installed and connected in Chrome."
    }
}

Write-Step "OpenCLI setup completed"
