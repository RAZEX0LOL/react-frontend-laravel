import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import '../styles/AdminPanel.css';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const templates = {
        users: { name: '', email: '', password: '', is_active: true },
        courses: { title: '', description: '', price: 0, is_active: true, subscription_type_name: '' },
        articles: { course_id: '', title: '', content: '' },
        subscriptions: {
            user_name: '',
            subscription_type_name: '',
            start_date: '',
            end_date: '',
            status: 'Active',
        },
        subscriptionTypes: { name: '', description: '', price: 0, is_active: false },
    };

    const fieldTranslations = {
        users: { name: 'Имя', email: 'Электронная почта', password: 'Пароль', is_active: 'Активен' },
        courses: { title: 'Название', description: 'Описание', price: 'Цена', is_active: 'Активен', subscription_type_name: 'Тип подписки' },
        articles: { course_id: 'Курс', title: 'Название статьи', content: 'Содержание' },
        subscriptions: {
            user_name: 'Пользователь',
            subscription_type_name: 'Тип подписки',
            start_date: 'Дата начала',
            end_date: 'Дата окончания',
            status: 'Статус',
        },
        subscriptionTypes: { name: 'Название', description: 'Описание', price: 'Цена', is_active: 'Активен' },
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
                    Object.entries(endpoints).map(([key, endpoint]) => api.get(endpoint))
                );

                const newData = responses.reduce((acc, res, idx) => {
                    const key = Object.keys(endpoints)[idx];
                    acc[key] = res.data;
                    return acc;
                }, {});

                setData(newData);
            } catch (err) {
                setError('Не удалось загрузить данные админ-панели');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

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
            const response = await api.get(endpoints[key]);
            setData((prev) => ({
                ...prev,
                [key]: response.data,
            }));
        } catch (err) {
            alert('Не удалось удалить элемент');
        }
    };

    const handleSave = async () => {
        try {
            const endpoint = endpoints[currentEdit];

            if (currentEdit === 'subscriptions') {
                const user = data.users.find((u) => u.name === editData.user_name);
                const subscriptionType = data.subscriptionTypes.find(
                    (s) => s.name === editData.subscription_type_name
                );

                if (user) editData.user_id = user.id;
                if (subscriptionType) editData.subscription_type_id = subscriptionType.id;

                delete editData.user_name;
                delete editData.subscription_type_name;
            }

            if (isAdding) {
                await api.post(endpoint, editData);
            } else {
                await api.put(`${endpoint}/${editData.id}`, editData);
            }

            const response = await api.get(endpoint);
            setData((prev) => ({
                ...prev,
                [currentEdit]: response.data,
            }));

            alert(isAdding ? 'Элемент успешно добавлен' : 'Изменения успешно сохранены');
        } catch (err) {
            alert('Не удалось сохранить изменения');
        } finally {
            setModalOpen(false);
        }
    };

    const getUserName = (userId) => {
        const user = data.users.find((u) => u.id === userId);
        return user ? user.name : 'Неизвестный пользователь';
    };

    const getSubscriptionTypeName = (subscriptionTypeId) => {
        const type = data.subscriptionTypes.find((t) => t.id === subscriptionTypeId);
        return type ? type.name : 'Неизвестный тип подписки';
    };

    const getSubscriptionDisplay = (subscription) => {
        const userName = getUserName(subscription.user_id);
        const subscriptionTypeName = getSubscriptionTypeName(subscription.subscription_type_id);
        return `${userName} - ${subscriptionTypeName} (${subscription.status})`;
    };

    const renderSearchAndSelectField = (field, options) => {
        const filteredOptions = options.filter((option) =>
            option.name.toLowerCase().includes((editData[field] || '').toLowerCase())
        );

        return (
            <div className="modal-select-container">
                <input
                    type="text"
                    placeholder={`Введите или выберите ${
                        field === 'course_id' ? 'курс' : 'значение'
                    }`}
                    value={editData[field] || ''}
                    onChange={(e) => {
                        const { value } = e.target;
                        setEditData((prev) => ({
                            ...prev,
                            [field]: value,
                        }));
                    }}
                    list={`list-${field}`}
                    className="modal-input"
                />
                <datalist id={`list-${field}`}>
                    {filteredOptions.map((option) => (
                        <option key={option.id} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </datalist>
            </div>
        );
    };

    if (loading) return <div className="admin-panel-container">Загрузка...</div>;
    if (error) return <div className="admin-panel-container">Ошибка: {error}</div>;

    return (
        <div className="admin-panel-container">
            <h1>Админ-панель</h1>
            <button onClick={logout} className="logout-button">Выйти из аккаунта</button>
            {Object.entries(data).map(([key, items]) => (
                <section key={key} className="admin-section">
                    <h2>
                        {{
                            users: 'Пользователи',
                            courses: 'Курсы',
                            articles: 'Статьи',
                            subscriptions: 'Подписки',
                            subscriptionTypes: 'Типы подписок',
                        }[key]}
                    </h2>
                    <button
                        className="admin-add-button"
                        onClick={() => handleAdd(key)}
                    >
                        Добавить {{
                            users: 'пользователя',
                            courses: 'курс',
                            articles: 'статью',
                            subscriptions: 'подписку',
                            subscriptionTypes: 'тип подписки',
                        }[key]}
                    </button>
                    <ul className="admin-list">
                        {items.map((item) => (
                            <li key={item.id} className="admin-list-item">
                                <span>
                                    {{
                                        users: item.name || item.email,
                                        courses: item.title,
                                        articles: `${getUserName(item.course_id)} - ${item.title}`,
                                        subscriptions: getSubscriptionDisplay(item),
                                        subscriptionTypes: item.name,
                                    }[key] || 'Новый элемент'}
                                </span>
                                <div className="admin-buttons">
                                    <button
                                        className="admin-edit-button"
                                        onClick={() => handleEdit(key, item)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="admin-delete-button"
                                        onClick={() => handleDelete(key, item.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h2>
                    {isAdding
                        ? `Добавить ${
                              {
                                  users: 'пользователя',
                                  courses: 'курс',
                                  articles: 'статью',
                                  subscriptions: 'подписку',
                                  subscriptionTypes: 'тип подписки',
                              }[currentEdit]
                          }`
                        : `Редактировать ${
                              {
                                  users: 'пользователя',
                                  courses: 'курс',
                                  articles: 'статью',
                                  subscriptions: 'подписку',
                                  subscriptionTypes: 'тип подписки',
                              }[currentEdit]
                          }`}
                </h2>
                {editData &&
                    Object.keys(editData).map((field) => (
                        <label key={field} className="modal-input-label">
                            {fieldTranslations[currentEdit]?.[field] || field}:
                            {field === 'course_id'
                                ? renderSearchAndSelectField(
                                      field,
                                      data.courses.map((c) => ({
                                          id: c.id,
                                          name: c.title,
                                      }))
                                  )
                                : (
                                    <input
                                        type={field.includes('date') ? 'date' : 'text'}
                                        name={field}
                                        value={editData[field] || ''}
                                        onChange={(e) => {
                                            const { name, value } = e.target;
                                            setEditData((prev) => ({
                                                ...prev,
                                                [name]: value,
                                            }));
                                        }}
                                        className="modal-input"
                                    />
                                )}
                        </label>
                    ))}
                <button className="modal-save-button" onClick={handleSave}>
                    Сохранить
                </button>
            </Modal>
        </div>
    );
}

export default AdminPanel;