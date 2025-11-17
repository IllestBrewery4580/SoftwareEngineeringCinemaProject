import React from "react";
import PromotionForm from "../promotions/PromotionForm";
import PromoCodeBox from "../../components/PromoCodeBox";

export default function ManagePromotions() {
    return (
        <div className="space-y-8">
            <PromotionForm />
            <PromoCodeBox onApply={(discount_percent) => console.log("Applied:", discount_percent)} />
        </div>
    );
}      
