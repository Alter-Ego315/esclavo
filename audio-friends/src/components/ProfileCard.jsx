import React, { useRef } from 'react';
import './ProfileCard.css';

const ProfileCard = ({ nickname, stats, avatar, onUpdateAvatar }) => {
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-card glass">
            <div className="profile-header">
                <div className="avatar-container" onClick={() => fileInputRef.current.click()}>
                    {avatar ? (
                        <img src={avatar} className="profile-avatar" alt="profile" />
                    ) : (
                        <div className="profile-avatar placeholder">{nickname[0].toUpperCase()}</div>
                    )}
                    <div className="avatar-overlay">Edit</div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <h3>{nickname}</h3>
            </div>

            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-val">{stats.count || 0}</span>
                    <span className="stat-lab">Audios</span>
                </div>
                <div className="stat-item">
                    <span className="stat-val">{Math.floor((stats.totalTime || 0) / 60)}</span>
                    <span className="stat-lab">Minutes</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
