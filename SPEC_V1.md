# Borghini Creative OS — Produktspesifikasjon V1

> **Status:** Pre-build | **Type:** MVP | **Bygger:** Hermes AI (DeepSeek V4 Flash)
> **Kunde:** Benjamin Borghini + Tormod Løkling — Borghini Entertainment
> **Dato:** 28. juni 2026

---

## 1. Produktvisjon

**Én setning:** En web-app som gir Borghini-teamet full oversikt over alle russegrupper, deres deadlines, status og feedback — slik at ingen release blir glemt igjen.

**Problemet det løser:**
- Prosjektledelse er spredt over Google Sheets, iMessage, Chrome-mapper og Dropbox
- Deadlines blir glemt fordi ingen har samlet oversikt
- Feedback fra grupper forsvinner i chat-tråder
- Det er umulig å se *hva som haster mest* på ett sted

---

## 2. Scope — Hva V1 SKAL inneholde

### 2.1 Dashboard (Hovedsiden)

**Hva:** En oversikt over alle aktive grupper, sortert etter hvor mye det haster.

| Kolonne | Beskrivelse |
|---------|-------------|
| Gruppe | Navn (f.eks. "Oppegård 2027") |
| Låt(er) | Aktive låter tilknyttet gruppa |
| Slippdato | Dato satt av gruppa |
| Nedtelling | Dager igjen til slipp |
| Status | Demo | Feedback | Mastering | Promo | Ute |
| Neste steg | Hva må skje nå (automatisk/ manuelt) |
| Siste aktivitet | Når noe sist ble oppdatert |

**Sortering:** Gruppen med *minst tid igjen* og *viktigste neste steg* havner øverst.

**AI-varsel:** Systemet sier ifra når en gruppe nærmer seg kritiske punkter:
- "⚠️ Oppegård — slipp om 10 dager. TikTok-lyd er ikke godkjent."
- "🔴 Nordby — deadline om 3 dager. Utkast ikke sendt."
- "✅ Ås — klar for mastering. Alt godkjent."

### 2.2 Prosjektside (Per gruppe)

**Hva:** En detaljside for hver gruppe med alle relevante data.

**Seksjoner:**

#### Informasjon
- Gruppenavn, kontaktpersoner (bussjef, musikksjef, økonomisjef)
- Prosjekt-type: **Standard** (85%) eller **Signature** (15%)
- Slippdato (kan endres, men med forbehold)
- Link til Dropbox-mappe (manuelt assignet)

#### Tidslinje
Automatisk utregnet basert på slippdato:

| Milepæl | Dato (auto) | Status |
|---------|-------------|--------|
| 🎵 TikTok-lyd godkjent | Slippdato - 28 dager | ☐ |
| 📀 Låta ferdig (mastering) | Slippdato - 21 dager | ☐ |
| 📬 Utkast sendt (runde 1) | Slippdato - 42 dager | ☐ |
| 🔄 Revisjon 1 | Slippdato - 35 dager | ☐ |
| 🔄 Revisjon 2 | Slippdato - 28 dager | ☐ |
| 🎬 Promo starter (TikTok) | Slippdato - 28 dager (helger) | ☐ |

*Hvis slippdato endres, regnes alle milepæler om automatisk.*

#### Intern sjekkliste (redigerbar)
- Sjekkpunkter som Benjamin/Tormod lager per prosjekt
- Eksempel: "Send logo til gruppa", "Sjekk at Spotify-artist finnes", "Book mastering"
- Huk av når utført

#### Feedback-log
- Legg inn feedback manuelt (tekst + opplastede filer: lyd/video/bilde)
- Hver feedback-entry har: dato, fra (hvem), type (tekst/lyd/video), status (ny/sett/håndtert)
- Historikk — ingenting blir borte

#### Demo-link
- SoundCloud/annen link til demoen
- Vises med en **nedtelling** for hvor lenge linken er aktiv (7-dagers konsept)
- Etter 7 dager: "🔒 Demo utløpt — ny versjon klar"

### 2.3 Opprettelse av nytt prosjekt

