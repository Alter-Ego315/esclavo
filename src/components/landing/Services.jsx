import React, { useState } from 'react';
import ServiceModal from './ServiceModal';
import minionIcon from '../../assets/icono_chatbot_ia.png';
import ironmanIcon from '../../assets/icono_automatizacion_procesos.png';
import genieIcon from '../../assets/icono_generacion_contenido.png';
import spidermanIcon from '../../assets/icono_diseno_web.png';
import yodaIcon from '../../assets/icono_consultoria_ia.png';

// Button Images
import bananaNormal from '../../assets/boton_chatbot_ia_atencion_cliente_normal.png';
import bananaHover from '../../assets/boton_chatbot_ia_atencion_cliente_hover.png';
import ironhandNormal from '../../assets/boton_automatizacion_rpa_empresarial_normal.png';
import ironhandHover from '../../assets/boton_automatizacion_rpa_empresarial_hover.png';
import lampNormal from '../../assets/boton_ia_generativa_contenido_normal.png';
import lampHover from '../../assets/boton_ia_generativa_contenido_hover.png';
import spideyhandNormal from '../../assets/boton_diseno_web_landing_page_normal.png';
import spideyhandHover from '../../assets/boton_diseno_web_landing_page_hover.png';
import saberNormal from '../../assets/boton_consultoria_auditoria_ia_normal.png';
import saberHover from '../../assets/boton_consultoria_auditoria_ia_hover.png';

const servicesData = {
    minion: {
        title: "Minions",
        technicalTitle: "Chatbots de atención al cliente con IA",
        modalTitle: "¿Qué son los minions?",
        altText: "Icono representando automatización de procesos de negocio",
        description: "Deja que tus minions trabajen sin descanso por ti (y sin pedir bananas).",
        shortDefinition: "Chatbots de IA entrenados para realizar tareas repetitivas y específicas 24/7.",
        benefits: [
            "Ahorra horas en tareas repetitivas",
            "Elimina errores humanos por cansancio",
            "Funciona 24/7 sin descanso",
            "Escalable: añade más minions cuando quieras"
        ],
        details: "Nuestros 'minions' son bots de automatización diseñados para realizar tareas específicas y repetitivas como entrada de datos, scraping web, clasificación de archivos o respuestas automáticas. Tú defines la tarea, ellos la ejecutan incansablemente.",
        message: "¡Quiero minions! Necesito un agente que me ayude con las siguientes tareas:"
    },
    jarvis: {
        title: "Protocolo J.A.R.V.I.S.",
        technicalTitle: "Automatización de procesos y tareas repetitivas",
        modalTitle: "¿Qué es el protocolo J.A.R.V.I.S.?",
        altText: "Interfaz de Chatbot de atención al cliente con IA",
        description: "Automatiza tu imperio. Haz que la tecnología haga el trabajo pesado mientras tú salvas el mundo.",
        shortDefinition: "Sistema integral de automatización y gestión para el control total de tu empresa.",
        benefits: [
            "Control centralizado de tu negocio",
            "Toma de decisiones basada en datos reales",
            "Integración de múltiples herramientas en un dashboard",
            "Alertas inteligentes y monitoreo proactivo"
        ],
        details: "El Protocolo J.A.R.V.I.S. es nuestra solución de gestión empresarial avanzada. Integramos tus sistemas (CRM, ERP, Marketing) para que funcionen como un solo organismo, ofreciéndote control y visibilidad total.",
        message: "Protocolo J.A.R.V.I.S activado. Necesito control total y gestión de mi negocio en estos aspectos:"
    },
    genie: {
        title: "El genio",
        technicalTitle: "Generación de contenido y copywriting con IA",
        modalTitle: "¿Qué es El genio?",
        altText: "Lámpara mágica representando generación de contenido con IA",
        description: "Frota la lámpara y aparecerá contenido mágico: vídeo, texto, imágenes, ...",
        shortDefinition: "Generador automático de contenido multimedia (texto, imagen, vídeo) bajo demanda.",
        benefits: [
            "Contenido ilimitado y creativo",
            "Reducción drástica de costes de producción",
            "Consistencia de marca en todos los canales",
            "Generación multiformato (texto, imagen, video)"
        ],
        details: "¿Necesitas posts para redes sociales, artículos para tu blog o imágenes para tus anuncios? El genio de la IA crea contenido de alta calidad a velocidad luz, liberando a tu equipo creativo para la estrategia.",
        message: "Froto la lámpara. Necesito contenido mágico y creativo para:"
    },
    web: {
        title: "La red (The web)",
        technicalTitle: "Diseño web ágil y landing pages",
        modalTitle: "¿Qué es La red?",
        altText: "Mano de Spiderman lanzando red web representando diseño web ágil",
        description: "Tu amigable web vecina. Rápida, ágil y con sentido arácnido para atrapar clientes.",
        shortDefinition: "Diseño y desarrollo de sitios web ultrarrápidos y optimizados para la conversión.",
        benefits: [
            "Velocidad de carga ultrarrápida",
            "Optimización SEO para aparecer primero",
            "Diseño que convierte visitantes en clientes",
            "Experiencia de usuario fluida en móvil y PC"
        ],
        details: "No tejemos telarañas viejas. Creamos sitios web modernos, reactivos y optimizados. Tu presencia digital será ágil y pegadiza, asegurando que ningún cliente potencial se escape.",
        message: "Sentido arácnido. Necesito una web rápida que atrape clientes. Mi idea es:"
    },
    yoda: {
        title: "Consejo Jedi",
        technicalTitle: "Consultoría estratégica de inteligencia artificial",
        modalTitle: "¿Qué es el Consejo Jedi?",
        altText: "Icono de Yoda representando consultoría estratégica de IA",
        description: "En los caminos de la IA guiarte podemos. Dominar la tecnología aprenderás, y el futuro de tu negocio, brillante será.",
        shortDefinition: "Consultoría estratégica y formación para la implementación de IA en tu negocio.",
        benefits: [
            "Estrategia clara de adopción de IA",
            "Formación para tu equipo",
            "Análisis de ROI y viabilidad",
            "Hoja de ruta personalizada hacia el futuro"
        ],
        details: "La tecnología puede ser abrumadora. El Consejo Jedi te ofrece consultoría estratégica para implementar Inteligencia Artificial en tu empresa con sabiduría y visión a largo plazo.",
        message: "Consejo Jedi busco. Necesito guía y estrategia en IA para:"
    }
};

