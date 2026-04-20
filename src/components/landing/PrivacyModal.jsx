import React from 'react';

const PrivacyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>Política de Privacidad</h2>
                <div className="modal-body">
                    <p><strong>Última actualización: 05/12/2025</strong></p>

                    <h3>¿Quién es el responsable del tratamiento de tus datos?</h3>
                    <p>Javier Sánchez del Campo Aguilera es el titular de la web. Al acceder a esta web, pasas a tener la condición de usuario. Todos los datos que se recopilen del usuario a través del uso de la web y de los formularios, serán tratados de acuerdo con la legislación aplicable.</p>

                    <h3>¿Cómo contactar?</h3>
                    <p>A través del email: <a href="mailto:javier.sanchezdelcampoa@gmail.com">javier.sanchezdelcampoa@gmail.com</a>.</p>

                    <h3>¿Con qué finalidad tratamos tus datos personales?</h3>
                    <p>Javier Sánchez del Campo Aguilera recogerá datos personales de cualquier formulario de contacto de la página web. Trataremos los datos que se faciliten con los siguientes fines:</p>
                    <ul>
                        <li>Dar respuesta a las cuestiones por las cuales contactes con nosotros.</li>
                        <li>Si son datos comerciales, podemos recopilarlos para un uso comercial posterior, cumpliendo con los derechos del usuario que haya dado su consentimiento.</li>
                        <li>Extraer información analítica o estadística que ayude a mejorar los contenidos de la página web y entender tu comportamiento (mediante herramientas como Vercel Analytics).</li>
                    </ul>
                    <p>Asimismo, pidiendo tu consentimiento de forma previa a que se recojan los datos, los trataremos con los siguientes fines:</p>
                    <ul>
                        <li>Elaborar un perfil comercial, en base a la información facilitada.</li>
                        <li>Conocer hábitos generales de la navegación.</li>
                    </ul>

                    <h3>¿Cuánto tiempo conservaremos tus datos?</h3>
                    <p>Los datos personales proporcionados se conservarán mientras dure la relación mercantil o hasta que el usuario solicite su eliminación. En el caso de que alguna legislación obligue a su tenencia durante más tiempo, se conservarán por el tiempo mínimo legal obligatorio.</p>

                    <h3>¿Cuál es la legitimación para el tratamiento de sus datos?</h3>
                    <p>La base legal para el tratamiento de tus datos personales es el consentimiento otorgado en el momento de recabar tus datos, en los formularios y en la confirmación del email que recibes cuando te das de alta.</p>

                    <h3>¿A qué destinatarios se comunicarán tus datos?</h3>
                    <p>Sus datos no serán transmitidos a terceros, salvo en el caso de ser imprescindibles para la prestación del servicio. Para el desarrollo de la actividad de Alter Ego y la prestación de los servicios de IA y automatización, tus datos podrán ser comunicados a las siguientes categorías de encargados de tratamiento:</p>
                    <ul>
                        <li><strong>Proveedores de Hosting y Analytics (Vercel):</strong> Para el alojamiento de la web y la medición del rendimiento.</li>
                        <li><strong>Plataformas de Automatización (Make, Antigravity):</strong> Para la ejecución de los flujos de trabajo de automatización internos y de clientes.</li>
                        <li><strong>Proveedores de Modelos de Lenguaje (OpenAI, Anthropic/Claude):</strong> Para el procesamiento de datos y la generación de respuestas en el contexto de la ejecución de los servicios (ej. Chatbots, Asistentes Internos).</li>
                        <li>Asesorías, proveedores de servicios informáticos o de internet.</li>
                        <li>Cuerpos y fuerzas del estado u otra autoridad administrativa o legal.</li>
                    </ul>
                    <p>Alter Ego trabajará para que cualquier proveedor autorizado opere con absoluta confidencialidad en el tratamiento de datos personales y cumpla la normativa (mediante la firma de Acuerdos de Encargado de Tratamiento).</p>

                    <h3>¿Qué obligaciones tienes como usuario?</h3>
                    <p>El usuario tiene el deber de proporcionar los datos solicitados por Alter Ego de forma responsable. Esto implica que los datos que proporciones responden a tu verdadera identidad y que son actuales, completos y veraces.</p>

                    <h3>¿Cuáles son sus derechos cuando nos facilitas tus datos?</h3>
                    <p>Los usuarios tienen Derecho a solicitar acceso, rectificación, supresión, limitación del tratamiento, oposición al tratamiento y portabilidad de los datos. Todo ello en los términos establecidos en la normativa aplicable en cada momento.</p>

                    <h3>¿Cómo se van a proteger tus datos?</h3>
                    <p>Hemos establecido las medidas de seguridad necesarias para asegurar que tus datos personales no sean accedidos o comunicados a terceras partes, y que tus datos no sean objeto de ningún tipo de tratamiento no autorizado.</p>

                    <h3>¿Puede cambiar la política?</h3>
                    <p>Sí. En el caso de cambios menores, se comunicarán mediante actualización de esta página web.</p>

                    <h3>¿Cuál es la ley aplicable en el tratamiento de tus datos?</h3>
                    <p>Estas políticas de privacidad serán gobernadas por la normativa vigente española, así como por el Reglamento General de Protección de Datos.</p>
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
                .modal-body ul {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    );
};

export default PrivacyModal;
