import { useState } from "react";

export default function PromoCodeBox({ onApply }) {
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);

    const validatePromo = async () => {
        const res = await fetch(`http://localhost:8000/promotions/validate/?code=${code}`);
        const data = await res.json();
        setResult(data);

        if (data.valid) {
            onApply(data.discount);
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Enter Promo Code</h3>

            <div className="flex space-x-2">
                <input className="border p-2 flex-1" placeholder="Enter code" value={code} onChange={(e) => setCode(e.target.value)} />
                <button className="bg-blue-500 text-white px-3 py-2 rounded" onClick={validatePromo}>
                    Apply
                </button>
            </div>

            {result && (
                <p className="mt-2 text-sm">
                    {result.valid ? `Valid! Discount: ${result.discount}%` : `Invalid: ${result.error}`}
                </p>
            )}
        </div>
    )
}