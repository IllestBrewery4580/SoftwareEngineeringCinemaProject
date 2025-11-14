'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/csrf';

 const ManagePromotions = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/manage")
    }

    return(<>
        <div className= "flex flex-col justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
                <h1 className="pb-1 text-center font-bold text-xl">Manage Promotions</h1>
                <hr></hr>
                <ul className='flex flex-col text-xl font-semibold mb-4'>
                    
                </ul>
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                    <button onClick={handleGoBack} className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                </div>
            </div>
        </div>
    </>);
};

export default ManagePromotions;