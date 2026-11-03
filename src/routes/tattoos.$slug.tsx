import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DISCOUNT_PCT, getCategory, getTattoo, usd } from "@/lib/catalog";
import { quote } from "@/lib/pricing";

export const Route = createFileRoute("/tattoos/$slug")({
  loader: ({ params }) => {
    const t = getTattoo(params.slug);
    if (!t) throw notFound();
    return { slug: t.slug, name: t.name, meaning: t.meaning };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} Tattoo — Meaning & Price | BookMyInk` : "Tattoo | BookMyInk" },
      { name: "description", content: loaderData?.meaning ?? "Tattoo design details" },
      { property: "og:title", content: loaderData ? `${loaderData.name} Tattoo | BookMyInk` : "BookMyInk" },
      { property: "og:description", content: loaderData?.meaning ?? "Tattoo design details" },
    ],
  }),
  component: Detail,
});

const ANGLES = [
  { label: "Front", style: "none" },
  { label: "Left angle", style: "perspective(900px) rotateY(28deg)" },
  { label: "Right angle", style: "perspective(900px) rotateY(-28deg)" },
  { label: "Top-down", style: "perspective(900px) rotateX(30deg)" },
  { label: "Close-up", style: "scale(1.7)" },
  { label: "Stencil", style: "none", filter: "grayscale(1) contrast(1.6)" },
];

function Detail() {
  const { slug } = Route.useLoaderData();
  const t = getTattoo(slug)!;
  const [a, setA] = useState(0);
  const angle = ANGLES[a]!;
  const q = quote(t.price);
  return (
    <div className="grid gap-10 px-6 py-10 md:px-12 lg:grid-cols-2">
      <div>
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
          <img src={t.image} alt={`${t.name} – ${angle.label}`} width={512} height={512} className="h-full w-full object-cover transition duration-500" style={{ transform: angle.style, filter: angle.filter }} />
        </div>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {ANGLES.map((x, i) => (
            <button key={x.label} onClick={() => setA(i)} title={x.label} className={`overflow-hidden rounded border ${i === a ? "border-primary" : "border-border"}`}>
              <img src={t.image} alt={x.label} loading="lazy" width={80} height={80} className="aspect-square w-full object-cover" style={{ transform: x.style, filter: x.filter }} />
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Viewing: {angle.label}</p>
      </div>
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap gap-2">
            {t.categories.map((c) => (
              <Link key={c} to="/categories/$slug" params={{ slug: c }} className="rounded-full border border-border px-3 py-0.5 text-xs hover:border-primary">{getCategory(c)?.name}</Link>
            ))}
          </div>
          <h1 className="mt-3 text-4xl">{t.name}</h1>
          <p className="mt-2 text-muted-foreground">{t.details}</p>
        </div>
        <div className="rounded-lg border border-primary/40 bg-card p-5">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{usd(q.final)}</span>
            <span className="text-muted-foreground line-through">{usd(q.price)}</span>
            <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">{DISCOUNT_PCT}% OFF</span>
          </div>
          <p className="mt-2 text-sm">Book today with a <b>{usd(q.deposit)}</b> deposit · pay <b>{usd(q.balance)}</b> at the studio after your session.</p>
          <p className="text-xs text-muted-foreground">{t.size} · Approx. {t.hours}</p>
          <Button asChild variant="gold" className="mt-4 w-full"><Link to="/book" search={{ tattoo: t.slug }}>Book this tattoo</Link></Button>
        </div>
        <section><h2 className="text-xl text-primary">Meaning</h2><p className="mt-1">{t.meaning}</p></section>
        <section><h2 className="text-xl text-primary">Why people choose it</h2><p className="mt-1">{t.motivation}</p></section>
      </div>
    </div>
  );
}
