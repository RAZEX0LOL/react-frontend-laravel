import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/AdminPanel.css';

function AdminPanel() {
    // State for different entities
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [articles, setArticles] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [subscriptionTypes, setSubscriptionTypes] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for new entries
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', is_active: true });
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        price: '',
        is_active: false,
        is_subscription_based: false,
    });
    const [newArticle, setNewArticle] = useState({ title: '', content: '', course_id: '' });
    const [newSubscription, setNewSubscription] = useState({
        user_id: '',
        subscription_type_id: '',
        start_date: '',
        end_date: '',
        status: 'Active',
    });
    const [newSubscriptionType, setNewSubscriptionType] = useState({
        name: '',
        description: '',
        price: '',
        is_active: true,
    });

    // Fetch all data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    usersRes,
                    coursesRes,
                    articlesRes,
                    subscriptionsRes,
                    subscriptionTypesRes,
                ] = await Promise.all([
                    api.get('/usercus'),
                    api.get('/courses'),
                    api.get('/articles'),
                    api.get('/subscriptions'),
                    api.get('/subscription-types'),
                ]);
                setUsers(usersRes.data);
                setCourses(coursesRes.data);
                setArticles(articlesRes.data);
                setSubscriptions(subscriptionsRes.data);
                setSubscriptionTypes(subscriptionTypesRes.data);
            } catch (err) {
                setError('Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // CRUD Handlers
    const createHandler = async (endpoint, data, setState, resetState) => {
        try {
            const response = await api.post(endpoint, data);
            setState((prev) => [...prev, response.data]);
            resetState();
        } catch (err) {
            alert(`Failed to create ${endpoint}`);
        }
    };

    const deleteHandler = async (endpoint, id, setState) => {
        try {
            await api.delete(`${endpoint}/${id}`);
            setState((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            alert(`Failed to delete ${endpoint}`);
        }
    };

    if (loading) return <div>Loading admin panel...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Admin Panel</h1>

            {/* Users Section */}
            <section className="admin-section">
                <h2>Users</h2>
                <form className= "admin-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createHandler('/usercus', newUser, setUsers, () =>
                            setNewUser({ name: '', email: '', password: '', is_active: true })
                        );
                    }}
                >
                    <input className="admin-input"
                        type="text"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <label>
                        Active
                        <input
                            type="checkbox"
                            checked={newUser.is_active}
                            onChange={(e) =>
                                setNewUser({ ...newUser, is_active: e.target.checked })
                            }
                        />
                    </label>
                    <button className="admin-button" type="submit">Add User</button>
                </form>
                <ul className="admin-list">
                    {users.map((user) => (
                        <li className="admin-list-item" key={user.id}>
                            {user.name} - {user.email}
                            <button className="admin-delete-button" onClick={() => deleteHandler('/usercus', user.id, setUsers)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Courses Section */}
            <section className="admin-section">
                <h2>Courses</h2>
                <form className= "admin-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createHandler('/courses', newCourse, setCourses, () =>
                            setNewCourse({
                                title: '',
                                description: '',
                                price: '',
                                is_active: false,
                                is_subscription_based: false,
                            })
                        );
                    }}
                >
                    <input className="admin-input"
                        type="text"
                        placeholder="Title"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newCourse.description}
                        onChange={(e) =>
                            setNewCourse({ ...newCourse, description: e.target.value })
                        }
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newCourse.price}
                        onChange={(e) =>
                            setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })
                        }
                        required
                    />
                    <label>
                        Active
                        <input
                            type="checkbox"
                            checked={newCourse.is_active}
                            onChange={(e) =>
                                setNewCourse({ ...newCourse, is_active: e.target.checked })
                            }
                        />
                    </label>
                    <label>
                        Subscription Based
                        <input
                            type="checkbox"
                            checked={newCourse.is_subscription_based}
                            onChange={(e) =>
                                setNewCourse({
                                    ...newCourse,
                                    is_subscription_based: e.target.checked,
                                })
                            }
                        />
                    </label>
                    <button className="admin-button" type="submit">Add Course</button>
                </form>
                <ul className="admin-list">
                    {courses.map((course) => (
                        <li className="admin-list-item" key={course.id}>
                            {course.title}
                            <button className="admin-delete-button"
                                onClick={() => deleteHandler('/courses', course.id, setCourses)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Articles Section */}
            <section className="admin-section">
                <h2>Articles</h2>
                <form className= "admin-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createHandler('/articles', newArticle, setArticles, () =>
                            setNewArticle({ title: '', content: '', course_id: '' })
                        );
                    }}
                >
                    <input className="admin-input"
                        type="text"
                        placeholder="Title"
                        value={newArticle.title}
                        onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={newArticle.content}
                        onChange={(e) =>
                            setNewArticle({ ...newArticle, content: e.target.value })
                        }
                        required
                    />
                    <select
                        value={newArticle.course_id}
                        onChange={(e) =>
                            setNewArticle({ ...newArticle, course_id: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                    <button className="admin-button" type="submit">Add Article</button>
                </form>
                <ul className="admin-list">
                    {articles.map((article) => (
                        <li className="admin-list-item" key={article.id}>
                            {article.title}
                            <button className="admin-delete-button"
                                onClick={() => deleteHandler('/articles', article.id, setArticles)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Subscriptions Section */}
            <section className="admin-section">
                <h2>Subscriptions</h2>
                <form className= "admin-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createHandler('/subscriptions', newSubscription, setSubscriptions, () =>
                            setNewSubscription({
                                user_id: '',
                                subscription_type_id: '',
                                start_date: '',
                                end_date: '',
                                status: 'Active',
                            })
                        );
                    }}
                >
                    <select
                        value={newSubscription.user_id}
                        onChange={(e) =>
                            setNewSubscription({ ...newSubscription, user_id: e.target.value })
                        }
                        required
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={newSubscription.subscription_type_id}
                        onChange={(e) =>
                            setNewSubscription({
                                ...newSubscription,
                                subscription_type_id: e.target.value,
                            })
                        }
                        required
                    >
                        <option value="">Select Subscription Type</option>
                        {subscriptionTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={newSubscription.start_date}
                        onChange={(e) =>
                            setNewSubscription({ ...newSubscription, start_date: e.target.value })
                        }
                        required
                    />
                    <input
                        type="date"
                        value={newSubscription.end_date}
                        onChange={(e) =>
                            setNewSubscription({ ...newSubscription, end_date: e.target.value })
                        }
                        required
                    />
                    <button className="admin-button" type="submit">Add Subscription</button>
                </form>
                <ul className="admin-list">
                    {subscriptions.map((sub) => (
                        <li className="admin-list-item" key={sub.id}>
                            User: {sub.user_id}, Type: {sub.subscription_type_id}
                            <button className="admin-delete-button"
                                onClick={() =>
                                    deleteHandler('/subscriptions', sub.id, setSubscriptions)
                                }
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Subscription Types Section */}
            <section className="admin-section">
                <h2>Subscription Types</h2>
                <form className= "admin-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createHandler(
                            '/subscription-types',
                            newSubscriptionType,
                            setSubscriptionTypes,
                            () =>
                                setNewSubscriptionType({
                                    name: '',
                                    description: '',
                                    price: '',
                                    is_active: true,
                                })
                        );
                    }}
                >
                    <input className="admin-input"
                        type="text"
                        placeholder="Name"
                        value={newSubscriptionType.name}
                        onChange={(e) =>
                            setNewSubscriptionType({ ...newSubscriptionType, name: e.target.value })
                        }
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newSubscriptionType.description}
                        onChange={(e) =>
                            setNewSubscriptionType({
                                ...newSubscriptionType,
                                description: e.target.value,
                            })
                        }
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newSubscriptionType.price}
                        onChange={(e) =>
                            setNewSubscriptionType({
                                ...newSubscriptionType,
                                price: parseFloat(e.target.value),
                            })
                        }
                        required
                    />
                    <label>
                        Active
                        <input
                            type="checkbox"
                            checked={newSubscriptionType.is_active}
                            onChange={(e) =>
                                setNewSubscriptionType({
                                    ...newSubscriptionType,
                                    is_active: e.target.checked,
                                })
                            }
                        />
                    </label>
                    <button className="admin-button" type="submit">Add Subscription Type</button>
                </form>
                <ul className="admin-list">
                    {subscriptionTypes.map((type) => (
                        <li className="admin-list-item" key={type.id}>
                            {type.name} - ${type.price} -{' '}
                            {type.is_active ? 'Active' : 'Inactive'}
                            <button className="admin-delete-button"
                                onClick={() =>
                                    deleteHandler('/subscription-types', type.id, setSubscriptionTypes)
                                }
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default AdminPanel;