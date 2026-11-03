import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingCard } from "@/components/BookingCard";
import { getMyBooking } from "@/lib/bookings.functions";
import { saveBooking } from "@/lib/local-bookings";
import { useMyBookings } from "@/lib/use-my-bookings";

export const Route = createFileRoute("/my-bookings")({
  validateSearch: z.object({ ref: z.string().optional(), paid: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "My Bookings | BookMyInk" },
      { name: "description", content: "Track your tattoo bookings, change dates, set reminders and download receipts." },
      { property: "og:title", content: "My Bookings | BookMyInk" },
      { property: "og:description", content: "Manage your tattoo appointments." },
    ],
  }),
  component: MyBookings,
});

function MyBookings() {
  const search = Route.useSearch();
  const { items, loading, reload } = useMyBookings();
  const [ref, setRef] = useState(search.ref ?? "");
  const [email, setEmail] = useState("");

  const find = async () => {
    const r = await getMyBooking({ data: { ref: ref.trim(), email: email.trim() } }).catch(() => null);
    if (!r) return toast.error("No booking found with that reference and email");
    saveBooking({ ref: r.booking.ref, email: r.booking.email });
    reload();
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-4xl">My Bookings</h1>
      {search.paid && <p className="mt-3 rounded bg-success/15 p-3 text-sm text-success">Thank you! Your payment is being confirmed by PayPal — your booking will update shortly.</p>}
      <div className="mt-6 flex flex-wrap gap-2 rounded-lg border border-border bg-card p-4">
        <Input className="max-w-40" placeholder="BMI-XXXXXX" value={ref} onChange={(e) => setRef(e.target.value)} />
        <Input className="max-w-64" type="email" placeholder="Booking email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button variant="outline-gold" onClick={find}>Find booking</Button>
      </div>
      <div className="mt-6 space-y-4">
        {loading ? <p className="text-muted-foreground">Loading…</p> : items.length === 0 ? (
          <p className="text-muted-foreground">No bookings yet. <Link to="/book" className="text-primary">Book your first tattoo →</Link></p>
        ) : items.map((r) => <BookingCard key={r.booking.id} b={r.booking} onChange={reload} />)}
      </div>
    </div>
  );
}
