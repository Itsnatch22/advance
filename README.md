# EaziWage - Earned Wage Access Platform

A Next.js 16 application providing earned wage access for employees across Africa.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Animations:** Framer Motion + GSAP
- **Icons:** Lucide React + Tabler Icons
- **Charts:** Recharts
- **Authentication:** NextAuth v5
- **Database:** Supabase
- **Deployment:** Vercel

## 📁 Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── (dashboards)/            # Dashboard routes
│   ├── employees/               # Employee pages
│   ├── employers/               # Employer pages
│   └── ...
├── components/                   # React components
│   ├── shared/                  # Reusable shared components
│   ├── ui/                      # shadcn UI components
│   └── ...
├── constants/                    # Application constants
│   ├── data.ts                  # Partner data
│   ├── colors.ts                # Brand colors
│   ├── icons.ts                 # Icon exports
│   └── mockData.ts              # Mock data
├── lib/                         # Utility functions
│   └── hooks/                   # Custom React hooks
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Itsnatch22/advance.git

# Navigate to project directory
cd advance

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## 🎨 Code Quality

- **TypeScript:** Strict type checking enabled
- **ESLint:** Custom configuration with Next.js rules
- **Prettier:** Consistent code formatting
- **Husky:** Pre-commit hooks for quality checks

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS v4 configuration
- `tsconfig.json` - TypeScript configuration
- `eslintrc.json` - ESLint rules
- `components.json` - shadcn configuration

## 📦 Key Features

- 🌍 Pan-African coverage (Kenya, Tanzania, Uganda, Rwanda)
- 💰 Instant wage access for employees
- 📊 Real-time analytics dashboards
- 📱 Fully responsive design
- ♿ Accessibility focused

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📞 Contact

- Email: support@eaziwage.com
- Location: Westlands, Nairobi

---

Built with ❤️ by the EaziWage Team
