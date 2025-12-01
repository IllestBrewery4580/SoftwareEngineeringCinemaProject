import { getCookie } from './csrf';

export async function createBooking(bookingId, payload) {
    const r = await fetch(`http://localhost:8000/bookings/${bookingId}/confirm`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials:'include',
        body: JSON.stringify(payload),
    });

    if (!r.ok) throw new Error("Error. Could not create booking.");
    return r.json();
}

export async function holdSeats(showId, seatIds, ticketTypeId=null) {
    const response = await fetch(`http://localhost:8000/bookings/shows/${showId}/hold/`, {
        method: "POST",
        credentials: "include",
        headers: { 
            "Content-Type": "application/json",
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            seatIds: seatIds,
            ticketTypeId: ticketTypeId,
        }),
    });

    if (!response.ok) throw new Error("Could not hold seats.");

    return response.json();
}

export async function releaseSeat(showId, seatId) {
    const res = await fetch(`http://localhost:8000/bookings/shows/${showId}/seats/${seatId}/release/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': getCookie('csrftoken')
        },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to release seat");
    }

    return res.json();
}

export async function fetchSeats(showId) {
    const r = await fetch(`http://localhost:8000/api/shows/${showId}/seats/`, {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        },
        credentials: 'include'
    });
    
    if (!r.ok) throw new Error("Failed to load seats");
    return r.json();
}