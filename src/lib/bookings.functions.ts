import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ADMIN_EMAIL, CUSTOM_BASE_PRICE, DEPOSIT_USD, DISCOUNT_PCT, getTattoo } from "./catalog";
import { quote } from "./pricing";

const admin = async () => (await import("@/integrations/supabase/client.server")).supabaseAdmin;

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function makeRef() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "BMI-";
  const r = crypto.getRandomValues(new Uint8Array(6));
  r.forEach((n) => (s += a[n % a.length]));
  return s;
}

const bookingInput = z.object({
  customer_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  tattoo_slug: z.string().max(80).nullable(),
  custom_description: z.string().max(1000).nullable(),
  placement: z.string().max(80),
  size: z.string().max(80),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().max(10),
  payment_method: z.enum(["paypal", "card"]),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => bookingInput.parse(d))
  .handler(async ({ data }) => {
    const t = getTattoo(data.tattoo_slug);
    if (!t && !data.custom_description) throw new Error("Pick a design or describe your idea");
    const q = quote(t ? t.price : CUSTOM_BASE_PRICE);
    const sb = await admin();
    const ref = makeRef();
    const { error } = await sb.from("bookings").insert({
      ref,
      ...data,
      tattoo_slug: t ? t.slug : null,
      price_usd: q.price,
      discount_pct: DISCOUNT_PCT,
      final_price_usd: q.final,
      deposit_usd: q.deposit,
      balance_usd: q.balance,
    });
    if (error) throw new Error(error.message);
    await sb.from("notifications").insert({
      booking_ref: ref,
      title: "Booking received",
      body: `Thanks ${data.customer_name}! Your request ${ref} is received. We will reach out to you via ${data.email} to confirm your booking.`,
    });
    return { ref };
  });

const lookup = z.object({ ref: z.string().max(20), email: z.string().email().max(255) });

async function findBooking(ref: string, email: string) {
  const sb = await admin();
  const { data } = await sb.from("bookings").select("*").eq("ref", ref.toUpperCase()).ilike("email", email).maybeSingle();
  return data;
}

export const getMyBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => lookup.parse(d))
  .handler(async ({ data }) => {
    const b = await findBooking(data.ref, data.email);
    if (!b) return null;
    const sb = await admin();
    const { data: notes } = await sb
      .from("notifications")
      .select("*")
      .or(`booking_ref.eq.${b.ref},booking_ref.is.null`)
      .order("created_at", { ascending: false })
      .limit(50);
    return { booking: b, notifications: notes ?? [] };
  });

export const changeBookingDate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    lookup.extend({ appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), appointment_time: z.string().max(10) }).parse(d),
  )
  .handler(async ({ data }) => {
    const b = await findBooking(data.ref, data.email);
    if (!b) throw new Error("Booking not found");
    const sb = await admin();
    await sb.from("bookings").update({ appointment_date: data.appointment_date, appointment_time: data.appointment_time }).eq("id", b.id);
    await sb.from("notifications").insert({
      booking_ref: b.ref,
      title: "Appointment rescheduled",
      body: `Your appointment is now on ${data.appointment_date} at ${data.appointment_time}.`,
    });
    return { ok: true };
  });

export const setReminders = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => lookup.extend({ enabled: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    const b = await findBooking(data.ref, data.email);
    if (!b) throw new Error("Booking not found");
    const sb = await admin();
    await sb.from("bookings").update({ reminders_enabled: data.enabled }).eq("id", b.id);
    return { ok: true };
  });

export const heartbeat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().min(8).max(64), path: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    await sb.from("site_presence").upsert({ visitor_id: data.id, path: data.path, last_seen: new Date().toISOString() });
    return { ok: true };
  });

/* ---------------- Admin ---------------- */

const ADMIN_PIN = "9090";

export const checkAdminPin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ pin: z.string().max(10) }).parse(d))
  .handler(async ({ data }) => ({ ok: data.pin === ADMIN_PIN }));

