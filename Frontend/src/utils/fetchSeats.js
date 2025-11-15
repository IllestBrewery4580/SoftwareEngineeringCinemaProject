export async function fetchSeats(showId) {
  const r = await fetch(`http://127.0.0.1:8000/api/shows/${showId}/seats/`, {
    method: 'GET',
    headers: {"Content-Type":"application/json"},
    credentials: 'include'
  });
  if (!r.ok) throw new Error("Failed to load seats");
  return r.json();
}