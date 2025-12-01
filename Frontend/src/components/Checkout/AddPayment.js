'use client'
import { useState, useEffect } from "react";
import { getCSRFToken, getCookie } from "../../utils/csrf";

const AddPayment = ({onSave}) => {
    const [method, setMethod] = useState({
        card_type: 'credit',
        card_no: '',
        expiration_date: '',
        card_cvv: '',
        address_line: '',
        city: '',
        state: '',
        zipcode: '',
        id: null
    })

    const handleMethodChange = (field, value) => {
        setMethod(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        for (let key in method) {
            if (key === 'id') continue;
            if (!method[key]) {
                alert('Please fill out all fields before saving.');
                return;
            }
        }
        
        try {
            const res = await fetch("http://localhost:8000/accounts/add_payment/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ methods: [method] })
            });
            const data = await res.json();
            console.log(data)

            if (!res.ok) throw new Error(data.error || 'Error saving payment info');
            alert('Payment methods saved successfully!');
            if(onSave) onSave();

        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return(
        <div className="payments-container border max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <div>
                <div className="border py-2 rounded-lg shadow-md mb-4">
                    <div className='flex flex-row justify-between px-10'>
                    <div className='flex flex-row items-center'>
                        <h1 className="pb-2 text-center">Add New Payment Method</h1>
                        <h1 className='px-2'>-</h1>
                        <div className='inline-block text-center px-2'>
                            <input 
                                type="radio" 
                                value="credit" 
                                checked={method.card_type === 'credit'} 
                                onChange={(e) => handleMethodChange('card_type', e.target.value)}
                            />
                            <label>Credit</label>
                        </div>
                        <div className='inline-block text-center gap-2'>
                            <input 
                                type="radio" 
                                value="debit"
                                checked={method.card_type === 'debit'} 
                                onChange={(e) => handleMethodChange('card_type', e.target.value)}
                            />
                            <label>Debit</label>
                        </div>
                    </div>
                    </div>

                    <div className="flex flex-wrap pt-2 items-center justify-center md:flex-row gap-4 mb-6 pl-4 pr-20">
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={method.card_no}
                            maxLength={16}
                            onChange={(e) => handleMethodChange('card_no', e.target.value)}
                            className="text-center w-fill pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            placeholder="Expiration Date (MM/YYYY)"
                            maxLength={7}
                            value={method.expiration_date}
                            onChange={(e) => handleMethodChange('expiration_date', e.target.value)}
                            className="text-center pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            placeholder="CVV"
                            value={method.card_cvv}
                            maxLength={3}
                            onChange={(e) => handleMethodChange('card_cvv', e.target.value)}
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
                            onChange={(e) => handleMethodChange('address_line', e.target.value)}
                            className="text-center w-4/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="City"
                            value={method.city}
                            onChange={(e) => handleMethodChange('city', e.target.value)}
                            className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={method.state}
                            onChange={(e) => handleMethodChange('state', e.target.value)}
                            className="text-center w-2/5 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            placeholder="Zipcode"
                            value={method.zipcode}
                            onChange={(e) => handleMethodChange('zipcode', e.target.value)}
                            className="text-center w-1/4 pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
            
            <button onClick={handleSave} 
                className="text-white bg-blue-600 text-l px-4 border py-2 rounded-lg shadow-sm flex items-center justify-center hover:bg-blue-700">
                Save
            </button>
        </div>
    );
}

export default AddPayment;