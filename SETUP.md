# Ruda Rugby Club - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier works)

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Then fill in your Supabase credentials in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Set up Supabase:**
- Create a new project at https://supabase.com
- Go to SQL Editor
- Copy and paste the contents of `database_schema.sql`
- Run the SQL to create all tables

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
ruda-rugby-website/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── (auth)/            # Auth routes (login, register)
│   ├── dashboard/         # Dashboard routes
│   └── ruda-school/       # Ruda School routes
├── components/            # React components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   └── supabase.ts       # Supabase client
├── types/                 # TypeScript types
├── hooks/                 # Custom React hooks
├── public/               # Static assets
│   └── assets/          # Logos, videos, PDFs
└── docs/                 # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Color Palette

See `COLOR_PALETTE.md` for the complete color scheme based on the team's colors.

## Next Steps

1. Set up Supabase project
2. Run database schema
3. Configure auth (magic links or OAuth)
4. Create login/register pages
5. Build dashboard for jugadores
6. Implement Ruda School modules

## Documentation

- `README.md` - Project overview
- `COLOR_PALETTE.md` - Design system colors
- `RUDA_SCHOOL_CONTENT.md` - Content structure for learning platform
- `PDF_INTEGRATION.md` - Guide for displaying PDFs
- `database_schema.sql` - Database structure
