'use client'
import React, { useState, useEffect} from 'react';
import {getCookie} from '../../utils/csrf'
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';

export default function Confirmation() {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('')
    const [popup, setPopup] = useState(false);
    const handleOtp = (otp) => setOtp(otp);
    const navigate = useNavigate()
    
    const getCSRFToken = async () => {
    await fetch("http://localhost:8000/accounts/csrf/", {
      method: "GET",
      credentials: "include",
    });
    };

    const handlePopup = () => {
        setPopup(!popup);
    }

    const handleSend  = async() => {
        try {
            await getCSRFToken();
            const csrftoken = getCookie("csrftoken");

            const response = await fetch("http://localhost:8000/accounts/verify-otp/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                },
                credentials:'include',
                body: JSON.stringify({ otp }),
            });
            
            const data = await response.json()
            if(data.status === 'success'){
                handlePopup()
                navigate("/login")
            } else {
                setMessage("Invalid verification code! Please try again.")
            }
        } catch (err) {
            console.error("Error with verification:", err);
            setMessage("An error occurred");
        }
    }

    return (
        <div className= "flex justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <h1 className='font-bold text-center text-lg'>Success!</h1>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <h3>Your account has been created! A verification code has been sent to your email. Please enter it below.</h3>
                </div>
            {message && <p className="mb-3 text-center text-red-600">{message}</p>}
            {popup && <Popup closePopup={handlePopup}>Your account has been verified! Log in now!</Popup>}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
                type="text"
                placeholder="Verification Code"
                value={otp}
                onChange={(e) => handleOtp(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>     
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
                <button onClick={handleSend} className="bg-blue-700 w-full pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Confirm</button>
            </div>
            
            </div>
        </div>
    )
};