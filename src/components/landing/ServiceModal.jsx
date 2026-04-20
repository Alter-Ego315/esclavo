import React from 'react';
import { createPortal } from 'react-dom';

const ServiceModal = ({ isOpen, onClose, service }) => {
    if (!isOpen || !service) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>{service.modalTitle || `¿Qué es ${service.title}?`}</h2>

                <div className="modal-body">
                    {/* Replaced description with shortDefinition */}
                    <p className="service-definition">{service.shortDefinition}</p>

                    <h3>Beneficios para ti:</h3>
                    <ul className="benefits-list">
                        {service.benefits && service.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>

                    {service.details && (
                        <>
                            <h3>Más información:</h3>
                            <p>{service.details}</p>
                        </>
                    )}
                </div>
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    background: #1a1a1a;
                    padding: 2rem;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    border: 1px solid #333;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    color: #e0e0e0;
                }
                .modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                .modal-close:hover {
                    color: #fff;
                }

                @media (max-width: 768px) {
                    .modal-content {
                        padding: 1.5rem;
                        width: 95%;
                        font-size: 0.95rem;
                    }
                    .modal-close {
                        top: 0.5rem;
                        right: 0.5rem;
                        font-size: 2rem;
                        padding: 0.2rem 0.8rem;
                        line-height: 1;
                    }
                    .service-definition {
                        font-size: 1rem;
                        margin-bottom: 1rem;
                    }
                }
                .modal-body {
                    margin-top: 1.5rem;
                    line-height: 1.6;
                }
                .service-definition {
                    font-size: 1.1em;
                    margin-bottom: 1.5rem;
                    color: #fff;
                    font-weight: 500;
                    border-left: 3px solid #3b82f6; /* Added accent border */
                    padding-left: 1rem;
                }
                .modal-body h3 {
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: #3b82f6; /* Blue highlight */
                }
                .benefits-list {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                .benefits-list li {
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default ServiceModal;
