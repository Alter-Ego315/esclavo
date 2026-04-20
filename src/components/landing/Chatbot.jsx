import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! Soy el Minion de Alter Ego. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(true);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'es-ES';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('La tecnología de dictado por voz no es compatible con tu navegador. Te recomendamos usar Chrome.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (error) {
            console.error('Error with API:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, he tenido un pequeño problema con mi conexión. ¿Puedes repetirlo?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const resetConversation = () => {
        setMessages([{ role: 'assistant', content: '¡Hola! Soy el Minion de Alter Ego. ¿En qué puedo ayudarte hoy?' }]);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHasNewMessage(false);
        }
    };

    return (
        <div className="chatbot-wrapper">
            {/* Notification Bubble */}
            {!isOpen && (
                <button className="chat-toggle-btn" onClick={toggleChat}>
                    {hasNewMessage && <span className="notification-dot"></span>}
                    <div className="toggle-icon">
                        <img src="/chatbot-logo-new.png" alt="Chat" className="toggle-img" />
                    </div>
                </button>
            )}

            {isOpen && (
                <div className="chat-window animate-slide-up">
                    <div className="chat-header">
                        <div className="header-info-wrapper">
                            <img src="/chatbot-logo-new.png" alt="Logo" className="header-logo-img" />
                            <div className="header-info">
                                <h3>Minion de Alter Ego</h3>
                                <p>¡Integra un chatbot como este en tu web!</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="reset-btn" onClick={resetConversation} title="Reiniciar conversación">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 4v6h-6"></path>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                            </button>
                            <button className="close-btn" onClick={toggleChat}>
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="chat-messages" ref={chatContainerRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-bubble">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant">
                                <div className="message-bubble loading">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSendMessage}>
                        <button
                            type="button"
                            className={`voice-btn ${isListening ? 'listening' : ''}`}
                            onClick={toggleListening}
                            title={isListening ? "Escuchando..." : "Dictar por voz"}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Escuchando..." : "¡Pruébalo!"}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>

                    <div className="chat-footer">
                        <img src="/logoalterego2.png" alt="Logo" className="footer-logo" />
                        <span>desarrollado por nosotros</span>
                    </div>
                </div>
            )}

            <style jsx>{`
                .chatbot-wrapper {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 1000;
                    font-family: 'Inter', sans-serif;
                }

                .chat-toggle-btn {
                    width: 65px;
                    height: 65px;
                    border-radius: 50%;
                    background: #fff;
                    border: none;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    position: relative;
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .chat-toggle-btn:hover {
                    transform: scale(1.1);
                }

                .toggle-img {
                    width: 35px;
                    height: 35px;
                    object-fit: contain;
                }

                .notification-dot {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    width: 15px;
                    height: 15px;
                    background: #ff4444;
                    border: 2px solid white;
                    border-radius: 50%;
                    animation: pulse-red 2s infinite;
                }

                @keyframes pulse-red {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 68, 68, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
                }

                .chat-window {
                    width: 380px;
                    max-height: 600px;
                    height: 80vh;
                    background: #1a1a1a;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .animate-slide-up {
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .chat-header {
                    background: var(--primary-color, #6BCC0B);
                    padding: 1rem 1.5rem;
                    color: #000;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-info-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .header-logo-img {
                    width: 32px;
                    height: 32px;
                    object-fit: contain;
                    border-radius: 6px;
                }

                .header-info h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 700;
                }

                .header-info p {
                    margin: 0.2rem 0 0;
                    font-size: 0.8rem;
                    opacity: 0.8;
                }

                .header-actions {
                    display: flex;
                    gap: 0.8rem;
                }

                .header-actions button {
                    background: rgba(0, 0, 0, 0.1);
                    border: none;
                    cursor: pointer;
                    padding: 0.4rem;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                .header-actions button:hover {
                    background: rgba(0, 0, 0, 0.2);
                }

                .chat-messages {
                    flex: 1;
                    padding: 1rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .message {
                    max-width: 85%;
                    display: flex;
                }

                .message.user {
                    align-self: flex-end;
                }

                .message.assistant {
                    align-self: flex-start;
                }

                .message-bubble {
                    padding: 0.8rem 1rem;
                    border-radius: 15px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    white-space: pre-wrap;
                }

                .user .message-bubble {
                    background: var(--primary-color, #6BCC0B);
                    color: #000;
                    border-bottom-right-radius: 2px;
                }

                .assistant .message-bubble {
                    background: #2d2d2d;
                    color: #fff;
                    border-bottom-left-radius: 2px;
                }

                .loading .dot {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    background: #888;
                    border-radius: 50%;
                    margin-right: 3px;
                    animation: bounce 1.4s infinite ease-in-out both;
                }

                .loading .dot:nth-child(1) { animation-delay: -0.32s; }
                .loading .dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }

                .chat-input-area {
                    padding: 1rem;
                    background: #252525;
                    display: flex;
                    gap: 0.5rem;
                }

                .chat-input-area input {
                    flex: 1;
                    background: #1a1a1a;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 0.8rem 1rem;
                    color: #fff;
                    outline: none;
                }

                .chat-input-area button {
                    background: var(--primary-color, #6BCC0B);
                    border: none;
                    border-radius: 10px;
                    padding: 0 1rem;
                    cursor: pointer;
                    color: #000;
                    transition: opacity 0.2s;
                }

                .chat-input-area button.voice-btn {
                    padding: 0 0.8rem;
                    background: transparent;
                    color: #888;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .chat-input-area button.voice-btn.listening {
                    color: #ff4444;
                    border-color: #ff4444;
                    animation: pulse-red 2s infinite;
                }

                .chat-input-area button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .chat-footer {
                    padding: 0.8rem;
                    background: #1a1a1a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .footer-logo {
                    height: 25px;
                }

                .chat-footer span {
                    font-size: 0.7rem;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                @media (max-width: 480px) {
                    .chat-window {
                        width: calc(100vw - 2rem);
                        right: 1rem;
                        bottom: 5rem;
                    }
                    .chatbot-wrapper {
                        right: 1rem;
                        bottom: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
