'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/csrf';
import PromotionForm from './PromotionForm';

 const ManagePromotions = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([])
    const handleGoBack = () => {
        navigate("/manage")
    }

    useEffect(() => {
        try {
            fetch(`http://localhost:8000/promotions/promotionList/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }})
            .then(res => res.json())
            .then(data => {
                setPromotions(data.promotions);
            });
        } catch (error) {
            console.error("Error fetching promotions:", error);
        }
    }, []);

    return(<>
        <div className= "flex justify-center min-w-screen mb-6">
            <div className="bg-white p-6 pb-6 rounded-lg shadow-md shadow-md max-w-4xl w-full">
                <h1 className="pb-3 text-center font-bold text-xl">Manage Promotions</h1>
                <hr className='pb-6'></hr>
                <PromotionForm />
            </div>
        </div>
        <div className= "flex justify-center min-w-screen">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md shadow-md max-w-4xl w-full">
                <h1 className="pb-3 text-center font-bold text-xl">Existing Promotions</h1>
                <hr className='pb-6'></hr>
                {promotions.map((promo, index) => (
                    <div className="border py-2 rounded-lg shadow-md mb-4 p-4">
                        <div key={index} className="mb-2 text-center">
                            <h2 className='text-xl font-semibold'>{promo.promo_code}</h2>
                            <p className='pb-4'>{promo.discount_percent}%</p>
                            <hr className='pb-4'/>
                            <p>{promo.description}</p>
                            <p>From: {promo.start_date} Until: {promo.end_date}</p>
                        </div>
                    </div>
                ))}
                <div className="flex flex-wrap md:flex-row gap-4 my-6 justify-between">
                    <button onClick={handleGoBack} className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                </div>
            </div>
        </div>
    </>);
};

export default ManagePromotions;