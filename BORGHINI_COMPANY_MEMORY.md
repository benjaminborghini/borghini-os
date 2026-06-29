# BORGHINI ENTERTAINMENT — Company Memory

> **Dato:** 28. juni 2026
> **Skrevet av:** Hermes AI (DeepSeek V4 Flash)
> **Formål:** Én sannhetskilde for Borghini Creative OS — alt vi har diskutert, slik at vi aldri må gjenta intervjuet.

---

## 1. SELSKAPET

**Navn:** Borghini Entertainment
**Gründere:** Benjamin Borghini + Tormod Løkling (CO-CEO)
**Tormod:** Musikkprodusent med 300M+ streams på CV'en. Lang erfaring, fokus på "tidløse hits".
**Benjamin:** Daglig leder, produsent, kjenner russemiljøet, vet hva som "kicker" for målgruppen.

**Dynamikk:** Benjamin og Tormod har til dels ulik smak. Benjamin er nærmere russen og deres preferanser. Tormod har erfaring med hva som fungerer kommersielt. De har vært uenige om produksjoner, men er enige om at rekke deadline er viktigst.

**Løsning på uenighet:** Begge lager hver sin versjon → gruppa stemmer. Beste idé vinner.

---

## 2. PRODUKTET — Borghini Creative OS

### 2.1 Visjon
En web-app som gir Borghini-teamet full oversikt over alle russegrupper, deres deadlines, status og feedback — slik at ingen release blir glemt.

**Motto:** *"Mindre tid på admin, mer tid på musikk."*

### 2.2 Hovedproblemer det løser
- Prosjektledelse spredt over Google Sheets, Chrome-mapper, iMessage, Dropbox
- Deadlines blir glemt (har skjedd — release gikk ut)
- Feedback fra grupper forsvinner i chat-tråder
- Umulig å se hva som haster mest på ett sted
- Tormod bruker mye tid på å svare på spørsmål (FAQ)

### 2.3 MVP Scope (V1 — bygges nå)

#### Dashboard
- Oversikt over alle aktive grupper
- Sortert etter urgency (minst tid til deadline → øverst)
- AI-varsler: "⚠️ Oppegård — slipp om 10 dager, TikTok-lyd ikke godkjent"
- En titt → du vet hva du må gjøre

#### Prosjektside (per gruppe)
- **Info:** Gruppenavn, kontaktpersoner (bussjef, musikksjef, økonomisjef), prosjekt-type, slippdato
- **Tidslinje:** Auto-generert fra slippdato
- **Sjekkliste:** Interne tasks — huk av når utført
- **Feedback-log:** Tekst + filopplasting (lyd/video/bilde), med status (ny/sett/håndtert)
- **Demo-link:** SoundCloud e.l. med 7-dagers nedtelling (låses etter 7 dager)
- **Dropbox-lenke:** Manuelt limt inn, vises som klikkbar link

#### Prosjekttyper
| Type | Andel | Beskrivelse |
|------|-------|-------------|
| **Standard** | ~85% | Gruppa eier låta, vi polerer. 7-dagers demovindu. |
| **Signature** | ~15% | Borghini-eide låter. Mer kreativ frihet, færre revisjoner. |

#### Tidslinje-algoritme (auto-regnet)
```
Slippdato = gruppa bestemmer
TikTok-lyd godkjent = slippdato - 28 dager  (viktigst!)
Låta ferdig (mastering) = slippdato - 21 dager
Utkast sendt = slippdato - 42 dager
Revisjon 1 = slippdato - 35 dager
Revisjon 2 = slippdato - 28 dager
Promo starter = slippdato - 28 dager (helger: fredag/lørdag kveld)
```

### 2.4 Utenfor V1 (V2+)
- Telegram-integrasjon (gruppe-kanaler per kunde)
- Avstemningssystem for gruppene
- Voice-to-checklist (opptak → tasks)
- AI kundesvar-generator
- Promo-pakker (Tormods upsell: coverart, TikTok-promo, etc.)
- FAQ-bot / automatisk svar
- Ableton-prosjekt-åpning fra web
- Spotify-metadata-innsamling
- Gruppemedlemmer logger inn selv

---

## 3. BRUKERE & ROLLER

| Rolle | Navn | Behov i V1 |
|-------|------|------------|
| Admin/Produsent | Benjamin | Se hva som haster, oppdatere status, legge inn feedback |
| CO-CEO | Tormod | Se status, legge inn notater (V2: promopakker, FAQ, Spotify-metadata) |
| Gruppa (ekstern) | Bussjef, musikksjef, økonomisjef | Utenfor scope V1 — leverer feedback via Benjamin |

**Målgruppe for tjenesten:** 1-3 tillitsvalgte per russegruppe (bussjef, musikksjef, økonomisjef). Resten av gruppa (20-35 pers) trenger kun avstemninger — utenfor V1.

---

## 4. BRAND & DESIGN

**Fargepalett:**
- Primær: `#cda41a` (gull) — accent, knapper, viktige elementer
- Bakgrunn: `#000000` (svart) — Midnight Luxe-stil
- Tekst: `#ffffff` (hvit)
- Sekundær: Mørkegrå (`#111111`) for kort/seksjoner

**Font:** Acumin Pro (Acumin-RPro.otf, Acumin-BdPro.otf, Acumin-ItPro.otf, Acumin-BdItPro.otf)

