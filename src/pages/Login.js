import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/access-token', { email, password });
            localStorage.setItem('authToken', response.data.token);

            const userResponse = await api.get('/myid', {
                headers: { Authorization: `Bearer ${response.data.token}` },
            });

            const userId = userResponse.data;

            // Получаем роль пользователя для проверки
            const userDetails = await api.get(`/usercus/${userId}`, {
                headers: { Authorization: `Bearer ${response.data.token}` },
            });

            if (userDetails.data.role === 'admin') {
                navigate('/admin-panel'); // Переход на админ-панель
            } else {
                navigate('/courses'); // Переход на страницу со всеми курсами
            }
        } catch (err) {
            setError('Неверные учетные данные. Попробуйте еще раз.');
        }
    };

    return (
        <div className="login-container">
            <h1>Войти</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Пароль:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Войти</button>
            </form>
            <p className="register-link">
                Нет аккаунта? <span onClick={() => navigate('/register')}>Зарегистрироваться</span>
            </p>
        </div>
    );
}

export default Login;