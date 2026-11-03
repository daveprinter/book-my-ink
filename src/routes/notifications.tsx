import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Mail } from "lucide-react";
import { useMyBookings } from "@/lib/use-my-bookings";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | BookMyInk" },
      { name: "description", content: "Updates about your tattoo bookings and appointment reminders." },
      { property: "og:title", content: "Notifications | BookMyInk" },
      { property: "og:description", content: "Your BookMyInk updates." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const { items, loading } = useMyBookings();
  const map = new Map<string, { id: string; title: string; body: string; created_at: string; booking_ref: string | null }>();
  items.forEach((r) => r.notifications.forEach((n) => map.set(n.id, n)));
  const list = [...map.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const upcoming = items
    .map((r) => r.booking)
    .filter((b) => b.reminders_enabled && new Date(b.appointment_date).getTime() >= Date.now() - 86400000);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-4xl">Notifications</h1>
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/40 bg-card p-4 text-sm">
        <Mail className="mt-0.5 h-5 w-5 text-primary" />
        <p>We will reach out to you via your email on the day of your appointment, and to confirm every booking.</p>
      </div>
      {upcoming.map((b) => {
        const days = Math.ceil((new Date(b.appointment_date).getTime() - Date.now()) / 86400000);
        return (
          <div key={b.ref} className="mt-3 rounded-lg border border-accent/60 bg-accent/10 p-4 text-sm">
            <b>Reminder · {b.ref}:</b> your appointment is {days <= 0 ? "today" : `in ${days} day(s)`} — {b.appointment_date} at {b.appointment_time}.
          </div>
        );
      })}
      <div className="mt-6 space-y-3">
        {loading ? <p className="text-muted-foreground">Loading…</p> : list.length === 0 ? (
          <p className="text-muted-foreground">No notifications yet. <Link to="/book" className="text-primary">Make a booking</Link> to start receiving updates.</p>
        ) : list.map((n) => (
          <div key={n.id} className="flex gap-3 rounded-lg border border-border bg-card p-4">
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">{n.title} {n.booking_ref && <span className="text-xs text-muted-foreground">· {n.booking_ref}</span>}</p>
              <p className="text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
