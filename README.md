# Borghini Creative OS

Prosjektstyring for Borghini Entertainment. Bygget med Next.js 14 + Supabase.

## Kom i gang

### 1. Opprett Supabase-prosjekt

1. Gå til [supabase.com](https://supabase.com) og opprett et nytt prosjekt
2. Navn: `borghini-os`
3. Gå til **SQL Editor** og kjør først `supabase/schema.sql`, deretter `supabase/seed.sql`
4. Gå til **Authentication > Users** og opprett brukere for Benjamin og Tormod

### 2. Sett opp miljøvariabler

```bash
cp .env.local.example .env.local
```

Fyll inn verdiene fra Supabase:
- `NEXT_PUBLIC_SUPABASE_URL` — Project URL (finnes i Settings > API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key (finnes i Settings > API)

### 3. Installer og kjør

```bash
npm install
npm run dev
```

Appen kjører på `http://localhost:3000`

### 4. Deploy til Vercel

1. Push koden til GitHub
2. Gå til [vercel.com](https://vercel.com) og importer repoet
3. Legg til miljøvariablene i Vercel settings
4. Deploy

## Stack

| Lag | Teknologi |
|-----|-----------|
| Frontend | Next.js 14 (App Router) |
| UI | Tailwind CSS + Midnight Luxe theme |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (epost/passord) |
| Storage | Supabase Storage (feedback-filer) |
| Hosting | Vercel |

## Design

- **Farger:** Svart (#000) + Gull (#cda41a) + Hvit
- **Font:** Acumin Pro
- **Tema:** Midnight Luxe — mørk, premium, minimalistisk

## Struktur

```
app/
├── layout.tsx              # Root layout + font + sidebar
├── page.tsx                # Dashboard
├── login/page.tsx          # Innlogging
├── prosjekter/
│   ├── page.tsx            # Prosjektliste med filter
│   ├── ny/page.tsx         # Opprett nytt prosjekt
│   └── [id]/page.tsx       # Prosjektdetaljer
├── pipeline/page.tsx       # Salgspipeline (Kanban)
├── team/page.tsx           # Produsenter & team
└── innstillinger/page.tsx  # Innstillinger

components/
├── sidebar.tsx             # Navigasjon (responsiv)
├── status-badge.tsx        # Status-merker
├── project-card.tsx        # Prosjektkort + varsler
├── timeline.tsx            # Auto-milepæler
├── checklist.tsx           # Intern sjekkliste (CRUD)
├── feedback-log.tsx        # Feedback med filopplasting
└── demo-link.tsx           # Låter med 7-dagers demo-utløp

lib/
├── types.ts                # TypeScript domentyper
├── constants.ts            # Statuser, typer, milepæler
├── utils.ts                # Dato/urgency-hjelpefunksjoner
└── supabase/
    ├── client.ts           # Browser Supabase-klient
    └── server.ts           # Server Supabase-klient

supabase/
├── schema.sql              # Database-skjema + RLS
└── seed.sql                # Ekte data fra Borghini (ID 107-167)
```

## Funksjoner (V1)

- **Dashboard** — urgency-sorterte prosjekter med AI-varsler
- **Prosjektside** — info, tidslinje, sjekkliste, feedback, demo-link
- **Pipeline** — Kanban-visning av salgsprosessen
- **Team** — produsenter, låtskrivere, kreative partnere
- **Forberedelsesskjema** — digitalisert skjema per prosjekt
- **Auth** — kun inviterte brukere (Benjamin + Tormod)
- **Mobilresponsivt** — sidebar blir bottom-nav på mobil

## Lisens

© Borghini Entertainment. Alle rettigheder forbeholdt.
