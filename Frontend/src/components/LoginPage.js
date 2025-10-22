import React, { useState, useEffect} from 'react';
import CreateAccountPage from './CreateAccountPage.js';
import App from '../App.js';

export default function LoginPage () {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleEmail = (email) => setEmail(email);
  const handlePassword = (password) => setPassword(password);

  const handleLogin = () => {
    if(email == "" || email == null){
      alert('Enter email');
    }
    if(password == "" || password == null) {
      alert('Enter password');
    }
    if (email != null && password != null && email != "" && password != "") {
      alert('yay logged in!');
    }
};
  
  return (
    <div className= "flex justify-center">
      <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <h1>Enter:</h1>
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
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePassword(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <button onClick={handleLogin} className="bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:text-white transition-colors">Login</button>
        </div>
      </div>
    </div>
  );
}



