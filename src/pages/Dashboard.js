import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import '../styles/Dashboard.css';

function Dashboard() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editedUserData, setEditedUserData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    // Функция для отмены подписки
    const cancelSubscription = async (subscriptionId) => {
        try {
            const payload = {
                subscription_id: subscriptionId, // ID подписки, которую нужно отменить
                cancellation_date: new Date().toISOString().split('T')[0], // Текущая дата
                reason: 'User requested cancellation', // Причина отмены
                status: 'Pending', // Статус отмены
            };

            // Отправляем запрос на сервер
            const response = await api.post(`/subscription-cancellations`, payload);

            // Убираем подписку из локального состояния
            setSubscriptions((prev) => prev.filter((sub) => sub.id !== subscriptionId));

            alert(response.data.message || 'Подписка успешно отменена.');
        } catch (err) {
            console.error('Failed to cancel subscription:', err);
            alert(err.response?.data?.message || 'Не удалось отменить подписку.');
        }
    };

    // Получение данных пользователя и его подписок/покупок
    const fetchUserData = async () => {
        try {
            const myIdResponse = await api.get('/myid');
            const userId = myIdResponse.data;

            const userResponse = await api.get(`/usercus/${userId}`);
            const [subscriptionsResponse, purchasesResponse] = await Promise.all([
                api.get(`/subscriptions/${userId}`),
                api.get('/courses'),
            ]);

            setUserData(userResponse.data);
            setEditedUserData({ name: userResponse.data.name, email: userResponse.data.email, password: '' });
            setSubscriptions(subscriptionsResponse.data);
            setPurchases(purchasesResponse.data);
        } catch (err) {
            setError('Не удалось загрузить данные.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveUserData = async () => {
        try {
            const payload = {
                name: editedUserData.name,
                email: editedUserData.email,
                ...(editedUserData.password && { password: editedUserData.password }),
            };

            await api.put(`/usercus/${userData.id}`, payload);

            setUserData((prev) => ({
                ...prev,
                name: editedUserData.name,
                email: editedUserData.email,
            }));
            setModalOpen(false);
            alert('Данные пользователя успешно обновлены.');
        } catch (err) {
            alert('Не удалось обновить данные пользователя.');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return <div className="dashboard-loading">Загрузка личного кабинета...</div>;
    }

    if (error) {
        return <div className="dashboard-error">Ошибка: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Личный кабинет</h1>

            {/* Информация о пользователе */}
            <section className="user-info-section">
                <h2>Информация о пользователе</h2>
                <p><strong>Имя:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <button
                    onClick={() => setModalOpen(true)}
                    className="edit-user-button"
                >
                    Редактировать данные
                </button>
            </section>

            {/* Подписки */}
            <section className="subscriptions-section">
                <h2>Ваши подписки</h2>
                {subscriptions.length > 0 ? (
                    <ul>
                        {subscriptions.map((sub) => (
                            <li key={sub.id} className="subscription-item">
                                <p><strong>Название подписки:</strong> {sub.subscription_type?.name || `Подписка ${sub.subscription_type_id}`}</p>
                                <p><strong>Статус:</strong> {sub.status}</p>
                                <p><strong>Дата начала:</strong> {sub.start_date}</p>
                                <p><strong>Дата окончания:</strong> {sub.end_date}</p>
                                <button
                                    onClick={() => cancelSubscription(sub.id)}
                                    className="subscription-cancel-button"
                                >
                                    Отменить подписку
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>У вас нет активных подписок.</p>
                )}
            </section>

            {/* Курсы */}
            <section className="courses-section">
                <h2>Ваши курсы</h2>
                {purchases.length > 0 ? (
                    <ul>
                        {purchases.map((purchase) => (
                            <li key={purchase.id} className="course-item">
                                <p><strong>Название курса:</strong> {purchase.title}</p>
                                {purchase.course && (
                                    <>
                                        <p><strong>Описание:</strong> {purchase.description}</p>
                                        <p>
                                            <strong>Статус:</strong>
                                            {purchase.is_active ? 'Активен' : 'Неактивен'}
                                        </p>
                                    </>
                                )}
                                <button
                                    onClick={() => navigate(`/course/${purchase.id}`)}
                                    className="course-view-button"
                                >
                                    Перейти к курсу
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Вы еще не приобрели ни одного курса.</p>
                )}
            </section>

            {/* Модальное окно для редактирования данных */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <h2>Редактировать данные</h2>
                <label>
                    Имя:
                    <input
                        type="text"
                        value={editedUserData.name}
                        onChange={(e) =>
                            setEditedUserData((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={editedUserData.email}
                        onChange={(e) =>
                            setEditedUserData((prev) => ({ ...prev, email: e.target.value }))
                        }
                    />
                </label>
                <label>
                    Новый пароль (если хотите изменить):
                    <input
                        type="password"
                        value={editedUserData.password}
                        onChange={(e) =>
                            setEditedUserData((prev) => ({ ...prev, password: e.target.value }))
                        }
                    />
                </label>
                <div className="modal-actions">
                    <button
                        onClick={handleSaveUserData}
                        className="save-button"
                    >
                        Сохранить
                    </button>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="cancel-button"
                    >
                        Отмена
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Dashboard;