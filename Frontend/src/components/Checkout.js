import { useState } from "react";

const Checkout = ({selectedBooking, numSeats, getNumSeats}) => {
 
    const [totalTicks, setTotalTicks] = useState(numSeats);

    const plusTicket = () => {
        if(numSeats > 0) {
            getNumSeats(() => numSeats--);
        }
    }

    const minusTicket = () => {
        if(numSeats < totalTicks) {
            getNumSeats(() => numSeats++);
        }
    }

    return (
        <div>
            <h1>checkout page</h1>
            <h1>numSeats: {numSeats}</h1>
            <h1>totalTicks: {totalTicks}</h1>

            <h1>ticket 1: </h1>
            <button className="bg-blue-500 p-3 m-2 rounded-lg" onClick={plusTicket}>+</button>
            <button className="bg-blue-500 p-3 m-2 rounded-lg" onClick={minusTicket}>-</button>
        </div>
    );
}

export default Checkout;