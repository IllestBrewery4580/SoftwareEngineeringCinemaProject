import { useState } from "react";

export default function PromotionCreationPage() {
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discount_percent: "",
        start_date: "",
        end_date: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/promotions/create/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.redirected) {
            setMessage("Promotion created and emails snet!");
            return;
        }

        const data = await res.json();
        setMessage(data?.message || "Error creating promotion.");
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Create Promotion</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="code" placeholder="Promo Code" className="border p-2 w-full" onChange={handleChange} />
                <textarea name="description" placeholder="Description" className="border p-2 w-full" onChange={handleChange} />
                <input type="number" name="discount_percent" placeholder="Discount %" className="border p-2 w-full" onChange={handleChange} />
                <input type="date" name="start_date" className="botder p-2 w-full" onChange={handleChange}></input>
                <input type="date" name="end_date" className="border p-2 w-full" onChange={handleChange} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
                    Create Promotion
                </button> 
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    )
}
