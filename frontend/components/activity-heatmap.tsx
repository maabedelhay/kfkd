import { DayActivity } from "@/lib/api";

interface ActivityHeatmapProps {
  data: DayActivity[];
}

function getColor(count: number): string {
  if (count === 0) return "bg-zinc-200";
  if (count === 1) return "bg-emerald-200";
  if (count === 2) return "bg-emerald-300";
  if (count === 3) return "bg-emerald-400";
  return "bg-emerald-600";
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const days = data.length > 0 ? data : generateEmptyDays();

  const firstDate = new Date(days[0].date + "T00:00:00Z");
  const startOffset = firstDate.getUTCDay();

  const padded: (DayActivity | null)[] = [
    ...Array(startOffset).fill(null),
    ...days,
  ];

  const weeks: (DayActivity | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    week.forEach((day) => {
      if (!day) return;
      const m = new Date(day.date + "T00:00:00Z").getUTCMonth();
      if (m !== lastMonth) {
        monthLabels.push({ label: MONTHS[m], weekIndex: wi });
        lastMonth = m;
      }
    });
  });

  const totalSolves = days.reduce((sum, d) => sum + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;
  const gridHeight = 7 * 11 + 6 * 3;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Activity
        </span>
        <span className="text-xs text-zinc-400">
          {totalSolves} solves · {activeDays} active days
        </span>
      </div>

      <div className="border border-zinc-600 rounded-lg p-4 bg-lime-50 overflow-x-auto">
        {/* Month labels - full width row */}
        <div className="flex mb-1" style={{ marginLeft: "14px" }}>
          {weeks.map((_, wi) => {
            const label = monthLabels.find((m) => m.weekIndex === wi);
            return (
              <div key={wi} className="w-[14px] shrink-0">
                {label && (
                  <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                    {label.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid row */}
        <div className="flex">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-[3px] mr-[3px]">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
              <div key={i} className="h-[11px] flex items-center text-[10px] text-zinc-400 pr-1">
                {label}
              </div>
            ))}
          </div>

          {/* Week columns */}
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di] ?? null;
                  return (
                    <div
                      key={di}
                      title={
                        day
                          ? `${day.date}: ${day.count} solve${day.count !== 1 ? "s" : ""}`
                          : ""
                      }
                      className={`w-[11px] h-[11px] rounded-sm transition-colors ${
                        day ? getColor(day.count) : "bg-transparent"
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* GIF */}
          <div className="ml-4 flex items-center" style={{ height: gridHeight }}>
            <img
              src="../../touphStickT.gif"
              alt="touph animation"
              className="max-h-full max-w-[150px] object-contain rounded"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-3 justify-end">
          <span className="text-[10px] text-zinc-400 mr-1">Less</span>
          {["bg-zinc-200", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400", "bg-emerald-600"].map((c) => (
            <div key={c} className={`w-[11px] h-[11px] rounded-sm ${c}`} />
          ))}
          <span className="text-[10px] text-zinc-400 ml-1">More</span>
        </div>
      </div>
    </div>
  );
}

function generateEmptyDays(): DayActivity[] {
  const days: DayActivity[] = [];
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().slice(0, 10),
      count: 0,
    });
  }
  return days;
}
