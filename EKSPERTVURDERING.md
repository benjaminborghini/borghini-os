# Borghini OS — Ekspertvurdering

**Claude (Fable 5), 8. juli 2026.** Kodegjennomgang av borghini-os slik et ekspertteam ville vurdert den.

---

## Helhetsinntrykk

Solid MVP. Stack-valget (Next.js 14 + Supabase + Vercel) er nøyaktig det et erfarent team ville valgt for et internverktøy med to brukere — null serverdrift, gratis hosting, innebygd auth og database. Kodebasen er liten (~3 100 linjer), lesbar, konsekvent i stil, og domenemodellen (prosjekter, produsenter, milepæler, feedback, pipeline) speiler den faktiske arbeidsflyten godt. RLS er aktivert på alle tabeller og hemmeligheter ligger utenfor git. Dette er bedre enn de fleste MVP-er.

**Karakter som internverktøy: B+.**
**Karakter som produkt for eksterne kunder:** ikke aktuelt ennå — og det er riktig, per fase-planen.

---

## Fikset i denne gjennomgangen (committet: 5b2c5f5)

| Funn | Alvorlighet | Fiks |
|------|-------------|------|
| `/preview-siden` var unntatt auth og eksponerte ekte gruppenavn, priser og produsentnavn | 🔴 Kritisk | Fjernet |
| `getSession()` brukt i middleware i stedet for `getUser()` — verifiserer ikke JWT | 🟡 Medium | Bytte til `getUser()` |
| SoundBetter-specene lå i repoet | 🟢 Lav | Flyttet til `10_fristil_marketplace/` |
| `.gitignore` manglet linjeskift på slutten | 🟢 Lav | Reparert |

---

## Gjenstående svakheter — til høsten, ikke nå

| Svakhet | Hvorfor vente | Når fikse |
|---------|---------------|-----------|
| **Git-disiplin** — repoet har én commit for hele MVP-en | Ingen umiddelbar risiko | Innfør vane: commit hver arbeidsøkt, push til GitHub |
| **build --no-lint** — byggeskriptet hopper over linting | Ingen brekker nå | Sett opp GitHub Actions: `npm run lint && npm run build` på hver push (15 min) |
| **Ingen feilhåndtering på datahenting** — sidene sjekker ikke `error` fra Supabase | Tom side ved feil | `error.tsx`-boundaries i App Router + error-sjekk |
| **Null tester** — urgency-logikken i `lib/utils.ts` er ukritisk ennå | Ok for internverktøy | Enhetstester på dato/urgency-funksjoner gir mest verdi per time |
| **Dropbox-tokens i klartekst** i databasen | RLS beskytter (2 brukere) | Ved skalering: Supabase Vault + refresh_token server-side |
| **Manuelt vedlikeholdte typer** — `lib/types.ts` | Drifter ikke | `npx supabase gen types typescript` genererer automatisk |
| **`updated_at` oppdateres ikke automatisk** | Lyver | Trigger i Postgres |

---

## Design — hva et ekspertteam ville gjort skarpere

Midnight Luxe-temaet (svart/gull/Acumin) er konsekvent gjennomført og passer merkevaren. Tre løft som monner:

1. **Kontrast og lesbarhet.** `text-dark-muted` på svart bakgrunn ligger trolig under WCAG AA. På mobil i sollys blir det ulest. Løft muted-fargen ett hakk.
2. **Optimistisk UI.** Sjekklister og statusendringer bør oppdatere umiddelbart i UI-et og synke i bakgrunnen — nå venter brukeren på rundturen til Supabase.
3. **Kommandopalett (⌘K)** for å hoppe rett til et prosjekt. Med 60+ prosjekter i sesong er søk-og-hopp den største tidsbesparelsen per tastetrykk.

**Men:** ingenting av dette haster. Verktøyet fungerer, og RUSS 2027-deadlines er hovedsaken.

---

## Relevans for Fristil-plattformen (fase 2)

Det viktigste funnet er **strategisk**: borghini-os er et godt internverktøy, men riktig beslutning er tatt i å **ikke bygge markedsplassen oppå det**. Datamodellen (interne prosjekter med faste statuser) er inkompatibel med en flersidig markedsplass (selgere, produkter, lisenser, ordre, betalinger).

**`SOUNDBETTER_FABLE_SPEC.md`** i `10_fristil_marketplace/` er derimot et uvanlig godt utgangspunkt — sidekart, datamodell per produkttype og design-tokens er allerede spesifisert.

**Når fase 2 starter i september:**
- Nytt repo
- Stripe Connect fra dag én
- Gjenbruk Supabase-mønstrene fra borghini-os

### Anbefalt modellnivå

| Oppgave | Nivå |
|---------|------|
| Analyse, opprydding, mindre fikser | Standard / High |
| Fristil-bygget i høst (mange filer, arkitekturvalg, betalingsflyt) | **Extra / Max** — der betaler dyp resonnering seg |