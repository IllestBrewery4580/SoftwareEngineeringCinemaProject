import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/profile');
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 ">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
                    <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"> Go back</button>
            </div>
        </div>
    )
}

export default OrderHistory; 