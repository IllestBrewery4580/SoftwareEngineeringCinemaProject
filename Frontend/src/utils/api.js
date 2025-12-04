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
    
    const response = await r.json()
    return response;
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

    const res = await response.json()
    return res;
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

    const response = await res.json()
    return response;
}

export async function fetchSeats(showId) {
    const r = await fetch(`http://localhost:8000/api/shows/${showId}/seats/`, {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        },
        credentials: 'include'
    });
    
    const response = await r.json()
    return response;
}