
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import ArticleManagement from './pages/ArticleManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';
import AdminPanel from './pages/AdminPanel';
import Payment from './pages/Payment';
import CoursePage from "./pages/CoursePage";
import ArticlePage from "./pages/ArticlePage";
import SubscriptionForm from "./pages/SubscriptionForm";
import PurchaseForm from "./pages/PurchaseForm";
import SubscriptionSelection from "./pages/SubscriptionSelection";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:courseId" element={<CoursePage />} />
                <Route path="/articles/:articleId" element={<ArticlePage />} />
                <Route path="/admin/articles" element={<ArticleManagement />} />
                <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/subscriptions" element={<SubscriptionSelection />} />
                <Route path="/subscriptions/form" element={<SubscriptionForm />} />
                <Route path="/purchase/form" element={<PurchaseForm />} />
            </Routes>
        </Router>
    );
}

export default App;
