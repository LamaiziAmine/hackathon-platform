import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import logoBlanc from '../assets/logo_blanc.png';

const NeuronBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = canvas.parentElement.offsetWidth);
        let height = (canvas.height = canvas.parentElement.offsetHeight);

        const handleResize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        };

        window.addEventListener('resize', handleResize);

        const mouse = { x: null, y: null, radius: 150 };
        const particleCount = Math.min(Math.floor((width * height) / 12000), 90);
        let particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;
                this.radius = Math.random() * 2 + 1.5;
                this.baseAlpha = Math.random() * 0.5 + 0.3;
                this.pulseSpeed = Math.random() * 0.03 + 0.01;
                this.pulseVal = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulseVal += this.pulseSpeed;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (1 - dist / mouse.radius) * 0.8;
                        this.x += (dx / dist) * force;
                        this.y += (dy / dist) * force;
                    }
                }
            }

            draw() {
                const currentAlpha = this.baseAlpha + Math.sin(this.pulseVal) * 0.2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${Math.max(0.1, currentAlpha)})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#3b82f6';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const initParticles = () => {
            particles = [];
            const count = Math.min(Math.floor((width * height) / 12000), 90);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        initParticles();

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        canvas.parentElement.addEventListener('mousemove', handleMouseMove);
        canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);

        const connectDistance = 140;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectDistance) {
                        const alpha = (1 - dist / connectDistance) * 0.45;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
                        ctx.lineWidth = 1.4;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (canvas.parentElement) {
                canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
                canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};

const Hero = () => {
    return (
        <section className="relative h-[calc(100vh-80px)] bg-[#00122e] flex items-center justify-center text-white overflow-hidden">
            <NeuronBackground />

            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/25 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[130px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700/15 rounded-full blur-[130px]"></div>
            </div>

            <div className="relative z-10 text-center max-w-4xl px-6">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex items-center ">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex items-center justify-center p-1">
                            <img
                                src={logoBlanc}
                                alt="PlaThon Logo"
                                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.65)]"
                            />
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">
                            Pla<span className="text-blue-500">Thon</span>
                        </h1>
                    </div>
                    <p className="text-xl md:text-2xl font-light text-blue-200/90 tracking-wide">
                        La plateforme de gestion des hackathons
                    </p>
                </div>

                <p className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    PlaThon accompagne la conception, l'organisation et le suivi de vos hackathons de A à Z. <br className="hidden sm:inline"/>
                    Collaborez, innovez et construisez l'avenir ensemble.
                </p>

                <button className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-base md:text-lg font-bold flex items-center gap-2.5 mx-auto transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)] cursor-pointer">
                    <span>Découvrir la plateforme</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>
    );
};

export default Hero;