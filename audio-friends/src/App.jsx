import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import AudioRecorder from './components/AudioRecorder';
import AudioFeed from './components/AudioFeed';
import Sidebar from './components/Sidebar';
import ProfileCard from './components/ProfileCard';
import SplashScreen from './components/SplashScreen';
import ProfileModal from './components/ProfileModal';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [activeChat, setActiveChat] = useState({ type: 'group', id: 'General' });
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [groups, setGroups] = useState(() => JSON.parse(localStorage.getItem('groups') || '[]'));
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatHistories, setChatHistories] = useState({});
  const [stats, setStats] = useState({ totalTime: 0, count: 0 });
  const [avatar, setAvatar] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [searchedUser, setSearchedUser] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('search-result', (result) => {
      if (result.error) alert(result.error);
      else setSearchedUser(result);
    });

    socket.on('join-success', (data) => {
      setUserName(data.nickname);
      setStats(data.stats);
      setAvatar(data.avatar);
      setFriends(data.friends);
      setPendingRequests(data.pendingRequests);
      setSentRequests(data.sentRequests);
      setIsJoined(true);
      groups.forEach(g => socket.emit('join-room', g));
    });

    socket.on('auth-message', (msg) => {
      setAuthMessage(msg);
      setAuthError('');
      setAuthMode('login');
    });

    socket.on('auth-error', (err) => setAuthError(err));
    socket.on('friend-update', (newFriends) => setFriends(newFriends));
    socket.on('new-friend-request', (sender) => setPendingRequests(prev => [...new Set([...prev, sender])]));
    socket.on('user-list', (users) => setOnlineUsers(users));
    socket.on('update-stats', (newStats) => setStats(newStats));
    socket.on('profile-updated', (data) => setAvatar(data.avatar));

    socket.on('receive-audio', (data) => {
      const chatId = data.isGroup ? data.target : data.sender;
      const blob = new Blob([data.audioBlob], { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setChatHistories(prev => ({
        ...prev,
        [chatId]: [{ ...data, url }, ...(prev[chatId] || [])]
      }));
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const handleAuth = () => {
    if (!userName || !password) {
      setAuthError('Please fill in both fields.');
      return;
    }
    socketRef.current.emit(authMode, { nickname: userName, password });
  };

  const handleNewAudio = (audioData) => {
    const { blob, duration } = audioData;
    const localUrl = URL.createObjectURL(blob);
    setChatHistories(prev => ({
      ...prev,
      [activeChat.id]: [{
        id: Date.now(),
        sender: 'You',
        timestamp: new Date().toLocaleTimeString(),
        url: localUrl,
        duration
      }, ...(prev[activeChat.id] || [])]
    }));
    socketRef.current.emit('send-audio', {
      blob,
      target: activeChat.id,
      isGroup: activeChat.type === 'group',
      duration
    });
  };

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  if (!isJoined) {
    return (
      <div className="app-container join-screen">
        <div className="glass join-card">
          <h1>Alter Ego</h1>
          <div className="auth-tabs">
            <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
            <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Register</button>
          </div>
          <div className="auth-fields">
            <input type="text" placeholder="Nickname" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAuth()} />
          </div>
          {authError && <p className="error-text">{authError}</p>}
          {authMessage && <p className="success-text">{authMessage}</p>}
          <button className="neon-button primary" onClick={handleAuth}>
            {authMode === 'login' ? 'Access' : 'Create'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="social-layout">
      <Sidebar
        friends={friends} pendingRequests={pendingRequests} onlineUsers={onlineUsers} activeChat={activeChat}
        onSelectChat={setActiveChat} onSearchUser={(nick) => socketRef.current.emit('search-user', nick)}
        onAcceptFriend={(nick) => socketRef.current.emit('accept-friend-request', nick)}
        groups={groups}
        sentRequests={sentRequests}
      />

      <div className="chat-area">
        <header className="glass chat-header">
          <h2>{activeChat.id}</h2>
          <div className="user-profile">
            {avatar ? <img src={avatar} className="avatar-mini-img" alt="me" /> : <div className="avatar-mini-dot">{userName[0]}</div>}
            {userName}
          </div>
        </header>
        <main className="main-feed"><AudioFeed messages={chatHistories[activeChat.id] || []} /></main>
        <footer className="footer-controls"><AudioRecorder onSend={handleNewAudio} /></footer>
      </div>

      <div className="right-panel">
        <ProfileCard
          nickname={userName} stats={stats} avatar={avatar}
          onUpdateAvatar={(av) => socketRef.current.emit('update-profile', { avatar: av })}
        />
      </div>

      {searchedUser && (
        <ProfileModal
          user={searchedUser}
          onClose={() => setSearchedUser(null)}
          onSendRequest={(n) => {
            socketRef.current.emit('send-friend-request', n);
            setSentRequests(prev => [...new Set([...prev, n])]);
            setSearchedUser(prev => ({ ...prev, isSent: true }));
          }}
        />
      )}
    </div>
  );
}

export default App;
