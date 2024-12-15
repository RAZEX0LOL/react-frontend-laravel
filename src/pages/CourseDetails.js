import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';

function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { purchased } = location.state || {};
    const [course, setCourse] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseResponse = await api.get(`/courses/${id}`);
                const articlesResponse = await api.get(`/articles?course_id=${id}`);
                setCourse(courseResponse.data);
                setArticles(articlesResponse.data);
            } catch (err) {
                setError('Failed to load course details');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);

    const handlePurchase = (type) => {
        navigate('/payment', { state: { courseId: id, purchaseType: type } });
    };

    if (loading) {
        return <div>Loading course details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            {!purchased && (
                <div>
                    <button onClick={() => handlePurchase('course')}>Buy Course</button>
                    <button onClick={() => handlePurchase('subscription')}>Subscribe</button>
                </div>
            )}
            {purchased && (
                <>
                    <h2>Articles</h2>
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </>
            )}
        </div>
    );
}

export default CourseDetails;