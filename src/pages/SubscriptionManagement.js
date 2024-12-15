
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [users, setUsers] = useState([]);
    const [subscriptionTypes, setSubscriptionTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newSubscription, setNewSubscription] = useState({
        user_id: '',
        subscription_type_id: '',
        start_date: '',
        end_date: '',
        status: 'Active',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subscriptionsResponse, usersResponse, typesResponse] = await Promise.all([
                    api.get('/subscriptions'),
                    api.get('/usercus'),
                    api.get('/subscription-types'),
                ]);
                setSubscriptions(subscriptionsResponse.data);
                setUsers(usersResponse.data);
                setSubscriptionTypes(typesResponse.data);
            } catch (err) {
                setError('Failed to load subscriptions, users, or subscription types');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/subscriptions/${id}`);
            setSubscriptions(subscriptions.filter((subscription) => subscription.id !== id));
        } catch (err) {
            alert('Failed to delete subscription');
        }
    };

    const handleCreate = async () => {
        try {
            const response = await api.post('/subscriptions', newSubscription);
            setSubscriptions([...subscriptions, response.data.subscription]);
            setNewSubscription({
                user_id: '',
                subscription_type_id: '',
                start_date: '',
                end_date: '',
                status: 'Active',
            });
        } catch (err) {
            alert('Failed to create subscription');
        }
    };

    if (loading) {
        return <div>Loading subscription management...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Subscription Management</h1>
            <h2>Create New Subscription</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreate();
                }}
            >
                <label>
                    User:
                    <select
                        value={newSubscription.user_id}
                        onChange={(e) => setNewSubscription({ ...newSubscription, user_id: e.target.value })}
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Subscription Type:
                    <select
                        value={newSubscription.subscription_type_id}
                        onChange={(e) =>
                            setNewSubscription({ ...newSubscription, subscription_type_id: e.target.value })
                        }
                    >
                        <option value="">Select a subscription type</option>
                        {subscriptionTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Start Date:
                    <input
                        type="date"
                        value={newSubscription.start_date}
                        onChange={(e) => setNewSubscription({ ...newSubscription, start_date: e.target.value })}
                    />
                </label>
                <br />
                <label>
                    End Date:
                    <input
                        type="date"
                        value={newSubscription.end_date}
                        onChange={(e) => setNewSubscription({ ...newSubscription, end_date: e.target.value })}
                    />
                </label>
                <br />
                <label>
                    Status:
                    <select
                        value={newSubscription.status}
                        onChange={(e) => setNewSubscription({ ...newSubscription, status: e.target.value })}
                    >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Expired">Expired</option>
                    </select>
                </label>
                <br />
                <button type="submit">Create Subscription</button>
            </form>
            <h2>Existing Subscriptions</h2>
            <ul>
                {subscriptions.map((subscription) => (
                    <li key={subscription.id}>
                        <h3>
                            User: {subscription.user_id}, Type: {subscription.subscription_type_id}, Status: {subscription.status}
                        </h3>
                        <p>
                            Start: {subscription.start_date}, End: {subscription.end_date}
                        </p>
                        <button onClick={() => handleDelete(subscription.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SubscriptionManagement;
