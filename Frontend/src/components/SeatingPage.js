'use client';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSeats, createBooking } from "../api";

export default function SeatingPage({ selectedBooking, getNumSeats, numSeats }) {
    const navigate = useNavigate();
    const location = useLocation();
    const showId = location.state?.showId ?? 1;     // fallback to 1 if not passed
    const bookingInfo = location.state?.selectedBooking || selectedBooking;

    const [seats, setSeats] = useState([]);
    const [selected, setSelected] = useState([]);
    const [ticketTypes, setTicketTypes] = useState({});
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const PRICE = { Adult: 12.5, Senior: 10.0, Child: 8.0 };

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

        setTicketTypes((prev) => {
            const next = { ...prev };
            if (next[seat.id]) {
                delete next[seat.id];       // deselect -> remove type
            } else {
                next[seat.id] = "Adult";    // select -> default to Adult
            }
            return next;
        });
    };

    const total = selected.reduce((sum, s) => sum + (PRICE[ticketTypes[s.id]] ?? PRICE.Adult), 0);

    const book = async () => {
        if (!selected.length) return alert("Pick at least one seat.");
        // ensure each selected seat has a type
        for (const s of selected) {
            if (!ticketTypes[s.id]) return alert(`Choose a ticket type for seat ${s.row}${s.number}`);
        }
        // snapshot current selections before any async work
        const snapshotSelected = [...selected];
        const snapshotTypes = { ...ticketTypes };
        const totalNow = snapshotSelected.reduce(
            (sum, s) => sum + (PRICE[snapshotTypes[s.id]] ?? PRICE.Adult),
            0
        );

        setLoading(true);
        try {
            await createBooking({
                show: showId,
                full_name: fullName,
                email,
                seats: snapshotSelected.map((s) => ({
                    seat_id: s.id,
                    price: PRICE[snapshotTypes[s.id]],
                })),
            });
            // refresh and proceed (or send to checkout)
            setSelected([]);
            setTicketTypes({});
            await setSeats(await fetchSeats(showId));
            // example: go to checkout with summary
            navigate("/booking/checkout", {
                state: {
                    showId,
                    total: totalNow,
                    seats: snapshotSelected.map((s) => ({
                        label: `${s.row}${s.number}`,
                        type: snapshotTypes[s.id],
                        price: PRICE[snapshotTypes[s.id]],
                    })),
                    bookingInfo,
                },
            });
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

            {bookingInfo && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-4">
                        <img
                            src={bookingInfo.movie.poster}
                            alt={bookingInfo.movie.title}
                            className="w-20 h-28 object-cover rounded"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{bookingInfo.movie.title}</h2>
                            <p className="text-gray-600">{bookingInfo.showtime}</p>
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

            {/* Selected seats + ticket type panel */}
            {selected.length > 0 && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Selected Seats</h3>
                    <div className="space-y-2">
                        {selected.map((s) => (
                            <div key={s.id} className="flex items-center justify-between gap-3">
                                <span className="font-medium">{s.row}{s.number}</span>
                                <select
                                    className="border rounded p-2"
                                    value={ticketTypes[s.id] ?? "Adult"}
                                    onChange={(e) =>
                                        setTicketTypes((prev) => ({ ...prev, [s.id]: e.target.value }))
                                    }
                                >
                                    <option value="Adult">Adult - ${PRICE.Adult.toFixed(2)}</option>
                                    <option value="Senior">Senior - ${PRICE.Senior.toFixed(2)}</option>
                                    <option value="Child">Child - ${PRICE.Child.toFixed(2)}</option>
                                </select>
                                <span className="text-sm text-gray-600">
                                    ${(PRICE[ticketTypes[s.id]] ?? PRICE.Adult).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
