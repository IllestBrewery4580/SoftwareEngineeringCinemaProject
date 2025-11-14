'use client'
import { useNavigate } from 'react-router-dom';

const BookingPage = ({ selectedBooking }) => {
  const navigate = useNavigate();
  const handleGoHome = () => {
      navigate('/');
  }

  const handleSeating = () => {
    navigate('/booking/seatselection');
  }

  var rated = null;
  if(selectedBooking.movie.rating === 1) {
    rated = "G"
  } else if (selectedBooking.movie.rating === 2) {
    rated = "PG"
  } else if (selectedBooking.movie.rating === 3) {
    rated = "PG-13"
  } else {
    rated = "R"
  }

  const date = (selectedBooking.showtime.label).split("•")[0];

  if (!selectedBooking) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Book Your Tickets</h1>
        <button 
          onClick={handleGoHome}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Back
        </button>
      </div>

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
            <p className="text-gray-600 mb-1">{rated} • {selectedBooking.movie.genre} • ⭐ {selectedBooking.movie.review_score}</p>
            <p className="text-lg font-semibold text-blue-600">Showtime: {selectedBooking.showtime.label}</p>
            <p className="text-gray-600">Duration: {selectedBooking.movie.duration} minutes</p>
          </div>
        </div>
      </div>

      {/* Booking Form (UI Only - No Logic) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Select Date: {date}</h3>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Number of Tickets</h3>
          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="1">1 Ticket</option>
            <option value="2">2 Tickets</option>
            <option value="3">3 Tickets</option>
            <option value="4">4 Tickets</option>
            <option value="5">5+ Tickets</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
          onClick={handleSeating}
        >
          Continue to Seat Selection
        </button>
      </div>
    </div>
  );
};

export default BookingPage;