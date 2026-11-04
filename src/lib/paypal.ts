import { getPaypalEmail } from "./catalog";

/** PayPal checkout link (PayPal account or debit/credit card as guest). No monthly fees — PayPal only takes a fee per sale. */
export function paypalCheckoutUrl(opts: { ref: string; itemName: string; amount: number; origin: string }) {
  const p = new URLSearchParams({
    cmd: "_xclick",
    business: getPaypalEmail(),
    item_name: `BookMyInk deposit – ${opts.itemName} (${opts.ref})`,
    amount: opts.amount.toFixed(2),
    currency_code: "USD",
    custom: opts.ref,
    invoice: opts.ref,
    no_shipping: "1",
    return: `${opts.origin}/my-bookings?ref=${opts.ref}&paid=1`,
    cancel_return: `${opts.origin}/my-bookings?ref=${opts.ref}`,
    notify_url: `${opts.origin}/api/public/paypal-ipn`,
  });
  return `https://www.paypal.com/cgi-bin/webscr?${p.toString()}`;
}
