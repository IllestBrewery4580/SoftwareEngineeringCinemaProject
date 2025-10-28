'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {getCookie} from '../utils/csrf'

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const handleNewPassword = (newPassword) => setNewPassword(newPassword);
    const handleNewPassword2 = (newPassword2) => setNewPassword2(newPassword2);
    const navigate = useNavigate();

    const csrftoken = getCookie("csrftoken");
    const handleSubmit = async() => {
        try {
            const response = await fetch("http://localhost:8000/accounts/newpassword/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                },
                credentials:'include',
                body: JSON.stringify({ newPassword, newPassword2 }),
            });
            const data = await response.json()
            if(data.status === 'success') {
                navigate('/login');
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("An error occurred");
        }
    }

    return (
        <div className= "flex justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
                <div className="flex flex-col justify-center md:flex-row gap-4 mb-6">
                    <h1 className='text-center font-bold text-lg'>Change your Password</h1>
                </div>
                <hr className='pb-2'></hr>
                <h1 className='pt-3'>New Password:</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => handleNewPassword(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <h1 className='pt-3'>Re-Enter New Password:</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={newPassword2}
                        onChange={(e) => handleNewPassword2(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6 w-full justify-between pt-6">
                    <button onClick={handleSubmit} className="bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Submit</button>
                </div>
            </div>
        </div>
    );
}


export default ResetPassword;