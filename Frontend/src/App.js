import React, { useState, useEffect} from 'react';
import { Search, Filter, Play, Star, Clock, Calendar } from 'lucide-react';
import LoginPage from './components/LoginPage';

// Movie cards
const MovieCard = ({ movie, showTrailer = false, showMovieDetails, showBookingPage }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="relative">
      <img 
        src={movie.poster} 
        alt={movie.title}
        className="w-full h-64 object-cover cursor-pointer"
        onClick={() => showMovieDetails(movie)}
      />
      {showTrailer && movie.trailer && (
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
      <p className="text-gray-600 text-sm mb-2">{movie.genre} • ⭐ {movie.rating}</p>
      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{movie.description}</p>
      
      {/* Showtimes */}
      {movie.showtimes && movie.showtimes.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-sm font-semibold mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Showtimes:
          </p>
          <div className="flex flex-wrap gap-2">
            {movie.showtimes.map((time, index) => (
              <button
                key={index}
                onClick={() => showBookingPage(movie, time)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Home page
const HomePage = ({ searchQuery, handleSearch, selectedGenre, handleFilter, genres, filteredMovies, loading, showMovieDetails, showBookingPage }) => {
  const currentlyRunning = filteredMovies.filter(movie => movie.status === 'Now running');
  const comingSoon = filteredMovies.filter(movie => movie.status === 'Coming soon');

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedGenre}
              onChange={(e) => handleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {genres.map(filter => (
                <option key={filter} value={filter}>
                  {filter === 'all' ? 'Filters' : filter}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading movies from database...</p>
        </div>
      ) : (
        <>
          {/* Currently running section */}
          {currentlyRunning.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Now Playing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentlyRunning.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    showTrailer={true}
                    showMovieDetails={showMovieDetails}
                    showBookingPage={showBookingPage}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Coming soon section */}
          {comingSoon.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Coming Soon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {comingSoon.map(movie => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    showTrailer={true}
                    showMovieDetails={showMovieDetails}
                    showBookingPage={showBookingPage}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No movies found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Movie details page 
const MovieDetailsPage = ({ selectedMovie, goHome, showBookingPage }) => {
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
            <button onClick={goHome} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
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

// Booking Page Component (UI Only)
const BookingPage = ({ selectedBooking, goHome }) => {
  if (!selectedBooking) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Book Your Tickets</h1>
        <button 
          onClick={goHome}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ← Back to Home
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
            <p className="text-gray-600 mb-1">{selectedBooking.movie.genre} • ⭐ {selectedBooking.movie.rating}</p>
            <p className="text-lg font-semibold text-blue-600">Showtime: {selectedBooking.showtime}</p>
            <p className="text-gray-600">Duration: {selectedBooking.movie.duration}</p>
          </div>
        </div>
      </div>

      {/* Booking Form (UI Only - No Logic) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Select Date</h3>
          <input 
            type="date" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
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

      {/* Select seat/ price/ payment/ confirm booking */}
      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">This part will be developed late for:</h3>
        <ul className="text-yellow-700 space-y-1">
          <li>- Interactive seat selection</li>
          <li>- Pricing calculation</li>
          <li>- Payment processing</li>
          <li>- Booking confirmation</li>
        </ul>
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
          onClick={() => alert('Booking functionality will be implemented in future sprints!')}
        >
          Continue to Seat Selection
        </button>
      </div>
    </div>
  );
};

function App() {
  // State management
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch from backend on mount
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/movies/")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  // Extract genres from movies
  const genres = ['all', ...Array.from(new Set(
    movies.flatMap(m => 
      m.genre ? m.genre.split(',').map(g => g.trim()) : []
    )
  ))];

  // Filtered movies based on search and genre
  const filteredMovies = movies.filter(movie => {
    const matchesTitle = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || 
      (movie.genre && movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchesTitle && matchesGenre;
  });

  // Handlers
  const handleSearch = (query) => setSearchQuery(query);
  const handleFilter = (genre) => setSelectedGenre(genre);
  
  const showMovieDetails = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage('details');
  };
  
  const showBookingPage = (movie, showtime) => {
    setSelectedBooking({ movie, showtime });
    setCurrentPage('booking');
  };
  
  const goHome = () => {
    setCurrentPage('home');
    setSelectedMovie(null);
    setSelectedBooking(null);
  };

  const goLogin = () => {
    setCurrentPage('login');
    setSelectedMovie(null);
    setSelectedBooking(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-blue-900 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold cursor-pointer hover:text-blue-200" onClick={goHome}>
                Simply Movies
              </h1>
              <nav>
                <button onClick={goHome} className="text-blue-200 hover:text-white transition-colors">
                  Home
                </button>
                <button onClick={goLogin} className="text-blue-200 hover:text-white transition-colors">Login</button>
              </nav>
            </div>
          </div>
        </header>
    
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <HomePage 
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            selectedGenre={selectedGenre}
            handleFilter={handleFilter}
            genres={genres}
            filteredMovies={filteredMovies}
            loading={loading}
            showMovieDetails={showMovieDetails}
            showBookingPage={showBookingPage}
          />
        )}

        {currentPage === 'details' && (
          <MovieDetailsPage 
            selectedMovie={selectedMovie}
            goHome={goHome}
            showBookingPage={showBookingPage}
          />
        )}

        {currentPage === 'booking' && (
          <BookingPage 
            selectedBooking={selectedBooking}
            goHome={goHome}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage />
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Team 13 - Sprint 1 CES</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
