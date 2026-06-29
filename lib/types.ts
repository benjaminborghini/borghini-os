// Borghini Creative OS — Domain Types

export type ProjectType =
  | "HJEMMESNEKK"
  | "BORGHINI SNEKK"
  | "KONSEPTSNEKK"
  | "PARTYSNEKK"
  | "EP"
  | "SINGEL"
  | "ARTISTLÅT"
  | "MANAGEMENT DEAL"
  | "3 SNEKKERE + ARTISTLÅT";

export type ProjectStatus =
  | "IKKE BEGYNT"
  | "WIP"
  | "FORBEREDELSE"
  | "SESSION BOOKET"
  | "DEMO SENDT"
  | "FEEDBACK MOTTATT"
  | "REVISJON"
  | "GODKJENT"
  | "MASTERING"
  | "SLUTTFØRING"
  | "RELEASED";

export type FormStatus =
  | "Ikke sendt"
  | "Sendt forberedelse"
  | "Sendt releaseskjema"
  | "Godkjent";

export type SongStatus =
  | "Idé"
  | "Beat"
  | "Demo"
  | "Utkast 1"
  | "Utkast 2"
  | "Godkjent"
  | "Mastering"
  | "Ferdig";

export type FeedbackStatus = "ny" | "sett" | "håndtert";
export type NotificationSeverity = "low" | "medium" | "high" | "critical";
export type ProducerRole = "snekker" | "sluttforing" | "tracks" | "latskriver" | "kreativ";

export type PipelineStatus =
  | "Ny lead"
  | "Kontaktet"
  | "Møte booket"
  | "Tilbud sendt"
  | "Signert"
  | "Avlyst"
  | "Ikke interessert";

export interface Project {
  id: string;
  project_id: string; // e.g. "ID 149"
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  form_status: FormStatus | null;
  release_date: string | null;
  producer_id: string | null;
  producer_name?: string;
  price: number | null;
  dropbox_link: string | null;
  audition: string | null;
  notes: string | null;
  tiktok_approved: boolean;
  spotify_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  project_id: string;
  name: string;
  role: string; // bussjef, musikksjef, økonomisjef, kontaktperson
  phone: string | null;
}

export interface Producer {
  id: string;
  name: string;
  role: ProducerRole;
  daw: string | null;
  phone: string | null;
  notes: string | null;
  spotify_url: string | null;
  active: boolean;
}

export interface Song {
  id: string;
  project_id: string;
  title: string;
  status: SongStatus;
  demo_link: string | null;
  demo_expires_at: string | null;
  notes: string | null;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  due_date: string;
  completed: boolean;
  category: string;
  sort_order: number;
}

export interface Task {
  id: string;
  project_id: string;
  content: string;
  completed: boolean;
  assigned_to: string | null;
  created_at: string;
}

export interface Feedback {
  id: string;
  project_id: string;
  song_id: string | null;
  content: string;
  file_url: string | null;
  file_name: string | null;
  sender: string;
  status: FeedbackStatus;
  created_at: string;
}

export interface PipelineEntry {
  id: string;
  group_name: string;
  contact_person: string | null;
  phone: string | null;
  interested_in: string | null;
  group_size: number | null;
  budget: string | null;
  meeting_date: string | null;
  status: PipelineStatus;
  deadline: string | null;
  notes: string | null;
  created_at: string;
}

export interface PreparationForm {
  id: string;
  project_id: string;
  concept_name: string | null;
  concept_meaning: string | null;
  internal_jokes: string | null;
  beat_style: string | null;
  beat_description: string | null;
  text_style: string | null;
  text_description: string | null;
  rap_amount: string | null;
  sing_amount: string | null;
  rap_sing_notes: string | null;
  beatswitch_importance: number | null;
  beatswitch_description: string | null;
  beatswitch_optional: boolean | null;
  live_importance: number | null;
  tiktok_importance: number | null;
  tiktok_suggestion: string | null;
  sound_effects: string | null;
  originality_importance: number | null;
  reference_links: string | null;
  glossary_words: string | null;
  glossary_phrases: string | null;
  additional_ideas: string | null;
  final_notes: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  project_id: string | null;
  message: string;
  severity: NotificationSeverity;
  read: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "produsent";
}
