const BASE =
  process.env.REACT_APP_API_URL ||
  (import.meta?.env?.VITE_API_URL) ||
  "http://127.0.0.1:8000";

export async function fetchSeats(showId) {
  const r = await fetch(`${BASE}/api/shows/${showId}/seats/`);
  if (!r.ok) throw new Error("Failed to load seats");
  return r.json();
}

export async function createBooking(payload) {
  const r = await fetch(`${BASE}/api/bookings/`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
