<<<<<<< HEAD:Frontend/src/components/MovieDetailsPage.js
'use client'
import { Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieDetailsPage = ({ selectedMovie, showBookingPage }) => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/")
  }
  
  if (!selectedMovie) return null;

  const casts = selectedMovie.cast ? selectedMovie.cast.split(',').map(g => g.trim()).join(" • ") : []
  
  var rated = null;
  if(selectedMovie.rating == 1) {
    rated = "G"
  } else if (selectedMovie.rating == 2) {
    rated = "PG"
  } else if (selectedMovie.rating == 3) {
    rated = "PG-13"
  } else {
    rated = "R"
  }

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
              {selectedMovie.review_score}
            </span>
            <span className="text-gray-600">{selectedMovie.genre}</span>
            <span className="text-gray-600">• {selectedMovie.duration} minutes</span>
            <span className="text-gray-600">• {rated}</span>
          </div>

          <div>
            <span className="text-gray-600 font-bold">Producer:{" "}</span>
            <span className="text-gray-600">{selectedMovie.producer}</span>
            <br></br>
            <span className="text-gray-600 font-bold">Cast:{" "}</span>
            <span className="text-gray-600">{casts}</span>
          </div>
          
          <br></br>
          <div>
            <span className="text-gray-600 font-bold">Synopsis:{" "}</span>
            <span className="text-gray-700 mb-6 leading-relaxed">{selectedMovie.description}</span>
          </div>
          <br></br>
          
          {/* Trailer Section */}
          {selectedMovie.trailer_link && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Watch Trailer</h3>
              <div className="aspect-video">
                <iframe
                  src={selectedMovie.trailer_link}
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
=======
'use client'
import { Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieDetailsPage = ({ selectedMovie, showBookingPage }) => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/")
  }
  
  if (!selectedMovie) return null;

  const casts = selectedMovie.cast ? selectedMovie.cast.split(',').map(g => g.trim()).join(" • ") : []
  
  var rated = null;
  if(selectedMovie.rating == 1) {
    rated = "G"
  } else if (selectedMovie.rating == 2) {
    rated = "PG"
  } else if (selectedMovie.rating == 3) {
    rated = "PG-13"
  } else {
    rated = "R"
  }

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
              {selectedMovie.review_score}
            </span>
            <span className="text-gray-600">{selectedMovie.genre}</span>
            <span className="text-gray-600">• {selectedMovie.duration} minutes</span>
            <span className="text-gray-600">• {rated}</span>
          </div>

          <div>
            <span className="text-gray-600 font-bold">Producer:{" "}</span>
            <span className="text-gray-600">{selectedMovie.producer}</span>
            <br></br>
            <span className="text-gray-600 font-bold">Cast:{" "}</span>
            <span className="text-gray-600">{casts}</span>
          </div>
          
          <br></br>
          <div>
            <span className="text-gray-600 font-bold">Synopsis:{" "}</span>
            <span className="text-gray-700 mb-6 leading-relaxed">{selectedMovie.description}</span>
          </div>
          <br></br>

          {/* Trailer Section */}
          {selectedMovie.trailer_link && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Watch Trailer</h3>
              <div className="aspect-video">
                <iframe
                  src={selectedMovie.trailer_link}
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
                {selectedMovie.showtimes.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => showBookingPage(selectedMovie, time)}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    {time.label}
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
>>>>>>> dbandfrontend:Frontend/src/components/App/MovieDetailsPage.js
