@echo off
echo Starting Fake News Detector...

:: Set Node PATH
set PATH=%~dp0node-v20.10.0-win-x64;%PATH%

:: Start ML Service in a new window
echo Starting ML Service...
start cmd /k "cd ml-service && .\venv\Scripts\activate && python main.py"

:: Start Node Backend in a new window
echo Starting Node Server...
start cmd /k "cd server && npm run dev"

:: Start React Frontend in a new window
echo Starting React Client...
start cmd /k "cd client && npm run dev"

echo All services are starting! Please wait a few seconds, then open http://localhost:3000 in your browser.
pause
