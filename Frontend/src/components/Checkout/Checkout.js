import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PromoCodeBox from "./PromoCodeBox";
import AddPayment from "./AddPayment";
import { createBooking } from "../../utils/api";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {bookingId, showId, total, seats, movie, showtime} = location.state || {};
    const [applied, setApplied] = useState(false);
    const [methods, setMethods] = useState([]);
    const [paymentId, setPaymentId] = useState("");
    const [paymentForm, setPaymentForm] = useState(false);
    var [newTotal, setNewTotal] = useState(total);
    var [discountVal, setDiscountVal] = useState(0);

    const handleSeating = () => {
        navigate('/booking/seatselection', {
            state: {
                showId,
                seats: seats,
                movie: movie,
                showtime: showtime,
                returnSeats: seats,
                noOfTickets: seats.length
            }
        });
    }

    useEffect(() => {
        fetch('http://localhost:8000/accounts/profile/', {
        method: 'GET',
        credentials: 'include',
        })
        .then((res) => res.json())
        .then((data) => {
            setMethods(data.account_data);
        })
        .catch((err) => {
            console.error("Error fetching payments:", err);
        });
    }, []);

    const handlePromoCode = (discount) => {
        if (discount !== 0) {
            var discountAmount = (discount / 100) * total;
            setDiscountVal(discount);
            setNewTotal(total - discountAmount);
            setApplied(true);
        } else {
            setDiscountVal(0);
            setNewTotal(total);
            setApplied(false);
        }
    }

    const handleCheckout = async () => {
        const response = await createBooking(bookingId, {
                show: showId,
                no_of_tickets: seats.length,
                seats: seats.map((s) => ({
                    seat_id: s.id,
                    ticket_type: s.type,
                })),
                card: paymentId,
                total_price: applied ? newTotal : total,
                discount: discountVal
        });

        if (response) {
            alert("Booking successful!");
            navigate('/booking/orderconfirmation', {
                state: {
                    booking: response,
                    movie: movie,
                    showtime: showtime,
                    seats: seats,
                }
            });
        } else {
            alert("Booking failed. Please try again.");
        }
    }

    const handlePaymentChange = (e) => {
        const value = e.target.value
        setPaymentId(value)

        if (value === 'add') {
            setPaymentForm(true)
        } else {
            setPaymentForm(false)
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

    console.log(methods)
    return (
        <div>
            {/* Selected Movie & Showtime */}
            <div className="border bg-gray-50 rounded-lg shadow-lg p-6 mb-6 flex-row">
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
        <div className="border bg-gray-50 rounded-lg shadow-lg p-6 mb-6 flex-row">
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

            <select 
            value={paymentId}
            onChange={handlePaymentChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full">
                <option value="" disabled>Select Payment Method</option>
                {methods.map((method, index) => (
                    <option key={index} value={method.id}>{method.card_type.charAt(0).toUpperCase() + method.card_type.slice(1)} ending in {method.card_no.substring(12)}</option>
                ))}
                {methods?.length < 3 ? (
                    <option value="add">Add New Method</option>
                ) : ('')}
            </select>

            {paymentForm && (
                <AddPayment onSave={() => setPaymentForm(false)} />
            )}
            
            <br></br>
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

            <button
                onClick={handleCheckout}
                className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg">
                Checkout
            </button>


            </div>
        </div>
    );
}

export default Checkout;