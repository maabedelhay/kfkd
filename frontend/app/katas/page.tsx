import Link from "next/link";
import { Plus } from "lucide-react";
import { kataApi, DayActivity } from "@/lib/api";
import { KatasTable } from "@/components/katas-table";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { Button } from "@/components/ui/button";
import { Kata } from "@/types/kata";

export const dynamic = "force-dynamic";

export default async function KatasPage() {
  let katas: Kata[] = [];
  let activity: DayActivity[] = [];
  let error: string | null = null;

  const [katasResult, activityResult] = await Promise.allSettled([
    kataApi.list(),
    kataApi.activity(),
  ]);

  if (katasResult.status === "fulfilled") {
    katas = katasResult.value;
  } else {
    error = katasResult.reason instanceof Error
      ? katasResult.reason.message
      : "Failed to load katas";
  }

  if (activityResult.status === "fulfilled") {
    activity = activityResult.value;
  }
  // activity failure is silent — heatmap just won't render

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Katas</h1>
          {!error && (
            <p className="text-sm text-zinc-400 mt-0.5">
              {katas.length} {katas.length === 1 ? "kata" : "katas"}
            </p>
          )}
        </div>
        <Button asChild size="sm">
          <Link href="/katas/new">
            <Plus className="h-4 w-4" />
            Add kata
          </Link>
        </Button>
      </div>

      <ActivityHeatmap data={activity} />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <KatasTable katas={katas} />
      )}
    </div>
  );
}
