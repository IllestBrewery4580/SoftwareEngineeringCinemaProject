'use client'
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

 const Profile = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [cardNum, setCardNum] = useState('');
    const [cardExp, setCardExp] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [promotion, setPromotion] = useState(false);

    const handleFname = (fname) => setFname(fname);
    const handleLname = (lname) => setLname(lname);
    const handlePhone = (phone) => setPhone(phone);
    const handleCardNum = (cardNum) => setCardNum(cardNum);
    const handleCardExp = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '').substring(0, 6);

        if (value.length > 1) {
            value = value.substring(0, 2) + '/' + value.substring(2, 6);
        }

        setCardExp(value);
    };
    const handleCardCVV = (cardCVV) => setCardCVV(cardCVV);
    const handleAddress = (address) => setAddress(address);
    const handleCity = (city) => setCity(city);
    const handleState = (state) => setState(state);
    const handleZipcode = (zipcode) => setZipcode(zipcode);
    const handlePromotion = () => {
        setPromotion(!promotion);
    }
    const [methods, setMethods] = useState([]);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/');
    }

    const handleNewPass = () => {
        navigate('/profile/newpassword');
    }

    const addNewMethod = () => {
        if (methods.length < 3) {
            setMethods([...methods, {
                cardNum:'', 
                cardExp: '', 
                cardCVV: ''
            }]);
        }
    }

    const removeMethod = (id) => {
        if (methods.length > 1) {
            setMethods(methods.filter(method => method.id !== id));
        } else if (methods.length === 1) {
            setMethods([{
                cardNum:'',
                cardExp:'',
                cardCVV:''
            }]);
        }
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
            console.log("Data: ", data);
            setEmail(data.email)
        })
        .catch((err) => {
            console.error("Error fetching profile:", err);
        });
    }, []);

    const handleSubmit = async() => {
        const getMonth = cardExp.substring(0,2);
        const month = parseInt(getMonth);
        const getYear = cardExp.substring(3,7);
        const year = parseInt(getYear);

        if (fname === '' || phone === '') {
            alert("Please enter all required fields indicated with an astrerisk (*).");
        } else if (month < 1 || month > 12 || year < 2025 || year > 2035) {
            alert("Invalid expiration date. Please try again.")
        } else {
            const formData = new URLSearchParams();
            formData.append("username", fname);
            formData.append("email", email);

            try {
                const response = await fetch("http://localhost:8000/accounts/profile/", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData.toString(),
                    credentials:'include',
                });

                if(response.ok) {
                    alert("Your profile has been updated!");
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
                    methods.map((method, id) => (
                    <div className="border py-2 rounded-lg shadow-md mb-4">
                        <div className='flex flex-row justify-between px-10'>
                        <div className='flex flex-row'>
                            <h1 className="pb-2 text-center">Payment Method {id + 1}</h1>
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
                            onClick={() => removeMethod(id)}
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
                                value={cardNum}
                                onChange={(e) => handleCardNum(e.target.value)}
                                className="text-center w-fill pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Expiration Date (MM/YYYY)"
                                maxLength={7}
                                value={cardExp}
                                onChange={(e) => handleCardExp(e.target.value)}
                                className="text-center pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                value={cardCVV}
                                onChange={(e) => handleCardCVV(e.target.value)}
                                className="text-center pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            
                        </div>
                        <hr></hr>
                        <h1 className="pl-10 py-2">Billing Address</h1>
                        <div className="flex flex-col items-center justify-center md:flex-row gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Address Line"
                                value={address}
                                onChange={(e) => handleAddress(e.target.value)}
                                className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:flex-row gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => handleCity(e.target.value)}
                                className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => handleState(e.target.value)}
                                className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Zipcode"
                                value={zipcode}
                                onChange={(e) => handleZipcode(e.target.value)}
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
                        value={address}
                        onChange={(e) => handleAddress(e.target.value)}
                        className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex flex-wrap items-center justify-center md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => handleCity(e.target.value)}
                        className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => handleState(e.target.value)}
                        className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Zipcode"
                        value={zipcode}
                        onChange={(e) => handleZipcode(e.target.value)}
                        className="text-center w-1/4 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className='flex flex-row justify-end items-right pb-4 text-lg'>
                    <label className='flex justify-right text-right gap-2'>
                        <input style={{transform:"scale(1.1"}} type='checkbox' checked={promotion} onChange={handlePromotion}/>
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