**Flow:**
1. Klikk "Nytt prosjekt"
2. Fyll inn: Gruppenavn, Slippdato, Prosjekt-type (Standard/Signature)
3. Velg (eller opprett) Dropbox-mappe-tilknytning
4. Systemet genererer automatisk tidslinje og initial sjekkliste
5. Ferdig — gruppa havner i dashbordet

### 2.4 Innstillinger / Profil

- Admin: Benjamin + Tormod (foreløpig kun dere to)
- Mulighet for å sette varslingspreferanser (e-post eller in-app)

---

## 3. Utenfor Scope (V2+)

*Ting vi har snakket om, men som IKKE skal bygges i V1:*
- Telegram-integrasjon (gruppe-kanaler per kunde)
- Avstemningssystem for gruppene
- Voice-to-checklist (snakk → AI lager tasks)
- AI kundesvar-generator
- Promo-pakke-generator (Tormods upsell-verktøy)
- FAQ-bot
- Spotify-metadata-innsamling
- Gruppemedlemmer logger inn selv
- Ableton-prosjekt-åpning fra web-app

---

## 4. 3 Måter Dette Kan Feile

### 🚨 1. "Det ble bare et fancy Google Sheets"

**Problemet:** Hvis appen bare viser informasjon uten å *tvinge* frem handling, blir den nok et sted du må sjekke — ikke stedet du styrer fra.

**Løsning:** Varslene må være gode nok til at du faktisk får lyst til å åpne appen. Status må oppdateres kjapt. Hvis noe haster, skal det føles.

**Tegn på feil:** Du åpner appen én gang, nikker, og går tilbake til Google Sheets.

### 🚨 2. Dropbox-integrasjonen blir for kompleks

**Problemet:** Å automatisk scanne Dropbox-strukturen og linke mapper til prosjekter høres enkelt ut, men Dropbox API har rate limits, mappestrukturer varierer, og feil kan føre til at feil filer vises.

**Løsning:** V1 lar deg manuelt lime inn en Dropbox-mappelenke. Ingen automatisk scanning. Det tar 10 sekunder og er 100% pålitelig.

**Tegn på feil:** Du bruker mer tid på å fikse Dropbox-koblinger enn du sparer på dashbordet.

### 🚨 3. Benjamin og Tormod har ulike behov, og V1 møter bare Benjamins

**Problemet:** Tormod trenger promo-pakker, FAQ-svar og Spotify-metadata. Hvis V1 ikke har noe for han, vil han ikke bruke den. Da blir det Benjamins private verktøy, ikke Borghinis felles system.

**Løsning:** V1 må ha *noe* for Tormod. Minimum: Han kan se dashbordet, se status på grupper, og legge inn notater. Bygg med tanke på at han skal inn senere.

**Tegn på feil:** Tormod sier "send meg en link til arket i stedet."

---

## 5. Teknisk Arkitektur (Hvordan vi bygger det)

### Tech Stack

| Lag | Valg | Hvorfor |
|-----|------|---------|
| Frontend | Next.js 14 (App Router) | Rask, React, SSR, enkel hosting |
| UI | Tailwind CSS + shadcn/ui | Ser bra ut, kjapp å utvikle |
| Database | Supabase (PostgreSQL) | Relasjonell, enkel å querye, gratis tier |
| Auth | Supabase Auth | Innebygd, epost + magic link |
| Hosting | Vercel | Gratis, integrert med Next.js |
| AI | Venice API (DeepSeek V4 Flash) | For varsler og logikk |
| Filer | Dropbox API (manuell linking) | Kun les-tilgang til mappestruktur |

### Database-modell (forenklet)

```sql
-- Brukere
users: id, name, email, role (admin/produsent)

-- Grupper
groups: id, name, type (standard/signature), 
        release_date, tiktok_approved (bool),
        status (demo/feedback/mastering/promo/ute),
        dropbox_link, created_at

-- Låter (en gruppe kan ha flere)
songs: id, group_id, title, status, 
       demo_link, demo_expires_at

-- Milepæler (autogenerert fra release_date)
milestones: id, group_id, title, due_date, 
            completed (bool), category

-- Feedback
feedback: id, group_id, song_id, content,
          file_url, sender, status (ny/sett/håndtert),
          created_at

-- Sjekkliste (interne tasks)
tasks: id, group_id, content, completed (bool),
       assigned_to, created_at

-- Notifikasjoner
notifications: id, group_id, message, severity,
               read (bool), created_at
```

