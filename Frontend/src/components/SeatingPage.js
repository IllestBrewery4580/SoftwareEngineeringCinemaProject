'use client'
import { Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeatingPage = ({selectedBooking}) => {
    const navigate = useNavigate();

    
    if (!selectedBooking) return null;

    return (
        <div>
            <h1>seating page for </h1>
            <h2 className="text-2xl font-bold mb-2">{selectedBooking.movie.title}</h2>
        </div>
    );
}

export default SeatingPage;