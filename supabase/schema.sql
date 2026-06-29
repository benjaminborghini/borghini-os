-- ============================================================
-- BORGHINI CREATIVE OS — Database Schema V1
-- Kjør dette i Supabase SQL Editor
-- ============================================================

-- === EXTENSIONS ===
create extension if not exists "uuid-ossp";

-- === PRODUCERS ===
create table if not exists producers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null check (role in ('snekker','sluttforing','tracks','latskriver','kreativ')),
  daw text,
  phone text,
  notes text,
  spotify_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- === PROJECTS ===
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  project_id text unique not null,  -- "ID 149", "ID 170" etc
  name text not null,                -- Gruppenavn
  type text not null,
  status text not null default 'IKKE BEGYNT',
  form_status text,
  release_date date,
  producer_id uuid references producers(id) on delete set null,
  price integer,
  dropbox_link text,
  audition text,
  notes text,
  tiktok_approved boolean default false,
  spotify_sent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- === CONTACTS ===
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  role text,                -- bussjef, musikksjef, økonomisjef, kontaktperson
  phone text,
  created_at timestamptz default now()
);

-- === SONGS ===
create table if not exists songs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  status text default 'Idé',
  demo_link text,
  demo_expires_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- === MILESTONES ===
create table if not exists milestones (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  due_date date not null,
  completed boolean default false,
  category text not null,
  sort_order integer default 0
);

-- === TASKS (Intern sjekkliste) ===
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  content text not null,
  completed boolean default false,
  assigned_to text,
  created_at timestamptz default now()
);

-- === FEEDBACK ===
create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  song_id uuid references songs(id) on delete set null,
  content text not null,
  file_url text,
  file_name text,
  sender text not null,
  status text default 'ny' check (status in ('ny','sett','håndtert')),
  created_at timestamptz default now()
);

-- === PIPELINE (Salgsprosessen før prosjekt starter) ===
create table if not exists pipeline (
  id uuid primary key default uuid_generate_v4(),
  group_name text not null,
  contact_person text,
  phone text,
  interested_in text,
  group_size integer,
  budget text,
  meeting_date date,
  status text default 'Ny lead' check (status in (
    'Ny lead','Kontaktet','Møte booket','Tilbud sendt','Signert','Avlyst','Ikke interessert'
  )),
  deadline date,
  notes text,
  created_at timestamptz default now()
);

-- === PREPARATION FORMS (Forberedelsesskjema) ===
create table if not exists preparation_forms (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  concept_name text,
  concept_meaning text,
  internal_jokes text,
  beat_style text,
  beat_description text,
  text_style text,
  text_description text,
  rap_amount text,
  sing_amount text,
  rap_sing_notes text,
  beatswitch_importance integer,
  beatswitch_description text,
  beatswitch_optional boolean,
  live_importance integer,
  tiktok_importance integer,
  tiktok_suggestion text,
  sound_effects text,
  originality_importance integer,
  reference_links text,
  glossary_words text,
  glossary_phrases text,
  additional_ideas text,
  final_notes text,
  created_at timestamptz default now()
);

-- === NOTIFICATIONS ===
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  message text not null,
  severity text default 'low' check (severity in ('low','medium','high','critical')),
  read boolean default false,
  created_at timestamptz default now()
);

-- === USER PROFILES ===
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text default 'produsent' check (role in ('admin','produsent')),
  created_at timestamptz default now()
);

-- === DROPBOX SETTINGS (OAuth tokens) ===
create table if not exists dropbox_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text,
  connected_at timestamptz default now()
);

