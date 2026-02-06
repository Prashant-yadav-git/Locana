@echo off
echo Setting up Git repository...

git init
git add .
git commit -m "Initial commit: Locana mobile app UI"

echo.
echo Now run these commands with your GitHub repository URL:
echo git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo git branch -M main
echo git push -u origin main

pause