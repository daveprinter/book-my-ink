import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TattooCard } from "@/components/TattooCard";
import { getCategory, TATTOOS } from "@/lib/catalog";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const c = getCategory(params.slug);
    if (!c) throw notFound();
    return { slug: c.slug, name: c.name, blurb: c.blurb };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} Tattoos | BookMyInk` : "Category | BookMyInk" },
      { name: "description", content: loaderData ? `${loaderData.name} tattoo designs: ${loaderData.blurb}.` : "Tattoo category" },
      { property: "og:title", content: loaderData ? `${loaderData.name} Tattoos | BookMyInk` : "BookMyInk" },
      { property: "og:description", content: loaderData?.blurb ?? "Tattoo category" },
    ],
  }),
  component: Cat,
});

function Cat() {
  const c = Route.useLoaderData();
  const items = TATTOOS.filter((t) => t.categories.includes(c.slug as never));
  return (
    <div className="px-6 py-10 md:px-12">
      <Link to="/categories" className="text-sm text-primary">← All categories</Link>
      <h1 className="mt-2 text-4xl">{c.name} Tattoos</h1>
      <p className="text-muted-foreground">{c.blurb}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((t) => <TattooCard key={t.slug} t={t} />)}
      </div>
    </div>
  );
}
