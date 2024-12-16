import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PurchaseForm.css';
import api from '../services/api'; // Импорт API для запросов

function PurchaseForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const course = location.state?.course; // Данные курса

    const [userId, setUserId] = useState(null); // Храним `user_id`
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await api.get('/myid');
                setUserId(response.data);
            } catch (error) {
                console.error('Ошибка при получении user_id:', error.response?.data || error);
                alert('Не удалось получить данные пользователя.');
            }
        };

        fetchUserId();
    }, []);

    const validateCardNumber = (number) => /^\d{16}$/.test(number);
    const validateExpiryDate = (date) => {
        const [month, year] = date.split('/');
        const isValidFormat = /^\d{2}\/\d{2}$/.test(date);
        const isValidMonth = month >= 1 && month <= 12;
        const currentYear = new Date().getFullYear() % 100;
        const isValidYear = year >= currentYear;
        return isValidFormat && isValidMonth && isValidYear;
    };
    const validateCvc = (code) => /^\d{3}$/.test(code);

    const handleExpiryDateChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setExpiryDate(value.slice(0, 5));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Проверка полей
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

                const purchaseDate = new Date().toISOString().split('T')[0];
                await api.post('/course-purchases', {
                    user_id: userId,
                    course_id: course.id,
                    purchase_date: purchaseDate,
                    price_paid: course.price,
                });

                setSuccessMessage(`Курс "${course.title}" успешно приобретён!`);
                setTimeout(() => {
                    navigate(`/courses/${course.id}`);
                }, 3000);
            } catch (error) {
                console.error('Ошибка при покупке курса:', error.response?.data || error);
                alert('Произошла ошибка при покупке курса. Попробуйте снова.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="purchase-form-container">
            {successMessage ? (
                <div className="success-message">
                    <h1>{successMessage}</h1>
                    <p>Вы будете перенаправлены на страницу курса через несколько секунд...</p>
                </div>
            ) : (
                <>
                    <h1>Покупка курса</h1>
                    <p>Вы покупаете курс: {course.title}</p>
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
                </>
            )}
        </div>
    );
}

export default PurchaseForm;