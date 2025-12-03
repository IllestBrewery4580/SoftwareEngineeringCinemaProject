import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/profile');
    }

    useEffect(() => {
        setLoading(true)
        fetch('http://localhost:8000/bookings/getUserBooking/', {
        method: 'GET',
        credentials: 'include',
        })
        .then((res) => res.json())
        .then((data) => {
            setLoading(false)
            setBookings(data.bookings)
        })
        .catch((err) => {
            setLoading(false)
            console.error("Error fetching order history:", err);
        });
    }, []);

    const handleHome = () => {
        navigate("/")
    }
    
    function formatDate(dateString) {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    if (loading) {
        return <p className='text-center'>Loading...</p>;
    }

    return (
        <div className= "flex justify-center min-h-screen">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md max-w-4xl w-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
                <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"> Go back</button>
            </div>
            <hr className='pb-6'></hr>
                {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                        <div className="border py-2 rounded-lg shadow-md mb-4 p-4 max-w-4xl w-full">
                            <div key={index} className="mb-2 text-center">
                                <div className='flex flex-row justify-between mb-2 mt-2'>
                                    <h2 className='text-xl font-semibold'>Booking {bookings.length - index}</h2>
                                    <h4 className='text-xl font-semibold text-green-600'>{booking.status}</h4>
                                </div>
                                <p className='font-semibold'>Booked on: {formatDate(booking.booking_time)}</p>
                                <hr className='pb-4'/>
                                <div className='bg-gray-200 py-2 px-4 rounded-lg mb-4'>
                                    <h1 className='text-lg font-semibold'>{booking.show.movie}</h1>
                                    <p>Showtime: {formatDate(booking.show.showtime)}</p>
                                </div>
                                <div className="bg-gray-200 py-2 px-4 rounded-lg mb-4">
                                <p className='pb-2'>Number of tickets: {booking.no_of_tickets}</p>
                                    {booking.tickets.map((ticket, index) => (
                                        <div key={index} className="flex items-center justify-between gap-3">
                                            <span className="font-medium">{ticket.seat__row_number}{ticket.seat__seat_number}</span>
                                            <span className="text-sm text-gray-600 font-medium">Type: {ticket.ticket_type_id__name}</span>
                                            <span className="text-sm text-gray-600 font-medium">${ticket.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className='text-right font-semibold'>Card: {booking.card_id === "----" ? "----" : booking.card_id.slice(12)}</p>
                                <p className='text-right font-semibold'>Total: {booking.total_price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex flex-col justify-center'>
                        <p className='text-center'>No orders yet. Make one now!</p>
                        <button onClick={handleHome} className='text-blue-600 underline hover:text-blue-800 transition-colors'>Find a movie!</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderHistory; 