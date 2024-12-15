import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId, purchaseType } = location.state || {};
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        setTimeout(() => {
            // Симулируем успешную оплату
            alert(`Payment successful for ${purchaseType === 'course' ? 'course' : 'subscription'}`);
            navigate(`/courses/${courseId}`, { state: { purchased: true } });
        }, 2000);
    };

    return (
        <div>
            <h1>Payment Page</h1>
            <p>You are purchasing a {purchaseType === 'course' ? 'Course' : 'Subscription'}.</p>
            <button onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Payment'}
            </button>
        </div>
    );
}

export default Payment;