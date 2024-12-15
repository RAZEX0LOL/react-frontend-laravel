
import React from 'react';
import './ArticleCard.css';

function ArticleCard({ article }) {
    return (
        <div className="article-card">
            <h3>{article.title}</h3>
            <p>{article.content}</p>
        </div>
    );
}

export default ArticleCard;
