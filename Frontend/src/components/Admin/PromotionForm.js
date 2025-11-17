import React, { useState } from "react";

export default function PromotionForm() {
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

        // Basic frontend validation
        const discount = parseFloat(formData.discount_percent);
        if (
            !formData.code ||
            isNaN(discount) ||
            discount_percent < 0 ||
            discount_percent > 100 ||
            new Date(formData.start_date) > new Date(formData.end_date)
        ) {
            setMessage("Please check your inputs. Discount must be 0-100 and dates must be valid.");
        }

        const res = await fetch("/promotions/create/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                discount_percent: discount,  // Ensure it's a number
            }),
        });

        if (res.redirected) {
            setMessage("Promotion created and emails sent!");
            setFormData({
                code: "",
                description: "",
                discount_percent: "",
                start_date: "",
                end_date: "",
            });
            return;
        }

        const data = await res.json();
        setMessage(data?.message || "Error creating promotion."); 
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Create Promotion</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="code" placeholder="Promo Code" className="borer p-2 w-full" value={formData.code} onChange={handleChange} />
                <textarea name="description" placeholder="Description" className="border p-2 w-full" value={formData.description} onChange={handleChange} />
                <input type="number" name="discount_percent" placeholder="Discout %" className="border p-2 w-full" value={formData.discount_percent} onChange={handleChange} />
                <input type="date" name="start_date" className="border p-2 w-full" value={formData.start_date} onChange={handleChange} />
                <input type="date" name="end_date" className="border p-2 w-full" value={formData.end_date} onChange={handleChange} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
                    Create Promotion
                </button>
            </form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
}
