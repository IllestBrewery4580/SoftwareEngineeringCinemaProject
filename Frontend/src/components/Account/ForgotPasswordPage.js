<<<<<<< HEAD:Frontend/src/components/ForgotPasswordPage.js
'use client'
import React, { useState, useEffect} from 'react';
import {getCookie} from '../utils/csrf'
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState(null);
    const handleEmail = (email) => setEmail(email);
    const navigate = useNavigate();
    
    const getCSRFToken = async () => {
    await fetch("/accounts/csrf/", {
      method: "GET",
      credentials: "include",
    });
    };

    const handleSend  = async() => {
        try {
            await getCSRFToken();
            const csrftoken = getCookie("csrftoken");

            const response = await fetch("/accounts/forgotpassword/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                },
                credentials:'include',
                body: JSON.stringify({ email }),
            });
            const data = await response.json()
            if(data.status === 'success'){
                navigate('/login/forgotpassword/verify');
            }
        } catch (err) {
            console.error("Error with password recovery:", err);
            alert("An error occurred");
        }
    }

    return (
        <div className= "flex justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <h1 className='font-bold text-center text-lg'>Password Recovery</h1>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <h3>Enter email:</h3>
                </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => handleEmail(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>     
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
                <button onClick={handleSend} className="bg-blue-700 w-full pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Send recovery email</button>
            </div>
            
            </div>
        </div>
    )
=======
'use client'
import React, { useState, useEffect} from 'react';
import {getCookie} from '../../utils/csrf'
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState(null);
    const handleEmail = (email) => setEmail(email);
    const navigate = useNavigate();
    
    const getCSRFToken = async () => {
    await fetch("http://localhost:8000/accounts/csrf/", {
      method: "GET",
      credentials: "include",
    });
    };

    const handleSend  = async() => {
        try {
            await getCSRFToken();
            const csrftoken = getCookie("csrftoken");

            const response = await fetch("http://localhost:8000/accounts/forgotpassword/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                },
                credentials:'include',
                body: JSON.stringify({ email }),
            });
            const data = await response.json()
            if(data.status === 'success'){
                navigate('/login/forgotpassword/verify');
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Error with password recovery:", err);
            alert("An error occurred");
        }
    }

    return (
        <div className= "flex justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <h1 className='font-bold text-center text-lg'>Password Recovery</h1>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <h3>Enter email:</h3>
                </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => handleEmail(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>     
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
                <button onClick={handleSend} className="bg-blue-700 w-full pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Send recovery email</button>
            </div>
            
            </div>
        </div>
    )
>>>>>>> dbandfrontend:Frontend/src/components/Account/ForgotPasswordPage.js
};