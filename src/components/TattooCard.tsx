import { Link } from "@tanstack/react-router";
import { DISCOUNT_PCT, discounted, usd, type Tattoo } from "@/lib/catalog";

export function TattooCard({ t }: { t: Tattoo }) {
  return (
    <Link
      to="/tattoos/$slug"
      params={{ slug: t.slug }}
      className="group overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-gold"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={t.image} alt={t.name} loading="lazy" width={512} height={512} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">-{DISCOUNT_PCT}%</span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg">{t.name}</h3>
        <p className="text-xs text-muted-foreground">{t.size} · {t.hours}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{usd(discounted(t.price))}</span>
          <span className="text-sm text-muted-foreground line-through">{usd(t.price)}</span>
        </div>
      </div>
    </Link>
  );
}
