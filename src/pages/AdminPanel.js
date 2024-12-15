import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import '../styles/AdminPanel.css';

function AdminPanel() {
    const [data, setData] = useState({
        users: [],
        courses: [],
        articles: [],
        subscriptions: [],
        subscriptionTypes: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setModalOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);
    const [editData, setEditData] = useState({});
    const [isAdding, setIsAdding] = useState(false);

    const templates = {
        users: { name: '', email: '' , password: '', is_active: true},
        courses: { title: '', description: '', price: 0, is_active: true, is_subscription_based: true },
        articles: {course_id: '',  title: '', content: '' },
        subscriptions: { user_id: '', subscription_type_id: '', start_date: '', end_date: '' },
        subscriptionTypes: { name: '', description: '', price: 0, is_active: false },
    };

    const endpoints = {
        users: '/usercus',
        courses: '/courses',
        articles: '/articles',
        subscriptions: '/subscriptions',
        subscriptionTypes: '/subscription-types',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all(
                    Object.entries(endpoints).map(([key, endpoint]) =>
                        api.get(endpoint)
                    )
                );
                const newData = responses.reduce((acc, res, idx) => {
                    const key = Object.keys(endpoints)[idx];
                    acc[key] = res.data;
                    return acc;
                }, {});
                setData(newData);
            } catch (err) {
                setError('Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAdd = (key) => {
        setIsAdding(true);
        setCurrentEdit(key);
        setEditData({ ...templates[key] });
        setModalOpen(true);
    };

    const handleEdit = (key, item) => {
        setIsAdding(false);
        setCurrentEdit(key);
        setEditData({ ...item });
        setModalOpen(true);
    };

    const handleDelete = async (key, id) => {
        try {
            await api.delete(`${endpoints[key]}/${id}`);
            setData((prev) => ({
                ...prev,
                [key]: prev[key].filter((item) => item.id !== id),
            }));
        } catch (err) {
            alert('Failed to delete the item');
        }
    };

    const handleSave = async () => {
        try {
            const endpoint = endpoints[currentEdit];
            if (isAdding) {
                const response = await api.post(endpoint, editData);
                setData((prev) => ({
                    ...prev,
                    [currentEdit]: [...prev[currentEdit], response.data],
                }));
                alert('Item successfully added');
            } else {
                await api.put(`${endpoint}/${editData.id}`, editData);
                setData((prev) => ({
                    ...prev,
                    [currentEdit]: prev[currentEdit].map((item) =>
                        item.id === editData.id ? editData : item
                    ),
                }));
                alert('Changes successfully saved');
            }
        } catch (err) {
            alert('Failed to save changes');
        } finally {
            setModalOpen(false);
        }
    };

    if (loading) return <div className="admin-panel-container">Loading...</div>;
    if (error) return <div className="admin-panel-container">Error: {error}</div>;

    return (
        <div className="admin-panel-container">
            <h1>Admin Panel</h1>
            {Object.entries(data).map(([key, items]) => (
                <section key={key} className="admin-section">
                    <h2>{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
                    <button
                        className="admin-add-button"
                        onClick={() => handleAdd(key)}
                    >
                        Add {key.slice(0, -1)}
                    </button>
                    <ul className="admin-list">
                        {items.map((item) => (
                            <li key={item.id} className="admin-list-item">
                                <span>
                                    {Object.values(item).slice(0, 2).join(' - ')}
                                </span>
                                <div className="admin-buttons">
                                    <button
                                        className="admin-edit-button"
                                        onClick={() => handleEdit(key, item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="admin-delete-button"
                                        onClick={() => handleDelete(key, item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h2>{isAdding ? 'Add Item' : 'Edit Item'}</h2>
                {editData &&
    Object.keys(editData).map((field) => (
        <label key={field} className="modal-input-label">
            {field}:
            {field === 'content' ? (
                <textarea
                    name={field}
                    value={editData[field]}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        setEditData((prev) => ({
                            ...prev,
                            [name]: value,
                        }));
                    }}
                    className="modal-textarea"
                />
            ) : (
                <input
                    type={
                        typeof editData[field] === 'boolean'
                            ? 'checkbox'
                            : field.includes('date')
                            ? 'date'
                            : 'text'
                    }
                    name={field}
                    value={
                        typeof editData[field] === 'boolean'
                            ? undefined
                            : editData[field]
                    }
                    checked={
                        typeof editData[field] === 'boolean' ? editData[field] : undefined
                    }
                    onChange={(e) => {
                        const { name, value, type, checked } = e.target;
                        setEditData((prev) => ({
                            ...prev,
                            [name]: type === 'checkbox' ? checked : value,
                        }));
                    }}
                />
            )}
        </label>
    ))}
                <button className="modal-save-button" onClick={handleSave}>
                    Save
                </button>
            </Modal>
        </div>
    );
}

export default AdminPanel;