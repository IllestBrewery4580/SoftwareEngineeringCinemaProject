'use client'
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './components/Account/LoginPage';
import CreateAccountPage from './components/Account/CreateAccountPage';
import Profile from './components/Account/Profile';
import HomePage from './components/App/HomePage';
import BookingPage from './components/Checkout/BookingPage';
import MovieDetailsPage from './components/App/MovieDetailsPage';
import NewPassword from './components/Account/NewPassword';
import ForgotPasswordPage from './components/Account/ForgotPasswordPage';
import ResetPassword from './components/Account/ResetPassword';
import Confirmation from './components/Account/Confirmation'
import ForgotVerification from './components/Account/ForgotVerification';
import AdminLogin from './components/Admin/AdminLogin'
import Manage from "./components/Admin/Manage"
import ManageMovies from "./components/Admin/ManageMovies"
import ManageUsers from "./components/Admin/ManageUsers"
import ManagePromotions from "./components/Admin/ManagePromotions"
import ManageMovieDetails from "./components/Admin/ManageMovieDetails"
import ManageShowtimes from './components/Admin/ManageShowtimes';
import AddMovie from './components/Admin/AddMovie';
import SeatingPage from './components/Checkout/SeatingPage';
import PrivateRoutes from './components/App/PrivateRoute';
import Checkout from './components/Checkout/Checkout';
import { bookingFacade, authFacade } from './facade/cinemaFacade';
import OrderHistory from './components/Account/OrderHistory';

function App() {
  // State management
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Fetch from backend on mount
  useEffect(() => {
    setLoading(true);
    bookingFacade
      .listMovies()
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  // Checks if logged in
  useEffect(() => {
    const checkAuth = async() => {
      try {
        const response = await fetch("http://localhost:8000/accounts/isAuth/", {
          method: 'GET',
          credentials:'include',
        })
        
        const data = await response.json();
        if (data.status === 'success') {
          setIsLoggedIn(true)

          if(data.isAuth === 'Admin') {
            setIsAdmin(true)
          }
        } else {
          setIsAdmin(false)
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error("Authentication failed");
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  // Handles logout function
  const handleLogout = async () => {
    try {
      await authFacade.logout();
      alert('Logged out successfully.');
      setIsLoggedIn(false);
      navigate("/");
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
    navigate("/details", {
      state: {
        movie
      }
    });
  };
  
  const showBookingPage = (movie, showtime) => {
    navigate("/booking/", {
      state: {
        movie,
        showtime
      }
    })
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
                  {isAdmin ? (
                    <Link to="/manage" className="text-blue-200 p-2 hover:text-white transition-colors">Manage</Link>
                  ) : ("")}
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
          <Route element={<PrivateRoutes/>}>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/profile/orderhistory" element={<OrderHistory />}></Route>
            <Route path="/manage" element={<Manage/>}></Route>
            <Route path="/managemovies" element={<ManageMovies 
              movies={movies}/>}></Route>
            <Route path="/manageusers" element={<ManageUsers/>}></Route>
            <Route path="/managepromo" element={<ManagePromotions/>}></Route>
            <Route path='/manage/movie_details/:movieId' element={<ManageMovieDetails/>}></Route>
            <Route path='/manage/movie_details/:movieId/showtimes' element={<ManageShowtimes/>}></Route>
            <Route path="/addmovie" element={<AddMovie />}></Route>
            <Route path="/booking/checkout" element={<Checkout />}></Route>
          </Route>
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
          <Route path="/details" element={<MovieDetailsPage />}></Route>
          <Route path="/booking" element={<BookingPage />}></Route>
          <Route path="/login" element={<div className='justify-items-center'><LoginPage 
            onLoginSuccess={() => setIsLoggedIn(true)}/></div>}></Route>
          <Route path="/adminlogin" element={<div className='justify-items-center'><AdminLogin 
            onAdminSuccess={() => {
              setIsLoggedIn(true);
              setIsAdmin(true)}}/></div>}></Route>
          <Route path="/create" element={<CreateAccountPage />}></Route>
          <Route path="/profile/newpassword" element={<NewPassword />}></Route>
          <Route path="/login/forgotpassword" element={<ForgotPasswordPage />}></Route>
          <Route path="/login/forgotpassword/verify" element={<ForgotVerification />}></Route>
          <Route path="/login/forgotpassword/resetpassword" element={<ResetPassword />}></Route>
          <Route path="/create/verification" element={<Confirmation />}></Route>
          <Route path="/booking/seatselection" element={<SeatingPage />}></Route>
        </Routes>
      </main>

      <footer className="absolute-bottom w-full bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Team 13 - Sprint 2 CES</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
