'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCookie } from '../../utils/csrf';

const ManageShowtimes = () => {
    const [movie, setMovie] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showtimes, setShowtimes] = useState([]);

    const navigate = useNavigate()
    const location = useLocation()
    const { movieId } = location.state || {};
    
    useEffect(() => {
        setLoading(true)
        fetch(`http://localhost:8000/api/movies/${movieId}/`)
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setMovie(data)});
    }, [movieId]);

    useEffect(() => {
        if (movie) {
            const showtimeAll = (movie.showtimes_raw || []).map(show => ({
                id: show.id,
                show_start_time: show.show_start_time.replace('Z', ''),
                auditorium: show.auditorium,
                no_of_available_seats: show.no_of_available_seats,
            }));
            setShowtimes(showtimeAll);
        }
    }, [movie]);

    if (loading) {
        return <p className='text-center'>Loading...</p>;
    }

    const handleGoBack = () => {
        navigate(`/manage/movie_details/${movieId}`, {state: {movieId: movieId}})
    }

    const formatForInput = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const pad = (num) => num.toString().padStart(2, '0');

        const yyyy = date.getFullYear();
        const MM = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const hh = pad(date.getHours());
        const mm = pad(date.getMinutes());

        return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    };

    const sortedShowtimes = showtimes
    .map(s => ({ 
        ...s, 
        dateObj: new Date(s.show_start_time)
    }))
    .sort((a, b) => a.dateObj - b.dateObj);

    const handleShowtimeChange = (index, field, value) => {
        setShowtimes(prev =>
            prev.map((times, i) => (i === index ? { ...times, [field]: value } : times))
        );
    };

    const addShowtime = () => {
        setShowtimes(prev => [
            ...prev,
            {
                id: null,
                show_start_time: '',
                auditorium: '',
                no_of_available_seats: 0,
            }
        ]);
    };

    const removeShowtime = async (index) => {
        if (movie.showtimes[index] == null) {
            setShowtimes(prev => prev.filter((_, i) => i !== index));
        } else {
            const confirmDelete = window.confirm(`Are you sure you want to delete this showtime?`);
            if (!confirmDelete) return;

            try {
                const csrftoken = getCookie('csrftoken');
                const response = await fetch(`http://localhost:8000/api/showtimes/${showtimes[index].id}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": csrftoken,
                },
                credentials: "include",
                });

                console.log(response)
                if (response.status === 204) {
                    alert("Movie showtime deleted successfully!");
                    setShowtimes(prev => prev.filter((_, i) => i !== index));
                } else {
                    alert("Failed to delete movie showtime. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting movie showtime:", error);
                alert("An error occurred while deleting the movie showtime.");
            }
        }
    };

    const handleSubmit = async() => {
        try {
            const response = await fetch(`http://localhost:8000/api/showtimes/${movie.id}/update_showtimes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    showtimes: showtimes.map(show => ({
                        id: (show.id ? show.id : null),
                        show_start_time: show.show_start_time,
                        auditorium: show.auditorium,
                        no_of_available_seats: show.no_of_available_seats,
                        movie_id: show.movie_id
                    }))
                }),
                credentials:'include',
            });

            const data = await response.json();
            console.log(data)
            if (data.status === 'success') {
                alert('Movie showtimes updated successfully!');
                window.location.reload();
            } else {
                if (typeof data === "object") {
                    const formattedErrors = Object.entries(data)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n");
                    alert(`Error updating showtimes:\n${formattedErrors}`);
                } else {
                    alert("Failed to update movie showtimes.");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the movie showtimes.');
        }
    }

    if (!movie) {
        return <p>Movie doesn't exist!</p>
    }

    return (<>
        <div className= "flex justify-center min-w-screen">
            <div className="bg-white py-4 px-16 pb-2 rounded-lg shadow-md max-w-4xl w-full">
                <h1 className="pb-1 text-center font-bold text-3xl">{movie.title}</h1>
                <hr className='my-4'></hr>
                <h1 className="pb-2 text-center text-xl font-semibold">Showtimes</h1>
                <hr className='pb-6'></hr>
                {sortedShowtimes.map((show, index) => (<>
                    <div key={index} className="border py-2 rounded-lg shadow-md mb-4 p-4">
                        <h1 className="pb-2 text-lg text-center">Showtime {index + 1}</h1>
                        <hr className='py-3'></hr>
                        <div className="flex flex-row items-center justify-center md:flex-row gap-4 mb-6">
                        <h2>DateTime:</h2>
                        <input
                            type='datetime-local'
                            value={formatForInput(show.show_start_time)}
                            onChange={(e) => handleShowtimeChange(index, 'show_start_time', e.target.value)}
                            className="w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        </div>
                        <div className="flex flex-row items-center justify-center md:flex-row gap-4 mb-6">
                        <h2>Auditorium:</h2>
                        <input
                            type='text'
                            placeholder='Auditorium'
                            value={show.auditorium}
                            onChange={(e) => handleShowtimeChange(index, 'auditorium', e.target.value)}
                            className="w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        </div>
                        <div className="flex flex-row items-center justify-center md:flex-row gap-4 mb-6">
                        <h2>No. of Available Seats:</h2>
                        <input
                            type='number'
                            placeholder='number of available seats'
                            value={show.no_of_available_seats}
                            onChange={(e) => handleShowtimeChange(index, 'no_of_available_seats', e.target.value)}
                            className="w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        </div>
                        <div className="flex flex-wrap md:flex-row mb-2 pr-6 justify-end">
                            <button onClick={() => removeShowtime(index)} className="align-center bg-red-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-red-900 text-white transition-colors">Delete</button>
                        </div>
                    </div>
                </>))}
                <div className="justify-center flex py-2">
                    <button
                        type="button"
                        onClick={() => addShowtime()}
                        className=" text-l w-full px-4 border py-2 rounded-lg shadow-sm flex items-center justify-center hover:bg-[#bbbbbb]">
                    Add Showtime
                    </button>
                </div>
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 pt-2 justify-between">
                    <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                    <button onClick={handleSubmit} className="align-right bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Done</button>
                </div>
            </div>
        </div>
    </>);
}

export default ManageShowtimes;