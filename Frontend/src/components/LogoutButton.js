'use client'
import React from 'react';
import Link from 'next/link'
import { useNavigate } from "react-router-dom"; // if using react-router

function LogoutButton({ setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await fetch('/accounts/logout/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
            });

            const data = await res.json(); // capture response from Django
            console.log('Logout response:', data);

            if (res.ok) {
                alert(data.message || 'You have been logged out successfully.');
                setIsLoggedIn(false); // clear frontend state
                navigate("/login"); // redirect to login page
            } else {
                alert(data.error || 'Logout failed. Please try again.');
            }
        } catch (err) {
            console.error('Logout fetch error:', err);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" >
            Logout
        </button>
    );
}

export default LogoutButton;