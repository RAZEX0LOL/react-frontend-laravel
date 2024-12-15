
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ArticleManagement() {
    const [articles, setArticles] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newArticle, setNewArticle] = useState({ title: '', content: '', course_id: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articlesResponse, coursesResponse] = await Promise.all([
                    api.get('/articles'),
                    api.get('/courses')
                ]);
                setArticles(articlesResponse.data);
                setCourses(coursesResponse.data);
            } catch (err) {
                setError('Failed to load articles or courses');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/articles/${id}`);
            setArticles(articles.filter((article) => article.id !== id));
        } catch (err) {
            alert('Failed to delete article');
        }
    };

    const handleCreate = async () => {
        try {
            const response = await api.post('/articles', newArticle);
            setArticles([...articles, response.data.article]);
            setNewArticle({ title: '', content: '', course_id: '' });
        } catch (err) {
            alert('Failed to create article');
        }
    };

    if (loading) {
        return <div>Loading article management...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Article Management</h1>
            <h2>Create New Article</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreate();
                }}
            >
                <label>
                    Title:
                    <input
                        type="text"
                        value={newArticle.title}
                        onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    />
                </label>
                <br />
                <label>
                    Content:
                    <textarea
                        value={newArticle.content}
                        onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    />
                </label>
                <br />
                <label>
                    Course:
                    <select
                        value={newArticle.course_id}
                        onChange={(e) => setNewArticle({ ...newArticle, course_id: e.target.value })}
                    >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button type="submit">Create Article</button>
            </form>
            <h2>Existing Articles</h2>
            <ul>
                {articles.map((article) => (
                    <li key={article.id}>
                        <h3>{article.title}</h3>
                        <p>{article.content}</p>
                        <button onClick={() => handleDelete(article.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ArticleManagement;
