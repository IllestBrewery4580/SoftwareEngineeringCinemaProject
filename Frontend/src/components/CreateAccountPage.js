import React, { useState, useEffect} from 'react';

export default function CreateAccountPage () {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);
  
    const handleName = (name) => setName(name);
    const handleEmail = (email) => setEmail(email);
    const handlePassword = (password) => setPassword(password);
    const handlePassword2 = (password2) => setPassword2(password2);
  
    const handleCreateAcct = () => {
    if(name == "" || name == null){
      alert('Enter name');
    }
    if(email == "" || email == null){
      alert('Enter email');
    }
    if(password == "" || password == null) {
      alert('Enter password');
    }
    if(password2 == "" || password2 == null) {
      alert('Re-enter password');
    }
    if(password != password2) {
        alert('Passwords don\'t match, re-enter password');
    }
    };
  
    return (
    <div className= "flex justify-center">
      <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <h1>Enter:</h1>
        </div>
        <div><h1>Name:</h1></div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e)=> handleName(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div><h1>Email:</h1></div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmail(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div><h1>Password:</h1></div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePassword(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div><h1>Re-enter Password:</h1></div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
              type="text"
              placeholder="Re-enter Password"
              value={password2}
              onChange={(e) => handlePassword2(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <button onClick={handleCreateAcct} className="bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:text-white transition-colors">Create Account</button>
        </div>
      </div>
    </div>
  );
}