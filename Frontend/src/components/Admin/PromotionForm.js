import React, { useState } from "react";
import { getCookie } from "../../utils/csrf";

export default function PromotionForm() {
    const [formData, setFormData] = useState({
        promo_code: "",
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
            !formData.promo_code ||
            isNaN(discount) ||
            discount < 0 ||
            discount > 100 ||
            new Date(formData.start_date) > new Date(formData.end_date)
        ) {
            setMessage("Please check your inputs. Discount must be 0-100 and dates must be valid.");
        }

        try {
            const res = await fetch("http://localhost:8000/promotions/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': getCookie('csrftoken')
                },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    discount_percent: discount,  // Ensure it's a number
                }),
            });

            if (res.redirected) {
                setMessage("Promotion created and emails sent!");
                setFormData({
                    promo_code: "",
                    description: "",
                    discount_percent: "",
                    start_date: "",
                    end_date: "",
                });
                return;
            }
        } catch (error) {
            console.error("Error creating promotion:", error);
            setMessage("An error occurred while creating the promotion.");
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 pb-2 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Create Promotion</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-4">
                <input name="promo_code" placeholder="Promo Code" className="border p-2 w-full" value={formData.promo_code} onChange={handleChange} />
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
