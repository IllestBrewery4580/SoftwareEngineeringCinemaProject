'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/csrf';

 const Manage = ( {movies, showManageMovie, setSelectedMovie} ) => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/")
    }

  const movieDetails = (movie) => {
    setSelectedMovie(movie)
    showManageMovie(movie)
    navigate("/manage/movie_details")
  }

    return(<>
        <div className= "flex-flow justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md w-500">
                <h1 className="pb-1 text-center font-bold text-xl">Manage Movies</h1>
                <hr></hr>
                <ul className='flex flex-col text-xl font-semibold mb-4'>
                    {movies.map((movie, index) => (

                        <li key={index} onClick={() => movieDetails(movie)} className="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600">
                            {index+1} | {movie.title}
                        </li>
                    ))}
                </ul>
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                    <button onClick={handleGoBack} className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                </div>
            </div>
        </div>
    </>);
};

export default Manage;