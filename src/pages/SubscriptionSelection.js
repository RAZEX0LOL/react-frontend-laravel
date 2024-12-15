import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/SubscriptionSelection.css';

function SubscriptionSelection() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await api.get('/subscription-types');
                setSubscriptions(response.data);
            } catch (err) {
                setError('Не удалось загрузить подписки.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    const handleSelectSubscription = (subscription) => {
        navigate('/subscriptions/form', { state: { subscription } });
    };

    if (loading) return <div className="subscription-container">Загрузка...</div>;
    if (error) return <div className="subscription-container">Ошибка: {error}</div>;

    return (
        <div className="subscription-container">
            <h1>Выберите подписку</h1>
            <ul>
                {subscriptions.map((subscription) => (
                    <li key={subscription.id}>
                        <p>{subscription.name}</p>
                        <button onClick={() => handleSelectSubscription(subscription)}>
                            Выбрать
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SubscriptionSelection;