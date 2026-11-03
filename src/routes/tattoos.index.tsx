import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TattooCard } from "@/components/TattooCard";
import { CATEGORIES, TATTOOS } from "@/lib/catalog";

export const Route = createFileRoute("/tattoos/")({
  head: () => ({
    meta: [
      { title: "Tattoo Gallery — 20 Designs | BookMyInk" },
      { name: "description", content: "Browse 20 tattoo designs with prices, meanings and discounts." },
      { property: "og:title", content: "Tattoo Gallery | BookMyInk" },
      { property: "og:description", content: "20 professional tattoo designs with meanings and prices in USD." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const list = TATTOOS.filter(
    (t) =>
      (cat === "all" || t.categories.includes(cat as never)) &&
      (t.name + t.details + t.meaning).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="px-6 py-10 md:px-12">
      <h1 className="text-4xl">Tattoo Gallery</h1>
      <p className="mt-1 text-muted-foreground">Click any design to see it from different angles, its meaning and price.</p>
      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search e.g. lion, love, rose…" className="pl-9" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[{ slug: "all", name: "All" }, ...CATEGORIES].map((c) => (
          <button key={c.slug} onClick={() => setCat(c.slug)} className={`rounded-full border px-3 py-1 text-xs ${cat === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
            {c.name}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {list.map((t) => <TattooCard key={t.slug} t={t} />)}
      </div>
      {list.length === 0 && <p className="mt-8 text-muted-foreground">No designs match — you can describe a custom idea on the booking page.</p>}
    </div>
  );
}
