#!/bin/bash
#
# Edge Knowledge Hunter V2 - Installation Script
# Supports: macOS, Linux (Ubuntu/Debian, CentOS/RHEL, Arch)
#
# Usage:
#   chmod +x install.sh && ./install.sh
#
# Options:
#   --resource-root PATH   Set custom resource directory (default: ~/edge_knowledge)
#   --no-deps             Skip system dependencies installation
#   --python PATH         Use specific Python path
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
RESOURCE_ROOT="$HOME/edge_knowledge"
INSTALL_DEPS=true
PYTHON_CMD=""
SKILL_DIR=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --resource-root)
            RESOURCE_ROOT="$2"
            shift 2
            ;;
        --no-deps)
            INSTALL_DEPS=false
            shift
            ;;
        --python)
            PYTHON_CMD="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Print banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║        Edge Knowledge Hunter V2 - Installer               ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ -f /etc/debian_version ]]; then
        echo "debian"
    elif [[ -f /etc/redhat-release ]]; then
        echo "rhel"
    elif [[ -f /etc/arch-release ]]; then
        echo "arch"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)
echo -e "${GREEN}[✓]${NC} Detected OS: $OS"

# Find Python
find_python() {
    if [[ -n "$PYTHON_CMD" ]]; then
        if command -v "$PYTHON_CMD" &> /dev/null; then
            echo "$PYTHON_CMD"
            return
        fi
    fi

    for cmd in python3 python; do
        if command -v $cmd &> /dev/null; then
            version=$($cmd --version 2>&1 | awk '{print $2}')
            major=$(echo $version | cut -d. -f1)
            minor=$(echo $version | cut -d. -f2)
            if [[ $major -ge 3 && $minor -ge 8 ]]; then
                echo $cmd
                return
            fi
        fi
    done
    echo ""
}

echo -e "${YELLOW}[?]${NC} Looking for Python 3.8+..."
PYTHON=$(find_python)

if [[ -z "$PYTHON" ]]; then
    echo -e "${RED}[✗]${NC} Python 3.8+ not found!"
    echo "    Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$($PYTHON --version 2>&1)
echo -e "${GREEN}[✓]${NC} Found: $PYTHON_VERSION"


# Find Node.js (for MCP servers - Gemini MCP)
find_node() {
    for cmd in node nodejs; do
        if command -v $cmd &> /dev/null; then
            echo $cmd; return
        fi
    done
    echo ""
}

echo -e "${YELLOW}[?]${NC} Looking for Node.js (for Gemini MCP routing)..."
NODE=$(find_node)
if [[ -z "$NODE" ]]; then
    echo -e "${RED}[✗]${NC} Node.js not found"
    echo "    Gemini MCP routing requires Node.js for @modelcontextprotocol/server-gemini"
    case $OS in
        macos)  echo "    Install: brew install node" ;;
        debian) echo "    Install: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -S bash && apt-get install -y nodejs" ;;
        rhel)   echo "    Install: curl -fsSL https://rpm.nodesource.com/setup_20.x | bash && yum install -y nodejs" ;;
        arch)   echo "    Install: sudo pacman -S --noconfirm nodejs npm" ;;
    esac
else
    echo -e "${GREEN}[✓]${NC} Node.js: $($NODE --version 2>&1)"
fi

# Install system dependencies
if [[ "$INSTALL_DEPS" == true ]]; then
    echo -e "${YELLOW}[?]${NC} Installing system dependencies..."

    case $OS in
        macos)
            if command -v brew &> /dev/null; then
                brew install ffmpeg aria2 || true
            else
                echo -e "${YELLOW}[!]${NC} Homebrew not found, skipping system deps"
            fi
            ;;
        debian)
            sudo apt-get update
            sudo apt-get install -y ffmpeg aria2 python3-pip python3-venv || true
            ;;
        rhel)
            sudo yum install -y ffmpeg aria2 python3-pip || true
            ;;
        arch)
            sudo pacman -S --noconfirm ffmpeg aria2 python-pip || true
            ;;
        *)
            echo -e "${YELLOW}[!]${NC} Unknown OS, skipping system deps"
            ;;
    esac
    echo -e "${GREEN}[✓]${NC} System dependencies installed"
else
    echo -e "${YELLOW}[!]${NC} Skipping system dependencies (--no-deps)"
fi

# Create virtual environment
VENV_DIR="$HOME/.edge-knowledge-venv"
echo -e "${YELLOW}[?]${NC} Creating virtual environment..."

if [[ ! -d "$VENV_DIR" ]]; then
    $PYTHON -m venv "$VENV_DIR"
    echo -e "${GREEN}[✓]${NC} Virtual environment created at $VENV_DIR"
else
    echo -e "${GREEN}[✓]${NC} Virtual environment exists at $VENV_DIR"
fi

# Activate venv
source "$VENV_DIR/bin/activate"

