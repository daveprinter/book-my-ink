import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, FileDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateChecker } from "@/components/DateChecker";
import { CUSTOM_BASE_PRICE, DISCOUNT_PCT, getTattoo, TATTOOS, usd } from "@/lib/catalog";
import { quote } from "@/lib/pricing";
import { createBooking, getMyBooking } from "@/lib/bookings.functions";
import { paypalCheckoutUrl } from "@/lib/paypal";
import { downloadReceipt } from "@/lib/receipt";
import { saveBooking } from "@/lib/local-bookings";

export const Route = createFileRoute("/book")({
  validateSearch: z.object({ tattoo: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Book a Tattoo Appointment | BookMyInk" },
      { name: "description", content: "Choose a design or describe your own, pick a date, pay a small deposit and you're booked." },
      { property: "og:title", content: "Book a Tattoo Appointment | BookMyInk" },
      { property: "og:description", content: "Reserve your tattoo session online with a deposit in USD." },
    ],
  }),
  component: Book,
});

const PLACEMENTS = ["Forearm", "Upper arm", "Wrist", "Back", "Chest", "Shoulder", "Leg / calf", "Ankle", "Neck", "Ribs", "Other"];
const SIZES = ["Small (≤ 7 cm)", "Medium (8–15 cm)", "Large (16–25 cm)", "XL / sleeve / back"];

