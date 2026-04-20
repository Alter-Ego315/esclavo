import React, { useState, useEffect } from 'react';

const CookieConsent = ({ showPreferences, setShowPreferences }) => {
    const [isVisible, setIsVisible] = useState(false);
    // showPreferences state is now managed by parent (App.jsx)

    // Default preferences: Necessary is always true and disabled
    const [preferences, setPreferences] = useState({
        necessary: true,
        performance: true,
        functional: true,
        targeting: true
    });

    useEffect(() => {
        const savedConsent = localStorage.getItem('cookieConsent');
        if (!savedConsent) {
            setIsVisible(true);
        }
    }, []);

    const handleAcceptAll = () => {
        const allEnabled = {
            necessary: true,
            performance: true,
            functional: true,
            targeting: true
        };
        savePreferences(allEnabled);
    };

    const handleRejectAll = () => {
        const allDisabled = {
            necessary: true,
            performance: false,
            functional: false,
            targeting: false
        };
        savePreferences(allDisabled);
    };

    const handleSavePreferences = () => {
        savePreferences(preferences);
    };

    const savePreferences = (prefs) => {
        localStorage.setItem('cookieConsent', JSON.stringify(prefs));
        setIsVisible(false);
        setShowPreferences(false);
        // Here you would typically trigger the actual scripts based on the prefs
        console.log("Consent saved:", prefs);
    };

    const togglePreference = (key) => {
        if (key === 'necessary') return; // Cannot toggle necessary
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    if (!isVisible && !showPreferences) return null;

    return (
        <>
            {/* Banner */}
            {isVisible && !showPreferences && (
                <div className="cookie-banner">
                    <div className="cookie-content">
                        <h3>Esta web usa cookies</h3>
                        <p>
                            Esta web usa cookies para asegurar que funciona correctamente y que tienes la mejor experiencia de navegación posible. Al aceptar, muestras tu acuerdo al uso de dichas cookies.
                        </p>
                    </div>
                    <div className="cookie-actions">
                        <button className="btn-cookie rejection" onClick={handleRejectAll}>Rechazar todas</button>
                        <button className="btn-cookie settings" onClick={() => setShowPreferences(true)}>Gestionar preferencias</button>
                        <button className="btn-cookie acceptance" onClick={handleAcceptAll}>Aceptar todas</button>
                    </div>
                </div>
            )}

            {/* Preferences Modal */}
            {showPreferences && (
                <div className="modal-overlay">
                    <div className="modal-content cookie-modal" onClick={e => e.stopPropagation()}>
                        <h2>Preferencias de cookies</h2>
                        <p className="modal-intro">
                            Cuando visitas cualquier sitio web, este puede almacenar o recuperar información en tu navegador, principalmente en forma de cookies.
                        </p>

                        <div className="cookie-group">
                            <div className="cookie-header">
                                <h4>Cookies necesarias</h4>
                                <span className="status-locked">Siempre activas</span>
                            </div>
                            <p>Las cookies necesarias son cruciales para el funcionamiento del sitio web y no pueden desactivarse en nuestros sistemas. Por lo general, solo se establecen en respuesta a acciones realizadas por ti que equivalen a una solicitud de servicios, como establecer tus preferencias de privacidad, iniciar sesión o rellenar formularios.</p>
                        </div>

                        <div className="cookie-group">
                            <div className="cookie-header">
                                <h4>Cookies de rendimiento</h4>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.performance}
                                        onChange={() => togglePreference('performance')}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <p>Las cookies de rendimiento nos permiten contar las visitas y las fuentes de tráfico para que podamos medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y las menos populares y a ver cómo se desplazan los visitantes por el sitio. Vercel Analytics se usa para este fin. Si no permites estas cookies, no sabremos cuándo has visitado nuestro sitio y no podremos analizar su rendimiento.</p>
                        </div>

                        <div className="cookie-group">
                            <div className="cookie-header">
                                <h4>Cookies funcionales</h4>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.functional}
                                        onChange={() => togglePreference('functional')}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <p>Las cookies funcionales permiten que el sitio web ofrezca una mayor funcionalidad y personalización. Podemos establecerlas nosotros o terceros proveedores cuyos servicios hemos añadido a nuestros sitios (como widgets de chat o herramientas de automatización de formularios). Si no permites estas cookies, es posible que algunos o todos estos servicios no funcionen correctamente.</p>
                        </div>

                        <div className="cookie-group">
                            <div className="cookie-header">
                                <h4>Cookies de segmentación</h4>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={preferences.targeting}
                                        onChange={() => togglePreference('targeting')}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <p>Las cookies de segmentación pueden ser establecidas a través de nuestro sitio web por nuestros socios publicitarios. Estas empresas pueden utilizarlas para crear un perfil de tus intereses y mostrarte anuncios relevantes en otros sitios. Ellas apoyan nuestras actividades de marketing y ayudan a medir su eficacia. Si no permites estas cookies, recibirás menos publicidad personalizada.</p>
                        </div>

                        <div className="cookie-modal-actions">
                            <button className="btn-cookie rejection" onClick={() => setShowPreferences(false)}>Cancelar</button>
                            <button className="btn-cookie acceptance" onClick={handleSavePreferences}>Guardar mis preferencias</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
