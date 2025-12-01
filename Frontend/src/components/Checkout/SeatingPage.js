'use client';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSeats, holdSeats, releaseSeat } from "../../utils/api"

export default function SeatingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { noOfTickets, movie, showtime, returnSeats } = location.state || {};
    const showId = showtime.id;     // fallback to 1 if not passed

    const [seats, setSeats] = useState([]);
    const [selected, setSelected] = useState([]);
    const [ticketTypes, setTicketTypes] = useState({});
    const [loading, setLoading] = useState(false);

    const PRICE = { Adult: 12.5, Senior: 10.0, Child: 8.0 };

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await fetchSeats(showId);
                setSeats(data);

                if (returnSeats) {
                    for (var seat of returnSeats) {
                        try {
                            await releaseSeat(showId, seat.id); // new endpoint
                        } catch (e) {
                            alert(`Failed to release seat ${seat.row_number}${seat.seat_number}`);
                            return;
                        }
                    }
                    setSelected(returnSeats);

                    const types = {};
                    returnSeats.forEach((s) => {
                        types[s.id] = s.type;
                        s.is_reserved = true;
                    });
                    setTicketTypes(types);
                }
            } catch (e) {
                alert("Failed to load seats");
            } finally {
                setLoading(false);
            }
        })();
    }, [showId]);

    const toggleSeat = (seat) => {
        if (seat.is_reserved && !seat.held_by_me) return;
        
        const isSelected = selected.some((s) => s.id === seat.id);
        if (!isSelected && selected.length >= noOfTickets) {
            return;
        }

        setSelected((prev) =>
            isSelected
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
            if (!ticketTypes[s.id]) return alert(`Choose a ticket type for seat ${s.row_number}${s.seat_number}`);
        }
        // snapshot current selections before any async work
        const snapshotSelected = [...selected];
        const snapshotTypes = { ...ticketTypes };
        const seatIds = selected.map((s) => s.id);
        const totalNow = selected.reduce(
            (sum, s) => sum + PRICE[ticketTypes[s.id]],
            0
        );

        setLoading(true);
        try {
            const hold = await holdSeats(showId, seatIds);
            setSeats(await fetchSeats(showId));
            // example: go to checkout with summary
            navigate("/booking/checkout", {
                state: {
                    bookingId: hold.bookingId,
                    holdExpiresAt: hold.holdExpiresAt,
                    showId,
                    total: totalNow,
                    seats: snapshotSelected.map((s) => ({
                        ...s,
                        type: snapshotTypes[s.id],
                        price: PRICE[snapshotTypes[s.id]],
                    })),
                    movie,
                    showtime: showtime
                },
            });
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };


    const handleGoBack = () => {
        navigate(`/details/`, {
        state: {
        movie: movie,
        showtime: showtime,
        noOfTickets: noOfTickets
      }});
    }

    var rated = null;
    if(movie.rating === 1) {
        rated = "G"
    } else if (movie.rating === 2) {
        rated = "PG"
    } else if (movie.rating === 3) {
        rated = "PG-13"
    } else {
        rated = "R"
    }

    const date = (showtime.label).split("•")[0];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Book Your Tickets</h1>
                <button 
                onClick={handleGoBack}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                ← Back
                </button>
            </div>

            {/* Selected Movie & Showtime */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-4">
                <img 
                    src={movie.poster}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded"
                />
                <div>
                    <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                    <p className="text-gray-600 mb-1">{rated} • {movie.genre} • ⭐ {movie.review_score}</p>
                    <p className="text-lg font-semibold text-blue-600">Showtime: {showtime.label}</p>
                    <p className="text-gray-600">Duration: {movie.duration} minutes</p>
                </div>
                </div>
            </div>

            {/* Booking Form (UI Only - No Logic) */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                <h3 className="text-xl font-semibold mb-4">Select Date: {date}</h3>
                </div>
                
                <div>
                <h3 className="text-xl font-semibold mb-4">Number of Tickets: {noOfTickets}</h3>                
                </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 pt-4">Seat Selection</h3>
            {loading && <p>Loading…</p>}

            <div className={`grid grid-cols-5 gap-2 mb-6`}>
                {seats.map((seat) => {
                    const isSelected = selected.some((s) => s.id === seat.id);
                    const disabled = seat.is_reserved && !seat.held_by_me;
                    return (
                        <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat)}
                            disabled={disabled}
                            className={`px-3 py-2 rounded border
                ${disabled ? "bg-gray-300 cursor-not-allowed" :
                                    isSelected ? "bg-green-500 text-white" : "bg-white"}`}
                            title={`${seat.row_number}${seat.seat_number}`}
                        >
                            {seat.row_number}{seat.seat_number}
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
                                <span className="font-medium">{s.row_number}{s.seat_number}</span>
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
                <button
                    onClick={book}
                    disabled={loading || selected.length === 0}
                    className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
}
