import axios from 'axios';

const api = axios.create({
    baseURL: 'https://fucklaravel.ru/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
        }
        return config;
    },
    (error) => Promise.reject(error) // Обработка ошибок
);


// Auth
export const login = (email, password) => {
    return api.post('/access-token', { email, password });
};

export const register = (name, email, password) => {
    return api.post('/usercus', { name, email, password });
};

// Articles
export const fetchArticles = () => api.get('/articles');
export const createArticle = (data) => {
    return api.post('/articles', {
        course_id: data.course_id,
        title: data.title,
        content: data.content,
    });
};
export const updateArticle = (id, data) => {
    return api.put(`/articles/${id}`, {
        course_id: data.course_id,
        title: data.title,
        content: data.content,
    });
};
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// Courses
export const fetchCourses = () => api.get('/courses');
export const createCourse = (data) => {
    return api.post('/courses', {
        title: data.title,
        description: data.description,
        price: data.price,
        is_active: data.is_active,
        is_subscription_based: data.is_subscription_based,
    });
};
export const updateCourse = (id, data) => {
    return api.put(`/courses/${id}`, {
        title: data.title,
        description: data.description,
        price: data.price,
        is_active: data.is_active,
        is_subscription_based: data.is_subscription_based,
    });
};
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Course Purchases
export const fetchCoursePurchases = () => api.get('/course-purchases');
export const createCoursePurchase = (data) => {
    return api.post('/course-purchases', {
        user_id: data.user_id,
        course_id: data.course_id,
        purchase_date: data.purchase_date,
        price_paid: data.price_paid,
    });
};
export const deleteCoursePurchase = (id) => api.delete(`/course-purchases/${id}`);

// Discounts
export const fetchDiscounts = () => api.get('/discounts');
export const createDiscount = (data) => {
    return api.post('/discounts', {
        course_id: data.course_id,
        percentage: data.percentage,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active,
    });
};
export const updateDiscount = (id, data) => {
    return api.put(`/discounts/${id}`, {
        course_id: data.course_id,
        percentage: data.percentage,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: data.is_active,
    });
};
export const deleteDiscount = (id) => api.delete(`/discounts/${id}`);

// Payments
export const fetchPayments = () => api.get('/payments');
export const createPayment = (data) => {
    return api.post('/payments', {
        user_id: data.user_id,
        amount: data.amount,
        payment_date: data.payment_date,
        payment_method: data.payment_method,
        status: data.status,
    });
};
export const deletePayment = (id) => api.delete(`/payments/${id}`);

// Subscription Cancellations
export const fetchSubscriptionCancellations = () => api.get('/subscription-cancellations');
export const createSubscriptionCancellation = (data) => {
    return api.post('/subscription-cancellations', {
        subscription_id: data.subscription_id,
        cancellation_date: data.cancellation_date,
        reason: data.reason,
        status: data.status,
    });
};
export const deleteSubscriptionCancellation = (id) => api.delete(`/subscription-cancellations/${id}`);

// Subscriptions
export const fetchSubscriptions = () => api.get('/subscriptions');
export const createSubscription = (data) => {
    return api.post('/subscriptions', {
        user_id: data.user_id,
        subscription_type_id: data.subscription_type_id,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
    });
};
export const updateSubscription = (id, data) => {
    return api.put(`/subscriptions/${id}`, {
        user_id: data.user_id,
        subscription_type_id: data.subscription_type_id,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
    });
};
export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}`);

// Subscription Types
export const fetchSubscriptionTypes = () => api.get('/subscription-types');
export const createSubscriptionType = (data) => {
    return api.post('/subscription-types', {
        name: data.name,
        description: data.description,
        price: data.price,
        is_active: data.is_active,
    });
};
export const updateSubscriptionType = (id, data) => {
    return api.put(`/subscription-types/${id}`, {
        name: data.name,
        description: data.description,
        price: data.price,
        is_active: data.is_active,
    });
};
export const deleteSubscriptionType = (id) => api.delete(`/subscription-types/${id}`);

// Users
export const fetchUsers = () => api.get('/usercus');
export const createUser = (data) => {
    return api.post('/usercus', {
        name: data.name,
        email: data.email,
        password: data.password,
        is_active: data.is_active,
    });
};
export const updateUser = (id, data) => {
    return api.put(`/usercus/${id}`, {
        name: data.name,
        email: data.email,
        password: data.password,
        is_active: data.is_active,
    });
};
export const deleteUser = (id) => api.delete(`/usercus/${id}`);
export default api;