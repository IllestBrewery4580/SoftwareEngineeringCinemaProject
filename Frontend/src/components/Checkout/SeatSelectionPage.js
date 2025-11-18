'use client';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSeats, createBooking } from "../../utils/api";

export default function SeatSelectionPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const showId = state?.showId ?? 1;           // fallback if no state passed
  const selectedBooking = state?.selectedBooking;

  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchSeats(showId);
        setSeats(data);
      } catch (e) {
        alert("Failed to load seats");
      } finally {
        setLoading(false);
      }
    })();
  }, [showId]);

  const toggleSeat = (seat) => {
    if (seat.is_reserved) return;
    setSelected((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const total = selected.length * 12.5;

  const book = async () => {
    if (!selected.length) return alert("Pick at least one seat.");
    setLoading(true);
    try {
      await createBooking({
        show: showId,
        full_name: fullName,
        email,
        seats: selected.map((s) => ({ seat_id: s.id, price: 12.5 })),
      });
      // refresh seats to reflect reservations
      setSelected([]);
      setSeats(await fetchSeats(showId));
      alert("Booking confirmed!");
      navigate("/"); // or navigate to a confirmation page
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Select Your Seats</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Back
        </button>
      </div>

      {selectedBooking && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            <img
              src={selectedBooking.movie.poster}
              alt={selectedBooking.movie.title}
              className="w-20 h-28 object-cover rounded"
            />
            <div>
              <h2 className="text-xl font-semibold">{selectedBooking.movie.title}</h2>
              <p className="text-gray-600">{selectedBooking.showtime}</p>
            </div>
          </div>
        </div>
      )}

      {loading && <p>Loading…</p>}

      <div className="grid grid-cols-8 gap-2 mb-6">
        {seats.map((seat) => {
          const isSelected = selected.some((s) => s.id === seat.id);
          const disabled = seat.is_reserved;
          return (
            <button
              key={seat.id}
              onClick={() => toggleSeat(seat)}
              disabled={disabled}
              className={`px-3 py-2 rounded border
                ${disabled ? "bg-gray-300 cursor-not-allowed" :
                 isSelected ? "bg-green-500 text-white" : "bg-white"}`}
              title={`${seat.row}${seat.number}`}
            >
              {seat.row}{seat.number}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 max-w-md">
        <div className="text-lg">Total: ${total.toFixed(2)}</div>
        <input
          className="border p-2 w-full"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={book}
          disabled={loading || selected.length === 0}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
