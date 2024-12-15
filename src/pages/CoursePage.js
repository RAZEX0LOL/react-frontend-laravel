import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CoursePage.css';

function CoursePage() {
    const { courseId } = useParams(); // ID курса из URL
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [articles, setArticles] = useState([]);
    const [userCourses, setUserCourses] = useState([]); // ID курсов, доступных пользователю
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Получаем данные текущего курса
                const courseResponse = await api.get(`/courses/${courseId}`);
                setCourse(courseResponse.data);

                // Получаем статьи курса
                const articlesResponse = await api.get(`/subarticles/${courseId}`);
                setArticles(articlesResponse.data);

                // Получаем список доступных курсов
                const userCoursesResponse = await api.get('https://fucklaravel.ru/api/mycourses');
                setUserCourses(userCoursesResponse.data); // Сохраняем массив ID курсов
            } catch (err) {
                setError('Не удалось загрузить данные курса.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    const handleSubscription = () => {
        navigate(`/subscriptions`);
    };

    const handlePurchaseCourse = () => {
        navigate(`/purchase/form`, { state: { course } });
    };

    // Проверяем, доступен ли курс пользователю
    const hasAccess = userCourses.includes(parseInt(courseId));

    if (loading) return <div className="course-page-loading">Загрузка курса...</div>;
    if (error) return <div className="course-page-error">Ошибка: {error}</div>;

    return (
        <div className="course-page-container">
            <h1>{course.title}</h1>
            <p className="course-description">{course.description}</p>

            <h2>Список статей</h2>
            <ul className="articles-list">
                {articles.map((article) => (
                    <li key={article.id} className="article-item">
                        {hasAccess ? (
                            <button
                                onClick={() => navigate(`/articles/${article.id}`)}
                                className="article-link"
                            >
                                {article.title}
                            </button>
                        ) : (
                            <span className="article-disabled">{article.title}</span>
                        )}
                    </li>
                ))}
            </ul>

            {!hasAccess && (
                <div className="purchase-options">
                    <button onClick={handleSubscription} className="subscription-button">
                        Оформить подписку
                    </button>
                    <button onClick={handlePurchaseCourse} className="purchase-button">
                        Приобрести курс отдельно
                    </button>
                </div>
            )}
        </div>
    );
}

export default CoursePage;