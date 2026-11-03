import { useCallback, useEffect, useState } from "react";
import { getMyBooking } from "./bookings.functions";
import { getSaved } from "./local-bookings";

type Result = NonNullable<Awaited<ReturnType<typeof getMyBooking>>>;

export function useMyBookings() {
  const [items, setItems] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const saved = getSaved();
    const res = await Promise.all(saved.map((s) => getMyBooking({ data: s }).catch(() => null)));
    setItems(res.filter(Boolean) as Result[]);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  // Local reminders: browser notification when an appointment is within 3 days.
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    items.forEach(({ booking: b }) => {
      if (!b.reminders_enabled) return;
      const days = Math.ceil((new Date(b.appointment_date).getTime() - Date.now()) / 86400000);
      const key = `bmi_rem_${b.ref}_${b.appointment_date}_${days}`;
      if (days >= 0 && days <= 3 && !localStorage.getItem(key)) {
        new Notification("BookMyInk appointment reminder", { body: days === 0 ? `Your tattoo appointment is today at ${b.appointment_time}.` : `Your tattoo appointment is in ${days} day(s), on ${b.appointment_date}.`, icon: "/logo.png" });
        localStorage.setItem(key, "1");
      }
    });
  }, [items]);

  return { items, loading, reload: load };
}
