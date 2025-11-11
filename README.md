# EaziWage - Earned Wage Access Platform

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![License](https://img.shields.io/badge/license-ISC-green)

A comprehensive platform enabling employees across Africa to access their earned wages before payday, reducing financial stress and improving financial wellness.

## 🚀 Features

- **Wage Advance Calculator** - Calculate available advance amounts for multiple African countries (Kenya, Uganda, Tanzania, Rwanda)
- **Multi-tenant Support** - Separate portals for employees, employers, and partners
- **AI-Powered Assistance** - Integrated Cohere AI for smart financial guidance
- **Real-time Analytics** - Dashboard with insights and statistics
- **Authentication** - Secure auth with NextAuth v5
- **Rate Limiting** - Upstash Redis-based protection
- **Responsive Design** - Mobile-first UI with dark mode support
- **Email Integration** - Automated notifications via Resend

## 📋 Prerequisites

- Node.js 18.x or higher
- npm/yarn/pnpm/bun
- PostgreSQL database (or Supabase)
- Redis instance (Upstash)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Itsnatch22/advance.git
   cd advance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   - Database credentials
   - Authentication secrets
   - API keys (Cohere, OpenAI, Resend)
   - Upstash Redis credentials

4. **Generate Prisma client** (if using Prisma)
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
advance/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── calculator/        # Wage calculator
│   ├── employers/         # Employer portal
│   └── ...
├── components/            # Reusable React components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── constants/             # App constants
├── data/                  # Static data files
├── public/                # Static assets
└── scripts/               # Build/utility scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run gen:json` - Generate JSON from Excel files

## 🌍 Supported Countries

- 🇰🇪 Kenya (KE)
- 🇺🇬 Uganda (UG)
- 🇹🇿 Tanzania (TZ)
- 🇷🇼 Rwanda (RW)

## 🔐 Authentication

Uses NextAuth v5 with support for:
- Credentials provider
- Email/password authentication
- Role-based access control (Employee, Employer, Admin)

## 📊 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion, GSAP
- **Charts**: Recharts
- **Icons**: Tabler Icons, Lucide, React Icons

### Backend
- **Database**: Supabase/PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth v5
- **Rate Limiting**: Upstash Redis
- **Email**: Resend + React Email

### AI & Analytics
- **AI**: Cohere AI, OpenAI
- **Analytics**: Vercel Analytics

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Environment Variables
Ensure all required environment variables are set in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `COHERE_API_KEY`
- And others from `.env.example`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- GitHub: [@Itsnatch22](https://github.com/Itsnatch22)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Powered by [Vercel](https://vercel.com)

---

**Note**: Excel files (*.xlsx) in the root directory contain country-specific calculator data. Use `npm run gen:json` to convert them to JSON format.

