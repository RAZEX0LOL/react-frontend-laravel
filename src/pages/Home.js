import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
      <div className="home-container">
        <h1>Добро пожаловать в наше приложение!</h1>
        <p>Здесь вы можете управлять курсами и статьями.</p>
        <button className="login-button" onClick={() => navigate('/login')}>
          Перейти на страницу логина
        </button>
      </div>
    );
  };

  export default Home;