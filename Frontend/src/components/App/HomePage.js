'use client'
import { Search, Filter } from 'lucide-react';
import MovieCard from './MovieCard';

const HomePage = ({ searchQuery, handleSearch, selectedGenre, handleFilter, genres, filteredMovies, loading, showMovieDetails, showBookingPage }) => {
  const currentlyRunning = filteredMovies.filter(movie => movie.showtimes.length > 0);
  const comingSoon = filteredMovies.filter(movie => movie.showtimes.length === 0);

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

export default HomePage;