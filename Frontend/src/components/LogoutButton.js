import React from 'react';
import { useNavigate } from "react-router-dom"; // if using react-router

function LogoutButton({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:8000/accounts/logout/', {
                method: 'GET',
                credetials: 'include',
            });

            if (res.ok) {
                alert('You have been logged out successfully.');
                setUser(null); // clear frontend state
                navigate("/login"); // redirect to login page
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <button onClick={handleLogout} class Name="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" >
            Logout
        </button>
    );
}

export default LogoutButton;