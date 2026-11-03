export type SavedBooking = { ref: string; email: string };
const KEY = "bmi_bookings";
export function getSaved(): SavedBooking[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveBooking(b: SavedBooking) {
  const list = getSaved().filter((x) => x.ref !== b.ref);
  localStorage.setItem(KEY, JSON.stringify([b, ...list]));
}
