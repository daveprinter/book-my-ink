import rose from "@/assets/tattoos/rose.jpg";
import koi from "@/assets/tattoos/koi.jpg";
import polynesian from "@/assets/tattoos/polynesian.jpg";
import lion from "@/assets/tattoos/lion.jpg";
import phoenix from "@/assets/tattoos/phoenix.jpg";
import infinityHeart from "@/assets/tattoos/infinity-heart.jpg";
import compass from "@/assets/tattoos/compass.jpg";
import lotus from "@/assets/tattoos/lotus-mandala.jpg";
import snake from "@/assets/tattoos/snake-dagger.jpg";
import wolf from "@/assets/tattoos/wolf-moon.jpg";
import skull from "@/assets/tattoos/sugar-skull.jpg";
import dragon from "@/assets/tattoos/dragon.jpg";
import butterfly from "@/assets/tattoos/butterfly.jpg";
import celtic from "@/assets/tattoos/celtic-knot.jpg";
import fox from "@/assets/tattoos/geometric-fox.jpg";
import wings from "@/assets/tattoos/angel-wings.jpg";
import anchor from "@/assets/tattoos/anchor.jpg";
import adinkra from "@/assets/tattoos/adinkra.jpg";
import eagle from "@/assets/tattoos/eagle.jpg";
import moon from "@/assets/tattoos/moon-stars.jpg";

/** Site-wide discount — always on. */
export const DISCOUNT_PCT = 20;
/** Deposit paid online to secure an appointment (USD). */
export const DEPOSIT_USD = 50;

