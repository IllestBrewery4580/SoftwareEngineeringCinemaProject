'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCookie } from '../../utils/csrf';
import Popup from '../Account/Popup';

const ManageMovieDetails = () => {
    const [movie, setMovie] = useState([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cast, setCast] = useState('');
    const [producer, setProducer] = useState('');
    const [genre, setGenre] = useState('');
    const [duration, setDuration] = useState('');
    const [trailer, setTrailer] = useState('');
    const [poster, setPoster] = useState(null);
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');
    const [message, setMessage] = useState('');
    const [content, setContent] = useState('');
    const [popup, setPopup] = useState(false);

    const handleTitleChange = (title) => setTitle(title);
    const handleDescriptionChange = (description) => setDescription(description);
    const handleCastChange = (cast) => setCast(cast);
    const handleProducerChange = (producer) => setProducer(producer);
    const handleGenreChange = (genre) => setGenre(genre);
    const handleDurationChange = (duration) => setDuration(duration);
    const handleTrailerChange = (trailer) => setTrailer(trailer);
    const handlePosterChange = (file) => setPoster(file);
    const handleRatingChange = (rating) => setRating(rating);
    const handleReviewChange = (review) => setReview(review);
    const handlePopup = () => {
        setPopup(!popup)
    }
    
    const navigate = useNavigate()
    const location = useLocation()
    const {movieId} = location.state || {};

    useEffect(() => {
        setLoading(true)
        fetch(`http://localhost:8000/api/movies/${movieId}/`)
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                setMovie(data)});
    }, [movieId]);
    console.log(movie)

    useEffect(() => {
        if (movie) {
            setTitle(movie.title || '');
            setDescription(movie.description || '');
            setCast(movie.cast || '');
            setProducer(movie.producer || '');
            setGenre(movie.genre || '');
            setDuration(movie.duration || '');
            setTrailer(movie.trailer_link || '');
            setPoster(movie.poster || '');
            setRating(movie.rating || '');
            setReview(movie.review_score || '');
        }
    }, [movie]);
    
    if (loading) {
        return <p className='text-center'>Loading...</p>;
    }

    const handleGoBack = () => {
        navigate("/managemovies")
    }
    const handleShowtimes = () => {
        navigate(`/manage/movie_details/${movieId}/showtimes`, {
            state: {movieId: movieId}
        })
    }

    const handleDelete = async () => {
        if (!movie || !movie.id) {
            setMessage("No movie selected to delete.");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete "${movie.title}"?`);
        if (!confirmDelete) return;

        try {
            const csrftoken = getCookie('csrftoken');

            const response = await fetch(`http://localhost:8000/api/movies/${movie.id}/`, {
            method: "DELETE",
            headers: {
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
            });

            if (response.ok) {
                setContent("Movie deleted successfully!")
                handlePopup()
                navigate("/managemovies");
                window.location.reload();
            } else {
                setMessage("Failed to delete movie. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
            setMessage("An error occurred while deleting the movie.");
        }
    };

    const handleSubmit = async() => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('cast', cast);
        formData.append('genre', genre);
        formData.append('producer', producer);
        formData.append('duration', duration);
        formData.append('trailer_link', trailer);
        if (poster instanceof File) {
            formData.append('poster', poster);
        }
        formData.append('rating', rating);
        formData.append('review_score', review);

        try {
            if (!title || !description || !cast || !genre || !producer || !duration || !trailer || !rating || !review) {
                setMessage("Please fill out of the fields below.")
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            const response = await fetch(`http://localhost:8000/api/movies/${movie.id}/update_movie/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: formData,
                credentials:'include',
            });

            const data = await response.json();
            if (data.status === 'success') {
                setContent("Movie updated successfully!")
                handlePopup();
            } else {
                setMessage('Failed to update movie. ', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while updating the movie.' + error);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (<>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
                <div className="md:w-1/3">
                    <img 
                        src={poster} 
                        alt={title}
                        className="w-full h-96 md:h-full object-cover"
                    />
                </div>

                {message && <p className="mt-4 text-center text-red-600">{message}</p>}
                {popup && <Popup closePopup={() => {
                    handlePopup();
                    setMessage('')}}
                >{content}</Popup>}
                <div className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                        <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                        ← Go Back
                        </button>
                    </div>
                    <hr className='my-4'></hr>
                    <h1 className="text-center text-lg font-semibold">Title</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            required={true}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Description</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            required={true}
                            rows={5}
                            className="w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Cast</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <textarea
                            placeholder="Cast"
                            value={cast}
                            onChange={(e) => handleCastChange(e.target.value)}
                            required={true}
                            rows={5}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Genre</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Genre"
                            onChange={(e) => handleGenreChange(e.target.value)}
                            value={genre}
                            required={true}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Producer</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Producer"
                            value={producer}
                            onChange={(e) => handleProducerChange(e.target.value)}
                            required={true}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Duration</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Duration (in minutes)"
                            value={duration}
                            onChange={(e) => handleDurationChange(e.target.value)}
                            required={true}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Trailer</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="url"
                            placeholder="Trailer link"
                            value={trailer}
                            onChange={(e) => handleTrailerChange(e.target.value)}
                            required={true}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Poster</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="file"
                            accept='image/*'
                            placeholder="poster"
                            onChange={(e) => handlePosterChange(e.target.files[0])}
                            required={true}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Rating</h1>
                    <h3 className="text-center">1=G, 2=PG, 3=PG-13, 4=R</h3>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Rating"
                            value={rating}
                            onChange={(e) => handleRatingChange(e.target.value)}
                            required={true}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <h1 className="text-center text-lg font-semibold">Review Score</h1>
                    <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Review Score"
                            value={review}
                            onChange={(e) => handleReviewChange(e.target.value)}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className='flex w-full justify-center pb-4'>
                        <button onClick={handleShowtimes} className="w-full bg-blue-400 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-600 text-white transition-colors">Edit Showtimes</button>
                    </div>
                    <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                        <button onClick={handleDelete} className="w-1/3 bg-red-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-red-900 text-white transition-colors">Delete</button>
                        <button onClick={handleSubmit} className="w-1/3 bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Done</button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default ManageMovieDetails;