import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SubscriptionForm.css';
import { createSubscription } from '../services/api'; // API для создания подписки
import api from '../services/api'; // Для получения user_id

function SubscriptionForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const subscription = location.state?.subscription; // Данные выбранной подписки

    const [userId, setUserId] = useState(null); // Храним user_id
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Получение user_id из /myid
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await api.get('/myid');
                setUserId(response.data); // Предполагается, что возвращается ID пользователя
            } catch (error) {
                console.error('Ошибка при получении user_id:', error.response?.data || error);
                alert('Не удалось получить данные пользователя.');
            }
        };

        fetchUserId();
    }, []);

    // Валидация полей формы
    const validateCardNumber = (number) => /^\d{16}$/.test(number); // 16 цифр
    const validateExpiryDate = (date) => {
        const [month, year] = date.split('/');
        const isValidFormat = /^\d{2}\/\d{2}$/.test(date); // Формат MM/YY
        const isValidMonth = month >= 1 && month <= 12; // Проверка месяца
        const currentYear = new Date().getFullYear() % 100; // Последние 2 цифры текущего года
        const isValidYear = year >= currentYear; // Проверка года
        return isValidFormat && isValidMonth && isValidYear;
    };
    const validateCvc = (code) => /^\d{3}$/.test(code); // 3 цифры

    // Обработка изменения поля срока действия карты
    const handleExpiryDateChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Только цифры
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2); // Добавляем слэш после двух цифр
        }
        setExpiryDate(value.slice(0, 5)); // Ограничиваем длину до 5 символов
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Валидация полей
        if (!validateCardNumber(cardNumber)) newErrors.cardNumber = 'Номер карты должен содержать 16 цифр.';
        if (!validateExpiryDate(expiryDate)) newErrors.expiryDate = 'Срок действия карты должен быть в формате MM/YY.';
        if (!validateCvc(cvc)) newErrors.cvc = 'CVC должен содержать 3 цифры.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                setLoading(true);

                if (!userId) {
                    alert('Ошибка: Не удалось определить пользователя.');
                    return;
                }

                // Подготовка данных для создания подписки
                const currentDate = new Date();
                const startDate = currentDate.toISOString().split('T')[0]; // Сегодняшняя дата
                const endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                    .toISOString()
                    .split('T')[0]; // Дата через месяц

                // Отправка запроса на создание подписки
                await createSubscription({
                    user_id: userId,
                    subscription_type_id: subscription.id, // ID выбранной подписки
                    start_date: startDate, // Дата начала
                    end_date: endDate, // Дата окончания
                    status: 'Active', // Замените на ожидаемое значение, если требуется
                });

                // Уведомление об успешной оплате
                alert('Подписка успешно оформлена!');
                navigate('/subscriptions'); // Перенаправление на страницу подписок
            } catch (error) {
                console.error('Ошибка при создании подписки:', error.response?.data || error);
                const apiErrors = error.response?.data?.errors;

                if (apiErrors) {
                    setErrors({
                        user_id: apiErrors.user_id?.[0],
                        status: apiErrors.status?.[0],
                    });
                } else {
                    alert('Произошла ошибка при создании подписки.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="subscription-form-container">
            <h1>Оформление подписки</h1>
            <p>Вы выбрали подписку: {subscription.name}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Номер карты:
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} // Только цифры
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                        required
                    />
                    {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
                </label>
                <label>
                    Срок действия (MM/YY):
                    <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        required
                    />
                    {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
                </label>
                <label>
                    CVC:
                    <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))} // Только цифры
                        placeholder="123"
                        maxLength="3"
                        required
                    />
                    {errors.cvc && <span className="error">{errors.cvc}</span>}
                </label>
                <button type="submit" disabled={loading || !userId}>
                    {loading ? 'Обработка...' : 'Оплатить'}
                </button>
            </form>
        </div>
    );
}

export default SubscriptionForm;