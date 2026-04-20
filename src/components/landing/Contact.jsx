import React from 'react';

const Contact = ({ openPrivacy, contactMessage }) => {
    const [status, setStatus] = React.useState('');
    const formRef = React.useRef(null);

    React.useEffect(() => {
        if (contactMessage && formRef.current) {
            const textarea = formRef.current.querySelector('textarea[name="message"]');
            if (textarea) {
                textarea.value = contactMessage;
            }
        }
    }, [contactMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        setStatus('sending');

        try {
            const response = await fetch('https://formspree.io/f/mgvgzznb', {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setStatus('success');
                form.reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="section contact">
            <div className="container">
                <h2 className="section-title">Hablemos</h2>
                <div className="contact-intro">
                    <p>¿Tienes un problema repetitivo? ¿Quieres probar la IA en tu negocio? Escríbenos.</p>
                </div>

                {status === 'success' ? (
                    <div className="alert success">
                        <p>¡Gracias! Hemos recibido tu mensaje. Te contestaremos pronto.</p>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
                        <div className="form-group">
                            <input type="text" name="name" placeholder="Tu nombre" required />
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" placeholder="Tu email" required />
                        </div>
                        <div className="form-group">
                            <textarea name="message" placeholder="¿En qué podemos ayudarte?" rows="5" required></textarea>
                        </div>
                        <div className="form-group checkbox-group">
                            <input type="checkbox" id="privacy" required />
                            <label htmlFor="privacy">Acepto la <a href="#" onClick={openPrivacy}>política de privacidad</a></label>
                        </div>
                        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
                        </button>
                        {status === 'error' && <p className="error-msg">Hubo un error al enviar. Por favor, inténtalo de nuevo.</p>}
                    </form>
                )}
            </div>
            <style jsx>{`
                .alert.success {
                    background: rgba(0, 255, 0, 0.1);
                    border: 1px solid #00ff00;
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: center;
                    color: #00ff00;
                }
                .error-msg {
                    color: #ff4444;
                    margin-top: 1rem;
                    text-align: center;
                }
                button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `}</style>
        </section>
    );
};

export default Contact;