const Services = ({ setContactMessage }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (serviceKey) => {
        setSelectedService(servicesData[serviceKey]);
        setIsModalOpen(true);
    };

    const handleServiceSelect = (serviceKey) => {
        const message = servicesData[serviceKey].message;
        setContactMessage(message);

        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    return (
        <section id="services" className="section services">
            <div className="container">
                <h2 className="section-title">El T.E.A.M.</h2>
                <div className="section-subtitle">(<span className="sc-highlight">T</span>ecnología · <span className="sc-highlight">E</span>ficiencia · <span className="sc-highlight">A</span>utomatización · <span className="sc-highlight">M</span>agia)</div>
                <p className="click-msg">Haz click en una tarjeta para saber más</p>

                <div className="services-grid">
                    <div className="service-card" onClick={() => handleCardClick('minion')} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        <img src={minionIcon} alt={servicesData.minion.altText} className="service-icon" />
                        <h2>Minions</h2>
                        <p className="technical-subtitle">{servicesData.minion.technicalTitle}</p>
                        <p>Deja que tus minions trabajen sin descanso por ti (y sin pedir bananas).</p>
                    </div>
                    <div className="service-card" onClick={() => handleCardClick('jarvis')} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        <img src={ironmanIcon} alt={servicesData.jarvis.altText} className="service-icon" />
                        <h2>Protocolo J.A.R.V.I.S.</h2>
                        <p className="technical-subtitle">{servicesData.jarvis.technicalTitle}</p>
                        <p>Automatiza tu imperio. Haz que la tecnología haga el trabajo pesado.</p>
                    </div>
                    <div className="service-card" onClick={() => handleCardClick('genie')} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        <img src={genieIcon} alt={servicesData.genie.altText} className="service-icon" />
                        <h2>El genio</h2>
                        <p className="technical-subtitle">{servicesData.genie.technicalTitle}</p>
                        <p>Frota la lámpara y aparecerá contenido mágico: vídeo, texto, imágenes...</p>
                    </div>
                    <div className="service-card" onClick={() => handleCardClick('web')} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        <img src={spidermanIcon} alt={servicesData.web.altText} className="service-icon" />
                        <h2>La red (The web)</h2>
                        <p className="technical-subtitle">{servicesData.web.technicalTitle}</p>
                        <p>Tu amigable web vecina. Rápida, ágil y con sentido arácnido para atrapar clientes.</p>
                    </div>
                    <div className="service-card" onClick={() => handleCardClick('yoda')} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        <img src={yodaIcon} alt={servicesData.yoda.altText} className="service-icon" />
                        <h2>Consejo Jedi</h2>
                        <p className="technical-subtitle">{servicesData.yoda.technicalTitle}</p>
                        <p>En los caminos de la IA guiarte podemos. El futuro brillante será.</p>
                    </div>
                </div>

                <div className="service-selection">
                    <h3 className="selection-title">¿Qué servicio quieres?</h3>
                    <div className="selection-buttons">
                        <div className="selection-item" onClick={() => handleServiceSelect('minion')}>
                            <div className="custom-button-container static">
                                <img src={bananaNormal} className="btn-img normal" alt="Minions" />
                                <img src={bananaHover} className="btn-img hover" alt="Minions Hover" />
                            </div>
                            <span>Minions</span>
                        </div>
                        <div className="selection-item" onClick={() => handleServiceSelect('jarvis')}>
                            <div className="custom-button-container static">
                                <img src={ironhandNormal} className="btn-img normal" alt="Jarvis" />
                                <img src={ironhandHover} className="btn-img hover" alt="Jarvis Hover" />
                            </div>
                            <span>J.A.R.V.I.S.</span>
                        </div>
                        <div className="selection-item" onClick={() => handleServiceSelect('genie')}>
                            <div className="custom-button-container static">
                                <img src={lampNormal} className="btn-img normal" alt="Genie" />
                                <img src={lampHover} className="btn-img hover" alt="Genie Hover" />
                            </div>
                            <span>El genio</span>
                        </div>
                        <div className="selection-item" onClick={() => handleServiceSelect('web')}>
                            <div className="custom-button-container static">
                                <img src={spideyhandNormal} className="btn-img normal" alt="Web" />
                                <img src={spideyhandHover} className="btn-img hover" alt="Web Hover" />
                            </div>
                            <span>La red</span>
                        </div>
                        <div className="selection-item" onClick={() => handleServiceSelect('yoda')}>
                            <div className="custom-button-container static">
                                <img src={saberNormal} className="btn-img normal" alt="Yoda" />
                                <img src={saberHover} className="btn-img hover" alt="Yoda Hover" />
                            </div>
                            <span>Consejo Jedi</span>
                        </div>
                    </div>
                </div>
            </div>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={selectedService}
            />

            <style jsx>{`
                .click-msg {
                    text-align: center;
                    color: #888;
                    margin-bottom: 2rem;
                    font-style: italic;
                }
                .service-selection {
                    margin-top: 4rem;
                    text-align: center;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .selection-title {
                    font-size: 2rem;
                    margin-bottom: 2rem;
                    color: var(--primary-color);
                }
                .selection-buttons {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 2rem;
                }
                .selection-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .selection-item:hover {
                    transform: translateY(-5px);
                }
                .selection-item span {
                    color: #aeaeae;
                    font-weight: 500;
                }
                .selection-item:hover span {
                    color: var(--primary-color);
                }
                .service-card {
                     display: flex;
                     flex-direction: column;
                     align-items: center;
                     height: 100%;
                     padding-bottom: 1rem !important; /* Force closer to bottom */
                }
                .service-card .service-icon {
                     margin-bottom: 1rem;
                }
                .technical-subtitle {
                    font-size: 0.9rem; 
                    color: #cbd5e1; /* Slate-300 - Visible but subtitle */
                    margin-bottom: 0.8rem;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    min-height: 2.7rem; /* Reserve space for 2 lines */
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                }
                .service-card h2 {
                    font-size: 1.8rem;
                    margin-bottom: 0.2rem;
                    color: var(--primary-color);
                    font-weight: 700;
                    min-height: 4.4rem; /* Reserve space for 2 lines */
                    display: flex;
                    align-items: center; /* Center vertically if 1 line */
                    justify-content: center;
                    line-height: 1.2;
                }
                .service-card p:last-child {
                    /* Description aligned to bottom */
                    margin-top: auto;
                    color: #94a3b8; /* Slate-400 */
                    font-size: 0.85rem;
                    line-height: 1.4;
                    font-weight: 400;
                    margin-bottom: 0; /* Remove default margin */
                    min-height: 5rem; /* Reserve space for ~4 lines so all cards are equal height */
                    display: flex;
                    align-items: flex-end; /* Text sits at the bottom of its box */
                    justify-content: center;
                }
                .custom-button-container.static {
                    position: relative;
                    width: 80px; /* Adjust size as needed */
                    height: 80px;
                    display: block;
                    margin: 0 auto;
                }
            `}</style>
        </section>
    );
};

export default Services;
