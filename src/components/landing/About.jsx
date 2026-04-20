import React from 'react';

const About = () => {
    return (
        <section id="about" className="section about">
            <div className="container">
                <h2 className="section-title">Quiénes somos</h2>
                <div className="about-grid">
                    <div className="about-text">
                        <p>Mira, podría decirle a ChatGPT que me genere un texto fabuloso diciendo que somos líderes mundiales en IA, pero <strong>prefiero serte sincero</strong>.</p>

                        <p>Somos dos estudiantes de primero de carrera. Comparados con las grandes consultoras, no somos nadie, pero <strong>tenemos cosas que los peces gordos no tienen</strong>:</p>

                        <p>Somos <strong>nativos digitales</strong>, con conocimientos profundos en Inteligencia Artificial y automatización</p>

                        <p>Somos <strong>ágiles</strong>, no como las grandes consultoras que tardan meses en dar resultados</p>

                        <p>Nuestro enfoque es diferente: <strong>detectamos dónde te duele, implementamos la solución y te la enseñamos en días</strong>. Te lo repito: <strong>dí-as</strong>. Buena suerte encontrando a alguien que no tarde como mínimo un mes.</p>

                        <p>Si buscas un desarrollo brutal que nos vaya a llevar 6 meses, búscate a otro. poque no tenemos tiempo para corbatas y reuniones con socios.<br />
                            En cambio, si quieres resultados, ahora mismo te ofrecemos un <strong>descuento del 50%</strong> por ser de nuestros primeros clientes, así que aprovecha ahora, que estos dos chavales tienen algo que te interesa.</p>
                    </div>
                    <div className="about-stats">
                        <div className="stat-card">
                            <h3>+10</h3>
                            <p>Proyectos de automatización</p>
                        </div>
                        <div className="stat-card">
                            <h3>100%</h3>
                            <p>Enfoque práctico</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
