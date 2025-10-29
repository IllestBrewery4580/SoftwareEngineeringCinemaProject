'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/csrf';

const ManageMovieDetails = ( {selectedMovie} ) => {
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cast, setCast] = useState('');
    const [producer, setProducer] = useState('');
    const [genre, setGenre] = useState('');
    const [duration, setDuration] = useState('');
    const [trailer, setTrailer] = useState('');
    const [poster, setPoster] = useState('');
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');

    const handleTitleChange = (title) => setTitle(title);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleCastChange = (e) => setCast(e.target.value);
    const handleProducerChange = (e) => setProducer(e.target.value);
    const handleGenreChange = (e) => setGenre(e.target.value);
    const handleDurationChange = (e) => setDuration(e.target.value);
    const handleTrailerChange = (e) => setTrailer(e.target.value);
    const handlePosterChange = (e) => setPoster(e.target.value);
    const handleRatingChange = (e) => setRating(e.target.value);
    const handleReviewChange = (e) => setReview(e.target.value);

    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate("/manage")
    }

    useEffect(() => {
        if (selectedMovie) {
            setTitle(selectedMovie.title || '');
            setDescription(selectedMovie.description || '');
            setCast(selectedMovie.cast || '');
            setProducer(selectedMovie.producer || '');
            setGenre(selectedMovie.genre || '');
            setDuration(selectedMovie.duration || '');
            setTrailer(selectedMovie.trailer_link || '');
            setPoster(selectedMovie.poster || '');
            setRating(selectedMovie.rating || '');
            setReview(selectedMovie.review_score || '');
        }
    }, [selectedMovie]);

    const handleDelete = () => {
        
    }

    const handleSubmit = () => {

    }

    if (!selectedMovie) {
        return <p>Movie doesn't exist!</p>
    }

    return (<>
        <div className= "flex-flow justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md w-500">
                <h1 className="pb-1 text-center font-bold text-xl">{selectedMovie.title}</h1>
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
                        type="text"
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
                        type="text"
                        placeholder="poster"
                        value={poster}
                        onChange={(e) => handlePosterChange(e.target.value)}
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
                        required={true}
                        className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                    <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                    <button onClick={handleDelete} className="align-right bg-red-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-red-900 text-white transition-colors">Delete</button>
                    <button onClick={handleSubmit} className="align-right bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Done</button>
                </div>
            </div>
        </div>
    </>);
}

export default ManageMovieDetails;