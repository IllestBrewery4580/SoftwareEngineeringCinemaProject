import React, { useState, useEffect} from 'react'
import { Search, Filter, Play, Star, Clock, Calendar } from 'lucide-react';

const movieList = () => {
  getMovies: () => Promise.resolve([
    { 
      id: 1, 
      title: "The Lion King", 
      genre: "Animation, Adventure, Family, Drama, Musical",
      rating: 9.3,
      description: "The Lion King is a classic Disney animated film that tells the story of Simba, a young lion who must reclaim his rightful place as king after the death of his father, Mufasa, and the betrayal by his uncle, Scar.",
      releaseDate: "06/24/2994",
      showtimes: "11:00 AM, 12:30 PM, 2:00 PM, 3:30 PM, 5:00 PM",
      poster: ""
      trailer: "https://www.youtube.com/watch?v=7TavVZMewpY",
      duration: "88 minutes",
      status: "Now running",
    },
    {
      id: 2, 
      title: "Barbie (2023)", 
      genre: "Adventure, Comedy, Fantasy", 
      rating: "8.3", 
      description: "The 2023 Barbie movie, directed by Greta Gerwig, features Margot Robbie and Ryan Gosling and explores themes of self-discovery and societal expectations through a vibrant fantasy comedy lens. ", 
      releaseDate: "07/21/2023", 
      showtimes: "12 AM, 2 PM, 4 PM, 6 PM, 8 PM", 
      poster: "", 
      trailer: "https://www.youtube.com/watch?v=pBk4NYhWNMM", 
      duration: "114 minutes", 
      status: "Coming soon",
    },
    {
      id: 3, 
      title: "the Conjuring", 
      genre: "", 
      rating: "", 
      description: "", 
      releaseDate: "", 
      showtimes: "", 
      poster: "", 
      trailer: "", 
      duration: "", 
      status: "",
    },
    {
      id: 4, 
      title: "Titanic", 
      genre: "", 
      rating: "", 
      description: "", 
      releaseDate: "", 
      showtimes: "", 
      poster: "", 
      trailer: "", 
      duration: "", 
      status: "",
    },
    {
      id: 5, 
      title: "Avatar: Fire & Ash", 
      genre: "", 
      rating: "", 
      description: "", 
      releaseDate: "", 
      showtimes: "", 
      poster: "", 
      trailer: "", 
      duration: "", 
      status: "",
    },
    {
      id: 6, 
      title: "IT (2017)", 
      genre: "", 
      rating: "", 
      description: "", 
      releaseDate: "", 
      showtimes: "", 
      poster: "", 
      trailer: "", 
      duration: "", 
      status: "",
    },
    {
      id: 7, 
      title: "Harry Potter and the Half-Blood Prince", 
      genre: "", 
      rating: "", 
      description: "", 
      releaseDate: "", 
      showtimes: "", 
      poster: "", 
      trailer: "", 
      duration: "", 
      status: "",
    },
    {
      id: 8, 
      title: "Lilo & Stitch (2025)", 
      genre: "", 
      rating: "", 
      description: "", 
      releaseDate: "", 
      showtimes: "", 
      poster: "", 
      trailer: "", 
      duration: "", 
      status: "",
    },
    {
      id: 9, 
      title: "Wednesday", 
      genre: "", 
      rating: "", 
      description: "", 
      releaseDate: "", 
      showtimes: "", 
      poster: "", 
      trailer: "", 
      duration: "", 
      status: "",
    },
    {
      id: 10, 
      title: "The Impossible (2012)", 
      genre: "", 
      rating: "7.2", 
      description: "", 
      releaseDate: "", 
      showtimes: "", 
      poster: "", 
      trailer: "", 
      duration: "", 
      status: "",
    }
  ]),

  searchMovies: (query) => {
    return movieList.getMovies().then(movies => 
      movies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  },

  filterMovies: (filter) => {
    return movieList.getMovies().then(movies =>
      filter === 'all' ? movies : movies.filter(movie => movie.filter === filter)
    );
  }
};

  const CinemaEBookingSystem = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const filter = ['all', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Animation', 'Sci-Fi', 'Comedy', 'Fantasy', 'Family', 'Adventure'];
  
    useEffect(() => {
      const fetchMovies = async () => {
        setLoading(true);
        try {
          const movieData = await movieList.getMovies();
          setMovies(movieData);
          setFilteredMovies(movieData);
        } catch (error) {
          console.error("Unable to fetch movies:", error);
        }
        setLoading(false);
      };
      fetchMovies();
    }, []);

    const handleSearch = async (query) => {
      setSearchQuery(query);
      if (query.trim() === '') {
        setFilteredMovies(movies);
      } else {
        const searchResults = await movieList.searchMovies(query);
        setFilteredMovies(searchResults);
      }
    };

    const handleFilter = async (filter) => {
      setSelectedFilter(filter);
      const filteredResults = await movieList.filterMovies(filter);
      setFilteredMovies(filteredResults);
    };

    const showMovieDetails = (movie) => {
      setSelectedMovies(movie);
      setCurrentPage('details');
    };

    const showBookingPage = (movie, showtime) => {
      setSelectedBooking({ movie, showtime });
      setCurrentPage('booking');
    };

    const backToHomePage = () => {
      setCurrentPage('home');
      setSelectedMovies(null);
      setSelectedBooking(null);
    };

    // Movie card 
    const MovieCard = ({ movie, showTrailer = false }) => (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img 
            src={movie.poster}
            alt={movie.title}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => showMovieDetails(movie)}
          />
          {showTrailer && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
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
          <p className="text-gray-600 text-sm mb-2">{movie.filter}</p>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{movie.description}</p>

          {/* Show time */}
          <div className="border-t pt-3">
            <p className="text-sm font-semibold mb-2 flex items-center"></div>
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
        </div>
      </div>
    );

    // Home Page component 
    const HomePage = () => (
      const nowRunning = filteredMovies.filter(movie => movie.status === 'nowRunning');
      const comingSoon = filteredMovies.filter(movie => movie.status === 'comingSoon');

      return (
        <div className="space-y-8">
          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search movies by title..."
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedFilter}
                  onChange={(e) => handleFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {filter.map(filter => (
                    <option key={genre} value={genre}>
                      {filter === 'all' ? 'All Filters' : filter}
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
            {/* Now Running Section */}
            {nowRunning.length > 0 && ( 
              <section>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Now Running</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {nowRunning.map(movie => ( 
                    <MovieCard key ={movie.id} movie={movie} showTrailer={true}/>
                  ))}
                </div>
              </section>
            )}

            { /* Coming Soon Section */} 
            {comingSoon.length > 0 && ( 
              <section>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Coming Soon</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {comingSoon.map(movie => ( 
                    <MovieCard key ={movie.id} movie={movie} showTrailer={true}/>
                  ))}
                </div>
              </section>
            )}

            {filterMovies.length === 0 && ( 
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No movies found matching your criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Movie Details Page 
  

export default movieList