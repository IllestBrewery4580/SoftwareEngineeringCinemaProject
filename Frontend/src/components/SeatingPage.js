'use client'
import { Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SeatingPage = ({selectedBooking}) => {
    const navigate = useNavigate();

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
    }

    const [a2selected, a2setSelected] = useState(false);
    const a2handleSelect = () => {
        a2setSelected(!a2selected);
    }

    const [a3selected, a3setSelected] = useState(false);
    const a3handleSelect = () => {
        a3setSelected(!a3selected);
    }

    const [a4selected, a4setSelected] = useState(false);
    const a4handleSelect = () => {
        a4setSelected(!a4selected);
    }

    const [b1selected, b1setSelected] = useState(false);
    const b1handleSelect = () => {
        b1setSelected(!b1selected);
    }

    const [b2selected, b2setSelected] = useState(false);
    const b2handleSelect = () => {
        b2setSelected(!b2selected);
    }

    const [b3selected, b3setSelected] = useState(false);
    const b3handleSelect = () => {
        b3setSelected(!b3selected);
    }

    const [b4selected, b4setSelected] = useState(false);
    const b4handleSelect = () => {
        b4setSelected(!b4selected);
    }

    const [c1selected, c1setSelected] = useState(false);
    const c1handleSelect = () => {
        c1setSelected(!c1selected);
    }

    const [c2selected, c2setSelected] = useState(false);
    const c2handleSelect = () => {
        c2setSelected(!c2selected);
    }

    const [c3selected, c3setSelected] = useState(false);
    const c3handleSelect = () => {
        c3setSelected(!c3selected);
    }

    const [c4selected, c4setSelected] = useState(false);
    const c4handleSelect = () => {
        c4setSelected(!c4selected);
    }

    const [d1selected, d1setSelected] = useState(false);
    const d1handleSelect = () => {
        d1setSelected(!d1selected);
    }

    const [d2selected, d2setSelected] = useState(false);
    const d2handleSelect = () => {
        d2setSelected(!d2selected);
    }

    const [d3selected, d3setSelected] = useState(false);
    const d3handleSelect = () => {
        d3setSelected(!d3selected);
    }

    const [d4selected, d4setSelected] = useState(false);
    const d4handleSelect = () => {
        d4setSelected(!d4selected);
    }


    if (!selectedBooking) return null;
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Seat Selection</h1>
        {/* Selected Movie & Showtime */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <img 
            src={selectedBooking.movie.poster}
            alt={selectedBooking.movie.title}
            className="w-24 h-36 object-cover rounded"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedBooking.movie.title}</h2>            
            <p className="text-lg font-semibold text-blue-600">Showtime: {selectedBooking.showtime}</p>
            <p className="text-gray-600 mb-1">{rated} • {selectedBooking.movie.genre} • ⭐ {selectedBooking.movie.review_score}</p>
            <p className="text-gray-600 mb-1">Duration: {selectedBooking.movie.duration} minutes</p>
            {/* Update with booking info*/}
            <p className="text-gray-600 mb-1">Theater __</p>
          </div>
        </div>
      </div>

         <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className='flex-row justify-self-center'>
                <div className='flex-col'>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a1handleSelect}>A1</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a2handleSelect}>A2</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a3handleSelect}>A3</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${a4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={a4handleSelect}>A4</button>
                </div>
                <div className='flex-col'>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b1handleSelect}>B1</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b2handleSelect}>B2</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b3handleSelect}>B3</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${b4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={b4handleSelect}>B4</button>
                </div>
                <div className='flex-col'>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c1handleSelect}>C1</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c2handleSelect}>C2</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c3handleSelect}>C3</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${c4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={c4handleSelect}>C4</button>
                </div>
                <div className='flex-col'>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d1selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d1handleSelect}>D1</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d2selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d2handleSelect}>D2</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d3selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d3handleSelect}>D3</button>
                    <button className={`m-3 p-3 font-bold rounded-lg duration-200 hover:bg-blue-900 ${d4selected? "bg-blue-900 text-white" : "bg-blue-500"}`} onClick={d4handleSelect}>D4</button>
                </div>
            </div>
        </div>

        </div>
    )
}

export default SeatingPage;