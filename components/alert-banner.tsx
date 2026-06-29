import { cn } from "@/lib/utils";
import { AlertEmblem, InfoEmblem, CriticalEmblem, HighEmblem } from "@/components/emblems";

const emblemMap = {
  low: InfoEmblem,
  medium: AlertEmblem,
  high: HighEmblem,
  critical: CriticalEmblem,
};

const styles = {
  low: "bg-blue-950/50 border-blue-500/20 text-blue-300",
  medium: "bg-amber-950/50 border-amber-500/20 text-amber-300",
  high: "bg-orange-950/50 border-orange-500/20 text-orange-300",
  critical: "bg-red-950/50 border-red-500/20 text-red-300",
};

export function AlertBanner({
  severity = "medium",
  title,
  message,
}: {
  severity?: "low" | "medium" | "high" | "critical";
  title?: string;
  message: string;
}) {
  const Emblem = emblemMap[severity];

  return (
    <div
      className={cn(
        "border rounded-lg px-4 py-3 flex items-start gap-3 animate-slide-in",
        styles[severity]
      )}
    >
      <span className="flex-shrink-0 mt-0.5">
        <Emblem size={18} />
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium text-sm">{title}</p>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}