export const CATEGORIES = [
  { slug: "cultural", name: "Cultural", blurb: "Heritage, roots and identity" },
  { slug: "love", name: "Love", blurb: "Romance, bonds and devotion" },
  { slug: "spiritual", name: "Spiritual", blurb: "Faith, peace and the divine" },
  { slug: "animal", name: "Animal", blurb: "Spirit animals and wild power" },
  { slug: "floral", name: "Floral", blurb: "Blooms, petals and growth" },
  { slug: "japanese", name: "Japanese", blurb: "Irezumi tradition" },
  { slug: "tribal", name: "Tribal", blurb: "Bold ancestral patterns" },
  { slug: "mythology", name: "Mythology", blurb: "Legends and creatures" },
  { slug: "minimalist", name: "Minimalist", blurb: "Fine-line, small and subtle" },
  { slug: "traditional", name: "Old School", blurb: "American traditional flash" },
  { slug: "geometric", name: "Geometric", blurb: "Lines, shapes and symmetry" },
  { slug: "nautical", name: "Nautical", blurb: "Sea, travel and adventure" },
  { slug: "memorial", name: "Memorial", blurb: "Honouring loved ones" },
  { slug: "strength", name: "Strength", blurb: "Courage and resilience" },
  { slug: "realism", name: "Realism", blurb: "Lifelike black & grey" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export type Tattoo = {
  slug: string;
  name: string;
  image: string;
  price: number;
  hours: string;
  size: string;
  categories: CategorySlug[];
  details: string;
  meaning: string;
  motivation: string;
};

export const TATTOOS: Tattoo[] = [
  { slug: "classic-rose", name: "Classic Rose", image: rose, price: 180, hours: "2–3 h", size: "Medium (10 cm)", categories: ["love", "floral", "traditional"], details: "Bold red rose with black-grey shaded leaves and thorned stem.", meaning: "Love, passion and beauty that endures pain — the thorns remind us beauty comes with sacrifice.", motivation: "Chosen to celebrate a relationship, a new chapter, or self-love after hard times." },
  { slug: "koi-yin-yang", name: "Koi Yin-Yang", image: koi, price: 420, hours: "5–6 h", size: "Large (18 cm)", categories: ["japanese", "spiritual", "cultural"], details: "Two koi circling in waves forming a yin-yang, orange and black.", meaning: "Perseverance and balance — the koi swims upstream to become a dragon.", motivation: "For anyone who pushed through adversity and found balance on the other side." },
  { slug: "polynesian-band", name: "Polynesian Band", image: polynesian, price: 260, hours: "3–4 h", size: "Armband", categories: ["tribal", "cultural", "strength"], details: "Solid black armband with spearhead, shark-tooth and ocean motifs.", meaning: "Protection, lineage and status — each symbol tells part of your story.", motivation: "Worn to honour ancestry and carry the strength of family." },
  { slug: "lion-realism", name: "Lion Realism", image: lion, price: 480, hours: "6–7 h", size: "Large (20 cm)", categories: ["animal", "realism", "strength"], details: "Photo-realistic lion portrait in black and grey with amber eyes.", meaning: "Courage, leadership and pride.", motivation: "For leaders, protectors and those who refuse to back down." },
  { slug: "rising-phoenix", name: "Rising Phoenix", image: phoenix, price: 390, hours: "5 h", size: "Large (16 cm)", categories: ["mythology", "strength", "spiritual"], details: "Fiery phoenix with sweeping wings in red-orange gradient.", meaning: "Rebirth and renewal — rising from the ashes.", motivation: "Marks recovery, a fresh start, or surviving something that tried to burn you." },
  { slug: "infinity-heart", name: "Infinity Heart", image: infinityHeart, price: 95, hours: "1 h", size: "Small (5 cm)", categories: ["love", "minimalist"], details: "Infinity loop woven into a heart with a red accent.", meaning: "Eternal, unconditional love.", motivation: "A popular matching tattoo for couples, parents and best friends." },
  { slug: "wanderer-compass", name: "Wanderer Compass", image: compass, price: 300, hours: "4 h", size: "Medium (14 cm)", categories: ["nautical", "geometric"], details: "Compass rose over a world map with dot-work grid.", meaning: "Direction, adventure and always finding your way home.", motivation: "For travellers and anyone navigating a big life change." },
  { slug: "lotus-mandala", name: "Lotus Mandala", image: lotus, price: 280, hours: "3–4 h", size: "Medium (12 cm)", categories: ["spiritual", "floral", "geometric"], details: "Blush lotus centred in an ornamental dot-work mandala.", meaning: "Purity and enlightenment — the lotus blooms from mud.", motivation: "Chosen during spiritual growth, meditation journeys or healing." },
  { slug: "serpent-dagger", name: "Serpent & Dagger", image: snake, price: 220, hours: "2–3 h", size: "Medium (15 cm)", categories: ["traditional", "strength"], details: "Snake coiling a dagger, bold traditional linework.", meaning: "Overcoming betrayal and danger; transformation through conflict.", motivation: "For people who survived betrayal and came out sharper." },
  { slug: "wolf-moon", name: "Howling Wolf", image: wolf, price: 450, hours: "6 h", size: "Large (18 cm)", categories: ["animal", "realism", "spiritual"], details: "Wolf howling at a full moon above a pine forest.", meaning: "Loyalty, instinct and the bond of the pack.", motivation: "Honours family loyalty, independence and inner instinct." },
  { slug: "sugar-skull", name: "Sugar Skull", image: skull, price: 260, hours: "3–4 h", size: "Medium (12 cm)", categories: ["cultural", "memorial"], details: "Calavera adorned with roses and ornamental detail.", meaning: "Día de los Muertos — celebrating life and remembering the departed.", motivation: "A joyful tribute to a loved one who has passed." },
  { slug: "eastern-dragon", name: "Eastern Dragon", image: dragon, price: 520, hours: "7–8 h", size: "XL (25 cm)", categories: ["japanese", "mythology", "strength"], details: "Serpentine dragon with red flame accents.", meaning: "Wisdom, power and good fortune.", motivation: "For those seeking strength, luck and protection." },
  { slug: "watercolor-butterfly", name: "Watercolor Butterfly", image: butterfly, price: 160, hours: "2 h", size: "Small-Medium (8 cm)", categories: ["floral", "minimalist", "love"], details: "Butterfly with soft violet and blue watercolor splashes.", meaning: "Transformation, freedom and the soul.", motivation: "Celebrates personal growth or remembers someone who 'flew away'." },
  { slug: "celtic-trinity", name: "Celtic Trinity Knot", image: celtic, price: 190, hours: "2 h", size: "Medium (10 cm)", categories: ["cultural", "spiritual", "geometric"], details: "Triquetra interwoven with a circle, no beginning or end.", meaning: "Eternity, unity and the threefold nature of life.", motivation: "Connects to Irish/Celtic roots or a sacred trio in your life." },
  { slug: "geometric-fox", name: "Geometric Fox", image: fox, price: 240, hours: "3 h", size: "Medium (12 cm)", categories: ["geometric", "animal"], details: "Low-poly fox face with amber shading.", meaning: "Cleverness, adaptability and playful wit.", motivation: "For creative minds who think their way around obstacles." },
  { slug: "angel-wings", name: "Angel Wings", image: wings, price: 550, hours: "7–8 h", size: "Back piece", categories: ["memorial", "spiritual", "love"], details: "Pair of feathered wings, detailed black and grey.", meaning: "Protection, freedom and a guardian watching over you.", motivation: "Most often a memorial for someone now watching from above." },
  { slug: "rope-anchor", name: "Rope Anchor", image: anchor, price: 150, hours: "2 h", size: "Medium (10 cm)", categories: ["nautical", "traditional", "strength"], details: "Iron anchor wrapped in rope, classic sailor style.", meaning: "Stability and staying grounded through storms.", motivation: "For people who are someone's rock — or found theirs." },
  { slug: "adinkra-dwennimmen", name: "Adinkra Dwennimmen", image: adinkra, price: 120, hours: "1–2 h", size: "Small (7 cm)", categories: ["cultural", "tribal", "strength"], details: "Ghanaian Adinkra 'ram's horns' symbol in solid black.", meaning: "Humility together with strength.", motivation: "Celebrates African heritage and quiet, grounded power." },
  { slug: "freedom-eagle", name: "Freedom Eagle", image: eagle, price: 400, hours: "5 h", size: "Large (chest)", categories: ["animal", "strength", "realism"], details: "Bald eagle with full wingspan, realistic feathers.", meaning: "Freedom, vision and honour.", motivation: "For those who value independence and seeing the bigger picture." },
  { slug: "crescent-stars", name: "Crescent & Stars", image: moon, price: 85, hours: "1 h", size: "Small (6 cm)", categories: ["minimalist", "spiritual"], details: "Fine-line crescent moon with scattered stars.", meaning: "Cycles, intuition and feminine energy.", motivation: "A delicate first tattoo or a nod to night owls and dreamers." },
];

export const discounted = (price: number) => Math.round(price * (1 - DISCOUNT_PCT / 100));
export const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
export const getTattoo = (slug?: string | null) => TATTOOS.find((t) => t.slug === slug);
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const CUSTOM_BASE_PRICE = 250;
export const PAYPAL_BUSINESS_EMAIL = "kuladavid177@gmail.com";
export const ADMIN_EMAIL = "kuladavid177@gmail.com";

/** Admin edits saved in the database, applied on top of the built-in catalog. */
export type TattooOverride = {
  slug: string; name: string | null; price: number | null; image_url: string | null;
  details: string | null; meaning: string | null; motivation: string | null;
};
export type CatalogData = { overrides: TattooOverride[]; paypalEmail: string | null };

const BASE = TATTOOS.map((t) => ({ ...t }));
let paypalEmail = PAYPAL_BUSINESS_EMAIL;
export const getPaypalEmail = () => paypalEmail;

export function applyCatalog(data: CatalogData | undefined | null) {
  if (!data) return;
  BASE.forEach((b, i) => {
    const o = data.overrides.find((x) => x.slug === b.slug);
    TATTOOS[i] = {
      ...b,
      name: o?.name || b.name,
      price: o?.price != null ? Number(o.price) : b.price,
      image: o?.image_url || b.image,
      details: o?.details || b.details,
      meaning: o?.meaning || b.meaning,
      motivation: o?.motivation || b.motivation,
    };
  });
  paypalEmail = (data.paypalEmail || PAYPAL_BUSINESS_EMAIL).toLowerCase();
}
