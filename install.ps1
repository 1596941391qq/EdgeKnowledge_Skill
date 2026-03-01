# Edge Knowledge Hunter V2 - Windows PowerShell Installation Script
# Supports: Windows 10/11
#
# Usage:
#   .\install.ps1
#   .\install.ps1 -ResourceRoot "D:\edge_knowledge"
#   .\install.ps1 -NoDeps
#
# Requirements:
#   - PowerShell 5.1+ (Windows 10/11 default)
#   - Python 3.8+

param(
    [string]$ResourceRoot = "$env:USERPROFILE\edge_knowledge",
    [switch]$NoDeps = $false,
    [string]$PythonPath = ""
)

$ErrorActionPreference = "Continue"

# Colors
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success { Write-ColorOutput Green "[✓] $args" }
function Write-Warning { Write-ColorOutput Yellow "[!] $args" }
function Write-Info { Write-ColorOutput Yellow "[?] $args" }
function Write-Error { Write-ColorOutput Red "[✗] $args" }
function Write-Header { Write-ColorOutput Cyan $args }

# Banner
Write-Output ""
Write-Header "╔═══════════════════════════════════════════════════════════╗"
Write-Header "║        Edge Knowledge Hunter V2 - Installer               ║"
Write-Header "╚══════��════════════════════════════════════════════════════╝"
Write-Output ""

# Find Python 3.8+
Write-Info "Looking for Python 3.8+..."

$python = $null

if ($PythonPath -and (Test-Path $PythonPath)) {
    $python = $PythonPath
} else {
    # Try common commands
    @("python", "python3", "py") | ForEach-Object {
        $cmd = $_
        try {
            $version = & $cmd --version 2>&1
            if ($version -match "Python (\d+)\.(\d+)") {
                $major = [int]$Matches[1]
                $minor = [int]$Matches[2]
                if ($major -ge 3 -and $minor -ge 8) {
                    $python = $cmd
                    Write-Success "Found: $version"
                    return
                }
            }
        } catch {}
    }
}

if (-not $python) {
    Write-Error "Python 3.8+ not found!"
    Write-Output "    Please install Python 3.8+ from https://python.org"
    Read-Host "Press Enter to exit"
    exit 1
}

# Create virtual environment
$venvDir = "$env:USERPROFILE\.edge-knowledge-venv"
Write-Info "Creating virtual environment..."

if (-not (Test-Path $venvDir)) {
    & $python -m venv $venvDir
    Write-Success "Virtual environment created"
} else {
    Write-Success "Virtual environment exists"
}

# Activate venv
$activateScript = Join-Path $venvDir "Scripts\Activate.ps1"
if (Test-Path $activateScript) {
    . $activateScript
} else {
    Write-Error "Failed to activate virtual environment"
    exit 1
}

# Upgrade pip
pip install --upgrade pip -q 2>$null

# Install Python dependencies
Write-Info "Installing Python packages..."

# Core dependencies
pip install -q playwright browser-use lxml beautifulsoup4 requests 2>$null

# Stitching projects
Write-Info "Installing stitching tools..."
pip install -q gallery-dl yt-dlp crawl4ai 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Some tools may need manual install"
}

# Optional
pip install -q trafilatura aiohttp httpx 2>$null

Write-Success "Python packages installed"

# Install Playwright browsers
Write-Info "Installing Playwright browsers..."
playwright install chromium 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Warning "May need manual: playwright install"
}

# Find skill directory
$skillDir = $null
@(
    "$env:USERPROFILE\.claude\skills\edge-knowledge-hunter",
    "$env:USERPROFILE\.claude\skills\edge-knowledge",
    $PSScriptRoot
) | ForEach-Object {
    if (Test-Path (Join-Path $_ "SKILL.md")) {
        $skillDir = $_
        return
    }
}

if (-not $skillDir) {
    $skillDir = $PSScriptRoot
    Write-Warning "Using script directory as skill directory"
}
Write-Success "Skill directory: $skillDir"

# Create resource directory structure
Write-Info "Creating resource directories..."

@("downloads", "links", "codes", "screenshots") | ForEach-Object {
    $dir = Join-Path $ResourceRoot $_
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Success "Resource directory: $ResourceRoot"

# Update memory.json
$memoryFile = Join-Path $skillDir "memory.json"

if (Test-Path $memoryFile) {
    try {
        $memory = Get-Content $memoryFile -Raw | ConvertFrom-Json
        $memory.resourceConfig.resourceRoot = $ResourceRoot
        $memory | ConvertTo-Json -Depth 10 | Set-Content $memoryFile -Encoding UTF8
        Write-Success "Updated memory.json"
    } catch {
        Write-Warning "Could not update memory.json automatically"
    }
}

# Create index.json
$indexFile = Join-Path $ResourceRoot "index.json"

if (-not (Test-Path $indexFile)) {
    $index = @{
        version = "2.0.0"
        lastUpdated = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        resourceRoot = $ResourceRoot
        statistics = @{
            totalDownloads = 0
            totalLinks = 0
            totalCodes = 0
        }
        downloads = @()
        links = @()
        codes = @()
    }

    $index | ConvertTo-Json -Depth 10 | Set-Content $indexFile -Encoding UTF8
    Write-Success "Created index.json"
}

# Verify installation
Write-Output ""
Write-Header "═══════════════════════════════════════════════════════════"
Write-Success "Installation Complete!"
Write-Header "═══════════════════════════════════════════════════════════"
Write-Output ""

Write-Output "Configuration:"
Write-Output "  Resource Root:   $ResourceRoot"
Write-Output "  Skill Directory: $skillDir"
Write-Output "  Virtual Env:     $venvDir"
Write-Output ""

Write-Output "Installed Tools:"

# Check tools
$tools = @(
    @{name="gallery-dl"; cmd="gallery-dl --version"},
    @{name="yt-dlp"; cmd="yt-dlp --version"},
    @{name="crawl4ai"; cmd="python -c `"import crawl4ai`" 2>`$null"},
    @{name="browser-use"; cmd="python -c `"import browser_use`" 2>`$null"}
)

foreach ($tool in $tools) {
    try {
        $result = Invoke-Expression $tool.cmd 2>$null
        if ($LASTEXITCODE -eq 0 -or $result) {
            Write-Success "$($tool.name): installed"
        } else {
            Write-Error "$($tool.name): not found"
        }
    } catch {
        Write-Error "$($tool.name): not found"
    }
}

Write-Output ""
Write-Header "Quick Start:"
Write-Output "  1. Activate venv: $venvDir\Scripts\Activate.ps1"
Write-Output "  2. Use the skill in Claude Code"
Write-Output "  3. Resources will be saved to: $ResourceRoot"
Write-Output ""
Write-Header "Optional - Agent-Reach Setup:"
Write-Output "  git clone https://github.com/fatwang2/agent-reach.git"
Write-Output "  cd agent-reach; pip install -e ."
Write-Output ""

Read-Host "Press Enter to continue"
