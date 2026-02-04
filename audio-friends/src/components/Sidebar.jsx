import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ friends, pendingRequests, onSelectChat, activeChat, onSearchUser, onAcceptFriend, onlineUsers }) => {
    const [searchNickname, setSearchNickname] = useState('');

    return (
        <aside className="sidebar glass">
            <div className="sidebar-section">
                <h4>User Search</h4>
                <div className="add-friend">
                    <input
                        type="text"
                        placeholder="Search nickname..."
                        value={searchNickname}
                        onChange={(e) => setSearchNickname(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSearchUser(searchNickname)}
                    />
                    <button className="icon-btn" onClick={() => onSearchUser(searchNickname)}>🔍</button>
                </div>
            </div>

            <div className="sidebar-section">
                <h4>Friends ({friends.length})</h4>
                {pendingRequests.length > 0 && (
                    <div className="pending-section">
                        <h5>Requests</h5>
                        {pendingRequests.map(nick => (
                            <div key={nick} className="friend-item pending">
                                <span>{nick}</span>
                                <button className="accept-btn" onClick={() => onAcceptFriend(nick)}>Accept</button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="friend-list list-container">
                    {friends.map(friend => (
                        <div
                            key={friend}
                            className={`friend-item ${activeChat.id === friend ? 'active' : ''}`}
                            onClick={() => onSelectChat({ type: 'private', id: friend })}
                        >
                            <div className="avatar-mini">{friend[0].toUpperCase()}</div>
                            <span>{friend}</span>
                            {onlineUsers.includes(friend) && <span className="online-dot-mini"></span>}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
