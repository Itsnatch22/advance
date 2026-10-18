# EaziWage

EaziWage is a Next.js web application for earned wage access and financial
wellbeing across Africa. It combines the public EaziWage website with API
routes, an administrative area, employee support tools, and partner resources.

## Technology

- **Web framework:** Next.js 16 App Router, React 19, and TypeScript
- **Styling and UI:** Tailwind CSS 4, Radix UI primitives, and project UI
  components
- **Animation and visualization:** Framer Motion, GSAP, and Recharts
- **Authentication and data:** Supabase; PostgreSQL is described by the Prisma
  schema
- **Email and infrastructure integrations:** Resend, Upstash Redis, and
  reCAPTCHA
- **AI integrations:** Google Generative AI, Cohere, and OpenAI SDKs
- **Monitoring:** Vercel Analytics

## Application areas

- **Public website:** Product information for employees and employers, company
  information, careers, and policy pages
- **Employee support:** Earned-wage calculator, help center, and Wiza AI
  assistant
- **Partner and lead workflows:** Partner onboarding, contact and sales forms,
  meeting scheduling, newsletter signup, and email preferences
- **Administration:** Supabase-authenticated admin pages for email campaigns,
  audit logs, and career applications
- **API routes:** Integrations for support chat, wage calculations, rates,
  resources, subscriptions, forms, webhooks, and administration

## Repository layout

```text
app/                  App Router pages, layouts, and API route handlers
components/           Shared site, feature, and UI components
constants/            Application configuration and shared constants
data/                 Application data
docs/                 Project and integration documentation
emails/               Email templates and related code
hooks/                React hooks
lib/                  Shared clients, utilities, and domain logic
prisma/               PostgreSQL schema and Prisma configuration
public/               Static assets
server/               Server-side modules
supabase/             Supabase configuration and resources
trigger/              Trigger.dev tasks
types/                Shared TypeScript types
```

## Getting started

### Requirements

- Node.js 20.9 or later
- npm
- Valid service credentials for the required environment variables below

### Install and run

```bash
git clone https://github.com/Itsnatch22/advance.git
cd advance
npm install
```

Create `.env.local` in the repository root and configure the required
environment variables before starting the app. The server validates these
values at startup and exits if a required value is missing or invalid.

| Variable                         | Purpose                               |
| -------------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Public Supabase anon key              |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA site key                    |
| `SUPABASE_SERVICE_ROLE_KEY`      | Server-only Supabase service-role key |
| `RECAPTCHA_SECRET_KEY`           | Server-only reCAPTCHA secret          |
| `UPSTASH_REDIS_REST_URL`         | Upstash Redis REST URL                |
| `UPSTASH_REDIS_REST_TOKEN`       | Server-only Upstash Redis REST token  |
| `RESEND_API_KEY`                 | Server-only Resend API key            |

`NEXT_PUBLIC_APP_URL` is optional and defaults to the production site URL.
Some features use additional integration settings, such as AI provider keys,
SMS credentials, webhook signing secrets, or sender addresses. Set the
credentials for the integrations you enable; keep secret values server-side
and never commit them.

`DATABASE_URL` and `DIRECT_URL` are used by Prisma for database operations.
Configure them when using Prisma commands or features that require the Prisma
database connection.

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Common commands

| Command                 | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `npm run dev`           | Start the Next.js development server with Turbopack           |
| `npm run build`         | Create a production build with Turbopack                      |
| `npm run build:webpack` | Create a production build with Webpack                        |
| `npm run start`         | Serve the production build                                    |
| `npm run lint`          | Run ESLint                                                    |
| `npm run type-check`    | Run the TypeScript compiler without emitting files            |
| `npm test`              | Run the Jest test suite                                       |
| `npm run format`        | Format supported source and documentation files with Prettier |
| `npm run format:check`  | Check formatting with Prettier                                |

## Development notes

- The project uses the Next.js App Router; routes live under `app/`.
- Supabase clients differ by runtime and security boundary. See
  [docs/SUPABASE_CLIENTS.md](./docs/SUPABASE_CLIENTS.md) before adding or
  changing Supabase access.
- Keep service-role keys and other credentials in server-only environment
  variables. Do not expose secrets through `NEXT_PUBLIC_*` variables.
- The repository includes focused Jest tests for finance calculations,
  consent handling, and campaign utilities.

## License and reuse

This codebase and its contents are intended solely for authorized team members and approved collaborators. Unauthorized access, copying, reproduction, distribution, modification, or use of any part of this codebase outside the authorized team is prohibited without prior written permission from the owner or authorized representative.

All rights reserved.

## Contact

- Support: [support@eaziwage.com](mailto:support@eaziwage.com)
- Location: Westlands, Nairobi
