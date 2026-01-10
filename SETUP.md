# Quick Setup Guide

Follow these steps to complete the project improvements:

## 1. Create Missing Directories

Open Command Prompt and run:

```cmd
cd C:\Users\Admin\OneDrive\Desktop\JS\advance
md .vscode
md .husky
md types
```

## 2. Install New Dependencies

```cmd
npm install -D prettier prettier-plugin-tailwindcss husky lint-staged @types/node
```

## 3. Create VSCode Settings

Create `.vscode\settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

Create `.vscode\extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma"
  ]
}
```

## 4. Create TypeScript Types

Create `types\index.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name?: string;
  role: "employee" | "employer" | "admin";
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export type Country = "KE" | "UG" | "TZ" | "RW";
```

## 5. Initialize Husky

```cmd
npx husky install
```

Create `.husky\pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint-staged
```

## 6. Format Your Code

```cmd
npm run format
```

## 7. Run Type Check

```cmd
npm run type-check
```

## 8. Optional: Move Excel Files

```cmd
move *.xlsx data\
```

Then update your scripts to reference the new location.

## Done! 🎉

Your project now has:

- ✅ Prettier for code formatting
- ✅ Husky for git hooks
- ✅ Stricter TypeScript
- ✅ Better Next.js config
- ✅ Comprehensive README
- ✅ Error boundaries
- ✅ Loading states
- ✅ Environment template