---

## 6. Byggeplan — Task for Task

### Fase 1: Oppsett (dag 1)

**Task 1.1:** Opprett Next.js-prosjekt med App Router + Tailwind
- `npx create-next-app@latest borghini-os --typescript --tailwind --app`
- Installer shadcn/ui: `npx shadcn@latest init`

**Task 1.2:** Opprett Supabase-prosjekt
- Gå til supabase.com, opprett nytt prosjekt "borghini-os"
- Kjør SQL for å opprette tabellene (se skjema over)
- Sett opp Auth (e-post/passord for admin-brukere)

**Task 1.3:** Koble Next.js til Supabase
- Installer `@supabase/supabase-js` og `@supabase/ssr`
- Sett opp miljøvariabler i `.env.local`

### Fase 2: Auth & Base (dag 1-2)

**Task 2.1:** Bygg innloggingsside
- E-post + passord
- Kun inviterte brukere (Benjamin + Tormod)
- Etter innlogging: redirect til dashboard

**Task 2.2:** Bygg dashboard-layout
- Sidebar med: Dashboard | Prosjekter | Innstillinger
- Header med brukerinfo og logg-ut

### Fase 3: Dashboard (dag 2-3)

**Task 3.1:** Hent og vis alle grupper fra Supabase
- Kort for hver gruppe med: navn, slippdato, nedtelling, status
- Sortert etter urgency (minst tid → mest)

**Task 3.2:** AI-varsler på dashboard
- Sjekk hvilke grupper som nærmer seg kritiske milepæler
- Vis varsler som banner/badge på dashboard

### Fase 4: Prosjektside (dag 3-5)

**Task 4.1:** Bygg prosjektside med alle seksjoner
- Informasjonskort (gruppeinfo, slippdato, type)
- Tidslinje (autogenerert fra slippdato)
- Sjekkliste (legg til, huk av, slett)
- Feedback-log (legg inn tekst + filopplasting)
- Demolink (med 7-dagers teller)

**Task 4.2:** Opprett nytt prosjekt-side
- Skjema: navn, slippdato, type
- Generer milepæler automatisk
- Redirect til prosjektsiden

### Fase 5: Dropbox & Filer (dag 5-6)

**Task 5.1:** Manuell Dropbox-lenke per prosjekt
- Input-felt for Dropbox URL
- Valider at lenka er gyldig
- Vis som klikkbar link på prosjektsiden

### Fase 6: Polering & Deploy (dag 6-7)

**Task 6.1:** Deploy til Vercel
- Koble GitHub-repo til Vercel
- Sett opp miljøvariabler
- Test at alt fungerer

**Task 6.2:** Første pilot
- Legg inn en aktiv gruppe manuelt (f.eks. Oppegård)
- Benjamin bruker i 3 dager og gir feedback
- Fiks bugs og justeringer

---

## 7. Estimert Tidslinje

| Dag | Hva |
|-----|-----|
| Dag 1 | Oppsett (Next.js, Supabase, Auth) |
| Dag 2-3 | Dashboard + AI-varsler |
| Dag 3-5 | Prosjektside + alle seksjoner |
| Dag 5-6 | Dropbox-integrasjon + opprett prosjekt |
| Dag 6-7 | Deploy + pilot-test med Oppegård |

**Total byggetid:** ~7 dager for fungerende MVP

---

## 8. Suksesskriterier

- ✅ Benjamin åpner appen hver dag i stedet for Google Sheets
- ✅ Ingen release blir glemt fordi systemet sier ifra
- ✅ All feedback er på ett sted, ikke spredt over iMessage
- ✅ Tormod kan logge inn og se status på alle grupper
- ✅ Det tar < 30 sekunder å se hva som haster mest

---

*"Mindre tid på admin, mer tid på musikk."*