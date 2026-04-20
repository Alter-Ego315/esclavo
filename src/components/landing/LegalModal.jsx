import React from 'react';

const LegalModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>Aviso Legal</h2>
                <div className="modal-body">
                    <p><strong>Última actualización: 31/12/2025</strong></p>

                    <h3>1. Información General</h3>
                    <p>En cumplimiento con el deber de información dispuesto en la Ley 34/2002 de Servicios de la Sociedad de la Información y el Comercio Electrónico (LSSI-CE), se facilitan a continuación los siguientes datos de información general de este sitio web:</p>
                    <p>La titularidad de este sitio web, https://ialter-ego.vercel.app, (en adelante, Sitio Web) la ostenta: Javier Sánchez del Campo Aguilera, con domicilio a efectos de notificaciones en Madrid, España, y correo electrónico de contacto: <a href="mailto:javier.sanchezdelcampoa@gmail.com">javier.sanchezdelcampoa@gmail.com</a>.</p>

                    <h3>2. Términos y Condiciones de Uso</h3>
                    <p>El objeto de las presentes Condiciones Generales de Uso es regular el acceso y la utilización del Sitio Web. El acceso al Sitio Web atribuye la condición de Usuario, que acepta, desde dicho acceso, las Condiciones Generales de Uso aquí reflejadas.</p>
                    <p>Alter Ego se reserva el derecho de modificar, en cualquier momento y sin previo aviso, la presentación y configuración del Sitio Web y de los Contenidos y Servicios que en él pudieran estar incorporados.</p>

                    <h3>3. Propiedad Intelectual e Industrial</h3>
                    <p>Javier Sánchez del Campo Aguilera por sí o como parte cesionaria, es titular de todos los derechos de propiedad intelectual e industrial del Sitio Web, así como de los elementos contenidos en el mismo (a título enunciativo y no limitativo: imágenes, sonido, audio, vídeo, software o textos, marcas o logotipos, combinaciones de colores, estructura y diseño, etc.).</p>
                    <p>Todos los derechos reservados. En virtud de lo dispuesto en la Ley de Propiedad Intelectual, quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de Alter Ego.</p>

                    <h3>4. Exclusión de Responsabilidad</h3>
                    <p>Alter Ego no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del Sitio Web o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.</p>

                    <h3>5. Enlaces</h3>
                    <p>En el caso de que en el Sitio Web se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, Alter Ego no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún caso Alter Ego asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno.</p>

                    <h3>6. Legislación Aplicable y Jurisdicción</h3>
                    <p>La relación entre Alter Ego y el Usuario se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Madrid.</p>
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
                    z-index: 1000;
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
                .modal-body {
                    margin-top: 1.5rem;
                    line-height: 1.6;
                }
                .modal-body h3 {
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: #fff;
                }
                .modal-body a {
                    color: var(--primary-color, #3b82f6);
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default LegalModal;