function Book() {
  const search = Route.useSearch();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"template" | "custom">(search.tattoo ? "template" : "template");
  const [slug, setSlug] = useState<string | null>(search.tattoo ?? null);
  const [custom, setCustom] = useState("");
  const [placement, setPlacement] = useState(PLACEMENTS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dateOk, setDateOk] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pay, setPay] = useState<"paypal" | "card">("paypal");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const t = mode === "template" ? getTattoo(slug) : undefined;
  const q = quote(t ? t.price : CUSTOM_BASE_PRICE);
  const designOk = mode === "template" ? !!t : custom.trim().length > 5;
  const contactOk = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && phone.trim().length >= 6;

  const submit = async () => {
    setBusy(true);
    try {
      const r = await createBooking({
        data: { customer_name: name, email, phone, tattoo_slug: t?.slug ?? null, custom_description: mode === "custom" ? custom : null, placement, size, appointment_date: date, appointment_time: time, payment_method: pay },
      });
      saveBooking({ ref: r.ref, email });
      setDone(r.ref);
      toast.success("Booking created!");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    const payUrl = paypalCheckoutUrl({ ref: done, itemName: t?.name ?? "Custom tattoo", amount: q.deposit, origin: window.location.origin });
    return (
      <div className="mx-auto max-w-2xl px-6 py-14 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
        <h1 className="mt-4 text-3xl">You're almost booked!</h1>
        <p className="mt-2 text-muted-foreground">Booking reference <b className="text-primary">{done}</b>. We will reach out to you and send an email to <b>{email}</b> to confirm your booking.</p>
        <div className="mt-6 rounded-lg border border-primary/40 bg-card p-5 text-left">
          <p>Deposit due now: <b className="text-primary">{usd(q.deposit)}</b></p>
          <p className="text-sm text-muted-foreground">Remaining {usd(q.balance)} is paid at the studio after your tattoo on {date} at {time}.</p>
          <Button asChild variant="gold" className="mt-4 w-full">
            <a href={payUrl}>{pay === "paypal" ? <Wallet className="mr-2 h-4 w-4" /> : <CreditCard className="mr-2 h-4 w-4" />} Pay {usd(q.deposit)} deposit {pay === "paypal" ? "with PayPal" : "by Mastercard / Visa"}</a>
          </Button>
          {pay === "card" && <p className="mt-2 text-xs text-muted-foreground">On the secure PayPal page choose "Pay with Debit or Credit Card" — no PayPal account needed.</p>}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button variant="outline-gold" onClick={async () => { const r = await getMyBooking({ data: { ref: done, email } }); if (r) downloadReceipt(r.booking); }}>
            <FileDown className="mr-2 h-4 w-4" /> Download receipt
          </Button>
          <Button asChild variant="outline"><Link to="/my-bookings">Go to My Bookings</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="text-4xl">Book your appointment</h1>
        <div className="mt-4 flex gap-2 text-xs">
          {["Design", "Date", "Your details", "Review & pay"].map((s, i) => (
            <span key={s} className={`rounded-full px-3 py-1 ${step === i + 1 ? "bg-primary text-primary-foreground" : step > i + 1 ? "bg-secondary text-primary" : "bg-secondary text-muted-foreground"}`}>{i + 1}. {s}</span>
          ))}
        </div>

        {step === 1 && (
          <div className="mt-6 space-y-4">
            <div className="flex gap-2">
              <Button variant={mode === "template" ? "gold" : "outline"} onClick={() => setMode("template")}>Choose a template</Button>
              <Button variant={mode === "custom" ? "gold" : "outline"} onClick={() => setMode("custom")}>Describe my own idea</Button>
            </div>
            {mode === "template" ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {TATTOOS.map((x) => (
                  <button key={x.slug} onClick={() => setSlug(x.slug)} className={`overflow-hidden rounded-lg border text-left ${slug === x.slug ? "border-primary ring-2 ring-primary" : "border-border"}`}>
                    <img src={x.image} alt={x.name} loading="lazy" width={160} height={160} className="aspect-square w-full object-cover" />
                    <p className="truncate p-1.5 text-xs">{x.name}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <Label>What kind of tattoo do you want?</Label>
                <Textarea rows={5} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. A small lion head with my daughter's name in script, fine-line style…" />
                <p className="mt-1 text-xs text-muted-foreground">Custom designs start from {usd(CUSTOM_BASE_PRICE)} (final quote confirmed by your artist).</p>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Placement</Label><select className="mt-1 w-full rounded-md border border-input bg-background p-2" value={placement} onChange={(e) => setPlacement(e.target.value)}>{PLACEMENTS.map((p) => <option key={p}>{p}</option>)}</select></div>
              <div><Label>Size</Label><select className="mt-1 w-full rounded-md border border-input bg-background p-2" value={size} onChange={(e) => setSize(e.target.value)}>{SIZES.map((p) => <option key={p}>{p}</option>)}</select></div>
            </div>
            <Button variant="gold" disabled={!designOk} onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-4">
            <DateChecker date={date} time={time} onDate={setDate} onTime={setTime} onReady={setDateOk} />
            <div className="flex gap-2"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button variant="gold" disabled={!dateOk} onClick={() => setStep(3)}>Continue</Button></div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-3">
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} /></div>
            <div><Label>Phone number</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} placeholder="+1 555 123 4567" /></div>
            <div>
              <Label>Deposit payment method</Label>
              <div className="mt-1 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => setPay("paypal")} className={`flex items-center gap-2 rounded-md border p-3 ${pay === "paypal" ? "border-primary" : "border-border"}`}><Wallet className="h-5 w-5 text-primary" /> PayPal</button>
                <button type="button" onClick={() => setPay("card")} className={`flex items-center gap-2 rounded-md border p-3 ${pay === "card" ? "border-primary" : "border-border"}`}><CreditCard className="h-5 w-5 text-primary" /> Mastercard / Visa card</button>
              </div>
            </div>
            <div className="flex gap-2"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button variant="gold" disabled={!contactOk} onClick={() => setStep(4)}>Review</Button></div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 space-y-2 rounded-lg border border-border bg-card p-5 text-sm">
            <p><b>Design:</b> {t ? t.name : `Custom — ${custom}`}</p>
            <p><b>Placement / size:</b> {placement} · {size}</p>
            <p><b>Appointment:</b> {date} at {time}</p>
            <p><b>Name:</b> {name} · {email} · {phone}</p>
            <p><b>Payment:</b> {pay === "paypal" ? "PayPal" : "Card"}</p>
            <div className="flex gap-2 pt-3"><Button variant="outline" onClick={() => setStep(3)}>Back</Button><Button variant="gold" disabled={busy} onClick={submit}>{busy ? "Booking…" : `Confirm & pay ${usd(q.deposit)} deposit`}</Button></div>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-lg border border-primary/40 bg-card p-5 lg:sticky lg:top-6">
        <h2 className="text-xl">Summary</h2>
        {t && <img src={t.image} alt={t.name} width={280} height={280} className="mt-3 aspect-square w-full rounded object-cover" />}
        <p className="mt-3 font-display">{t ? t.name : mode === "custom" ? "Custom design" : "No design selected"}</p>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between"><dt>Price</dt><dd className="line-through text-muted-foreground">{usd(q.price)}</dd></div>
          <div className="flex justify-between"><dt>Discount ({DISCOUNT_PCT}%)</dt><dd className="text-accent">-{usd(q.price - q.final)}</dd></div>
          <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{usd(q.final)}</dd></div>
          <div className="flex justify-between text-primary"><dt>Deposit today</dt><dd>{usd(q.deposit)}</dd></div>
          <div className="flex justify-between text-muted-foreground"><dt>Pay on the day</dt><dd>{usd(q.balance)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
