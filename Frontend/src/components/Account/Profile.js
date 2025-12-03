'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/csrf';
import Payments from './Payments'
import Popup from './Popup';

 const Profile = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [promotion, setPromotion] = useState(false);
    const [methods, setMethods] = useState([]);
    const [homeAddress, setHomeAddress] = useState([]);
    const [save, setSave] = useState(false);
    const [message, setMessage] = useState('');
    const [popup, setPopup] = useState(false);

    const handleFname = (fname) => setFname(fname);
    const handleLname = (lname) => setLname(lname);
    const handlePhone = (phone) => setPhone(phone);
    const handlePromotion = () => {
        setPromotion(!promotion);
    }

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/');
    }

    const handleNewPass = () => {
        navigate('/profile/newpassword');
    }

    const handleAddressChange = (field, value) => {
        setHomeAddress(prev => ({...prev, [field]: value}));
    }

    const handleGoOrderHistory = () => {
        navigate('/profile/orderhistory');
    }

    const handlePopup = () => {
        setPopup(!popup);
    }

    useEffect(() => {
        fetch('http://localhost:8000/accounts/profile/', {
        method: 'GET',
        credentials: 'include',
        })
        .then((res) => {
            if (!res.ok) {
                navigate('/login')
                throw new Error("Not authenticated or failed to fetch profile");
            }
            return res.json();
        })
        .then((data) => {
            setFname(data.first_name);
            setLname(data.last_name);
            setEmail(data.email);
            setPhone(data.phone);
            setPromotion(data.enroll_for_promotions);
            setMethods(data.account_data);
            setHomeAddress(data.home_address)
        })
        .catch((err) => {
            console.error("Error fetching profile:", err);
        });
    }, []);


    const handleSubmit = async() => {
        if (fname === '' || lname === '' || phone === '') {
            setMessage("Please enter all required fields indicated with an astrerisk (*).");
        } else {
            try {
                const response = await fetch("http://localhost:8000/accounts/updateprofile/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken"),
                    },
                    body: JSON.stringify({
                        fname: fname,
                        lname: lname,
                        phone: phone,
                        enroll_for_promotions: document.getElementById('promotions').checked,
                        homeAddress: homeAddress,
                    }),
                    credentials:'include',
                });

                const data = await response.json()
                if(response.ok) {
                    setSave(true);
                    <Payments paymentInfo={methods} save={save} setMethods={setMethods} mode="profile"/>
                    handlePopup()
                    setMessage('')
                } else {
                    setMessage(data.message)
                }
            } catch (err) {
                console.error("Profile error:", err);
                alert("An error occurred");
            }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return(<>
        <div className= "flex justify-center items-center min-h-screen">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md max-w-4xl w-full">
                <h1 className="pb-1 text-center font-bold text-xl">Your Profile</h1>
                <h2 className="pb-4 text-center font-bold text-xl">{email}</h2>
                <hr></hr>
                {message && <p className="mt-4 text-center text-red-600">{message}</p>}
                {popup && <Popup closePopup={handlePopup}>Your profile has been updated!</Popup>}
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
                <Payments paymentInfo={methods} save={save} setMethods={setMethods} mode="profile"/>
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
                        Receive Promotions
                    </label>
                </div>
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                    <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                    <button onClick={handleNewPass} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">Change your Passowrd</button>
                    <button onClick={handleGoOrderHistory} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">View Order History</button>
                    <button onClick={handleSubmit} className="align-right bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Done</button>
                </div>
            </div>
        </div>
    </>);
};

export default Profile;