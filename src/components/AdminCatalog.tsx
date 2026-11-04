import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPaypalEmail, TATTOOS, usd, discounted, type Tattoo } from "@/lib/catalog";
import { adminSavePaypalEmail, adminSaveTattoo } from "@/lib/bookings.functions";

const toBase64 = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = rej;
    r.readAsDataURL(f);
  });

export function AdminPaypal({ token }: { token: string }) {
  const qc = useQueryClient();
  const [email, setEmail] = useState(getPaypalEmail());
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="max-w-lg space-y-3 rounded-lg border border-border bg-card p-4"
      onSubmit={async (e) => {
        e.preventDefault(); setBusy(true);
        try { await adminSavePaypalEmail({ data: { token, email } }); await qc.invalidateQueries({ queryKey: ["catalog"] }); toast.success("PayPal email saved"); }
        catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
      }}
    >
      <h2 className="text-lg">PayPal payment email</h2>
      <p className="text-xs text-muted-foreground">Customer deposits are sent to this PayPal account. Card payments are handled by the payment gateway.</p>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Button variant="gold" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
    </form>
  );
}

export function AdminCatalog({ token }: { token: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {TATTOOS.map((t) => <TattooEditor key={t.slug + t.image + t.price + t.name} t={t} token={token} />)}
    </div>
  );
}

function TattooEditor({ t, token }: { t: Tattoo; token: string }) {
  const qc = useQueryClient();
  const [f, setF] = useState({ name: t.name, price: String(t.price), details: t.details, meaning: t.meaning, motivation: t.motivation });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(t.image);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    const price = Number(f.price);
    if (!price || price < 1) { toast.error("Enter a valid price"); return; }
    setBusy(true);
    try {
      const image = file ? { base64: await toBase64(file), type: file.type as "image/jpeg" } : null;
      await adminSaveTattoo({ data: { token, slug: t.slug, name: f.name, price, details: f.details, meaning: f.meaning, motivation: f.motivation, image } });
      await qc.invalidateQueries({ queryKey: ["catalog"] });
      toast.success(`${f.name} saved — live on the site`);
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4 text-sm">
      <div className="w-32 shrink-0 space-y-2">
        <img src={preview} alt={t.name} className="aspect-square w-full rounded object-cover" />
        <label className="block cursor-pointer rounded border border-input p-1 text-center text-xs hover:border-primary">
          Change image
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
            const x = e.target.files?.[0]; if (!x) return;
            if (x.size > 8 * 1024 * 1024) { toast.error("Image must be under 8 MB"); return; }
            setFile(x); setPreview(URL.createObjectURL(x));
          }} />
        </label>
      </div>
      <div className="flex-1 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2"><Label>Name</Label><Input value={f.name} onChange={set("name")} /></div>
          <div><Label>Price (USD)</Label><Input type="number" min={1} value={f.price} onChange={set("price")} /></div>
        </div>
        <p className="text-xs text-muted-foreground">Customers pay {usd(discounted(Number(f.price) || 0))} after discount.</p>
        <div><Label>Description</Label><Textarea rows={2} value={f.details} onChange={set("details")} /></div>
        <div><Label>Meaning</Label><Textarea rows={2} value={f.meaning} onChange={set("meaning")} /></div>
        <div><Label>Why people choose it</Label><Textarea rows={2} value={f.motivation} onChange={set("motivation")} /></div>
        <Button variant="gold" size="sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
      </div>
    </div>
  );
}
