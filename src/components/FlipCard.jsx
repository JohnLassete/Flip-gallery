// src/components/FlipCard.jsx
import React from 'react';
import './FlipCard.less';

const FlipCard = () => {
    return (
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h2>Front Side</h2>
                </div>
                <div className="flip-card-back">
                    <h2>Back Side</h2>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;
