import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTattoo, usd } from "@/lib/catalog";
import {
  adminDashboard, adminMarkPaid, adminSendNotification, adminUpdateStatus, checkAdminPin, requestAdminOtp, verifyAdminOtp,
} from "@/lib/bookings.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | BookMyInk" },
      { name: "description", content: "BookMyInk studio administration." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin | BookMyInk" },
      { property: "og:description", content: "Studio administration" },
    ],
  }),
  component: Admin,
});

type Dash = Awaited<ReturnType<typeof adminDashboard>>;

function Admin() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => setToken(sessionStorage.getItem("bmi_admin")), []);
  if (!token) return <Gate onToken={(t) => { sessionStorage.setItem("bmi_admin", t); setToken(t); }} />;
  return <Dashboard token={token} onExpire={() => { sessionStorage.removeItem("bmi_admin"); setToken(null); }} />;
}

function Gate({ onToken }: { onToken: (t: string) => void }) {
  const [step, setStep] = useState<"pin" | "email" | "otp">("pin");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); } };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-primary/40 bg-card p-6">
        <Lock className="mb-3 h-8 w-8 text-primary" />
        <h1 className="text-2xl">Admin Panel</h1>
        {step === "pin" && (
          <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); run(async () => { const r = await checkAdminPin({ data: { pin } }); if (!r.ok) throw new Error("Wrong admin code"); setStep("email"); }); }}>
            <Label>Admin code</Label>
            <Input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} autoFocus />
            <Button variant="gold" className="w-full" disabled={busy}>Continue</Button>
          </form>
        )}
        {step === "email" && (
          <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); run(async () => { await requestAdminOtp({ data: { pin, email } }); toast.success("A 6-digit code was sent to your email"); setStep("otp"); }); }}>
            <Label>Admin email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
            <Button variant="gold" className="w-full" disabled={busy}>{busy ? "Sending…" : "Send verification code"}</Button>
          </form>
        )}
        {step === "otp" && (
          <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); run(async () => { const r = await verifyAdminOtp({ data: { code } }); onToken(r.token); }); }}>
            <Label>6-digit code from your email</Label>
            <Input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus className="text-center text-2xl tracking-[0.5em]" />
            <Button variant="gold" className="w-full" disabled={busy || code.length !== 6}>Verify</Button>
          </form>
        )}
      </div>
    </div>
  );
}

