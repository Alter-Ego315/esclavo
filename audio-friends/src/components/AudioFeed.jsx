import React from 'react';
import './AudioFeed.css';

const AudioFeed = ({ messages }) => {
    return (
        <div className="feed-container">
            {messages.length === 0 ? (
                <div className="empty-state">
                    <p>No audio messages yet.</p>
                    <small>Share a thought with your friends!</small>
                </div>
            ) : (
                messages.map((msg) => (
                    <div key={msg.id} className="audio-card glass scale-in">
                        <div className="card-header">
                            <span className="sender">{msg.sender}</span>
                            <span className="time">{msg.timestamp}</span>
                        </div>
                        <div className="audio-wrapper">
                            <audio controls src={msg.url}></audio>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AudioFeed;
