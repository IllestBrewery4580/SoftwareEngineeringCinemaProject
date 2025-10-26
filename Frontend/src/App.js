'use client'
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import CreateAccountPage from '../components/CreateAccountPage';
import Profile from '../components/Profile';
import HomePage from '../components/HomePage';
import BookingPage from '../components/BookingPage';
import MovieDetailsPage from '../components/MovieDetailsPage';
import NewPassword from '../components/NewPassword';
import ForgotPasswordPage from '../components/ForgotPasswordPage';
import ResetPassword from '../components/ResetPassword';
import Confirmation from '../components/Confirmation'
import ForgotVerification from '../components/ForgotVerification';

function App() {
  // State management
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Fetch from backend on mount
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/movies/")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        console.log(data)
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  // Handles logout function
  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8000/accounts/logout/', {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Accept': 'application/json',
          },
      });

      if (res.ok) {
        alert('Logged out successfully.');
        setIsLoggedIn(false); // clear frontend state
        navigate("/"); // redirect to login page
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (err) {
      console.error('Logout fetch error:', err);
      alert("Logout failed. Please try again.");
    }
  };

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
    navigate("/details");
  };
  
  const showBookingPage = (movie, showtime) => {
    setSelectedBooking({ movie, showtime });
    navigate("/booking")
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold cursor-pointer hover:text-blue-200">Simply Movies</Link>
              <nav className="flex items-center space-x-4">
                <Link to="/" className="text-blue-200 hover:text-white transition-colors">Home</Link>
                {isLoggedIn ? (<>
                  <Link to="/profile" className="text-blue-200 p-2 hover:text-white transition-colors">Profile</Link>
                  <button onClick={handleLogout} className="text-blue-200 hover:text-white transition-colors">Logout</button>
                </>) : (
                  <Link to="/login" className="text-blue-200 p-2 hover:text-white transition-colors">Login</Link>
                )}
                </nav>
            </div>
          </div>
        </header>
    
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage 
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            selectedGenre={selectedGenre}
            handleFilter={handleFilter}
            genres={genres}
            filteredMovies={filteredMovies}
            loading={loading}
            showMovieDetails={showMovieDetails}
            showBookingPage={showBookingPage}
          />}></Route>
          <Route path="/details" element={<MovieDetailsPage 
            selectedMovie={selectedMovie}
            showBookingPage={showBookingPage}
          />}></Route>
          <Route path="/booking" element={<BookingPage 
            selectedBooking={selectedBooking}
          />}></Route>
          <Route path="/login" element={<div className='justify-items-center'><LoginPage onLoginSuccess={() => setIsLoggedIn(true)}/></div>}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/create" element={<CreateAccountPage />}></Route>
          <Route path="/profile/newpassword" element={<NewPassword />}></Route>
          <Route path="/login/forgotpassword" element={<ForgotPasswordPage />}></Route>
          <Route path="/login/forgotpassword/verify" element={<ForgotVerification />}></Route>
          <Route path="/login/forgotpassword/resetpassword" element={<ResetPassword />}></Route>
          <Route path="/create/verification" element={<Confirmation />}></Route>
        </Routes>
      </main>

      <footer className="absolute-bottom w-full bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Team 13 - Sprint 1 CES</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
