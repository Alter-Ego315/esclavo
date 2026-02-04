const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8 // 100MB
});

// PERSISTENCE CONFIG
const DB_PATH = path.join(__dirname, 'database.json');

function loadDB() {
    if (fs.existsSync(DB_PATH)) {
        try {
            const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
            return {
                accounts: new Map(Object.entries(data.accounts || {})),
                friendships: new Map(Object.entries(data.friendships || {}).map(([k, v]) => [k, new Set(v)])),
                pendingRequests: new Map(Object.entries(data.pendingRequests || {}).map(([k, v]) => [k, new Set(v)])),
                sentRequests: new Map(Object.entries(data.sentRequests || {}).map(([k, v]) => [k, new Set(v)]))
            };
        } catch (e) {
            console.error('Error loading DB:', e);
        }
    }
    return { accounts: new Map(), friendships: new Map(), pendingRequests: new Map(), sentRequests: new Map() };
}

function saveDB() {
    const data = {
        accounts: Object.fromEntries(accounts),
        friendships: Object.fromEntries(Array.from(friendships.entries()).map(([k, v]) => [k, Array.from(v)])),
        pendingRequests: Object.fromEntries(Array.from(pendingRequests.entries()).map(([k, v]) => [k, Array.from(v)])),
        sentRequests: Object.fromEntries(Array.from(sentRequests.entries()).map(([k, v]) => [k, Array.from(v)]))
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const { accounts, friendships, pendingRequests, sentRequests } = loadDB();
const activeSessions = new Map(); // socketId -> nickname

io.on('connection', (socket) => {
    console.log('--- Socket Connected:', socket.id);

    socket.on('register', ({ nickname, password }) => {
        if (!nickname || !password) {
            socket.emit('auth-error', 'Username and password required.');
            return;
        }
        if (accounts.has(nickname)) {
            socket.emit('auth-error', 'Nickname already exists.');
            return;
        }

        accounts.set(nickname, {
            password,
            stats: { totalTime: 0, count: 0 },
            avatar: null
        });
        friendships.set(nickname, new Set());
        pendingRequests.set(nickname, new Set());
        sentRequests.set(nickname, new Set());

        saveDB();
        console.log(`[AUTH] Registered: ${nickname}`);
        socket.emit('auth-message', 'Registration successful.');
    });

    socket.on('login', ({ nickname, password }) => {
        const account = accounts.get(nickname);
        if (!account || account.password !== password) {
            socket.emit('auth-error', 'Invalid credentials.');
            return;
        }

        socket.data.nickname = nickname;
        activeSessions.set(socket.id, nickname);
        socket.join(`user:${nickname}`);

        socket.emit('join-success', {
            nickname,
            stats: account.stats,
            avatar: account.avatar,
            friends: Array.from(friendships.get(nickname) || []),
            pendingRequests: Array.from(pendingRequests.get(nickname) || []),
            sentRequests: Array.from(sentRequests.get(nickname) || [])
        });

        const onlineNicknames = Array.from(new Set(activeSessions.values()));
        io.emit('user-list', onlineNicknames);
    });

    socket.on('update-profile', ({ avatar }) => {
        const nick = socket.data.nickname;
        if (!nick) return;
        const account = accounts.get(nick);
        if (account) {
            account.avatar = avatar;
            saveDB();
            socket.emit('profile-updated', { avatar });
        }
    });

    socket.on('search-user', (targetNickname) => {
        const account = accounts.get(targetNickname);
        if (!account) {
            socket.emit('search-result', { error: 'User not found' });
            return;
        }
        socket.emit('search-result', {
            nickname: targetNickname,
            stats: account.stats,
            avatar: account.avatar,
            isFriend: friendships.get(socket.data.nickname)?.has(targetNickname) || false,
            isSent: sentRequests.get(socket.data.nickname)?.has(targetNickname) || false
        });
    });

    socket.on('send-friend-request', (targetNickname) => {
        const sender = socket.data.nickname;
        if (!sender || sender === targetNickname) return;
        if (!accounts.has(targetNickname)) return;

        if (!pendingRequests.has(targetNickname)) pendingRequests.set(targetNickname, new Set());
        pendingRequests.get(targetNickname).add(sender);

        if (!sentRequests.has(sender)) sentRequests.set(sender, new Set());
        sentRequests.get(sender).add(targetNickname);

        saveDB();
        io.to(`user:${targetNickname}`).emit('new-friend-request', sender);
    });

    socket.on('accept-friend-request', (senderNickname) => {
        const recipient = socket.data.nickname;
        if (!recipient) return;

        if (pendingRequests.get(recipient)?.has(senderNickname)) {
            pendingRequests.get(recipient).delete(senderNickname);
            sentRequests.get(senderNickname)?.delete(recipient);

            if (!friendships.has(recipient)) friendships.set(recipient, new Set());
            friendships.get(recipient).add(senderNickname);

            if (!friendships.has(senderNickname)) friendships.set(senderNickname, new Set());
            friendships.get(senderNickname).add(recipient);

            saveDB();
            io.to(`user:${recipient}`).emit('friend-update', Array.from(friendships.get(recipient)));
            io.to(`user:${senderNickname}`).emit('friend-update', Array.from(friendships.get(senderNickname)));
        }
    });

    socket.on('send-audio', (data) => {
        const sender = socket.data.nickname;
        if (!sender) return;

        if (!data.isGroup && !friendships.get(sender)?.has(data.target)) return;

        const account = accounts.get(sender);
        if (account) {
            account.stats.totalTime += data.duration || 0;
            account.stats.count += 1;
            saveDB();
            socket.emit('update-stats', account.stats);
        }

        const payload = {
            id: Date.now(),
            sender,
            timestamp: new Date().toLocaleTimeString(),
            audioBlob: data.blob,
            duration: data.duration,
            isGroup: data.isGroup,
            target: data.target
        };

        if (data.isGroup) {
            socket.to(data.target).emit('receive-audio', payload);
        } else {
            io.to(`user:${data.target}`).emit('receive-audio', payload);
        }
    });

    socket.on('disconnect', () => {
        activeSessions.delete(socket.id);
        const onlineNicknames = Array.from(new Set(activeSessions.values()));
        io.emit('user-list', onlineNicknames);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Alter Ego Phase 9 Persistence Server running on http://localhost:${PORT}`);
});
