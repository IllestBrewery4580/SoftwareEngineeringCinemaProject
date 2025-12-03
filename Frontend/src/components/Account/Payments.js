'use client'
import { useState, useEffect } from "react";
import { getCSRFToken, getCookie } from "../../utils/csrf";
import Popup from "./Popup";

const Payments = ({paymentInfo, save, setMethods, onSaved, mode="profile"}) => {
    const [message, setMessage] = useState('');
    const [popup, setPopup] = useState(false);
    const methods = paymentInfo

    const handlePopup = () => {
        setPopup(!popup);
    }

    const handleMethodChange = (id, field, value) => {
        setMethods(prev =>
            prev.map(m => m.id === id ? { ...m, [field]: value } : m)
        );
    };

    const removeMethod = async (id) => {
        try {
            const csrftoken = getCookie('csrftoken');

            const response = await fetch(`http://localhost:8000/accounts/payment/${id}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": csrftoken,
                },
                credentials: 'include',
            });

            if (!response.ok) setMessage("Failed to delete payment method");

            // Remove from local state
            setMethods(prev => prev.filter(method => method.id !== id));

        } catch (err) {
            console.error(err);
            setMessage("Could not delete payment method");
        }
    };

    const addMethod = () => {
        const newId = methods.length ? Math.max(...methods.map(m => m.id)) + 1 : 1;
        setMethods([...methods, {
            id: newId,
            card_type: 'credit',
            card_no: '',
            expiration_date: '',
            card_cvv: '',
            address_line: '',
            city: '',
            state: '',
            zipcode: '',
            new: true
        }]);
    };

    const handleSaveAll = async () => {
        for (let method of methods) {
            if (method.card_no === '' || !method.expiration_date || method.card_cvv === '' ||
                !method.address_line || !method.city || !method.state || !method.zipcode) {
                setMessage('Please fill out all fields for each payment method before saving.');
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            if (method.new === true) {
                method.id = null;
            }
        }

        if (mode === "register") {
            if (onSaved) {onSaved(methods)}
            return;
        }
        
        try {
            const res = await fetch("http://localhost:8000/accounts/add_payment/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                 },
                credentials: "include",
                body: JSON.stringify({ methods })
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage('Error saving payment info: ' + data.error);
                return;
            }

            if(onSaved) onSaved();
            if (save === false) {
                handlePopup();
                setMessage('Payment methods saved successfully!')
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        if (save === true) {
            handleSaveAll();
        }
    }, [save]);

    return(
        <div className="payments-container border max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <div>
                {message && <p className="mb-3 text-center text-red-600">{message}</p>}
                {popup && <Popup closePopup={handlePopup}>Payment methods saved successfully!</Popup>}
                {methods.length > 0 ? (
                    methods.map((method, index) => (
                    <div key={method.id} className="border py-2 rounded-lg shadow-md mb-4">
                        <div className='flex flex-row justify-between px-10'>
                        <div className='flex flex-row items-center'>
                            <h1 className="pb-2 text-center">Payment Method {index + 1}</h1>
                            <h1 className='px-2'>-</h1>
                            <div className='inline-block text-center px-2'>
                                <input 
                                    type="radio" 
                                    id={`credit-${method.id}`} 
                                    name={`type-${method.id}`} 
                                    value="credit" 
                                    checked={method.card_type === 'credit'} 
                                    onChange={(e) => handleMethodChange(method.id, 'card_type', e.target.value)}
                                />
                                <label htmlFor={`credit-${method.id}`}>Credit</label>
                            </div>
                            <div className='inline-block text-center gap-2'>
                                <input 
                                    type="radio" 
                                    id={`debit-${method.id}`} 
                                    name={`type-${method.id}`} 
                                    value="debit"
                                    checked={method.card_type === 'debit'} 
                                    onChange={(e) => handleMethodChange(method.id, 'card_type', e.target.value)}
                                />
                                <label htmlFor={`debit-${method.id}`}>Debit</label>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => removeMethod(method.id)}
                            className="text-gray-500 hover:text-red-500"
                        >
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
                                value={method.card_no}
                                maxLength={16}
                                onChange={(e) => handleMethodChange(method.id, 'card_no', e.target.value)}
                                className="text-center w-fill pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Expiration Date (MM/YYYY)"
                                maxLength={7}
                                value={method.expiration_date}
                                onChange={(e) => handleMethodChange(method.id, 'expiration_date', e.target.value)}
                                className="text-center pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                value={method.card_cvv}
                                maxLength={3}
                                onChange={(e) => handleMethodChange(method.id, 'card_cvv', e.target.value)}
                                className="text-center pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <hr />
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
            <div className="flex justify-between mt-4 gap-4">
                <button
                type="button"
                onClick={() => addMethod()}
                disabled={methods.length >= 3}
                className="bg-gray-300 text-l px-4 border p-2 rounded-lg shadow-sm flex items-center justify-center hover:bg-[#bbbbbb]">
                Add Method
                </button>
                {methods.length > 0 && (
                    <button onClick={handleSaveAll} className="text-white bg-blue-600 text-l px-4 border py-2 rounded-lg shadow-sm flex items-center justify-center hover:bg-blue-700">
                        Save Methods
                    </button>
                )}
            </div>
        </div>
    );
}

export default Payments;