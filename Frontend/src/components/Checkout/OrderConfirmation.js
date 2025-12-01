import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
    const location = useLocation();
    const { booking, movie, showtime, seats } = location.state || {};
    const navigate = useNavigate();
    console.log(booking, movie, showtime, seats)

    const handleHome = () => {
        navigate("/")
    }

    function getSeats(seats) {
        let result = []
        for (const seat of seats) {
            var label = seat.row_number.toString() + seat.seat_number.toString()
            result += label + " "
        }
        return result
    }

    return (
        <div className= "flex justify-center min-h-screen">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md max-w-4xl w-full">
                <div className="flex items-center justify-center mb-6">
                    <h1 className='text-3xl font-bold text-gray-800'>Enjoy your Movie!</h1>
                </div>
                <hr className='pb-6'></hr>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
                    <div className="md:flex">
                        <div className="w-full max-h-96">
                            <img 
                                src={movie.poster} 
                                alt={movie.title}
                                className="w-full h-96 md:h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                <h1 className='font-bold text-xl pb-3 pl-2'>Order Details:</h1>
                <div className='flex flex-row justify-start mb-10'>
                    <div className='flex flex-col border w-full'>
                        <div className='flex flex-col border'>
                            <h2 className='p-2'>Booking Id</h2>
                            <h2 className='p-2'>Movie</h2>
                            <h2 className='p-2'>Showtime</h2>
                            <h2 className='p-2'>Payment Method</h2>
                            <h2 className='p-2'>Auditorium</h2>
                        </div>
                        <div className='flex flex-col border'>
                            <h2 className='p-2'>Seats Selected</h2>
                            <h2 className='p-2'>Total Seats</h2>
                            <h2 className='font-bold p-2 pt-6'>Total Price</h2>
                        </div>
                    </div>
                    <div className='flex flex-col border w-full'>
                        <div className='flex flex-col border'>
                            <h2 className='p-2'>{booking.booking.id}</h2>
                            <h2 className='p-2'>{movie.title}</h2>
                            <h2 className='p-2'>{showtime.label}</h2>
                            <h2 className='p-2'>{booking.booking.card4}</h2>
                            <h2 className='p-2'>{showtime.auditorium}</h2>
                        </div>
                        <div className='flex flex-col border'>
                            <h2 className='p-2'>{getSeats(seats)}</h2>
                            <h2 className='p-2'>{booking.booking.no_of_tickets}</h2>
                            <h2 className='font-bold p-2 pt-6'>${booking.booking.total_price}</h2>
                        </div>
                    </div>
                </div>
                <button onClick={handleHome} className="mb-4 bg-blue-700 w-full pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Home</button>
            </div>
        </div>
    )
}

export default OrderConfirmation; 