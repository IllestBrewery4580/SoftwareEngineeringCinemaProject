import React, { useState, useEffect} from 'react';


export default function ForgotPasswordPage() {

    const [email, setEmail] = useState(null);
      
    const handleEmail = (email) => setEmail(email);

    var checkEmail = true; //check in database for account, change later
    const verifyEmail  = () => {
        if(checkEmail) {
            
        } else {
            alert('No account found');
        }
    }

    return (
    <div className= "flex justify-center">
        <div className="bg-white p-6 pb-2 rounded-lg shadow-md">
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <h1>Password Recovery</h1>
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
        <button onClick={verifyEmail} className="bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:text-white transition-colors">Send recovery email</button>
        </div>
        
        </div>
    </div>
    )
};