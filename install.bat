@echo off
REM Edge Knowledge Hunter V2 - Windows Installation Script
REM Supports: Windows 10/11
REM
REM Usage:
REM   install.bat
REM   install.bat --resource-root D:\edge_knowledge
REM   install.bat --no-deps
REM

setlocal enabledelayedexpansion

REM Default values
set "RESOURCE_ROOT=%USERPROFILE%\edge_knowledge"
set "INSTALL_DEPS=true"
set "PYTHON_CMD="
set "SKIP_PAUSE=false"

REM Parse arguments
:parse_args
if "%~1"=="" goto :done_args
if /i "%~1"=="--resource-root" (
    set "RESOURCE_ROOT=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--no-deps" (
    set "INSTALL_DEPS=false"
    shift
    goto :parse_args
)
if /i "%~1"=="--python" (
    set "PYTHON_CMD=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--skip-pause" (
    set "SKIP_PAUSE=true"
    shift
    goto :parse_args
)
shift
goto :parse_args
:done_args

REM Colors (Windows 10+ ANSI support)
for /f %%A in ('echo prompt $E^| cmd') do set "ESC=%%A"
set "RED=!ESC![0;31m"
set "GREEN=!ESC![0;32m"
set "YELLOW=!ESC![1;33m"
set "BLUE=!ESC![0;34m"
set "NC=!ESC![0m"

REM Banner
echo.
echo !BLUE!╔═══════════════════════════════════════════════════════════╗
echo ║        Edge Knowledge Hunter V2 - Installer               ║
echo ╚═══════════════════════════════════════════════════════════╝!NC!
echo.

REM Find Python
echo !YELLOW![?]!NC! Looking for Python 3.8+...

if defined PYTHON_CMD (
    "%PYTHON_CMD%" --version >nul 2>&1
    if !errorlevel!==0 (
        set "PYTHON=%PYTHON_CMD%"
        goto :found_python
    )
)

REM Try common locations
for %%p in (python python3 py) do (
    where %%p >nul 2>&1
    if !errorlevel!==0 (
        for /f "tokens=2" %%v in ('%%p --version 2^>^&1') do (
            set "version=%%v"
            goto :check_version
        )
        :check_version
        for /f "tokens=1,2 delims=." %%a in ("!version!") do (
            set "major=%%a"
            set "minor=%%b"
        )
        if !major! geq 3 if !minor! geq 8 (
            set "PYTHON=%%p"
            goto :found_python
        )
    )
)

echo !RED![✗]!NC! Python 3.8+ not found!
echo     Please install Python 3.8 or higher from https://python.org
if "%SKIP_PAUSE%"=="false" pause
exit /b 1

:found_python
for /f "tokens=2" %%v in ('"%PYTHON%" --version 2^>^&1') do set "PYTHON_VERSION=%%v"
echo !GREEN![✓]!NC! Found: Python !PYTHON_VERSION!

REM Create virtual environment
set "VENV_DIR=%USERPROFILE%\.edge-knowledge-venv"
echo !YELLOW![?]!NC! Creating virtual environment...

if not exist "%VENV_DIR%" (
    "%PYTHON%" -m venv "%VENV_DIR%"
    echo !GREEN![✓]!NC! Virtual environment created
) else (
    echo !GREEN![✓]!NC! Virtual environment exists
)

REM Activate venv
call "%VENV_DIR%\Scripts\activate.bat"

REM Upgrade pip
pip install --upgrade pip -q

REM Install Python dependencies
echo !YELLOW![?]!NC! Installing Python packages...

REM Core dependencies
pip install -q playwright browser-use lxml beautifulsoup4 requests

REM Stitching projects
echo !YELLOW![?]!NC! Installing stitching tools...
pip install -q gallery-dl yt-dlp crawl4ai 2>nul || echo !YELLOW![!]!NC! Some tools may need manual install

REM Optional but useful
pip install -q trafilatura aiohttp httpx 2>nul

echo !GREEN![✓]!NC! Python packages installed

REM Install Playwright browsers
echo !YELLOW![?]!NC! Installing Playwright browsers...
playwright install chromium 2>nul || echo !YELLOW![!]!NC! May need manual: playwright install

REM Find skill directory
set "SKILL_DIR="
for %%d in (
    "%USERPROFILE%\.claude\skills\edge-knowledge-hunter"
    "%USERPROFILE%\.claude\skills\edge-knowledge"
    "%~dp0"
) do (
    if exist "%%~d\SKILL.md" (
        set "SKILL_DIR=%%~d"
        goto :found_skill
    )
)
:found_skill

if not defined SKILL_DIR (
    set "SKILL_DIR=%~dp0"
    echo !YELLOW![!]!NC! Using script directory as skill directory
)
echo !GREEN![✓]!NC! Skill directory: !SKILL_DIR!

REM Create resource directory structure
echo !YELLOW![?]!NC! Creating resource directories...

if not exist "%RESOURCE_ROOT%\downloads" mkdir "%RESOURCE_ROOT%\downloads"
if not exist "%RESOURCE_ROOT%\links" mkdir "%RESOURCE_ROOT%\links"
if not exist "%RESOURCE_ROOT%\codes" mkdir "%RESOURCE_ROOT%\codes"
if not exist "%RESOURCE_ROOT%\screenshots" mkdir "%RESOURCE_ROOT%\screenshots"

echo !GREEN![✓]!NC! Resource directory: %RESOURCE_ROOT%

REM Update memory.json
set "MEMORY_FILE=%SKILL_DIR%\memory.json"

if exist "%MEMORY_FILE%" (
    REM Convert Windows path to JSON-safe format
    set "JSON_PATH=%RESOURCE_ROOT:\=\\%"

    REM Use Python to update JSON
    python -c "import json; f=open(r'%MEMORY_FILE%','r'); d=json.load(f); f.close(); d['resourceConfig']['resourceRoot']=r'%JSON_PATH%'; f=open(r'%MEMORY_FILE%','w'); json.dump(d,f,indent=2); f.close(); print('Updated resourceRoot')" 2>nul

    echo !GREEN![✓]!NC! Updated memory.json
)

REM Create index.json
set "INDEX_FILE=%RESOURCE_ROOT%\index.json"

if not exist "%INDEX_FILE%" (
    for /f %%t in ('powershell -command "Get-Date -Format yyyy-MM-ddTHH:mm:ssZ -AsUTC"') do set "TIMESTAMP=%%t"

    echo {!INDEX_FILE! > "%INDEX_FILE%"
    echo   "version": "2.0.0", >> "%INDEX_FILE%"
    echo   "lastUpdated": "!TIMESTAMP!", >> "%INDEX_FILE%"
    echo   "resourceRoot": "!JSON_PATH!", >> "%INDEX_FILE%"
    echo   "statistics": { >> "%INDEX_FILE%"
    echo     "totalDownloads": 0, >> "%INDEX_FILE%"
    echo     "totalLinks": 0, >> "%INDEX_FILE%"
    echo     "totalCodes": 0 >> "%INDEX_FILE%"
    echo   }, >> "%INDEX_FILE%"
    echo   "downloads": [], >> "%INDEX_FILE%"
    echo   "links": [], >> "%INDEX_FILE%"
    echo   "codes": [] >> "%INDEX_FILE%"
    echo } >> "%INDEX_FILE%"

    echo !GREEN![✓]!NC! Created index.json
)

REM Verify installation
echo.
echo !BLUE!═══════════════════════════════════════════════════════════!NC!
echo !GREEN!Installation Complete!!NC!
echo !BLUE!═══════════════════════════════════════════════════════════!NC!
echo.
echo Configuration:
echo   !YELLOW!Resource Root:!NC!   %RESOURCE_ROOT%
echo   !YELLOW!Skill Directory:!NC! %SKILL_DIR%
echo   !YELLOW!Virtual Env:!NC!     %VENV_DIR%
echo.
echo Installed Tools:

where gallery-dl >nul 2>&1
if !errorlevel!==0 (
    for /f %%v in ('gallery-dl --version 2^>^&1') do echo   !GREEN![✓]!NC! gallery-dl: %%v
) else (
    echo   !RED![✗]!NC! gallery-dl: not found in PATH
)

where yt-dlp >nul 2>&1
if !errorlevel!==0 (
    for /f %%v in ('yt-dlp --version 2^>^&1') do echo   !GREEN![✓]!NC! yt-dlp: %%v
) else (
    echo   !RED![✗]!NC! yt-dlp: not found in PATH
)

python -c "import crawl4ai" 2>nul && echo   !GREEN![✓]!NC! crawl4ai: installed || echo   !YELLOW![?]!NC! crawl4ai: check manually
python -c "import browser_use" 2>nul && echo   !GREEN![✓]!NC! browser-use: installed || echo   !RED![✗]!NC! browser-use: not found

echo.
echo !BLUE!Quick Start:!NC!
echo   1. Activate venv: %VENV_DIR%\Scripts\activate.bat
echo   2. Use the skill in Claude Code
echo   3. Resources will be saved to: %RESOURCE_ROOT%
echo.
echo !BLUE!Optional - Agent-Reach Setup:!NC!
echo   git clone https://github.com/fatwang2/agent-reach.git
echo   cd agent-reach ^&^& pip install -e .
echo.

if "%SKIP_PAUSE%"=="false" pause
