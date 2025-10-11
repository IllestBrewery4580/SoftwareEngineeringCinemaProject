import React, { useState, useEffect} from 'react';

export default function CreateAccountPage () {
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
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div><h1>Email:</h1></div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
              type="text"
              placeholder="Email"
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div><h1>Password:</h1></div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
              type="text"
              placeholder="Password"
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div><h1>Re-enter Password:</h1></div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
              type="text"
              placeholder="Re-enter Password"
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <button className="bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:text-white transition-colors">Create Account</button>
        </div>
      </div>
    </div>
  );
}