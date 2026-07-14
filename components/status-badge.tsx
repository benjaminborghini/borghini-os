import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import { STATUS_EMBLEMS } from "@/components/emblems";
import type { ProjectStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS["IKKE BEGYNT"];
  const Emblem = STATUS_EMBLEMS[status] || STATUS_EMBLEMS["IKKE BEGYNT"];

  return (
    <span
      className={cn(
        "inline-flex flex-shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap",
        colors.bg,
        colors.text
      )}
    >
      <Emblem size={12} />
      {status}
    </span>
  );
}
