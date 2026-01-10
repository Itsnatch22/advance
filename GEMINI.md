# GEMINI.md - EaziWage Project Context

This document provides a comprehensive overview of the EaziWage project, its structure, and conventions to be used as instructional context for future interactions.

## Project Overview

EaziWage is a comprehensive platform enabling employees across Africa to access their earned wages before payday, reducing financial stress and improving financial wellness.

The core of the application is a wage advance calculator that can calculate available advance amounts for multiple African countries (Kenya, Uganda, Tanzania, Rwanda). The application also features multi-tenant support for employees, employers, and partners, AI-powered financial assistance, real-time analytics, and secure authentication.

**Key Technologies:**

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4, Radix UI, shadcn/ui
- **Animations:** Framer Motion, GSAP
- **Backend:** Next.js API Routes, Supabase/PostgreSQL, Prisma
- **Authentication:** NextAuth v5
- **AI & Analytics:** Cohere AI, OpenAI, Vercel Analytics
- **Other:** Upstash Redis (Rate Limiting), Resend (Email)

## Building and Running

The following are the key commands for building, running, and testing the project:

- **`npm run dev`**: Start the development server with Turbopack.
- **`npm run build`**: Build the application for production.
- **`npm start`**: Start the production server.
- **`npm run lint`**: Run ESLint to check for code quality.
- **`npm run lint:fix`**: Fix ESLint errors automatically.
- **`npm run format`**: Format the code with Prettier.
- **`npm run type-check`**: Run the TypeScript compiler to check for type errors.
- **`npm run gen:json`**: Generate JSON data from Excel files located in the root directory.

## Development Conventions

- **Structure:** The project follows the Next.js App Router structure.
  - `app/`: Contains all the routes, pages, and layouts.
  - `components/`: Contains reusable React components.
  - `lib/`: Contains utility functions and the core business logic.
  - `hooks/`: Contains custom React hooks.
  - `constants/`: Contains application-wide constants.
  - `data/`: Contains static data files, including the JSON files for the calculator.
  - `public/`: Contains static assets like images and fonts.
  - `scripts/`: Contains utility scripts for the project.
- **Styling:** The project uses Tailwind CSS for styling, with components from `shadcn/ui` and `Radix UI`.
- **Data:** The calculator's country-specific data is stored in JSON files in the `data` directory. These files are generated from Excel files in the root directory using the `npm run gen:json` script.
- **API:** The backend logic is implemented as Next.js API Routes in the `app/api` directory.
- **Core Logic:** The core business logic for the wage calculator is located in `lib/calc.ts`.
- **Linting and Formatting:** The project uses ESLint for linting and Prettier for formatting. Configuration files are `.eslintrc.js` and `.prettierrc`.
- **Typescript:** The project is written in TypeScript. Type checking is enforced.

## Key Files

- **`README.md`**: The main documentation for the project.
- **`package.json`**: Defines the project's dependencies and scripts.
- **`next.config.ts`**: The configuration file for Next.js.
- **`app/layout.tsx`**: The root layout of the application.
- **`app/page.tsx`**: The entry point of the application (the homepage).
- **`lib/calc.ts`**: Contains the core logic for the wage calculator.
- **`app/api/calc/route.ts`**: The API endpoint for the calculator.
- **`app/calculator/page.tsx`**: The UI for the calculator page.
- **`app/calculator/Calc.tsx`**: The implementation of the calculator component.
- **`data/`**: This directory contains the country-specific configuration files (`calcke.json`, `calcug.json`, etc.) that drive the calculator.
