import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {getCookie} from '../../utils/csrf'

const LoginPage = ( {onAdminSuccess} ) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remeber, setRemeber] = useState(false);
  const handleEmail = (email) => setEmail(email);
  const handlePassword = (password) => setPassword(password);
  const handleRemember = () => {
    setRemeber(!remeber);
  }

  const navigate = useNavigate();
  const handleForgotPass = () => {
    navigate("/login/forgotpassword")
  }
  const handleGoBack = () => {
    navigate("/login")
  }

  const getCSRFToken = async () => {
    await fetch("http://localhost:8000/accounts/csrf/", {
      method: "GET",
      credentials: "include",
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both fields");
      return;
    }
        
    try {
      await getCSRFToken();
      const csrftoken = getCookie("csrftoken");

      const response = await fetch("http://localhost:8000/accounts/adminlogin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials:'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json()

      if (data.status === 'success') {
        onAdminSuccess();
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (err) {
        console.error("Login error:", err);
        alert("An error occured.");
    }
  };
  
  return (
    <div className= "flex flex-col justify-center">
      <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
        <div className="flex flex-col justify-center md:flex-row gap-4 mb-6">
        <h1 className='text-center font-bold text-lg'>Admin Login</h1>
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
        <div className="flex flex-col md:flex-row gap-4">
          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePassword(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div className="flex justify-end pb-3 pt-1">
            <button onClick={handleForgotPass} className='hover:text-blue-700 transition-colors text-[#808080] text-sm'>Forgot Password</button>
        </div>
        <div className='flex flex-row justify-start pb-4 text'>
          <label className='flex text-right gap-2'>
              <input type='checkbox' checked={remeber} onChange={handleRemember}/>
              Remember Me
          </label>
        </div>
        <div className="flex flex-col gap-4 mb-6 w-full justify-center">
            <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
            <button onClick={handleLogin} className="bg-blue-700 w-full pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Login</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;