-- RLS for dropbox_settings
alter table dropbox_settings enable row level security;
create policy "User can read own dropbox settings" on dropbox_settings for select to authenticated using (auth.uid() = user_id);
create policy "User can insert own dropbox settings" on dropbox_settings for insert to authenticated with check (auth.uid() = user_id);
create policy "User can update own dropbox settings" on dropbox_settings for update to authenticated using (auth.uid() = user_id);
create policy "User can delete own dropbox settings" on dropbox_settings for delete to authenticated using (auth.uid() = user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table producers enable row level security;
alter table projects enable row level security;
alter table contacts enable row level security;
alter table songs enable row level security;
alter table milestones enable row level security;
alter table tasks enable row level security;
alter table feedback enable row level security;
alter table pipeline enable row level security;
alter table preparation_forms enable row level security;
alter table notifications enable row level security;
alter table profiles enable row level security;

-- Authenticated users can do everything (V1: kun Benjamin + Tormod)
-- Ikke-authenticated users = ingen tilgang

create policy "Authenticated read producers" on producers for select to authenticated using (true);
create policy "Authenticated insert producers" on producers for insert to authenticated with check (true);
create policy "Authenticated update producers" on producers for update to authenticated using (true);
create policy "Authenticated delete producers" on producers for delete to authenticated using (true);

create policy "Authenticated read projects" on projects for select to authenticated using (true);
create policy "Authenticated insert projects" on projects for insert to authenticated with check (true);
create policy "Authenticated update projects" on projects for update to authenticated using (true);
create policy "Authenticated delete projects" on projects for delete to authenticated using (true);

create policy "Authenticated read contacts" on contacts for select to authenticated using (true);
create policy "Authenticated insert contacts" on contacts for insert to authenticated with check (true);
create policy "Authenticated update contacts" on contacts for update to authenticated using (true);
create policy "Authenticated delete contacts" on contacts for delete to authenticated using (true);

create policy "Authenticated read songs" on songs for select to authenticated using (true);
create policy "Authenticated insert songs" on songs for insert to authenticated with check (true);
create policy "Authenticated update songs" on songs for update to authenticated using (true);
create policy "Authenticated delete songs" on songs for delete to authenticated using (true);

create policy "Authenticated read milestones" on milestones for select to authenticated using (true);
create policy "Authenticated insert milestones" on milestones for insert to authenticated with check (true);
create policy "Authenticated update milestones" on milestones for update to authenticated using (true);
create policy "Authenticated delete milestones" on milestones for delete to authenticated using (true);

create policy "Authenticated read tasks" on tasks for select to authenticated using (true);
create policy "Authenticated insert tasks" on tasks for insert to authenticated with check (true);
create policy "Authenticated update tasks" on tasks for update to authenticated using (true);
create policy "Authenticated delete tasks" on tasks for delete to authenticated using (true);

create policy "Authenticated read feedback" on feedback for select to authenticated using (true);
create policy "Authenticated insert feedback" on feedback for insert to authenticated with check (true);
create policy "Authenticated update feedback" on feedback for update to authenticated using (true);
create policy "Authenticated delete feedback" on feedback for delete to authenticated using (true);

create policy "Authenticated read pipeline" on pipeline for select to authenticated using (true);
create policy "Authenticated insert pipeline" on pipeline for insert to authenticated with check (true);
create policy "Authenticated update pipeline" on pipeline for update to authenticated using (true);
create policy "Authenticated delete pipeline" on pipeline for delete to authenticated using (true);

create policy "Authenticated read prep_forms" on preparation_forms for select to authenticated using (true);
create policy "Authenticated insert prep_forms" on preparation_forms for insert to authenticated with check (true);
create policy "Authenticated update prep_forms" on preparation_forms for update to authenticated using (true);
create policy "Authenticated delete prep_forms" on preparation_forms for delete to authenticated using (true);

create policy "Authenticated read notifications" on notifications for select to authenticated using (true);
create policy "Authenticated insert notifications" on notifications for insert to authenticated with check (true);
create policy "Authenticated update notifications" on notifications for update to authenticated using (true);
create policy "Authenticated delete notifications" on notifications for delete to authenticated using (true);

create policy "User can read own profile" on profiles for select to authenticated using (auth.uid() = id);
create policy "User can update own profile" on profiles for update to authenticated using (auth.uid() = id);
create policy "User can insert own profile" on profiles for insert to authenticated with check (auth.uid() = id);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

-- ============================================================
-- STORAGE BUCKET for feedback files
-- ============================================================

insert into storage.buckets (id, name, public)
values ('feedback-files', 'feedback-files', true)
on conflict (id) do nothing;

create policy "Authenticated upload feedback files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'feedback-files');

create policy "Authenticated read feedback files"
  on storage.objects for select to authenticated
  using (bucket_id = 'feedback-files');

create policy "Authenticated delete feedback files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'feedback-files');
