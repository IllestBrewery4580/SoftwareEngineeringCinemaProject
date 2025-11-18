'use client'
import { Star, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MovieDetailsPage = () => {
  const location = useLocation()
  const { movie } = location.state || []
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/")
  }
  
  if (!movie) return null;

  const casts = movie.cast ? movie.cast.split(',').map(g => g.trim()).join(" • ") : []
  
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-96 md:h-full object-cover"
          />
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
            <button onClick={handleGoHome} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
              ← Back
            </button>
          </div>
          
          <div className="flex items-center mb-4 space-x-4">
            <span className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-1" />
              {movie.review_score}
            </span>
            <span className="text-gray-600">{movie.genre}</span>
            <span className="text-gray-600">• {movie.duration} minutes</span>
            <span className="text-gray-600">• {rated}</span>
          </div>

          <div>
            <span className="text-gray-600 font-bold">Producer:{" "}</span>
            <span className="text-gray-600">{movie.producer}</span>
            <br></br>
            <span className="text-gray-600 font-bold">Cast:{" "}</span>
            <span className="text-gray-600">{casts}</span>
          </div>
          
          <br></br>
          <div>
            <span className="text-gray-600 font-bold">Synopsis:{" "}</span>
            <span className="text-gray-700 mb-6 leading-relaxed">{movie.description}</span>
          </div>
          <br></br>

          {/* Trailer Section */}
          {movie.trailer_link && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Watch Trailer</h3>
              <div className="aspect-video">
                <iframe
                  src={movie.trailer_link}
                  title={`${movie.title} Trailer`}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          {/* Showtimes Section */}
          {movie.showtimes && movie.showtimes.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Available Showtimes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {movie.showtimes.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => navigate(`/booking/`, {state: {movie: movie, showtime: time}})}
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
