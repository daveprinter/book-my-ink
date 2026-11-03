import { jsPDF } from "jspdf";
import { getTattoo } from "./catalog";

type B = {
  ref: string; customer_name: string; email: string; phone: string; tattoo_slug: string | null;
  custom_description: string | null; placement: string | null; size: string | null;
  appointment_date: string; appointment_time: string; price_usd: number; discount_pct: number;
  final_price_usd: number; deposit_usd: number; balance_usd: number; payment_status: string; status: string; created_at: string;
};

export function downloadReceipt(b: B) {
  const doc = new jsPDF();
  const t = getTattoo(b.tattoo_slug);
  doc.setFillColor(15, 13, 11);
  doc.rect(0, 0, 210, 36, "F");
  doc.setTextColor(212, 175, 95);
  doc.setFontSize(24);
  doc.text("BookMyInk", 14, 20);
  doc.setFontSize(9);
  doc.text("Your art, your artist, your appointment.", 14, 28);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.text(`Booking receipt  ${b.ref}`, 14, 50);
  doc.setFontSize(10);
  const rows: [string, string][] = [
    ["Issued", new Date(b.created_at).toLocaleString()],
    ["Name", b.customer_name],
    ["Email", b.email],
    ["Phone", b.phone],
    ["Tattoo", t ? t.name : "Custom design"],
    ["Description", b.custom_description || t?.details || "-"],
    ["Placement / size", `${b.placement || "-"} / ${b.size || "-"}`],
    ["Appointment", `${b.appointment_date} at ${b.appointment_time}`],
    ["Booking status", b.status],
    ["Payment status", b.payment_status.replace("_", " ")],
    ["Price", `$${Number(b.price_usd).toFixed(2)} USD`],
    ["Discount", `${b.discount_pct}%`],
    ["Total after discount", `$${Number(b.final_price_usd).toFixed(2)} USD`],
    ["Deposit (paid online)", `$${Number(b.deposit_usd).toFixed(2)} USD`],
    ["Balance due at studio", `$${Number(b.balance_usd).toFixed(2)} USD`],
  ];
  let y = 62;
  rows.forEach(([k, v]) => {
    doc.setTextColor(120, 110, 95);
    doc.text(k, 14, y);
    doc.setTextColor(20, 20, 20);
    doc.text(doc.splitTextToSize(String(v), 120), 75, y);
    y += k === "Description" ? 12 : 8;
  });
  doc.setTextColor(120, 110, 95);
  doc.text("We will reach out to you via email to confirm your booking.", 14, y + 10);
  doc.save(`BookMyInk-${b.ref}.pdf`);
}
