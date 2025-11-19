import { useState } from "react";

export default function PromoCodeBox( {onAction} ) {
    const [code, setCode] = useState("");
    const [result, setResult] = useState([]);
    const [applied, setApplied] = useState(false);

    const validatePromo = async () => {
        try{
            const res = await fetch(`http://localhost:8000/promotions/validate/${code}`);
            const data = await res.json();
            setResult(data);
            setApplied(true);
        } catch (error) {
            console.error("Error validating promo code:", error);
        }
    };

    if (result.status === "success") {
        onAction(result.promotions[0].discount_percent);
    } else {
        onAction(0);
    }

    return (
        <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-start">Promo Code:</h3>
            <div className="flex items-center gap-2">
                <input 
                    className="pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Enter code" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} />
                <button className="bg-blue-500 p-3 rounded-xl transition-colors hover:text-white" onClick={validatePromo}>
                    Apply
                </button>
            </div>
            
            {result && applied && (
                <p className="mt-2 text-sm">
                    {result.status === 'success' ? `Valid! Discount: ${result.promotions[0].discount_percent}%` : `Invalid: ${result.message}`}
                </p>
            )}
        </div>
    )
}