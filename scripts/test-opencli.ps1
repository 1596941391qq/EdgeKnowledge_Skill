param(
    [switch]$SkipDoctor,
    [switch]$SkipSmokeTest,
    [string[]]$SmokeTestArgs = @("google", "search", "opencli browser bridge", "--limit", "3", "-f", "json")
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "[edge-knowledge-hunter] $Message"
}

$opencliCommand = Get-Command opencli -ErrorAction SilentlyContinue
if (-not $opencliCommand) {
    throw "opencli is not available in PATH. Run scripts/setup-opencli.ps1 first."
}

Write-Step "Using opencli from $($opencliCommand.Source)"

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

Write-Step "OpenCLI test completed"
