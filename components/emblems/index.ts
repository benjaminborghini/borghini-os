// Emblem system for Borghini Creative OS
// Midnight Luxe — custom SVG emblems replacing all emojis

export {
  CriticalEmblem, HighEmblem, MediumEmblem, LowEmblem, DoneEmblem,
  NotStartedEmblem, WipEmblem, PreparationEmblem, SessionBookedEmblem,
  DemoSentEmblem, FeedbackReceivedEmblem, RevisionEmblem, ApprovedEmblem,
  MasteringEmblem, FinishingEmblem, ReleasedEmblem,
} from "./status";

export {
  AlertEmblem, InfoEmblem, LockEmblem, SealEmblem,
  DraftSentEmblem, RevisionMilestoneEmblem, TikTokApprovedEmblem,
  TrackDoneEmblem, PromoStartEmblem, ReleaseStarEmblem,
  AudioFileEmblem, VideoFileEmblem, DocFileEmblem,
} from "./ui";

import type { ProjectStatus } from "@/lib/types";

// Status → emblem mapping
import {
  NotStartedEmblem, WipEmblem, PreparationEmblem, SessionBookedEmblem,
  DemoSentEmblem, FeedbackReceivedEmblem, RevisionEmblem, ApprovedEmblem,
  MasteringEmblem, FinishingEmblem, ReleasedEmblem,
} from "./status";

export const STATUS_EMBLEMS: Record<ProjectStatus, React.ComponentType<{ size?: number; className?: string }>> = {
  "IKKE BEGYNT": NotStartedEmblem,
  "WIP": WipEmblem,
  "FORBEREDELSE": PreparationEmblem,
  "SESSION BOOKET": SessionBookedEmblem,
  "DEMO SENDT": DemoSentEmblem,
  "FEEDBACK MOTTATT": FeedbackReceivedEmblem,
  "REVISJON": RevisionEmblem,
  "GODKJENT": ApprovedEmblem,
  "MASTERING": MasteringEmblem,
  "SLUTTFØRING": FinishingEmblem,
  "RELEASED": ReleasedEmblem,
};

// Urgency level → emblem mapping
import { CriticalEmblem, HighEmblem, MediumEmblem, LowEmblem, DoneEmblem } from "./status";

export const URGENCY_EMBLEMS = {
  critical: CriticalEmblem,
  high: HighEmblem,
  medium: MediumEmblem,
  low: LowEmblem,
  done: DoneEmblem,
} as const;

// Milestone category → emblem mapping
import {
  DraftSentEmblem, RevisionMilestoneEmblem, TikTokApprovedEmblem,
  TrackDoneEmblem, PromoStartEmblem, ReleaseStarEmblem,
} from "./ui";

export const MILESTONE_EMBLEMS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  utkast: DraftSentEmblem,
  revisjon: RevisionMilestoneEmblem,
  tiktok: TikTokApprovedEmblem,
  mastering: TrackDoneEmblem,
  promo: PromoStartEmblem,
  release: ReleaseStarEmblem,
};
