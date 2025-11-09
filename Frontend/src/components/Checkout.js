import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = ({selectedBooking, numSeats, getNumSeats}) => {

    const navigate = useNavigate();
    const handleSeating = () => {
    navigate('/booking/seatselection');
    getNumSeats(() => numSeats = 0);
    }

    const [totalTicks, setTotalTicks] = useState(numSeats);
    const [adultTicks, setAdultTicks] = useState(0);
    const [childTicks, setChildTicks] = useState(0);
    const [seniorTicks, setSeniorTicks] = useState(0);

    const [promoCode, setPromoCode] = useState("");
    const handlePromoCode = (promoCode) => setPromoCode(promoCode);

    {/*Can be changed if needed */}
    const[totalPrice, setTotalPrice] = useState(0);
    const handleTotalPrice = () => {
        setTotalPrice(() => (adultTicks * 10) + (childTicks * 7) + (seniorTicks * 7));
        console.log("total price calculated " + {totalPrice});
    }

      {/*Setting number of each ticket type*/}
    const plusTicketAdult = () => {
        getNumSeats(() => numSeats - 1); 
        setAdultTicks(() => adultTicks + 1); 
        
    }

    const minusTicketAdult = () => {
        getNumSeats(() => numSeats + 1);
        setAdultTicks(() => adultTicks - 1);
    }

    const plusTicketChild = () => {
        getNumSeats(() => numSeats - 1); 
        setChildTicks(() => childTicks + 1); 
    }

    const minusTicketChild = () => {
        getNumSeats(() => numSeats + 1);
        setChildTicks(() => childTicks - 1);
    }

    const plusTicketSenior = () => {
        getNumSeats(() => numSeats - 1); 
        setSeniorTicks(() => seniorTicks + 1); 
    }

    const minusTicketSenior = () => {
        getNumSeats(() => numSeats + 1);
        setSeniorTicks(() => seniorTicks - 1);
    }

    {/*Rating*/}
    var rated = null;
  if(selectedBooking.movie.rating == 1) {
    rated = "G"
  } else if (selectedBooking.movie.rating == 2) {
    rated = "PG"
  } else if (selectedBooking.movie.rating == 3) {
    rated = "PG-13"
  } else {
    rated = "R"
  }

     if (!selectedBooking) return null;

    return (
        <div>
            {/* Selected Movie & Showtime */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 flex-row">
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
                src={selectedBooking.movie.poster}
                alt={selectedBooking.movie.title}
                className="w-24 h-36 object-cover rounded"
            />
            <div>
                <h2 className="text-2xl font-bold mb-2">{selectedBooking.movie.title}</h2>            
                <p className="text-xl font-semibold text-blue-600">Showtime: {selectedBooking.showtime}</p>
                <p className="text-gray-600 mb-1">{rated} • {selectedBooking.movie.genre} • ⭐ {selectedBooking.movie.review_score}</p>
                <p className="text-gray-600 mb-1">Duration: {selectedBooking.movie.duration} minutes</p>
                {/* Update with booking info*/}
                <p className="text-gray-600 mb-1">Theater __</p>
            </div>
            </div>
        </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 flex-row">
             <h2 className="text-2xl font-bold mb-2">Tickets selected: {numSeats}</h2> 
             <h1>total ticks: {totalTicks}</h1>
             <h1>seats: [list of seats]</h1>
             
             {/*Adult Ticket*/}
             <div className="justify-items-center">
            <div className="bg-gray-200 p-5 m-3 rounded-xl flex justify-between w-2/3">
                <div className="justify-self-center">
                <h1 className="font-extrabold text-xl text-blue-950">Adult Ticket - $10</h1>
                <h1>Ages 12-65</h1>
                </div>
                <div className="flex-col justify-items-center">
                    <div className=" justify-center">
                    <h1>{adultTicks} tickets</h1>
                    </div>
                    <button className={`bg-blue-500 p-1 m-1 rounded-xl w-10 font-extrabold transition-colors hover:text-white ${numSeats > 0 && numSeats < totalTicks +1? "bg-blue-500" : "bg-gray-400 text-gray-700 hover:text-gray-700 cursor-not-allowed"}`} disabled={numSeats < 1 || numSeats > totalTicks} onClick={plusTicketAdult}>+</button>
                    <button className={`bg-blue-500 p-1 m-1 rounded-xl w-10 font-extrabold transition-colors hover:text-white ${numSeats > -1 && numSeats < totalTicks + 1 && adultTicks > 0? "bg-blue-500" : "bg-gray-400 text-gray-700 hover:text-gray-700 cursor-not-allowed"}`} disabled={numSeats < -1 || numSeats == totalTicks || adultTicks < 1} onClick={minusTicketAdult}>-</button>
                </div>
            </div>
            </div>

             {/*Child Ticket*/}
             <div className="justify-items-center">
            <div className="bg-gray-200 p-5 m-3 rounded-xl flex justify-between w-2/3">
                <div className="justify-self-center">
                <h1 className="font-extrabold text-xl text-blue-950">Child Ticket - $7</h1>
                <h1>Ages 11 and under</h1>
                </div>
                <div className="flex-col justify-items-center">
                    <div className=" justify-center">
                    <h1>{childTicks} tickets</h1>
                    </div>
                    <button className={`bg-blue-500 p-1 m-1 rounded-xl w-10 font-extrabold transition-colors hover:text-white ${numSeats > 0 && numSeats < totalTicks +1? "bg-blue-500" : "bg-gray-400 text-gray-700 hover:text-gray-700 cursor-not-allowed"}`} disabled={numSeats < 1 || numSeats > totalTicks} onClick={plusTicketChild}>+</button>
                    <button className={`bg-blue-500 p-1 m-1 rounded-xl w-10 font-extrabold transition-colors hover:text-white ${numSeats > -1 && numSeats < totalTicks + 1 && childTicks > 0? "bg-blue-500" : "bg-gray-400 text-gray-700 hover:text-gray-700 cursor-not-allowed"}`} disabled={numSeats < -1 || numSeats == totalTicks || childTicks < 1} onClick={minusTicketChild}>-</button>
                </div>
            </div>
            </div>

             {/*Senior Ticket*/}
             <div className="justify-items-center">
            <div className="bg-gray-200 p-5 m-3 rounded-xl flex justify-between w-2/3">
                <div className="justify-self-center">
                <h1 className="font-extrabold text-xl text-blue-950">Senior Ticket - $7</h1>
                <h1>Ages 65 and up</h1>
                </div>
                <div className="flex-col justify-items-center">
                    <div className=" justify-center">
                    <h1>{seniorTicks} tickets</h1>
                    </div>
                    <button className={`bg-blue-500 p-1 m-1 rounded-xl w-10 font-extrabold transition-colors hover:text-white ${numSeats > 0 && numSeats < totalTicks +1? "bg-blue-500" : "bg-gray-400 text-gray-700 hover:text-gray-700 cursor-not-allowed"}`} disabled={numSeats < 1 || numSeats > totalTicks} onClick={plusTicketSenior}>+</button>
                    <button className={`bg-blue-500 p-1 m-1 rounded-xl w-10 font-extrabold transition-colors hover:text-white ${numSeats > -1 && numSeats < totalTicks + 1 && seniorTicks > 0? "bg-blue-500" : "bg-gray-400 text-gray-700 hover:text-gray-700 cursor-not-allowed"}`} disabled={numSeats < -1 || numSeats == totalTicks || seniorTicks < 1} onClick={minusTicketSenior}>-</button>
                </div>
            </div>
            </div>
            <div className="justify-self-center">
                <button className={`bg-blue-500 p-3 m-2 ml-5 rounded-xl transition-colors hover:text-white ${numSeats != 0? "bg-gray-400 text-gray-700 hover:text-gray-700 cursor-not-allowed " : "bg-blue-500"}`} disabled={false} onClick={handleTotalPrice}>Calculate Final Total</button>
            </div>
        </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-6 flex-row">
            <div className="justify-items-center flex-col p-3">

                <div className="flex" >
                <div className="flex-row m-10 bg-gray-100 rounded-lg p-6 ">
                <div className='flex items-center mb-2 justify-between'>  
                    <h1 className={` ${adultTicks > 0? "visible" : "hidden"}`}>{adultTicks} adult tickets</h1>  
                    <h1 className={` ${adultTicks > 0? "visible" : "hidden"}`}>${adultTicks * 10} </h1>   
                </div>
                <hr className={`${adultTicks > 0 && childTicks > 0? "visible" : "hidden"}`}/>
                <div className='flex items-center mb-2 justify-between'> 
                    <h1 className={` ${childTicks > 0? "visible" : "hidden"}`}> {childTicks} child tickets</h1> 
                    <h1 className={` ${childTicks > 0? "visible" : "hidden"}`}>${childTicks * 7} </h1>      
                </div>
                <hr className={` ${childTicks > 0 && seniorTicks > 0 || adultTicks > 0 && seniorTicks > 0? "visible" : "hidden"}`}/>
                <div className='flex items-center mb-2 justify-between'>  
                    <h1 className={` ${seniorTicks > 0? "visible" : "hidden"}`}> {seniorTicks} senior tickets</h1> 
                    <h1 className={` ${seniorTicks > 0? "visible" : "hidden"}`}>${seniorTicks * 7}</h1> 
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Price Total: ${totalPrice}.00</h2>                 
                </div>
                <div className="m-10 bg-gray-100 rounded-lg p-6">
                    <h1>sign in if u have account or create account</h1>
                </div>

                </div>
            </div>
            </div>

        </div>
    );
}

export default Checkout;