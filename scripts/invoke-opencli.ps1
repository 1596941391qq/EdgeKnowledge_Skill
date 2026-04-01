param(
    [switch]$RunDoctor,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$OpenCliArgs
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

if ($RunDoctor) {
    Write-Step "Running opencli doctor"
    & opencli doctor
    if ($LASTEXITCODE -ne 0) {
        throw "opencli doctor failed with exit code $LASTEXITCODE"
    }
}

if (-not $OpenCliArgs -or $OpenCliArgs.Count -eq 0) {
    throw "No opencli arguments provided. Example: -RunDoctor google search `"opencli browser bridge`" --limit 3 -f json"
}

Write-Step "Executing: opencli $($OpenCliArgs -join ' ')"
& opencli @OpenCliArgs
if ($LASTEXITCODE -ne 0) {
    throw "opencli command failed with exit code $LASTEXITCODE"
}
