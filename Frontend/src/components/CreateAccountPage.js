'use client'
import React, { useState, useEffect} from 'react';
import { getCookie } from '../utils/csrf';
import { useNavigate } from 'react-router-dom';

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

  const addNewMethod = () => {
        setMethods(prev => [
            ...prev,
            {
            id: prev.length + 1,
            cardNum: '',
            cardType: '',
            cardExp: '',
            address_line: '',
            city: '',
            state: '',
            zipcode: '',
            country: ''
            }
        ]);
    };

  const removeMethod = (id) => {
        if (methods.length > 0) {
            setMethods(methods.filter(method => method.id !== id));
        }
    }

  const handleMethodChange = (id, field, value) => {
        if (field === 'cardExp') {
            value = value.replace(/\D/g, '').substring(0, 6);
            if (value.length > 1) {
            value = value.substring(0, 2) + '/' + value.substring(2, 6);
            }
        }
        setMethods(prev =>
            prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
        );
    };

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
    if (fname === '' || lname === '' || phone === '' || email === '' || password === '' || password2 === '') {
      alert("Please enter all required fields indicated with an astrerisk (*).");
    } else if (password !== password2) {
      alert("Passwords do not match. Please re-enter and try again.");
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
        }),
        });
        const data = await response.json()

        if(data.status === 'success') {
          navigate('/create/verification');
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error("Creation error:", err);
        alert("An error occurred");
      }
    }
  };
  
  return (<>
    <div className= "flex-flow justify-center">
      <div className="bg-white p-6 pb-2 rounded-lg shadow-md w-500">
          <h1 className="pb-1 text-center font-bold text-xl">Create Your Account</h1>
          <hr></hr>
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
              className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <h1 className="pb-2 text-center text-lg">Payment Information</h1>
          <hr className="pb-6 "></hr>
          <div>
          {methods.length > 0 ? (
            methods.map((method) => (
            <div key={method.id} className="border py-2 rounded-lg shadow-md mb-4">
              <div className='flex flex-row justify-between px-10'>
                <div className='flex flex-row'>
                  <h1 className="pb-2 text-center">Payment Method {method.id}</h1>
                  <h1 className='px-2'>-</h1>
                  <div className='inline-block text-center px-2'>
                    <input type="radio" id="credit" name="type" value="credit"/>
                    <label for="credit">Credit</label>
                  </div>
                  <div className='inline-block text-center gap-2'>
                    <input type="radio" id="debit" name="type" value="debit"/>
                    <label for="debit">Debit</label>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeMethod(method.id)}
                  className="justify-right align-right right-2 top-2 text-gray-500 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                  </svg>
                </button>
              </div>
                <div className="flex flex-wrap pt-2 items-center justify-center md:flex-row gap-4 mb-6 pl-4 pr-20">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={method.cardNum}
                    onChange={(e) => handleMethodChange(method.id, 'cardNum', e.target.value)}
                    className="text-center w-fill pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Expiration Date (MM/YYYY)"
                    value={method.cardExp}
                    onChange={(e) => handleMethodChange(method.id, 'cardExp', e.target.value)}
                    className="text-center pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={method.cardCVV}
                    onChange={(e) => handleMethodChange(method.id, 'cardCVV', e.target.value)}
                    className="text-center pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />  
                </div>
                <hr></hr>
                <h1 className="pl-10 py-2">Billing Address</h1>
                <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Address Line"
                    value={method.address_line}
                    onChange={(e) => handleMethodChange(method.id, 'address_line', e.target.value)}
                    className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="City"
                    value={method.city}
                    onChange={(e) => handleMethodChange(method.id, 'city', e.target.value)}
                    className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={method.state}
                    onChange={(e) => handleMethodChange(method.id, 'state', e.target.value)}
                    className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Zipcode"
                    value={method.zipcode}
                    onChange={(e) => handleMethodChange(method.id, 'zipcode', e.target.value)}
                    className="text-center w-1/4 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className='text-center border py-2 rounded-lg shadow-md'>
              <h1>No payment methods stored. Add one below!</h1>
            </div>
          )}
          </div>
          <div className="justify-center flex py-2">
            <button
              type="button"
              onClick={() => addNewMethod()}
              disabled={methods.length >= 3}
              className=" text-l w-full px-4 border py-2 rounded-lg shadow-sm flex items-center justify-center hover:bg-[#bbbbbb]">
              Add Method
            </button>
          </div>
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