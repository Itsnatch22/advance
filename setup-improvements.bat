@echo off
echo ========================================
echo  EaziWage Project Improvements Setup
echo ========================================
echo.

echo Step 1: Creating directories...
md .vscode 2>nul
md .husky 2>nul
md types 2>nul
echo ✓ Directories created
echo.

echo Step 2: Replacing tsconfig.json...
if exist tsconfig-new.json (
    del tsconfig.json 2>nul
    ren tsconfig-new.json tsconfig.json
    echo ✓ TypeScript config updated
) else (
    echo ✗ tsconfig-new.json not found
)
echo.

echo Step 3: Installing dependencies...
echo Running: npm install -D prettier prettier-plugin-tailwindcss husky lint-staged
call npm install -D prettier prettier-plugin-tailwindcss husky lint-staged
echo.

echo Step 4: Initializing Husky...
call npx husky install
echo.

echo Step 5: Creating VSCode settings...
(
echo {
echo   "editor.formatOnSave": true,
echo   "editor.defaultFormatter": "esbenp.prettier-vscode",
echo   "editor.codeActionsOnSave": {
echo     "source.fixAll.eslint": "explicit",
echo     "source.organizeImports": "explicit"
echo   },
echo   "typescript.tsdk": "node_modules/typescript/lib"
echo }
) > .vscode\settings.json
echo ✓ VSCode settings created
echo.

echo Step 6: Creating VSCode extensions...
(
echo {
echo   "recommendations": [
echo     "dbaeumer.vscode-eslint",
echo     "esbenp.prettier-vscode",
echo     "bradlc.vscode-tailwindcss",
echo     "prisma.prisma"
echo   ]
echo }
) > .vscode\extensions.json
echo ✓ VSCode extensions file created
echo.

echo Step 7: Creating types file...
(
echo export interface User {
echo   id: string;
echo   email: string;
echo   name?: string;
echo   role: "employee" ^| "employer" ^| "admin";
echo }
echo.
echo export interface ApiResponse^<T = any^> {
echo   success: boolean;
echo   data?: T;
echo   error?: string;
echo }
echo.
echo export type Country = "KE" ^| "UG" ^| "TZ" ^| "RW";
) > types\index.ts
echo ✓ Types file created
echo.

echo Step 8: Creating Husky pre-commit hook...
(
echo #!/usr/bin/env sh
echo . "$^(dirname -- "$0"^)/_/husky.sh"
echo.
echo npm run lint-staged
) > .husky\pre-commit
echo ✓ Pre-commit hook created
echo.

echo Step 9: Removing temporary files...
if exist create-dirs.bat del create-dirs.bat 2>nul
echo ✓ Cleanup complete
echo.

echo ========================================
echo  Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run format
echo 2. Run: npm run type-check
echo 3. Run: npm run dev
echo.
echo Check PROJECT_IMPROVEMENTS_SUMMARY.md for details
echo.
pause
