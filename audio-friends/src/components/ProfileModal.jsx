import React from 'react';
import './ProfileModal.css';

const ProfileModal = ({ user, onClose, onSendRequest }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>×</button>

                <div className="profile-hero">
                    {user.avatar ? (
                        <img src={user.avatar} className="large-avatar" alt={user.nickname} />
                    ) : (
                        <div className="large-avatar placeholder">{user.nickname[0].toUpperCase()}</div>
                    )}
                    <h1>{user.nickname}</h1>
                </div>

                <div className="profile-stats-grid">
                    <div className="stat-card">
                        <span className="label">Total Audios</span>
                        <span className="value">{user.stats.count}</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">Minutes Shared</span>
                        <span className="value">{Math.floor(user.stats.totalTime / 60)}</span>
                    </div>
                </div>

                <div className="modal-actions">
                    {user.isFriend ? (
                        <p className="already-friend">✓ Confirmed Friend</p>
                    ) : user.isSent ? (
                        <button className="neon-button secondary" disabled>
                            Request Pending
                        </button>
                    ) : (
                        <button className="neon-button primary" onClick={() => onSendRequest(user.nickname)}>
                            Send Friend Request
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
