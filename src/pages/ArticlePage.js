import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/ArticlePage.css';

function ArticlePage() {
    const { articleId } = useParams(); // ID статьи из URL
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                const response = await api.get(`/articles/${articleId}`);
                setArticle(response.data);
            } catch (err) {
                setError('Не удалось загрузить статью.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticleData();
    }, [articleId]);

    if (loading) return <div className="article-page-loading">Загрузка статьи...</div>;
    if (error) return <div className="article-page-error">Ошибка: {error}</div>;

    const createMarkup = (htmlContent) => ({ __html: htmlContent });

    return (
        <div className="article-page-container">
            <h1 className="article-title">{article.title}</h1>
            <p className="article-meta">
                Часть курса: <strong>{article.course?.title || `Курс ID: ${article.course_id}`}</strong>
            </p>
            <div
                className="article-content"
                dangerouslySetInnerHTML={createMarkup(article.content)}
            ></div>
            <Link to={`/courses/${article.course_id}`} className="back-to-course">
                Вернуться к курсу
            </Link>
        </div>
    );
}

export default ArticlePage;