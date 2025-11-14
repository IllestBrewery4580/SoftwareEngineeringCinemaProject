'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/csrf';

const AddMovie = () => {
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

    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate("/manage")
    }

    const handleSubmit = async() => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('cast', cast);
        formData.append('genre', genre);
        formData.append('producer', producer);
        formData.append('duration', duration);
        formData.append('trailer_link', trailer);
        formData.append('poster', poster);
        formData.append('rating', rating);
        formData.append('review_score', review);

        try {
            const response = await fetch('http://localhost:8000/api/movies/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: formData,
            });

            const data = await response.json();
            if (response.status === 201) {
                alert('Movie added successfully!');
                navigate('/manage');
            } else {
                alert('Failed to add movie.');
                console.log(data.message)
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the movie.');
        }
    }

    return (<>
        <div className= "flex-flow justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md w-500">
                <h1 className="pb-1 text-center font-bold text-xl">Add a Movie</h1>
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
                        className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        type="number"
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
                        accept="image/*"
                        placeholder='Poster'
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
                        type="number"
                        placeholder="Review Score"
                        value={review}
                        onChange={(e) => handleReviewChange(e.target.value)}
                        min={0}
                        max={10}
                        step={0.1}
                        required={true}
                        className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                    <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                    <button onClick={handleSubmit} className="align-right bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Done</button>
                </div>
            </div>
        </div>
    </>);
}

export default AddMovie;