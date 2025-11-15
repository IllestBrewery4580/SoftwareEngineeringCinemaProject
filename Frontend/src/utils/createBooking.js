import { getCookie } from './csrf';
import { useEffect } from 'react';

export async function createBooking(payload) {
    console.log("Cookie", getCookie('csrftoken'))
    var data = [];
          try {
            const response = await fetch("http://localhost:8000/bookings/getUser/", {
              method: "GET",
              credentials: "include",
            });
    
            data = await response.json();
    
            if (data.status === "success") {
                console.log("User exists", data.user)
            } else {
                console.log("No user")
            }
          } catch (error) {
            console.error("Error checking authentication:", error);
          }

    const r = await fetch(`http://127.0.0.1:8000/api/bookings/`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials:'include',
        body: JSON.stringify({
            user: data.user.id, 
            ...payload
        }),
    });
    console.log(r)
    if (!r.ok) throw new Error("Error. Could not create booking.");
    return r.json();
}
