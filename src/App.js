
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import ArticleManagement from './pages/ArticleManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';
import AdminPanel from './pages/AdminPanel';
import Payment from './pages/Payment';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/admin/articles" element={<ArticleManagement />} />
                <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/payment" element={<Payment />} />
            </Routes>
        </Router>
    );
}

export default App;
