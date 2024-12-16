import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Добро пожаловать в нашу платформу!</h1>
                <p>Изучайте IT- сферу легко и просто</p>
            </header>
            <main className="home-content">
                <section className="features-section">
                    <h2>Что вы можете делать:</h2>
                    <ul className="features-list">
                        <li>Изучайте курсы, которые вам интересны.</li>
                        <li>Управляйте подписками и отслеживайте их статус.</li>
                        <li>Просматривайте статьи и создавайте новые.</li>
                        <li>Редактируйте данные вашего профиля.</li>
                    </ul>
                </section>
                <section className="benefits-section">
                    <h2>Почему выбрать нас?</h2>
                    <ul className="benefits-list">
                        <li>Простота и удобство в использовании.</li>
                        <li>Большой выбор курсов и статей.</li>
                        <li>Мгновенный доступ к вашему личному кабинету.</li>
                        <li>Поддержка пользователей 24/7.</li>
                    </ul>
                </section>
                <div className="action-section">
                    <button className="login-button" onClick={() => navigate('/login')}>
                        Войти
                    </button>
                </div>
            </main>
            <footer className="home-footer">
                <p>&copy; 2024 Наше приложение. Все права защищены.</p>
            </footer>
        </div>
    );
};

export default Home;