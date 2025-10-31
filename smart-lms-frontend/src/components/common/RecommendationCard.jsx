import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendationCard.css';

function RecommendationCard({ path }) {
    const navigate = useNavigate();

    return (
        <div className="recommendation-card" onClick={() => navigate(`/learning-paths/${path.id}`)}>
            <div className="match-badge">
                <div className="percentage">{path.matchPercentage}%</div>
                <div className="match-label">Phù hợp</div>
            </div>
            <div className="card-content">
                <h4 className="card-title">🎯 {path.title}</h4>
                <p className="card-reasoning">
                    <strong>Lý do gợi ý:</strong> {path.reasoning}
                </p>
                <div className="tags">
                    <span className="tag">{path.category}</span>
                    <span className="tag">{path.difficulty}</span>
                </div>
            </div>
        </div>
    );
}

export default RecommendationCard;
