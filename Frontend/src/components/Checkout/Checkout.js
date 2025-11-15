import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
    const location = useLocation();
    const {showId, total, seats, movie, showtime} = location.state || {};
    const navigate = useNavigate();
    
    const handleSeating = () => {
        navigate('/booking/seatselection', {
            state: {
                showId,
                seats: seats,
                movie: movie,
                showtime: showtime
            }
        });
    }

    const [promoCode, setPromoCode] = useState("");
    const handlePromoCode = (promoCode) => setPromoCode(promoCode);


    console.log("checkout", showtime)
    {/*Rating*/}
    var rated = null;
    if(movie.rating == 1) {
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
            <h1>{
                seats.map((seat, index) => (
                    <span key={index} className="mr-2">
                        {seat.label} &nbsp;&nbsp;-&nbsp;&nbsp; {seat.type} &nbsp;&nbsp;-&nbsp;&nbsp; ${seat.price}
                    </span>
                ))  
            }</h1>
             
            <div className="justify-items-end flex-col p-3">
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => handlePromoCode(e.target.value)}
                        className="pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-blue-500 p-3 m-2 ml-5 rounded-xl transition-colors hover:text-white">Enter Code</button>
                </div>
                <h2 className="text-2xl font-bold mt-4">Price Total: ${total}</h2> 
            </div>


            </div>
        </div>
    );
}

export default Checkout;