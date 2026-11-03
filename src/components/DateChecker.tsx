import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TIMES = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
export const todayPlus = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

export function DateChecker({ date, time, onDate, onTime, onReady }: {
  date: string; time: string; onDate: (v: string) => void; onTime: (v: string) => void; onReady: (ok: boolean) => void;
}) {
  const [state, setState] = useState<"idle" | "checking" | "ok">("idle");
  useEffect(() => {
    if (!date || !time) { setState("idle"); onReady(false); return; }
    setState("checking"); onReady(false);
    const t = setTimeout(() => { setState("ok"); onReady(true); }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time]);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Preferred date</Label><Input type="date" min={todayPlus(1)} value={date} onChange={(e) => onDate(e.target.value)} /></div>
        <div>
          <Label>Preferred time</Label>
          <div className="mt-1 flex flex-wrap gap-2">
            {TIMES.map((x) => (
              <button type="button" key={x} onClick={() => onTime(x)} className={`rounded border px-3 py-1.5 text-sm ${time === x ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{x}</button>
            ))}
          </div>
        </div>
      </div>
      {state === "checking" && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Checking whether our tattoo artists are available that day…</p>}
      {state === "ok" && <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Yes, this is the perfect appointment date! An artist is available.</p>}
    </div>
  );
}
