'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/csrf';

 const Manage = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/")
    }

    const handleManageMovies = () => {
        navigate("/managemovies")
    }

    const handleManageUsers = () => {
        navigate("/manageusers")
    }

    const handleManagePromo = () => {
        navigate("/managepromo")
    }

    return(<>
        <div className= "flex justify-center min-w-screen">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md max-w-4xl w-full">
                <h1 className="pb-3 text-center font-bold text-xl">Manage</h1>
                <hr className='pb-4'></hr>
                <ul className='flex flex-col text-xl font-semibold mb-4'>
                    <li onClick={handleManageMovies} className="font-semibold mb-2 cursor-pointer hover:text-blue-600">Manage Movies</li>
                    <li onClick={handleManageUsers} className="font-semibold mb-2 cursor-pointer hover:text-blue-600">Manage Users</li>
                    <li onClick={handleManagePromo} className="font-semibold mb-2 cursor-pointer hover:text-blue-600">Manage Promotions</li>
                </ul>
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                    <button onClick={handleGoBack} className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                </div>
            </div>
        </div>
    </>);
};

export default Manage;