function Dashboard({ token, onExpire }: { token: string; onExpire: () => void }) {
  const [d, setD] = useState<Dash | null>(null);
  const load = useCallback(async () => {
    try { setD(await adminDashboard({ data: { token } })); } catch (e) { if (String((e as Error).message).includes("ADMIN_SESSION")) onExpire(); else toast.error((e as Error).message); }
  }, [token, onExpire]);
  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const [nRef, setNRef] = useState("");
  const [nTitle, setNTitle] = useState("");
  const [nBody, setNBody] = useState("");

  if (!d) return <p className="p-10 text-muted-foreground">Loading dashboard…</p>;
  const paidTotal = d.payments.filter((p) => p.status === "Completed").reduce((s, p) => s + Number(p.amount_usd || 0), 0);
  const upcoming = d.bookings.filter((b) => b.appointment_date >= new Date().toISOString().slice(0, 10) && b.status !== "cancelled");

  const stats = [
    { label: "Active users now", value: d.activeUsers, icon: true },
    { label: "Total bookings", value: d.bookings.length },
    { label: "Pending approval", value: d.bookings.filter((b) => b.status === "pending").length },
    { label: "Upcoming appointments", value: upcoming.length },
    { label: "Payments received", value: usd(paidTotal) },
  ];

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Admin Dashboard</h1>
        <div className="flex gap-2"><Button variant="outline" size="sm" onClick={load}><RefreshCw className="mr-1 h-4 w-4" />Refresh</Button><Button variant="outline" size="sm" onClick={onExpire}>Log out</Button></div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">{s.icon && <Users className="h-3 w-3 text-success" />}{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="mt-8">
        <TabsList><TabsTrigger value="bookings">Bookings</TabsTrigger><TabsTrigger value="payments">Payments</TabsTrigger><TabsTrigger value="notify">Notifications</TabsTrigger></TabsList>

        <TabsContent value="bookings" className="mt-4 space-y-3">
          {d.bookings.length === 0 && <p className="text-muted-foreground">No bookings yet.</p>}
          {d.bookings.map((b) => (
            <div key={b.id} className="rounded-lg border border-border bg-card p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-base">{b.ref} · {getTattoo(b.tattoo_slug)?.name ?? "Custom design"}</p>
                <p className="text-xs text-muted-foreground">Booked {new Date(b.created_at).toLocaleString()}</p>
              </div>
              <div className="mt-2 grid gap-1 md:grid-cols-3">
                <p><b>Name:</b> {b.customer_name}</p>
                <p><b>Email:</b> <a className="text-primary" href={`mailto:${b.email}`}>{b.email}</a></p>
                <p><b>Phone:</b> <a className="text-primary" href={`tel:${b.phone}`}>{b.phone}</a></p>
                <p><b>Appointment:</b> {b.appointment_date} {b.appointment_time}</p>
                <p><b>Placement / size:</b> {b.placement} · {b.size}</p>
                <p><b>Method:</b> {b.payment_method}</p>
                <p><b>Total:</b> {usd(Number(b.final_price_usd))} ({b.discount_pct}% off {usd(Number(b.price_usd))})</p>
                <p><b>Deposit:</b> {usd(Number(b.deposit_usd))}</p>
                <p><b>Balance on day:</b> {usd(Number(b.balance_usd))}</p>
              </div>
              {b.custom_description && <p className="mt-1"><b>Idea:</b> {b.custom_description}</p>}
              <div className="mt-3 flex flex-wrap gap-3">
                <label className="flex items-center gap-2">Status
                  <select className="rounded border border-input bg-background p-1" value={b.status} onChange={async (e) => { await adminUpdateStatus({ data: { token, id: b.id, status: e.target.value as never } }); toast.success("Status updated — customer notified"); load(); }}>
                    {["pending", "approved", "rejected", "completed", "cancelled"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2">Payment
                  <select className="rounded border border-input bg-background p-1" value={b.payment_status} onChange={async (e) => { await adminMarkPaid({ data: { token, id: b.id, payment_status: e.target.value as never } }); load(); }}>
                    {["pending", "deposit_paid", "fully_paid"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <p className="mb-3 text-xs text-muted-foreground">Recorded automatically from PayPal payment notifications (PayPal account and card payments).</p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left"><tr><th className="p-2">Date</th><th className="p-2">Booking</th><th className="p-2">Amount</th><th className="p-2">Status</th><th className="p-2">Payer</th><th className="p-2">Transaction</th></tr></thead>
              <tbody>
                {d.payments.length === 0 && <tr><td colSpan={6} className="p-4 text-muted-foreground">No payments yet.</td></tr>}
                {d.payments.map((p) => (
                  <tr key={p.id} className="border-t border-border"><td className="p-2">{new Date(p.created_at).toLocaleString()}</td><td className="p-2">{p.booking_ref}</td><td className="p-2">{usd(Number(p.amount_usd || 0))}</td><td className="p-2">{p.status}</td><td className="p-2">{p.payer_email}</td><td className="p-2 text-xs">{p.txn_id}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="notify" className="mt-4 grid gap-6 lg:grid-cols-2">
          <form className="space-y-3 rounded-lg border border-border bg-card p-4" onSubmit={async (e) => { e.preventDefault(); await adminSendNotification({ data: { token, booking_ref: nRef.trim() || null, title: nTitle, body: nBody } }); toast.success("Notification sent"); setNTitle(""); setNBody(""); load(); }}>
            <h2 className="text-lg">Send custom notification</h2>
            <div><Label>Booking ref (leave empty to notify everyone)</Label><Input value={nRef} onChange={(e) => setNRef(e.target.value)} placeholder="BMI-XXXXXX" /></div>
            <div><Label>Title</Label><Input value={nTitle} onChange={(e) => setNTitle(e.target.value)} required /></div>
            <div><Label>Message</Label><Textarea value={nBody} onChange={(e) => setNBody(e.target.value)} required /></div>
            <Button variant="gold">Send</Button>
          </form>
          <div className="space-y-2">
            <h2 className="text-lg">Recent notifications</h2>
            {d.notifications.map((n) => (
              <div key={n.id} className="rounded border border-border bg-card p-3 text-sm"><b>{n.title}</b> <span className="text-xs text-muted-foreground">{n.booking_ref ?? "All customers"}</span><p className="text-muted-foreground">{n.body}</p></div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
