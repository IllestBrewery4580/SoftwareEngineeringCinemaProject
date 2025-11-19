import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PromoCodeBox from "./PromoCodeBox";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {showId, total, seats, movie, showtime} = location.state || {};
    const [applied, setApplied] = useState(false);
    var [newTotal, setNewTotal] = useState(total);

    const handleSeating = () => {
        navigate('/booking/seatselection', {
            state: {
                showId,
                seats: seats,
                movie: movie,
                showtime: showtime,
                returnSeats: seats
            }
        });
    }

    const handlePromoCode = (discount) => {
        if (discount !== 0) {
            var discountAmount = (discount / 100) * total;
            setNewTotal(total - discountAmount);
            setApplied(true);
        } else {
            setNewTotal(total);
            setApplied(false);
        }
    }

    {/*Rating*/}
    var rated = null;

    if (movie.rating == 1) {
        rated = "G"
    } else if (movie.rating == 2) {
        rated = "PG"
    } else if (movie.rating == 3) {
        rated = "PG-13"
    } else {
        rated = "R"
    }

    return (
        <div>
            {/* Selected Movie & Showtime */}
            <div className="border bg-gray-50 rounded-lg p-6 mb-6 flex-row">
            <div className='flex items-center mb-6 justify-between'>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
                </div>
                <div>
                <div>
                <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors" onClick={handleSeating}>
                     ← Back to Seat Selection
                </button>
                </div>
                </div>
            </div>
            <div className="flex items-start space-x-4">
            <img 
                src={movie.poster}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded"
            />
            <div>
                <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>            
                <p className="text-xl font-semibold text-blue-600">Showtime: {showtime.label}</p>
                <p className="text-gray-600 mb-1">{rated} • {movie.genre} • ⭐ {movie.review_score}</p>
                <p className="text-gray-600 mb-1">Duration: {movie.duration} minutes</p>
                {/* Update with booking info*/}
                <p className="text-gray-600 mb-1">Theater {showtime.auditorium}</p>
            </div>
            </div>
        </div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6 flex-row">
            <h2 className="text-2xl font-bold mb-2">Tickets selected: {seats.length}</h2> 
            <h1 className="text-xl font-semibold mb-2">Seats:</h1>
            <div className="bg-gray-200 py-2 px-4 rounded-lg mb-4">
                {seats.map((seat, index) => (
                    <div key={index} className="flex items-center justify-between gap-3">
                        <span className="font-medium">{seat.row_number}{seat.seat_number}</span>
                        <span className="text-sm text-gray-600 font-medium">Type: {seat.type}</span>
                        <span className="text-sm text-gray-600 font-medium">${seat.price}</span>
                    </div>
                ))}
            </div>
             
            <div className="justify-items-end flex-col">
                <div className="flex">
                    <PromoCodeBox onAction={handlePromoCode}/>
                </div>
                {applied ? (
                    <h2 className="text-2xl font-bold mt-4">New Price Total: ${newTotal.toFixed(2)}</h2>
                ) : (
                    <h2 className="text-2xl font-bold mt-4">Price Total: ${total.toFixed(2)}</h2>
                )} 
            </div>


            </div>
        </div>
    );
}

export default Checkout;