**Designfilosofi:**
- "Form follows function" — funksjon bestemmer utseende
- "Don't make me think" — selvinnlysende navigasjon
- "As little design as possible" — fjern alt unødvendig
- Mørkt tema = avslappende for øynene, premium-feeling
- Gull signaliserer "viktig/premium", rød signaliserer "haster"

**Logo:** BORGHINI i clean typografi + "ENT." i italic. Variantene:
- `borghini-logo-white.png` — hvit på gjennomsiktig
- `borghini-logo-black.png` — svart på gjennomsiktig
- `borghini-logo-gold.png` — gull variant

---

## 5. TEKNOLOGI

| Lag | Valg |
|-----|------|
| Frontend | Next.js 14 (App Router) |
| UI | Tailwind CSS + shadcn/ui + Acumin Pro font |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (e-post/passord) |
| AI | Venice API (DeepSeek V4 Pro for bygging) |
| Filer | Dropbox (manuell linking, ikke automatisk scanning) |
| Hosting | Vercel |

**AI-funksjoner i V1:**
- Automatisk beregning av milepæler fra slippdato
- Varsler: "X dager igjen — TikTok-lyd mangler"
- Urgency-sortering på dashboard

---

## 6. PROSESSER & WORKFLOW

### 6.1 Standard løp (85% av tilfellene)

1. **Research** — sjekker trender, gruppas referanser, sjanger
2. **Forberedelser** — så gjennomarbeidet at studio-demoen er nesten ferdig
3. **Studiodag 1-2** — spiller inn, lager demo
4. **Demo sendes** — link til gruppa med 7-dagers aktivt vindu
5. **Uke 1-2:** Revisjon 1 fra gruppa
6. **Uke 3:** Revisjon 2 (hvis nødvendig)
7. **Uke 3-4:** Godkjenning + mastering
8. **Uke 4:** TikTok-lyd ferdig + promo starter (helger)
9. **Slipp!**

### 6.2 7-dagers demovindu

- Demo-link er aktiv i 7 dager
- Etter 7 dager: linken låses — gruppa må forholde seg til nye versjoner
- Forhindrer at gruppa forelsker seg i en tidlig demo og avviser forbedringer
- Systemet viser: "🔒 Demo utløpt — ny versjon klar om X dager"

### 6.3 Håndtering av uenighet

- Benjamin og Tormod uenige? → Begge lager versjon → gruppa stemmer
- Gruppa uenige seg imellom? → Frist på 24 timer for tilbakemelding
- Hvis ingen svar → eskalering til Benjamin/Tormod

---

## 7. RISIKOANALYSE (3 måter å feile på)

### 🚨 1. "Ble bare et fancy Google Sheets"
**Løsning:** AI-varsler må være gode nok til at appen blir *go-to* stedet

### 🚨 2. Dropbox-integrasjon for kompleks
**Løsning:** V1 bruker manuell lenkeinnliming — 10 sekunder, 100% pålitelig

### 🚨 3. Tormod får ikke dekket sine behov
**Løsning:** V1 har noe for Tormod (dashbord-tilgang, notater). Hans fulle behov (promo, FAQ, metadata) kommer i V2.

---

## 8. DATABASEMODELL

```sql
users:    id, name, email, role (admin/produsent)
groups:   id, name, type (standard/signature), release_date,
          status (demo/feedback/mastering/promo/ute),
          tiktok_approved (bool), dropbox_link, created_at
songs:    id, group_id, title, status, demo_link, demo_expires_at
milestones: id, group_id, title, due_date, completed (bool), category
feedback: id, group_id, song_id, content, file_url,
          sender, status (ny/sett/håndtert), created_at
tasks:    id, group_id, content, completed (bool), assigned_to
notifications: id, group_id, message, severity, read (bool)
```

---

## 9. BYGGEPLAN (6 faser, ~7 dager)

| Fase | Dag(er) | Hva |
|------|---------|-----|
| 1 — Oppsett | Dag 1 | Next.js + Supabase + Tailwind + shadcn/ui |
| 2 — Auth | Dag 1-2 | Innlogging (kun Benjamin + Tormod) |
| 3 — Dashboard | Dag 2-3 | Urgency-sortering + AI-varsler |
| 4 — Prosjektside | Dag 3-5 | Info, tidslinje, sjekkliste, feedback, demo-link |
| 5 — Dropbox | Dag 5-6 | Manuell Dropbox-lenke per prosjekt |
| 6 — Deploy | Dag 6-7 | Vercel-deploy + pilot-test |

**Pilot:** Oppegård 2027 (aktiv gruppe)

---

## 10. FILER & STRUKTUR

```
~/Borghini_AI/borghini-os/
├── CLAUDE.md                          # AI-utviklingsregler
├── SPEC_V1.md                         # Full produktspec
├── BORGHINI_COMPANY_MEMORY.md         # ← Denne filen
├── public/
│   ├── images/
│   │   ├── borghini-logo-white.png
│   │   ├── borghini-logo-black.png
│   │   └── borghini-logo-gold.png
│   └── fonts/
│       ├── Acumin-RPro.otf
│       ├── Acumin-BdPro.otf
│       ├── Acumin-ItPro.otf
│       └── Acumin-BdItPro.otf
└── (Next.js-prosjekt starter her)
```