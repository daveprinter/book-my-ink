import { createFileRoute } from "@tanstack/react-router";
import { PAYPAL_BUSINESS_EMAIL } from "@/lib/catalog";

// PayPal Instant Payment Notification (webhook). PayPal posts here after each payment;
// we verify the message with PayPal before recording anything.
export const Route = createFileRoute("/api/public/paypal-ipn")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const verify = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "BookMyInk-IPN" },
          body: `cmd=_notify-validate&${body}`,
        });
        const verdict = await verify.text();
        if (verdict !== "VERIFIED") {
          console.error("IPN not verified:", verdict);
          return new Response("ok");
        }
        const p = new URLSearchParams(body);
        const receiver = (p.get("receiver_email") || p.get("business") || "").toLowerCase();
        if (receiver !== PAYPAL_BUSINESS_EMAIL) return new Response("ok");

        const { supabaseAdmin: sb } = await import("@/integrations/supabase/client.server");
        const ref = p.get("custom") || p.get("invoice") || null;
        const amount = Number(p.get("mc_gross") || 0);
        const status = p.get("payment_status") || "";
        const txn = p.get("txn_id");

        if (txn) {
          const { data: dup } = await sb.from("payments").select("id").eq("txn_id", txn).maybeSingle();
          if (dup) return new Response("ok");
        }
        await sb.from("payments").insert({
          booking_ref: ref,
          provider: "paypal",
          txn_id: txn,
          amount_usd: amount,
          status,
          payer_email: p.get("payer_email"),
          raw: Object.fromEntries(p.entries()),
        });

        if (ref && status === "Completed" && p.get("mc_currency") === "USD") {
          const { data: b } = await sb.from("bookings").select("deposit_usd, final_price_usd").eq("ref", ref).maybeSingle();
          if (b && amount >= Number(b.deposit_usd)) {
            const ps = amount >= Number(b.final_price_usd) ? "fully_paid" : "deposit_paid";
            await sb.from("bookings").update({ payment_status: ps }).eq("ref", ref);
            await sb.from("notifications").insert({
              booking_ref: ref,
              title: "Deposit received",
              body: `We received your payment of $${amount.toFixed(2)}. The balance is paid at the studio on your appointment day.`,
            });
          }
        }
        return new Response("ok");
      },
    },
  },
});
