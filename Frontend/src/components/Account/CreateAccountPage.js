'use client'
import React, { useState, useEffect} from 'react';
import { getCookie } from '../../utils/csrf';
import { useNavigate } from 'react-router-dom';
import Payments from './Payments';

export default function CreateAccountPage () {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [phone, setPhone] = useState('');
  const [methods, setMethods] = useState([]);
  const [homeAddress, setHomeAddress] = useState({
          address_line: '',
          city: '',
          state: '',
          zipcode: '',
      });
  const [promotion, setPromotion] = useState(false);
  const [save, setSave] = useState(false);
  const [message, setMessage] = useState('');

  const handleFname = (fname) => setFname(fname);
  const handleLname = (lname) => setLname(lname);
  const handleEmail = (email) => setEmail(email);
  const handlePassword = (password) => setPassword(password);
  const handlePassword2 = (password2) => setPassword2(password2);
  const handlePhone = (phone) => setPhone(phone);
  const handlePromotion = () => {
      setPromotion(!promotion);
  }
  const navigate = useNavigate();

  const handleAddressChange = (field, value) => {
      setHomeAddress(prev => ({...prev, [field]: value}));
  }
  
  const getCSRFToken = async () => {
    await fetch("http://localhost:8000/accounts/csrf/", {
      method: "GET",
      credentials: "include",
    });
  };

  const handleCreateAcct = async() => {
    const cleaned = methods.map(m => ({
      ...m,
      id: m.new ? null : m.id
    }));

    if (fname === '' || lname === '' || phone === '' || email === '' || password === '' || password2 === '') {
      setMessage("Please enter all required fields indicated with an astrerisk (*).");
    } else if (password !== password2) {
      setMessage("Passwords do not match. Please re-enter and try again.");
    } else {
      try {
        await getCSRFToken()
        const csrftoken = getCookie("csrftoken");

        const response = await fetch("http://localhost:8000/accounts/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          credentials:'include',
          body: JSON.stringify({
            fname: fname,
            lname: lname,
            phone: phone,
            email: email,
            password: password,
            enroll_for_promotions: document.getElementById('promotions').checked,
            homeAddress: homeAddress,
            methods: cleaned
        }),
        });
        const data = await response.json()

        if(data.status === 'success') {
          setSave(true);
        } else {
          setMessage(data.message);
        }
      } catch (err) {
        console.error("Creation error:", err);
        setMessage("An error occurred");
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (<>
    <div className= "flex-flow justify-center">
      <div className="bg-white p-6 pb-2 rounded-lg shadow-md w-500">
          <h1 className="pb-1 text-center font-bold text-xl">Create Your Account</h1>
          <hr></hr>
          {message && <p className="mt-4 text-center text-red-600">{message}</p>}
          <div className='flex flex-row justify-center pt-4 gap-4'>
            <div className='flex flex-col w-2/5'>
              <h1 className="text-left text-lg">First Name *</h1>
              <input
                type="text"
                placeholder="First Name"
                value={fname}
                onChange={(e)=> handleFname(e.target.value)}
                required={true}
                className="text-center pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className='flex flex-col mb-4 w-2/5'>
              <h1 className="text-left text-lg">Last Name *</h1>                            
              <input
                type="text"
                placeholder="Last Name"
                value={lname}
                onChange={(e)=> handleLname(e.target.value)}
                required={true}
                className="text-center pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <h1 className="text-center text-lg">Email *</h1>
          <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=> handleEmail(e.target.value)}
              required={true}
              className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <h1 className="text-center text-lg">Password *</h1>
          <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=> handlePassword(e.target.value)}
              required={true}
              className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <h1 className="text-center text-lg">Re-enter Password *</h1>
          <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
            <input
              type="password"
              placeholder="Re-enter Password"
              value={password2}
              onChange={(e)=> handlePassword2(e.target.value)}
              required={true}
              className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <h1 className="text-center text-lg">Phone Number *</h1>
          <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={(e)=> handlePhone(e.target.value)}
              required={true}
              maxLength={10}
              className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <h1 className="pb-2 text-center text-lg">Payment Information</h1>
          <hr className="pb-6 "></hr>
          <Payments 
            paymentInfo={methods} 
            save={save} 
            setMethods={setMethods} 
            mode="register" 
            onSaved={() => {navigate('/create/verification');
          }}/>
          <hr className='mt-4 mb-1'></hr>
          <h1 className="text-center text-lg pt-2">Address</h1>
          <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Address Line"
              value={homeAddress.address_line}
              onChange={(e) => handleAddressChange('address_line', e.target.value)}
              className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="City"
              value={homeAddress.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="State"
              value={homeAddress.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Zipcode"
              value={homeAddress.zipcode}
              onChange={(e) => handleAddressChange('zipcode', e.target.value)}
              className="text-center w-1/4 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className='flex flex-row justify-end items-right pb-4 text-lg'>
            <label className='flex justify-right text-right gap-2'>
              <input id="promotions" style={{transform:"scale(1.1"}} type='checkbox' checked={promotion} onChange={handlePromotion}/>
              Recieve Promotions
            </label>
          </div>
          <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-center">
            <button onClick={handleCreateAcct} className="w-full bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Create Account</button>
          </div>
        </div>
    </div>
  </>);
}