# Upgrade pip
pip install --upgrade pip -q

# Install Python dependencies
echo -e "${YELLOW}[?]${NC} Installing Python packages..."

# Core dependencies
pip install -q playwright browser-use lxml beautifulsoup4 requests

# Stitching projects (缝合项目)
echo -e "${YELLOW}[?]${NC} Installing stitching tools..."
pip install -q gallery-dl yt-dlp crawl4ai || echo -e "${YELLOW}[!]${NC} Some stitching tools may require manual install"
# Install ai-captcha-bypass
echo -e "${YELLOW}[?]${NC} Installing AI Captcha Bypass..."
CAPTCHA_DIR="$HOME/ai-captcha-bypass"
if [[ -d "$CAPTCHA_DIR" ]]; then
    echo -e "${GREEN}[OK]${NC} ai-captcha-bypass already at $CAPTCHA_DIR"
else
    if command -v git &> /dev/null; then
        git clone https://github.com/aydinnyunus/ai-captcha-bypass.git "$CAPTCHA_DIR" 2>/dev/null && \
        echo -e "${GREEN}[OK]${NC} Cloned ai-captcha-bypass" || \
        echo -e "${YELLOW}[!]${NC} git clone failed (git not installed?)"
    else
        echo -e "${YELLOW}[!]${NC} git not found, skipping ai-captcha-bypass clone"
    fi
fi
if [[ -f "$CAPTCHA_DIR/requirements.txt" ]]; then
    pip install -q -r "$CAPTCHA_DIR/requirements.txt" 2>/dev/null && \
    echo -e "${GREEN}[OK]${NC} ai-captcha-bypass deps installed" || \
    echo -e "${YELLOW}[!]${NC} Some captcha deps failed (check selenium installed manually)"
fi


# Optional but useful
pip install -q trafilatura aiohttp httpx || true

echo -e "${GREEN}[✓]${NC} Python packages installed"

# Install Playwright browsers
echo -e "${YELLOW}[?]${NC} Installing Playwright browsers..."
playwright install chromium 2>/dev/null || echo -e "${YELLOW}[!]${NC} Playwright browser install may need manual: playwright install"
# Check / install Firefox (required for ai-captcha-bypass)
echo -e "${YELLOW}[?]${NC} Checking Firefox (required for AI Captcha Bypass)..."
FIREFOX_FOUND=false
if command -v firefox &> /dev/null; then
    FIREFOX_VERSION=$(firefox --version 2>&1 | head -1)
    echo -e "${GREEN}[OK]${NC} Firefox: $FIREFOX_VERSION"
    FIREFOX_FOUND=true
fi
if [[ "$OSTYPE" == "darwin"* ]] && [[ -d "/Applications/Firefox.app" ]]; then
    echo -e "${GREEN}[OK]${NC} Firefox (macOS) found"
    FIREFOX_FOUND=true
fi
if [[ -d "/c/Program Files/Mozilla Firefox" ]]; then
    echo -e "${GREEN}[OK]${NC} Firefox (Windows) found"
    FIREFOX_FOUND=true
fi
if [[ "$FIREFOX_FOUND" == false ]]; then
    echo -e "${YELLOW}[!]${NC} Firefox not found. AI Captcha Bypass REQUIRES Firefox!"
    case $OS in
        macos)   echo "    Install: brew install --cask firefox" ;;
        debian)  echo "    Install: sudo apt-get install -y firefox-esr" ;;
        rhel)    echo "    Install: sudo yum install -y firefox" ;;
        arch)    echo "    Install: sudo pacman -S --noconfirm firefox" ;;
    esac
fi


# Find skill directory
find_skill_dir() {
    # Check common locations
    local locations=(
        "$HOME/.claude/skills/edge-knowledge-hunter"
        "$HOME/.claude/skills/edge-knowledge"
        "$(dirname "$0")"
    )

    for loc in "${locations[@]}"; do
        if [[ -f "$loc/SKILL.md" ]]; then
            echo "$loc"
            return
        fi
    done
    echo ""
}

SKILL_DIR=$(find_skill_dir)

if [[ -z "$SKILL_DIR" ]]; then
    echo -e "${YELLOW}[!]${NC} Could not find skill directory, using script location"
    SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
fi

echo -e "${GREEN}[✓]${NC} Skill directory: $SKILL_DIR"

# Create resource directory structure
echo -e "${YELLOW}[?]${NC} Creating resource directories..."

mkdir -p "$RESOURCE_ROOT/downloads"
mkdir -p "$RESOURCE_ROOT/links"
mkdir -p "$RESOURCE_ROOT/codes"
mkdir -p "$RESOURCE_ROOT/screenshots"

echo -e "${GREEN}[✓]${NC} Resource directory: $RESOURCE_ROOT"

# Update memory.json with resource root
MEMORY_FILE="$SKILL_DIR/memory.json"

