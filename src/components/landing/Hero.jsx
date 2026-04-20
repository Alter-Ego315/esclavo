import React, { useEffect, useRef } from 'react';

const Hero = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationFrameId;

        // Configuration
        const particleCount = 80;
        const connectionDistance = 150;
        const mouseDistance = 200;

        const resize = () => {
            if (canvas.parentElement) {
                width = canvas.width = canvas.parentElement.offsetWidth;
                height = canvas.height = canvas.parentElement.offsetHeight;
            }
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
                this.color = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2})`; // Blueish
            }

            update(mouseX, mouseY) {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouseX != null && mouseY != null) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;
                        const directionX = forceDirectionX * force * 2;
                        const directionY = forceDirectionY * force * 2;

                        this.x += directionX;
                        this.y += directionY;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        initParticles();

        let mouseX = null;
        let mouseY = null;

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouseX = null;
            mouseY = null;
        };

        // Attach event listeners to the parent element (header) to capture mouse even over text
        const header = canvas.parentElement;
        header.addEventListener('mousemove', handleMouseMove);
        header.addEventListener('mouseleave', handleMouseLeave);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(mouseX, mouseY);
                p.draw();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            header.removeEventListener('mousemove', handleMouseMove);
            header.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <header className="hero">
            <canvas ref={canvasRef} id="hero-canvas"></canvas>
            <div className="container hero-content">
                <h1>Soluciones de IA <br /> <span className="highlight">reales y prácticas</span></h1>
                <p className="seo-subtitle">Agencia de Automatización · Chatbots para Pymes · Consultoría de IA</p>
                <p>Automatización, chatbots y contenido inteligente para tu negocio. Sin humo, solo resultados.</p>
                <div className="hero-btns">
                    <a href="#contact" className="btn-primary">Empezar ahora</a>
                    <a href="#services" className="btn-secondary">Ver servicios</a>
                </div>
            </div>
            <div className="hero-bg-glow"></div>
            <style jsx>{`
                .seo-subtitle {
                    font-size: 1.1rem;
                    color: #ccc;
                    margin-top: -1rem;
                    margin-bottom: 2rem;
                    font-weight: 500;
                    white-space: nowrap;
                }
                @media (max-width: 768px) {
                    .seo-subtitle {
                        white-space: normal;
                        font-size: 1rem;
                        line-height: 1.4;
                        margin-top: -0.5rem;
                    }
                }
            `}</style>
        </header>
    );
};

export default Hero;
