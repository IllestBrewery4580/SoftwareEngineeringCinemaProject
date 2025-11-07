'use client'
import { Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SeatingPage = ({selectedBooking, getNumSeats, numSeats}) => {
    const navigate = useNavigate();
    const handleGoBooking = () => {
      navigate('/booking');
    }
    
    const handleGoCheckout =() => {
        navigate('/booking/checkout');
    }
  

    const handleNumSeats = (selected) => {
    if(!selected) {
        getNumSeats(numSeats + 1);
    } else {
        getNumSeats(numSeats - 1);
    }
  }

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


  {/*Handlers for each seat*/}
  const [a1selected, a1setSelected] = useState(false);
  const a1handleSelect = () => {
    a1setSelected(!a1selected);
    handleNumSeats(a1selected);
    }

    const [a2selected, a2setSelected] = useState(false);
    const a2handleSelect = () => {

        a2setSelected(!a2selected);
        handleNumSeats(a2selected);
    }

    const [a3selected, a3setSelected] = useState(false);
    const a3handleSelect = () => {
        a3setSelected(!a3selected);
        handleNumSeats(a3selected);
    }

    const [a4selected, a4setSelected] = useState(false);
    const a4handleSelect = () => {
        a4setSelected(!a4selected);
        handleNumSeats(a4selected);
    }

    const [a5selected, a5setSelected] = useState(false);
    const a5handleSelect = () => {
        a5setSelected(!a5selected);
        handleNumSeats(a5selected);
    }

    const [a6selected, a6setSelected] = useState(false);
    const a6handleSelect = () => {
        a6setSelected(!a6selected);
        handleNumSeats(a6selected);
    }

    const [b1selected, b1setSelected] = useState(false);
    const b1handleSelect = () => {
        b1setSelected(!b1selected);
        handleNumSeats(b1selected);
    }

    const [b2selected, b2setSelected] = useState(false);
    const b2handleSelect = () => {
        b2setSelected(!b2selected);
        handleNumSeats(b2selected);
    }

    const [b3selected, b3setSelected] = useState(false);
    const b3handleSelect = () => {
        b3setSelected(!b3selected);
        handleNumSeats(b3selected);
    }

    const [b4selected, b4setSelected] = useState(false);
    const b4handleSelect = () => {
        b4setSelected(!b4selected);
        handleNumSeats(b4selected);
    }

    const [b5selected, b5setSelected] = useState(false);
    const b5handleSelect = () => {
        b5setSelected(!b5selected);
        handleNumSeats(b5selected);
    }

    const [b6selected, b6setSelected] = useState(false);
    const b6handleSelect = () => {
        b6setSelected(!b6selected);
        handleNumSeats(b6selected);
    }

    const [c1selected, c1setSelected] = useState(false);
    const c1handleSelect = () => {
        c1setSelected(!c1selected);
        handleNumSeats(c1selected);
    }

    const [c2selected, c2setSelected] = useState(false);
    const c2handleSelect = () => {
        c2setSelected(!c2selected);
        handleNumSeats(c2selected);
    }

    const [c3selected, c3setSelected] = useState(false);
    const c3handleSelect = () => {
        c3setSelected(!c3selected);
        handleNumSeats(c3selected);
    }

    const [c4selected, c4setSelected] = useState(false);
    const c4handleSelect = () => {
        c4setSelected(!c4selected);
        handleNumSeats(c4selected);
    }

    const [c5selected, c5setSelected] = useState(false);
    const c5handleSelect = () => {
        c5setSelected(!c5selected);
        handleNumSeats(c5selected);
    }

    const [c6selected, c6setSelected] = useState(false);
    const c6handleSelect = () => {
        c6setSelected(!c6selected);
        handleNumSeats(c6selected);
    }

    const [d1selected, d1setSelected] = useState(false);
    const d1handleSelect = () => {
        d1setSelected(!d1selected);
        handleNumSeats(d1selected);
    }

    const [d2selected, d2setSelected] = useState(false);
    const d2handleSelect = () => {
        d2setSelected(!d2selected);
        handleNumSeats(d2selected);
    }

    const [d3selected, d3setSelected] = useState(false);
    const d3handleSelect = () => {
        d3setSelected(!d3selected);
        handleNumSeats(d3selected);
    }

    const [d4selected, d4setSelected] = useState(false);
    const d4handleSelect = () => {
        d4setSelected(!d4selected);
        handleNumSeats(d4selected);
    }

    const [d5selected, d5setSelected] = useState(false);
    const d5handleSelect = () => {
        d5setSelected(!d5selected);
        handleNumSeats(d5selected);
    }

    const [d6selected, d6setSelected] = useState(false);
    const d6handleSelect = () => {
        d6setSelected(!d6selected);
        handleNumSeats(d6selected);
    }

    const [e1selected, e1setSelected] = useState(false);
    const e1handleSelect = () => {
        e1setSelected(!e1selected);
        handleNumSeats(e1selected);
    }

    const [e2selected, e2setSelected] = useState(false);
    const e2handleSelect = () => {
        e2setSelected(!e2selected);
        handleNumSeats(e2selected);
    }

    const [e3selected, e3setSelected] = useState(false);
    const e3handleSelect = () => {
        e3setSelected(!e3selected);
        handleNumSeats(e3selected);
    }

    const [e4selected, e4setSelected] = useState(false);
    const e4handleSelect = () => {
        e4setSelected(!e4selected);
        handleNumSeats(e4selected);
    }

    const [e5selected, e5setSelected] = useState(false);
    const e5handleSelect = () => {
        e5setSelected(!e5selected);
        handleNumSeats(e5selected);
    }

    const [e6selected, e6setSelected] = useState(false);
    const e6handleSelect = () => {
        e6setSelected(!e6selected);
        handleNumSeats(e6selected);
    }



    if (!selectedBooking) return null;
    return (
        <div>
        {/* Selected Movie & Showtime */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 flex-row">
        <div className='flex items-center mb-6 justify-between'>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Seat Selection</h1>
                </div>
                <div>
            <div>
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors" onClick={handleGoBooking}>
             ← Back to Booking
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

         <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className='flex-row justify-self-center'>
                <div className='flex-col justify-self-center'>
                    <button className='bg-black text-white m-3 pr-48 pl-48 pt-1 pb-1 mb-5 cursor-default'>Screen</button>
                </div>
                
                <div className='flex-col justify-self-center'>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a1handleSelect}>A1</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a2handleSelect}>A2</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a3handleSelect}>A3</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a4handleSelect}>A4</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a5selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a5handleSelect}>A5</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a6selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a6handleSelect}>A6</button>


                </div>
                <div className='flex-col justify-self-center'>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b1handleSelect}>B1</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b2handleSelect}>B2</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b3handleSelect}>B3</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b4handleSelect}>B4</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b5selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b5handleSelect}>B5</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b6selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b6handleSelect}>B6</button>
                </div>
                <div className='flex-col justify-self-center'>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c1handleSelect}>C1</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c2handleSelect}>C2</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c3handleSelect}>C3</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c4handleSelect}>C4</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c5selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c5handleSelect}>C5</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c6selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c6handleSelect}>C6</button>
                </div>
                <div className='flex-col justify-self-center'>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d1handleSelect}>D1</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d2handleSelect}>D2</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d3handleSelect}>D3</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d4handleSelect}>D4</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d5selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d5handleSelect}>D5</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d6selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d6handleSelect}>D6</button>
                </div>
                <div className='flex-col justify-self-center'>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${e1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={e1handleSelect}>E1</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${e2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={e2handleSelect}>E2</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${e3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={e3handleSelect}>E3</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${e4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={e4handleSelect}>E4</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${e5selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={e5handleSelect}>E5</button>
                    <button className={`m-1 p-3 w-12 font-bold rounded-lg duration-200 hover:bg-blue-900 ${e6selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={e6handleSelect}>E6</button>
                </div>
                <div className='flex-col'>
                    <h1  className="text-xl font-semibold m-2 justify-self-center">{numSeats} seats selected</h1>

                </div>
            </div>
        </div>

        <div className='justify-self-center'>
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg" onClick={handleGoCheckout}>
            Continue to Checkout
            </button>
        </div>
        </div>
    )
}

export default SeatingPage;