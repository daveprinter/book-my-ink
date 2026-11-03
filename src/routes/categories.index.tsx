import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, TATTOOS } from "@/lib/catalog";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Tattoo Categories — 15 Styles | BookMyInk" },
      { name: "description", content: "Explore cultural, love, spiritual, animal, Japanese and more tattoo categories." },
      { property: "og:title", content: "Tattoo Categories | BookMyInk" },
      { property: "og:description", content: "15 tattoo categories to explore, from cultural to minimalist." },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="px-6 py-10 md:px-12">
      <h1 className="text-4xl">Categories</h1>
      <p className="mt-1 text-muted-foreground">15 styles — choose one to explore its designs and prices.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const items = TATTOOS.filter((t) => t.categories.includes(c.slug));
          return (
            <Link key={c.slug} to="/categories/$slug" params={{ slug: c.slug }} className="group overflow-hidden rounded-lg border border-border bg-card hover:border-primary">
              <div className="grid h-32 grid-cols-3">
                {items.slice(0, 3).map((t) => <img key={t.slug} src={t.image} alt="" loading="lazy" width={170} height={128} className="h-full w-full object-cover opacity-80 group-hover:opacity-100" />)}
              </div>
              <div className="p-4">
                <h2 className="text-xl">{c.name}</h2>
                <p className="text-sm text-muted-foreground">{c.blurb} · {items.length} designs</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
