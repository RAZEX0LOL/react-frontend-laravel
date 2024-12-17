import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CourseList.css';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const isUserLoggedIn = !!localStorage.getItem('authToken');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                setCourses(response.data);
            } catch (err) {
                setError('Не удалось загрузить курсы.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div className="courses-container">Загрузка курсов...</div>;
    if (error) return <div className="courses-container">Ошибка: {error}</div>;

    return (
        <div className="courses-container">
            {isUserLoggedIn && (
                <div className="dashboard-button-container">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="dashboard-button"
                    >
                        Личный кабинет
                    </button>
                </div>
            )}
            <h1>Все курсы</h1>
            <div className="courses-list">
                {courses.map((course) => (
                    <div key={course.id} className="course-item">
                        <h2 className="course-title">{course.title}</h2>
                        <p className="course-description">{course.description}</p>
                        <div className="course-actions">
                            <button
                                onClick={() => navigate(`/courses/${course.id}`)}
                                className="course-view-button"
                            >
                                Перейти к курсу
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseList;