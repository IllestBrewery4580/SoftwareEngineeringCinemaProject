'use client'
import { useState, useEffect } from "react";

const Payments = () => {
    const [paymentInfo, setPaymentInfo] = useState({ addresses: [], payment_info: [] });
    const [selectedAddress, setSelectedAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [message, setMessage] = useState('');

    // Fetch user addresses for billing
    useEffect(() => {
        fetch("http://localhost:8000/api/profile/", { credentials: "include" }) // Assuming addresses are also returned
        .then(res => res.json())
        .then(data => {
            setProfile(data);
            if (DataTransfer.payment_info.length > 0) {
                const pay = data.payment_info[0];
                setCardNumber(pay.card_number);
                setExpiryDate(pay.expiry_date);
                setCvv(pay.cvv);
                setSelectedAddress(pay.billing_address.id || ''); // ensure id
            }
        })
        .catch(err => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAddress | !cardNumber || !expiryDate || !cvv) {
            setMessage('All fields are required.');
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/add_payment/", {
                method: "POST",
                header: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    address_id: selectedAddress,
                    card_number: cardNumber,
                    expiry_date: expiryDate,
                    cvv
                })
            });

            const data = await res.json();
            if (res.ok) setMessage(data.messsage);
            else setMessage(data.error || 'Error saving payment info.');
        } catch (err) {
            setMessage('Network error: ' + err.message);
        }
    }

    return(
        <div className="payents-container max-w-md mx-auto p-6 bg-white shaodw-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Payment Info</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    Billing Address
                    <select className="w-full border p-2 rounded" value={selectedAddress} onChange={e => { setSelectedAddress(e.target.value); setMessage('') }}>
                        <option value="">Select Address</option>
                        {profile.addressees.map(addr => (
                            <option key={addr.id} value={addr.id}>
                                {addr.street}, {addr.city}, {addr.state}
                            </option>
                        ))}
                    </select>
                </label>

                <input type="text" placeholder="Card Number" value={cardNumber} onChange={e => { setCardNumber(e.target.value); setMessage(''); }} className="w-full border p-2 rounded"/>
                <input type="text" placeholder="Expiry Date (MM/YY)" value={expiryDate} onChange={e => { setExpiryDate(e.target.value); setMessage(''); }} className="w-full border p-2 rounded" /> 
                <input type="text" placeholder="CVV" value={cvv} onChange={e => { setCvv(e.target.value); setMessage(''); }} className="w-full border p-2 rounded" />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover: bg-blue-700">
                    Save Payment Info
                </button>
            </form>

            {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
        </div>
    );
}

export default Payments;
