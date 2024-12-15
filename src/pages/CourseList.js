import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/CourseList.css';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <h1>Все курсы</h1>
            <div className="courses-list">
                {courses.map((course) => (
                    <div key={course.id} className="course-item">
                        <h2 className="course-title">{course.title}</h2>
                        <p className="course-description">{course.description}</p>
                        <div className="course-actions">
                            <button>Перейти к курсу</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseList;