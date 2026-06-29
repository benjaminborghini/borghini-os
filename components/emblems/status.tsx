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
// URGENCY EMBLEMS (5) — filled style
// ═══════════════════════════════════════

export function CriticalEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HighEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M12 3L21 20H3L12 3Z" fill="currentColor" stroke="none" />
      <line x1="12" y1="9" x2="12" y2="14" stroke="#000" strokeWidth="2.5" />
      <circle cx="12" cy="17.5" r="0.8" fill="#000" stroke="none" />
    </svg>
  );
}

export function MediumEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LowEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function DoneEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
      <path d="M8 12L11 15L16 9" stroke="#000" strokeWidth="2.5" />
    </svg>
  );
}

// ═══════════════════════════════════════
// STATUS EMBLEMS (11)
// ═══════════════════════════════════════

export function NotStartedEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
    </svg>
  );
}

export function WipEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M4 12H20" />
      <path d="M12 4V12" />
      <path d="M4 4L12 12" opacity="0.4" />
      <path d="M20 4L12 12" opacity="0.4" />
    </svg>
  );
}

export function PreparationEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function SessionBookedEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function DemoSentEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

export function FeedbackReceivedEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10H8.01" />
      <path d="M12 10H12.01" />
      <path d="M16 10H16.01" />
    </svg>
  );
}

export function RevisionEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M23 4V10H17" />
      <path d="M1 20V14H7" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function ApprovedEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M12 2L14.5 5L18 4L17 7.5L20 10L17 12.5L18 16L14.5 15L12 18L9.5 15L6 16L7 12.5L4 10L7 7.5L6 4L9.5 5L12 2Z" />
      <path d="M9 10L11 12L15 8" />
    </svg>
  );
}

export function MasteringEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function FinishingEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
      <path d="M19 17L19.7 19.3L22 20L19.7 20.7L19 23L18.3 20.7L16 20L18.3 19.3L19 17Z" opacity="0.5" />
    </svg>
  );
}

export function ReleasedEmblem({ size, ...p }: EmblemProps) {
  return (
    <svg {...base({ size, ...p })}>
      <path d="M4.5 16.5L3 21L7.5 19.5" />
      <path d="M7.5 19.5L16.5 10.5L13.5 7.5L4.5 16.5" />
      <path d="M16.5 10.5L19.5 7.5C20.5 6.5 20.5 5 19.5 4L18 2.5L14.5 6" />
      <path d="M14.5 6L13.5 7" />
      <path d="M10 4L11 5M6 8L7 9M5 13L6 14" opacity="0.4" />
    </svg>
  );
}
