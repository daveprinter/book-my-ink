import { useState } from "react";
import { toast } from "sonner";
import { BellRing, CalendarClock, FileDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DateChecker } from "@/components/DateChecker";
import { getTattoo, usd } from "@/lib/catalog";
import { changeBookingDate, setReminders } from "@/lib/bookings.functions";
import { downloadReceipt } from "@/lib/receipt";
import { paypalCheckoutUrl } from "@/lib/paypal";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-secondary text-muted-foreground",
  approved: "bg-success text-primary-foreground",
  completed: "bg-primary text-primary-foreground",
  rejected: "bg-destructive text-destructive-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

export function BookingCard({ b, onChange }: { b: Booking; onChange: () => void }) {
  const t = getTattoo(b.tattoo_slug);
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(b.appointment_date);
  const [time, setTime] = useState(b.appointment_time);
  const [ok, setOk] = useState(false);

  const toggleReminders = async (v: boolean) => {
    if (v && "Notification" in window && Notification.permission === "default") await Notification.requestPermission();
    await setReminders({ data: { ref: b.ref, email: b.email, enabled: v } });
    toast.success(v ? "Reminders on — we'll notify you as your date approaches" : "Reminders off");
    onChange();
  };

  const saveDate = async () => {
    await changeBookingDate({ data: { ref: b.ref, email: b.email, appointment_date: date, appointment_time: time } });
    toast.success("Appointment date updated");
    setEditing(false);
    onChange();
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start gap-4">
        {t && <img src={t.image} alt={t.name} width={96} height={96} className="h-24 w-24 rounded object-cover" />}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg">{t ? t.name : "Custom design"}</h3>
            <span className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[b.status] ?? ""}`}>{b.status}</span>
            <span className="rounded border border-border px-2 py-0.5 text-xs capitalize">{b.payment_status.replace("_", " ")}</span>
          </div>
          <p className="text-sm text-muted-foreground">Ref {b.ref} · {b.appointment_date} at {b.appointment_time}</p>
          <p className="text-sm">Total {usd(Number(b.final_price_usd))} · Deposit {usd(Number(b.deposit_usd))} · Due on the day {usd(Number(b.balance_usd))}</p>
          {b.status === "approved" && <p className="mt-2 rounded bg-success/15 p-2 text-sm text-success">Your booking has been approved and the appointment is ready. Please show up on {b.appointment_date} at {b.appointment_time}.</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline-gold" onClick={() => downloadReceipt(b)}><FileDown className="mr-1 h-4 w-4" />Receipt</Button>
        <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}><CalendarClock className="mr-1 h-4 w-4" />Change date</Button>
        {b.payment_status === "pending" && (
          <Button size="sm" variant="gold" asChild>
            <a href={paypalCheckoutUrl({ ref: b.ref, itemName: t?.name ?? "Custom tattoo", amount: Number(b.deposit_usd), origin: window.location.origin })}><Wallet className="mr-1 h-4 w-4" />Pay deposit (PayPal / card)</a>
          </Button>
        )}
        <label className="ml-auto flex items-center gap-2 text-sm"><BellRing className="h-4 w-4 text-primary" /> Reminders <Switch checked={b.reminders_enabled} onCheckedChange={toggleReminders} /></label>
      </div>
      {editing && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <DateChecker date={date} time={time} onDate={setDate} onTime={setTime} onReady={setOk} />
          <Button size="sm" variant="gold" disabled={!ok} onClick={saveDate}>Save new date</Button>
        </div>
      )}
    </div>
  );
}