if [[ -f "$MEMORY_FILE" ]]; then
    # Convert to Unix path format for JSON
    UNIX_PATH=$(echo "$RESOURCE_ROOT" | sed 's/\\/\\\\/g')

    # Update resourceRoot in memory.json using Python
    $PYTHON -c "
import json
import sys

with open('$MEMORY_FILE', 'r') as f:
    data = json.load(f)

if 'resourceConfig' in data:
    data['resourceConfig']['resourceRoot'] = '$UNIX_PATH'

with open('$MEMORY_FILE', 'w') as f:
    json.dump(data, f, indent=2)

print('Updated resourceRoot to: $UNIX_PATH')
" 2>/dev/null || echo -e "${YELLOW}[!]${NC} Could not update memory.json automatically"

    echo -e "${GREEN}[✓]${NC} Updated memory.json"
fi

# Create index.json in resource directory
INDEX_FILE="$RESOURCE_ROOT/index.json"

if [[ ! -f "$INDEX_FILE" ]]; then
    cat > "$INDEX_FILE" << EOF
{
  "version": "2.0.0",
  "lastUpdated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "resourceRoot": "$RESOURCE_ROOT",
  "statistics": {
    "totalDownloads": 0,
    "totalLinks": 0,
    "totalCodes": 0
  },
  "downloads": [],
  "links": [],
  "codes": []
}
EOF
    echo -e "${GREEN}[✓]${NC} Created index.json"
fi


# Install Google Gemini MCP Server (npm global)
echo -e "${YELLOW}[?]${NC} Installing Google Gemini MCP Server..."
if [[ -n "$NODE" ]]; then
    if npm list -g @modelcontextprotocol/server-gemini &> /dev/null; then
        echo -e "${GREEN}[OK]${NC} @modelcontextprotocol/server-gemini already installed"
    else
        npm install -g @modelcontextprotocol/server-gemini 2>/dev/null && \
        echo -e "${GREEN}[OK]${NC} Installed @modelcontextprotocol/server-gemini" || \
        echo -e "${YELLOW}[!]${NC} Gemini MCP install failed (check GEMINI_API_KEY env var)"
    fi
else
    echo -e "${YELLOW}[!]${NC} Skipping Gemini MCP (Node.js not found)"
fi

# Verify installation
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Configuration:"
echo -e "  ${YELLOW}Resource Root:${NC}   $RESOURCE_ROOT"
echo -e "  ${YELLOW}Skill Directory:${NC} $SKILL_DIR"
echo -e "  ${YELLOW}Virtual Env:${NC}     $VENV_DIR"
echo ""
echo -e "Installed Tools:"

# Check tool versions
if command -v gallery-dl &> /dev/null; then
    echo -e "  ${GREEN}[✓]${NC} gallery-dl: $(gallery-dl --version 2>/dev/null || echo 'installed')"
else
    echo -e "  ${RED}[✗]${NC} gallery-dl: not found"
fi

if command -v yt-dlp &> /dev/null; then
    echo -e "  ${GREEN}[✓]${NC} yt-dlp: $(yt-dlp --version 2>/dev/null | head -1 || echo 'installed')"
else
    echo -e "  ${RED}[✗]${NC} yt-dlp: not found"
fi

if python -c "import crawl4ai" 2>/dev/null; then
    echo -e "  ${GREEN}[✓]${NC} crawl4ai: installed"
else
    echo -e "  ${YELLOW}[?]${NC} crawl4ai: check manually"
fi

if python -c "import browser_use" 2>/dev/null; then
    echo -e "  ${GREEN}[✓]${NC} browser-use: installed"
else
    echo -e "  ${RED}[✗]${NC} browser-use: not found"
fi

echo ""
echo -e "${BLUE}Quick Start:${NC}"
echo "  1. Activate venv: source $VENV_DIR/bin/activate"
echo "  2. Use the skill in Claude Code"
echo "  3. Resources will be saved to: $RESOURCE_ROOT"
echo ""
echo -e "${YELLOW}=== IMPORTANT: API Keys Setup ===${NC}"
echo "  AI Captcha Bypass needs API keys. Create/edit .env:"
if [[ -d "$HOME/ai-captcha-bypass" ]]; then
    echo "  $ nano $HOME/ai-captcha-bypass/.env"
else
    echo "  $ nano ~/ai-captcha-bypass/.env"
fi
echo "  Add ONE of:"
echo "    OPENAI_API_KEY=sk-...    # for GPT-4o solver"
echo "    GOOGLE_API_KEY=...       # for Gemini solver"
echo ""
echo "  For Gemini MCP routing (Tier 3):"
echo "    export GEMINI_API_KEY=..."
echo ""
echo -e "${BLUE}Optional - Agent-Reach Setup:${NC}"
echo "  git clone https://github.com/fatwang2/agent-reach.git"
echo "  cd agent-reach && pip install -e ."
echo ""
