'use client'
import { Play, Clock } from 'lucide-react';

const MovieCard = ({ movie, showTrailer = false, showMovieDetails, showBookingPage }) => {
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
  
  return(
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="relative">
      <img 
        src={movie.poster} 
        alt={movie.title}
        className="w-full h-64 object-cover cursor-pointer"
        onClick={() => showMovieDetails(movie)}
      />
      {showTrailer && movie.trailer_link && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
             onClick={() => showMovieDetails(movie)}>
          <Play className="text-white w-12 h-12" />
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 
        className="font-bold text-lg mb-2 cursor-pointer hover:text-blue-600"
        onClick={() => showMovieDetails(movie)}
      >
        {movie.title}
      </h3>
      <p className="text-gray-600 text-sm mb-2">{rated} • {movie.genre} • ⭐ {movie.review_score}</p>
      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{movie.description}</p>
      
      {/* Showtimes */}
      {movie.showtimes && movie.showtimes.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-sm font-semibold mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Showtimes:
          </p>
          <div className="flex flex-wrap gap-2">
            {movie.showtimes.map((time) => (
              <button
                key={time.id}
                onClick={() => showBookingPage(movie, time)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default MovieCard;