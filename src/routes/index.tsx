import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgePercent, Bell, CalendarCheck, CreditCard, FileDown, ShieldCheck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { TattooCard } from "@/components/TattooCard";
import { CATEGORIES, DEPOSIT_USD, DISCOUNT_PCT, TATTOOS } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookMyInk — Your Next Tattoo Starts Here" },
      { name: "description", content: "Browse 20 tattoo designs across 15 styles, see meanings and prices, and book your appointment with a small deposit." },
      { property: "og:title", content: "BookMyInk — Your Next Tattoo Starts Here" },
      { property: "og:description", content: "Your art, your artist, your appointment. Book your tattoo online with a deposit." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: CalendarCheck, title: "Instant scheduling", text: "Pick a date, we check artist availability and lock it in." },
  { icon: BadgePercent, title: `${DISCOUNT_PCT}% off, always`, text: "Every design is discounted — no codes needed." },
  { icon: CreditCard, title: `$${DEPOSIT_USD} deposit only`, text: "Pay by PayPal or card. The rest is paid on the day." },
  { icon: Bell, title: "Reminders", text: "Get notified as your appointment approaches." },
  { icon: FileDown, title: "Downloadable receipts", text: "Save a PDF of your booking and payment details." },
  { icon: ShieldCheck, title: "Licensed artists", text: "Sterile, single-use needles and certified professionals." },
];

function Index() {
  return (
    <div>
      <section className="relative min-h-[560px] overflow-hidden">
        <img src={hero} alt="Tattoo artist at work" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="relative z-10 flex max-w-2xl flex-col gap-6 px-6 py-20 md:px-12 md:py-28">
          <img src={logo} alt="BookMyInk" width={96} height={96} className="h-24 w-24 rounded-full shadow-gold" />
          <h1 className="text-4xl leading-tight md:text-6xl">
            <span className="text-gold">BookMyInk</span>
          </h1>
          <p className="text-xl text-foreground/90 md:text-2xl">Your art, your artist, your appointment.<br />Your next tattoo starts here.</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg"><Link to="/book">Book an appointment</Link></Button>
            <Button asChild variant="outline-gold" size="lg"><Link to="/tattoos">Browse designs</Link></Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 px-6 py-14 sm:grid-cols-2 md:px-12 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg border border-border bg-card p-5">
            <Icon className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-display text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="px-6 pb-14 md:px-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl">Popular designs</h2>
          <Link to="/tattoos" className="text-sm text-primary hover:underline">View all 20 →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {TATTOOS.slice(0, 8).map((t) => <TattooCard key={t.slug} t={t} />)}
        </div>
      </section>

      <section className="px-6 pb-16 md:px-12">
        <h2 className="mb-6 text-3xl">Explore by category</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to="/categories/$slug" params={{ slug: c.slug }} className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary">
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
