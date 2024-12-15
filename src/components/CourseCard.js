
import React from 'react';
import './CourseCard.css';

function CourseCard({ course, onClick }) {
    return (
        <div className="course-card" onClick={onClick}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
        </div>
    );
}

export default CourseCard;
