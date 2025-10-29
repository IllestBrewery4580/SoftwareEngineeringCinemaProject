'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/csrf';

 const Profile = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [homeAddress, setHomeAddress] = useState({
        address_line: '',
        city: '',
        state: '',
        zipcode: '',
    });
    const [promotion, setPromotion] = useState(false);
    const [methods, setMethods] = useState([]);

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

    const removeMethod = async(id) => {
        try {
            await getCSRFToken();
            const csrftoken = getCookie("csrftoken");

            const response = await fetch(`http://localhost:8000/accounts/payment/${id}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": csrftoken,
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error("Failed to delete payment method");

            // Remove from local state
            setMethods(prev => prev.filter(method => method.id !== id));

        } catch (err) {
            console.error(err);
            alert("Could not delete payment method");
        }
    
    };

    const handleMethodChange = (id, field, value) => {
        setMethods(prev =>
            prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
        );
    };

    const handleAddressChange = (field, value) => {
        setHomeAddress(prev => ({...prev, [field]: value}));
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
            console.log("Data: ", data);
            setFname(data.first_name);
            setLname(data.last_name);
            setEmail(data.email);
            setPhone(data.phone);
            setPromotion(data.enroll_for_promotions);
            
            const mappedMethods = data.account_data.map((acc, idx) => ({
                id: acc.id,
                cardType: acc.card_type,
                cardNum: acc.get_last4(),
                cardExp: acc.expiration_date,
                cardCVV: acc.get_cvv(),
                address_line: acc.address_line || '',
                city: acc.city || '',
                state: acc.state || '',
                zipcode: acc.zipcode || '',
                country: acc.country || 'USA'
            }));
            setMethods(mappedMethods);
            
            setHomeAddress({
                address_line: data.home_address?.address_line || '',
                city: data.home_address?.city || '',
                state: data.home_address?.state || '',
                zipcode: data.home_address?.zipcode || '',
            })
        })
        .catch((err) => {
            console.error("Error fetching profile:", err);
        });
    }, []);

    const getCSRFToken = async () => {
    await fetch("http://localhost:8000/accounts/csrf/", {
      method: "GET",
      credentials: "include",
    });
  };

    const handleSubmit = async() => {
        if (fname === '' || phone === '') {
            alert("Please enter all required fields indicated with an astrerisk (*).");
        } else {
            try {
                await getCSRFToken();
                const csrftoken = getCookie("csrftoken");

                const validMethods = methods.filter(method =>
            Object.values(method).some(
                value => value !== '' && value !== null && value !== undefined
            )
        );

                const response = await fetch("http://localhost:8000/accounts/updateprofile/", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify({
                        fname: fname,
                        lname: lname,
                        phone: phone,
                        enroll_for_promotions: document.getElementById('promotions').checked,
                        payment: methods,
                        homeAddress: homeAddress,
                    }),
                    credentials:'include',
                });
                const data = await response.json()
                if(response.ok) {
                    alert("Your profile has been updated!");
                } else {
                    alert(data.message)
                }
            } catch (err) {
                console.error("Profile error:", err);
                alert("An error occurred");
            }
        }
    };

    return(<>
        <div className= "flex-flow justify-center">
            <div className="bg-white p-6 pb-2 rounded-lg shadow-md w-500">
                <h1 className="pb-1 text-center font-bold text-xl">Your Profile</h1>
                <h2 className="pb-4 text-center font-bold text-xl">{email}</h2>
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
                                <input 
                                type="radio" 
                                id="credit" 
                                name="type" 
                                value="credit" 
                                checked={method.cardType === 'credit'} 
                                onChange={(e) => handleMethodChange(method.id, 'cardType', e.target.value)}/>
                                <label for="credit">Credit</label>
                            </div>
                            <div className='inline-block text-center gap-2'>
                                <input 
                                type="radio" 
                                id="debit" 
                                name="type" 
                                value="debit"
                                checked={method.cardType === 'debit'} 
                                onChange={(e) => handleMethodChange(method.id, 'cardType', e.target.value)}/>
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
                                maxLength={7}
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
                <div className="flex flex-wrap md:flex-row gap-4 mb-6 justify-between">
                    <button onClick={handleGoBack} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">← Go Back</button>
                    <button onClick={handleNewPass} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">Change your Passowrd</button>
                    <button onClick={handleSubmit} className="align-right bg-blue-700 pt-2 pb-2 pl-4 pr-4 rounded hover:bg-blue-900 text-white transition-colors">Done</button>
                </div>
            </div>
        </div>
    </>);
};

export default Profile;