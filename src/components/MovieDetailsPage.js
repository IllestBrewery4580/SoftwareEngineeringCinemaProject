'use client'
import { Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieDetailsPage = ({ selectedMovie, showBookingPage }) => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/")
  }
  
  if (!selectedMovie) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={selectedMovie.poster} 
            alt={selectedMovie.title}
            className="w-full h-96 md:h-full object-cover"
          />
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{selectedMovie.title}</h1>
            <button onClick={handleGoHome} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
              ← Back
            </button>
          </div>
          
          <div className="flex items-center mb-4 space-x-4">
            <span className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-1" />
              {selectedMovie.rating}
            </span>
            <span className="text-gray-600">{selectedMovie.genre}</span>
            <span className="text-gray-600">{selectedMovie.duration}</span>
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed">{selectedMovie.description}</p>
          
          {/* Trailer Section */}
          {selectedMovie.trailer && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Watch Trailer</h3>
              <div className="aspect-video">
                <iframe
                  src={selectedMovie.trailer}
                  title={`${selectedMovie.title} Trailer`}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          {/* Showtimes Section */}
          {selectedMovie.showtimes && selectedMovie.showtimes.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Available Showtimes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedMovie.showtimes.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => showBookingPage(selectedMovie, time)}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;