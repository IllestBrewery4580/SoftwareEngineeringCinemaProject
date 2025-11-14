'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/csrf';

 const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8000/accounts/getUsers", {
          method: 'GET',
          credentials:'include',
        })
          .then((res) => res.json())
          .then((data) => {
            setUsers(data);
            setLoading(false);
            console.log(data)
          })
          .catch((err) => {
            console.error("Error fetching users:", err);
            setLoading(false);
          });
    }, []);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/manage")
    }

    if(loading) {
        return <p className='text-center'>Loading...</p>
    }

    return(<>
        <div className= "flex flex-col justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
                <h1 className="pb-3 text-center font-bold text-xl">Manage Users</h1>
                <hr className='pb-6'></hr>
                {users.map((user, index) => (
                    <div className="border py-2 rounded-lg shadow-md mb-4 p-4">
                        <div key={index} className="mb-2 text-center">
                            <h2 className='text-xl font-semibold'>{user.first_name} {user.last_name}</h2>
                            <p className='pb-4'>{user.email}</p>
                            <hr className='pb-4'/>
                            <p>{user.user_type__name}, {user.is_active ? "Active" : "Inactive"}</p>
                        </div>
                    </div>
                ))}
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                    <button onClick={handleGoBack} className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                </div>
            </div>
        </div>
    </>);
};

export default ManageUsers;