export const requestAdminOtp = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ pin: z.string().max(10), email: z.string().email().max(255) }).parse(d))
  .handler(async ({ data }) => {
    if (data.pin !== ADMIN_PIN) throw new Error("Invalid admin code");
    if (data.email.trim().toLowerCase() !== ADMIN_EMAIL) throw new Error("This email is not an admin");
    const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
    const sb = await admin();
    await sb.from("admin_otps").insert({ code_hash: await sha256(code), expires_at: new Date(Date.now() + 10 * 60000).toISOString() });
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) throw new Error("Email sending is not connected yet");
    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": RESEND_API_KEY },
      body: JSON.stringify({
        from: "BookMyInk <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `BookMyInk admin code: ${code}`,
        html: `<div style="font-family:Arial;padding:24px"><h2>BookMyInk Admin</h2><p>Your verification code is:</p><p style="font-size:32px;letter-spacing:8px;font-weight:bold">${code}</p><p>It expires in 10 minutes.</p></div>`,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error(`Resend failed [${res.status}]: ${t}`);
      throw new Error(`Could not send email [${res.status}]: ${t}`);
    }
    return { sent: true };
  });

export const verifyAdminOtp = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().regex(/^\d{6}$/) }).parse(d))
  .handler(async ({ data }) => {
    const sb = await admin();
    const h = await sha256(data.code);
    const { data: row } = await sb
      .from("admin_otps")
      .select("*")
      .eq("code_hash", h)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (!row) throw new Error("Invalid or expired code");
    await sb.from("admin_otps").update({ used: true }).eq("id", row.id);
    const token = crypto.randomUUID() + crypto.randomUUID();
    await sb.from("admin_sessions").insert({ token_hash: await sha256(token), expires_at: new Date(Date.now() + 12 * 3600000).toISOString() });
    return { token };
  });

async function requireAdmin(token: string) {
  const sb = await admin();
  const { data } = await sb
    .from("admin_sessions")
    .select("token_hash")
    .eq("token_hash", await sha256(token))
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!data) throw new Error("ADMIN_SESSION_EXPIRED");
  return sb;
}

const tok = z.object({ token: z.string().min(20).max(200) });

export const adminDashboard = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => tok.parse(d))
  .handler(async ({ data }) => {
    const sb = await requireAdmin(data.token);
    const since = new Date(Date.now() - 2 * 60000).toISOString();
    const [bookings, payments, notifications, active] = await Promise.all([
      sb.from("bookings").select("*").order("created_at", { ascending: false }).limit(500),
      sb.from("payments").select("*").order("created_at", { ascending: false }).limit(500),
      sb.from("notifications").select("*").order("created_at", { ascending: false }).limit(100),
      sb.from("site_presence").select("visitor_id", { count: "exact", head: true }).gt("last_seen", since),
    ]);
    return {
      bookings: bookings.data ?? [],
      payments: payments.data ?? [],
      notifications: notifications.data ?? [],
      activeUsers: active.count ?? 0,
    };
  });

const STATUS_MESSAGES: Record<string, string> = {
  approved: "Your booking has been approved and your appointment is ready. Please show up on your appointment day.",
  rejected: "Unfortunately we could not accept this booking. We'll contact you by email.",
  completed: "Your tattoo is complete. Thank you for choosing BookMyInk!",
  pending: "Your booking is pending review.",
  cancelled: "Your booking has been cancelled.",
};

export const adminUpdateStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    tok.extend({ id: z.string().uuid(), status: z.enum(["pending", "approved", "rejected", "completed", "cancelled"]) }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = await requireAdmin(data.token);
    const { data: b } = await sb.from("bookings").update({ status: data.status }).eq("id", data.id).select("ref, appointment_date, appointment_time").single();
    if (b) {
      const extra = data.status === "approved" ? ` See you on ${b.appointment_date} at ${b.appointment_time}.` : "";
      await sb.from("notifications").insert({ booking_ref: b.ref, title: `Booking ${data.status}`, body: STATUS_MESSAGES[data.status] + extra });
    }
    return { ok: true };
  });

export const adminMarkPaid = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => tok.extend({ id: z.string().uuid(), payment_status: z.enum(["pending", "deposit_paid", "fully_paid"]) }).parse(d))
  .handler(async ({ data }) => {
    const sb = await requireAdmin(data.token);
    await sb.from("bookings").update({ payment_status: data.payment_status }).eq("id", data.id);
    return { ok: true };
  });

export const adminSendNotification = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    tok.extend({ booking_ref: z.string().max(20).nullable(), title: z.string().min(1).max(120), body: z.string().min(1).max(1000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const sb = await requireAdmin(data.token);
    await sb.from("notifications").insert({ booking_ref: data.booking_ref || null, title: data.title, body: data.body });
    return { ok: true };
  });

export { DEPOSIT_USD };
