import type { SVGProps } from "react";

type EmblemProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...props }: EmblemProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

// ═══════════════════════════════════════
// UI EMBLEMS (4)
// ═══════════════════════════════════════

export function AlertEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M12 3L22 20H2L12 3Z" />
      <line x1="12" y1="9" x2="12" y2="14" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InfoEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LockEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <line x1="12" y1="15" x2="12" y2="18" />
    </svg>
  );
}

export function SealEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M12 2L14 4L16.5 3L17.5 5.5L20 5.5L19 8L21 9.5L19 11.5L21 13.5L19 15L20 17.5L17.5 17.5L16.5 20L14 19L12 21L10 19L7.5 20L6.5 17.5L4 17.5L5 15L3 13.5L5 11.5L3 9.5L5 8L4 5.5L6.5 5.5L7.5 3L10 4L12 2Z" />
      <path d="M8.5 11L11 13.5L15.5 9" />
    </svg>
  );
}

// ═══════════════════════════════════════
// MILESTONE EMBLEMS (6)
// ═══════════════════════════════════════

export function DraftSentEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" opacity="0.5" />
      <line x1="8" y1="17" x2="13" y2="17" opacity="0.5" />
      <path d="M12 19L18 13M18 13L16 11M18 13L20 15" />
    </svg>
  );
}

export function RevisionMilestoneEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.6" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}

export function TikTokApprovedEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M3 12C3 7 7 4 12 4s9 3 9 8" />
      <path d="M3 12c0 5 4 8 9 8s9-3 9-8" />
      <path d="M8 12L11 15L16 9" />
    </svg>
  );
}

export function TrackDoneEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 3L12 6" />
      <path d="M12 18L12 21" />
      <path d="M3 12L6 12" />
      <path d="M18 12L21 12" />
    </svg>
  );
}

export function PromoStartEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M3 11L21 2L18 20L12 14L3 11Z" />
      <line x1="3" y1="11" x2="12" y2="14" />
      <path d="M12 14L21 2" opacity="0.3" />
    </svg>
  );
}

export function ReleaseStarEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M12 2L14.5 8.5L21 9L16 13.5L17.5 20L12 16.5L6.5 20L8 13.5L3 9L9.5 8.5L12 2Z" />
    </svg>
  );
}

// ═══════════════════════════════════════
// FILE TYPE EMBLEMS (3)
// ═══════════════════════════════════════

export function AudioFileEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 18V13" />
      <circle cx="8" cy="18" r="1.5" fill="currentColor" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      <path d="M12 16V12" />
    </svg>
  );
}

export function VideoFileEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <rect x="8" y="11" width="8" height="7" rx="1.5" />
      <path d="M11 13.5L13.5 14.75L11 16V13.5Z" fill="currentColor" />
    </svg>
  );
}

export function DocFileEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="16" x2="16" y2="16" />
      <line x1="8" y1="19" x2="13" y2="19" />
    </svg>
  );
}
