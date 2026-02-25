import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Activity, Shield, Sparkles, MapPin, Phone, ArrowRight, Droplets, Wind, RotateCcw, Check, CheckCircle2 } from 'lucide-react';
import QuoteModal from './QuoteModal';

gsap.registerPlugin(ScrollTrigger);

// --- A. NAVBAR ---
const Navbar = ({ openQuote }) => {
    const navRef = useRef(null);

    useGSAP(() => {
        ScrollTrigger.create({
            start: 'top -50',
            end: 99999,
            toggleClass: {
                targets: navRef.current,
                className: 'scrolled'
            }
        });
    });

    const CTA = () => {
        openQuote();
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-center pt-3 md:pt-6 px-3 md:px-4 pointer-events-none">
            <div
                ref={navRef}
                className="pointer-events-auto flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-500 w-full max-w-5xl bg-transparent text-background border border-transparent
        [&.scrolled]:bg-background/80 [&.scrolled]:backdrop-blur-xl [&.scrolled]:text-primary [&.scrolled]:border-primary/10 [&.scrolled]:shadow-lg"
            >
                <div className="font-heading font-bold text-base md:text-xl tracking-tight flex items-center gap-2 md:gap-3 text-primary opacity-0 transition-opacity duration-500 [.scrolled_&]:opacity-100">
                    <img src="/logo.png" alt="Mr. Cleaner" className="h-8 md:h-10 w-auto" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                    <span style={{ display: 'none' }}>Mr. Cleaner</span>
                </div>

                <div className="hidden lg:flex items-center gap-8 font-body text-sm font-medium">
                    <a href="#solucoes" className="hover:-translate-y-[1px] transition-transform">Soluções</a>
                    <a href="#filosofia" className="hover:-translate-y-[1px] transition-transform">Filosofia</a>
                    <a href="#protocolo" className="hover:-translate-y-[1px] transition-transform">Protocolo</a>
                </div>

                <button
                    onClick={CTA}
                    className="group relative overflow-hidden bg-accent text-background px-3 md:px-5 py-2 md:py-2.5 rounded-full font-body text-xs md:text-sm font-semibold transition-transform hover:scale-105 active:scale-95 min-h-[44px] md:min-h-0"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                >
                    <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                        <span className="hidden sm:inline">WhatsApp CTA</span>
                        <span className="inline sm:hidden">WhatsApp</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                </button>
            </div>
        </nav>
    );
};

// --- B. HERO SECTION ---
const Hero = ({ openQuote }) => {
    const heroTextRef = useRef(null);
    const carouselRef = useRef(null);
    const carouselTrackRef = useRef(null);

    // Imagens do carrossel - antes e depois de limpeza de tapetes
    const carouselImages = [
        {
            url: '/hero1.jpg',
            alt: 'Tapetes de diversos tamanhos sendo limpos no chão quadriculado'
        },
        {
            url: '/hero2.jpg',
            alt: 'Máquina centrifugadora azul Lavfort para extração e secagem'
        },
        {
            url: '/hero3.jpg',
            alt: 'Tapetes enrolados organizados em prateleiras após a limpeza'
        },
        {
            url: '/hero4.jpg',
            alt: 'Tapetes geométricos e coloridos secando na área com iluminação adequada'
        },
        {
            url: '/hero5.jpg',
            alt: 'Profissional Mr. Cleaner realizando a lavagem premium de tapete persa'
        }
    ];

    useGSAP(() => {
        // Animação de entrada do texto hero
        if (heroTextRef.current) {
            gsap.from(heroTextRef.current.children, {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.3
            });
        }

        // Animação infinita do carrossel para a esquerda
        const track = carouselTrackRef.current;
        if (track) {
            const images = track.children;
            const imageWidth = images[0]?.offsetWidth || 400;
            const gap = 32; // 2rem em pixels
            const totalWidth = (imageWidth + gap) * carouselImages.length;

            // Duplicar as imagens para loop infinito programaticamente
            // (Para evitar problemas no React, renderizamos o array duplicado no JSX)

            // Animação infinita suave
            gsap.to(track, {
                x: -totalWidth,
                duration: 30,
                ease: 'none',
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
                }
            });

            // Pausar no hover
            const carousel = carouselRef.current;
            if (carousel) {
                carousel.addEventListener('mouseenter', () => {
                    gsap.to(track, { timeScale: 0.3, duration: 0.5 });
                });
                carousel.addEventListener('mouseleave', () => {
                    gsap.to(track, { timeScale: 1, duration: 0.5 });
                });
            }
        }
    }, { scope: carouselRef }); // Scope is slightly generalized, but safe since refs are used

    return (
        <section className="hero">
            <div className="hero-background">
                <div className="gradient-overlay"></div>
            </div>

            <div className="hero-content" ref={heroTextRef}>
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    <span>Higienização Profissional</span>
                </div>

                <h1 className="hero-title">
                    <span className="title-main">Seu tapete merece o melhor</span>
                    <span className="title-accent !text-[#556b3e] !bg-none" style={{ WebkitTextFillColor: 'initial' }}>cuidado.</span>
                </h1>

                <p className="hero-description">
                    Removemos sujeira profunda, manchas difíceis e ácaros com tecnologia avançada. Devolva a vida e a beleza aos seus tapetes.
                </p>

                <div className="hero-cta">
                    <button onClick={openQuote} className="btn-primary">
                        <span className="btn-bg"></span>
                        <span className="btn-text">Solicitar Orçamento</span>
                    </button>
                    <button className="btn-secondary">
                        <span className="btn-text">Ver Resultados</span>
                    </button>
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">10+ anos</span>
                        <span className="stat-label">de experiência</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">5.000+</span>
                        <span className="stat-label">tapetes higienizados</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">98%</span>
                        <span className="stat-label">clientes satisfeitos</span>
                    </div>
                </div>
            </div>

            {/* Carrossel de Imagens */}
            <div className="carousel-container" ref={carouselRef}>
                <div className="carousel-track" ref={carouselTrackRef}>
                    {/* Renderizamos duplicado no JSX para o infinite scroll funcionar perfeitamente com React */}
                    {[...carouselImages, ...carouselImages].map((image, index) => (
                        <div key={index} className="carousel-item">
                            <img src={image.url} alt={image.alt} />
                            <div className="carousel-overlay">
                                <span>{image.alt}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- C. FEATURES ---
const Features = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const cardsRef = useRef([]);

    // Card 1: Diagnostic Shuffler
    const [shuffleImages, setShuffleImages] = useState([
        { id: 1, title: 'Limpeza com Extração', desc: 'Remove sujeira profunda, manchas difíceis e odores persistentes.' },
        { id: 2, title: 'Impermeabilização Premium', desc: 'Barreira protetora contra líquidos que prolonga a durabilidade.' },
        { id: 3, title: 'Produtos Eco-Friendly', desc: 'Certificados e 100% seguros para pets, crianças e alérgicos.' }
    ]);

    useEffect(() => {
        const int = setInterval(() => {
            setShuffleImages(prev => {
                const arr = [...prev];
                arr.unshift(arr.pop());
                return arr;
            });
        }, 3000);
        return () => clearInterval(int);
    }, []);

    // Card 2: Telemetry Typewriter
    const typewriterText = "✓ Análise detalhada do tecido e manchas...\n✓ Aspiração de alta potência remove sujeira profunda...\n✓ Aplicação de produtos ecológicos certificados...\n✓ Extração completa de resíduos e ácaros...\n✓ Revitalização das fibras e cores originais...\n✓ Ambiente 100% higienizado e saudável!";
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        let i = 0;
        setTypedText("");
        const typeInt = setInterval(() => {
            setTypedText(typewriterText.slice(0, i));
            i++;
            if (i > typewriterText.length + 20) { // Keep text on screen longer before looping
                i = 0;
                setTypedText("");
            }
        }, 100);
        return () => clearInterval(typeInt);
    }, []);

    // Card 3: Cursor Protocol Scheduler
    const cursorRef = useRef(null);
    const cellRef = useRef(null);
    const saveBtnRef = useRef(null);
    const [activeDay, setActiveDay] = useState(null);

    useGSAP(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, defaults: { ease: 'power2.inOut' } });

        tl.set(cursorRef.current, { x: 50, y: 150, opacity: 0, scale: 1 });
        tl.set(cellRef.current, { scale: 1, backgroundColor: 'transparent' });

        tl.to(cursorRef.current, { opacity: 1, duration: 0.3 })
            .to(cursorRef.current, { x: 120, y: 35, duration: 1.2 })
            .to(cursorRef.current, { scale: 0.9, duration: 0.1 })
            .call(() => setActiveDay(3))
            .to(cellRef.current, { scale: 0.95, duration: 0.1 }, "<")
            .to(cursorRef.current, { scale: 1, duration: 0.1 })
            .to(cellRef.current, { scale: 1, backgroundColor: '#CC5833', color: '#FFF', duration: 0.1 }, "<")
            .to(cursorRef.current, { x: 140, y: 120, duration: 1 })
            .to(cursorRef.current, { scale: 0.9, duration: 0.1 })
            .to(saveBtnRef.current, { scale: 0.95, duration: 0.1 }, "<")
            .to(cursorRef.current, { scale: 1, duration: 0.1 })
            .to(saveBtnRef.current, { scale: 1, duration: 0.1 }, "<")
            .to(cursorRef.current, { opacity: 0, duration: 0.5 });
    });

    // Scroll animations
    useGSAP(() => {
        // Animate section header
        gsap.from(headerRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Animate cards with stagger
        gsap.from(cardsRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="solucoes" className="w-full max-w-7xl mx-auto px-6 py-32 z-10 relative">
            <div ref={headerRef} className="mb-16">
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-primary">Serviços Premium</h2>
                <p className="font-body text-dark/70 text-lg max-w-xl">Técnicas avançadas para renovar seus estofados e ambientes com segurança e eficiência.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div ref={el => cardsRef.current[0] = el} className="bg-white rounded-[2rem] p-8 border border-primary/10 shadow-xl shadow-primary/5 flex flex-col h-[400px] overflow-hidden group">
                    <div className="flex items-center gap-3 mb-8">
                        <Activity className="w-5 h-5 text-accent" />
                        <h3 className="font-heading font-bold text-xl text-primary">Lavagem e Impermeabilização</h3>
                    </div>
                    <p className="font-body text-sm text-dark/70 mb-auto">Tratamento completo que combina limpeza profunda com proteção duradoura.</p>

                    <div className="relative h-56 w-full mt-6 flex justify-center items-end pb-4">
                        {shuffleImages.map((img, i) => {
                            const zIndex = shuffleImages.length - i;
                            const translateY = - (i * 45); // Stack them UPWARDS
                            const scale = 1 - (i * 0.1); // Make back cards smaller
                            const opacity = 1 - (i * 0.3); // Fade back cards more

                            return (
                                <div
                                    key={img.id}
                                    className="absolute w-full max-w-[90%] bg-background rounded-2xl border border-primary/10 p-4 shadow-lg flex items-center gap-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom"
                                    style={{
                                        zIndex: zIndex,
                                        transform: `translateY(${translateY}px) scale(${scale})`,
                                        opacity: opacity
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-heading font-bold text-xs text-dark">{img.title}</div>
                                        <div className="font-body text-[10px] md:text-xs text-dark/60 line-clamp-1">{img.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Card 2 */}
                <div ref={el => cardsRef.current[1] = el} className="bg-primary rounded-[2rem] p-8 shadow-xl shadow-primary/20 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between gap-3 mb-8">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-accent" />
                            <h3 className="font-heading font-bold text-xl text-white">Higienização Profunda</h3>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></div>
                            <span className="font-body text-[10px] font-bold text-white/90 uppercase tracking-widest">Ativo</span>
                        </div>
                    </div>
                    <p className="font-body text-sm text-white/60 mb-auto">Processo completo de desinfecção profunda para eliminar ácaros, bactérias e alérgenos.</p>

                    <div className="mt-8 bg-black/20 rounded-2xl p-6 h-48 border border-white/5 flex items-start overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/80 pointer-events-none z-10" />
                        <div className="font-body text-white/90 text-sm md:text-base leading-relaxed w-full">
                            {typedText}
                            <span className="w-2 h-4 bg-accent inline-block align-middle ml-1 animate-pulse"></span>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div ref={el => cardsRef.current[2] = el} className="bg-white rounded-[2rem] p-8 border border-primary/10 shadow-xl shadow-primary/5 flex flex-col h-[400px] relative overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="w-5 h-5 text-accent" />
                            <h3 className="font-heading font-bold text-xl text-primary drop-shadow-[0_2px_4px_rgba(255,255,255,1)]">Coleta & Entrega Grátis</h3>
                        </div>
                        <p className="font-body text-sm text-dark/90 font-medium mb-auto drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">Realizamos a retirada e entrega gratuita dos tapetes, sem que você precise se deslocar até nossa sede.</p>

                        <button ref={saveBtnRef} className="mt-8 w-full py-3 bg-primary text-white rounded-lg font-heading text-sm font-bold flex justify-center items-center shadow-lg transition-transform hover:scale-105">
                            Agendar Coleta
                        </button>
                    </div>

                    <div className="absolute bottom-0 right-0 w-full h-[60%] z-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10"></div>
                        <img src="https://framerusercontent.com/images/JL7ZfTqVPTKwu07Cz8QQgWFH9w.webp" alt="Van Mister Cleaner" className="w-full h-full object-cover object-right-bottom transform translate-y-4" />
                    </div>
                </div>

            </div>
        </section>
    );
};

// --- D. PHILOSOPHY / SOBRE NÓS ---
const Philosophy = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);

    useGSAP(() => {
        // Animate text content from left
        gsap.from(textRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
            },
            x: -60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        });

        // Animate image from right
        gsap.from(imageRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
            },
            x: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="filosofia" className="relative w-full py-24 md:py-40 bg-background text-dark overflow-hidden border-t border-primary/5">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div ref={textRef}>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-primary">
                        Sobre nós
                        <span className="block text-accent font-drama italic text-3xl md:text-4xl mt-2 font-normal">O Spa do Seu Sofá!</span>
                    </h2>
                    <div className="font-body text-dark/70 text-lg space-y-6">
                        <p>
                            Há mais de 20 anos, a Mr. Cleaner transforma ambientes com serviços de limpeza, impermeabilização de estofados e lavagem de tapetes.
                        </p>
                        <p>
                            Com mais de 15 mil clientes satisfeitos, nossa missão é criar espaços mais saudáveis para você, sua família, colaboradores e clientes.
                        </p>
                    </div>
                </div>

                <div ref={imageRef} className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl p-4 bg-white border border-primary/10">
                    <img
                        src="https://framerusercontent.com/images/wlrSkzWc74dJ3ZiBW26TwRuVOA.jpg"
                        alt="Equipe Mr. Cleaner"
                        className="w-full h-full object-cover rounded-[2rem]"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-full w-32 h-32 flex items-center justify-center shadow-xl rotate-12">
                        <span className="font-heading font-bold text-center leading-tight">20+ Anos<br />de Exp.</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- E. PROTOCOL SECTION (Horizontal Cards) ---
const ProtocolSection = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const cardsRef = useRef([]);

    useGSAP(() => {
        // Animate section header
        gsap.from(headerRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Animate protocol cards with stagger
        gsap.from(cardsRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }, { scope: sectionRef });

    const protocols = [
        {
            num: '01',
            title: 'Avaliação Estofado',
            desc: 'Análise detalhada do tecido e nível de sujidade para determinar o melhor tratamento.',
            color: 'from-accent/20 to-transparent'
        },
        {
            num: '02',
            title: 'Limpeza e Extração',
            desc: 'Utilizamos produtos eco-friendly e extração de alta potência contra manchas e odores.',
            color: 'from-primary/20 to-transparent'
        },
        {
            num: '03',
            title: 'Impermeabilização Premium',
            desc: 'Proteção contra líquidos, prolongando a vida útil e facilitando a limpeza diária.',
            color: 'from-accent-bright/20 to-transparent'
        }
    ];

    return (
        <section ref={sectionRef} id="protocolo" className="relative w-full py-24 md:py-32 bg-white overflow-hidden border-t border-primary/5">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(var(--primary) 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-primary font-bold text-sm tracking-wide mb-6">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        METODOLOGIA
                    </div>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-6">
                        O processo <span className="text-accent italic font-drama font-normal">Diamond</span> de renovação
                    </h2>
                    <p className="font-body text-lg text-dark/60">
                        Um protocolo de três etapas desenvolvido para garantir não apenas a limpeza visual, mas a desinfecção profunda e duradoura do seu ambiente.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting UI elements for desktop */}
                    <div className="hidden md:block absolute top-[4.5rem] left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-transparent via-primary/10 to-transparent z-0"></div>

                    {protocols.map((protocol, index) => (
                        <div key={index} ref={el => cardsRef.current[index] = el} className="relative z-10 group h-full">
                            <div className="flex flex-col items-center text-center bg-background rounded-3xl p-8 h-full border border-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">

                                {/* Number Sphere */}
                                <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-8 relative z-10">
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${protocol.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                    <span className="font-heading font-black text-3xl text-primary relative z-10">{protocol.num}</span>

                                    {/* Decorator rings */}
                                    <div className="absolute -inset-2 border border-dashed border-primary/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-[spin_10s_linear_infinite] transition-all duration-500"></div>
                                </div>

                                {/* Content */}
                                <h3 className="font-heading text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
                                    {protocol.title}
                                </h3>
                                <p className="font-body text-dark/70 leading-relaxed">
                                    {protocol.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- F. TESTIMONIALS ---
const Testimonials = ({ openQuote }) => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const testimonialsTrackRef = useRef(null);
    const testimonialsContainerRef = useRef(null);

    const prints = [
        // Depoimentos originais
        "https://framerusercontent.com/images/jaIxhP95TXT34Q2PY1bHpWOUolM.webp",
        "https://framerusercontent.com/images/HDqHa05aK2q4D4yaG408ZA1KE.webp",
        "https://framerusercontent.com/images/tlyhi8idktsx3mi1AsLQH0AFeN8.webp",
        "https://framerusercontent.com/images/BaZMm0ZuUSnV3eFQwUPq5I3gI.webp",
        "https://framerusercontent.com/images/fKQTuvLKhsdWOxsZnjyS2IjPs8.webp",
        "https://framerusercontent.com/images/KkQ72sfBB38rEGrRxIHVkakKpo.webp",
        // Novos depoimentos - substitua pelos URLs das suas imagens
        "https://framerusercontent.com/images/jaIxhP95TXT34Q2PY1bHpWOUolM.webp",
        "https://framerusercontent.com/images/HDqHa05aK2q4D4yaG408ZA1KE.webp",
        "https://framerusercontent.com/images/tlyhi8idktsx3mi1AsLQH0AFeN8.webp",
        "https://framerusercontent.com/images/BaZMm0ZuUSnV3eFQwUPq5I3gI.webp",
        "https://framerusercontent.com/images/fKQTuvLKhsdWOxsZnjyS2IjPs8.webp",
        "https://framerusercontent.com/images/KkQ72sfBB38rEGrRxIHVkakKpo.webp"
    ];

    useGSAP(() => {
        const track = testimonialsTrackRef.current;
        if (!track) return;

        const items = track.children;
        if (!items.length) return;

        const itemWidth = items[0]?.offsetWidth || 280;
        const gap = 16; // 1rem em pixels
        const totalWidth = (itemWidth + gap) * prints.length;

        // Animação infinita suave da direita para esquerda
        gsap.to(track, {
            x: -totalWidth,
            duration: 80,
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });

        // Pausar/desacelerar no hover
        const container = testimonialsContainerRef.current;
        if (container) {
            container.addEventListener('mouseenter', () => {
                gsap.to(track, { timeScale: 0.2, duration: 0.5 });
            });
            container.addEventListener('mouseleave', () => {
                gsap.to(track, { timeScale: 1, duration: 0.5 });
            });
        }
    }, { scope: testimonialsContainerRef });

    // Scroll animations
    useGSAP(() => {
        // Animate section header
        gsap.from(headerRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Animate carousel container
        gsap.from(testimonialsContainerRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="w-full py-16 md:py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-primary font-bold text-xs md:text-sm tracking-wide mb-6">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        DEPOIMENTOS REAIS
                    </div>
                    <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-primary">
                        Clientes <span className="text-accent italic font-drama font-normal">apaixonados</span> pela Mr. Cleaner
                    </h2>
                    <p className="font-body text-dark/70 text-base md:text-lg max-w-2xl mx-auto">
                        99,8% dos nossos clientes dizem estar satisfeitos com nossos serviços e recomendam a Mr. Cleaner.
                    </p>
                </div>

                {/* Testimonials Infinite Carousel */}
                <div className="relative overflow-hidden" ref={testimonialsContainerRef}>
                    <div className="flex gap-4" ref={testimonialsTrackRef} style={{ willChange: 'transform' }}>
                        {/* Renderizamos o array duplicado para loop infinito */}
                        {[...prints, ...prints].map((src, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-[280px] md:w-[320px] rounded-2xl overflow-hidden shadow-lg border border-primary/5 hover:border-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl bg-white group"
                            >
                                <img
                                    src={src}
                                    alt={`Depoimento ${(idx % prints.length) + 1}`}
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-8 md:mt-12">
                    <button
                        onClick={openQuote}
                        className="group relative overflow-hidden bg-accent text-background px-6 md:px-8 py-3 md:py-4 rounded-full font-body text-sm md:text-base font-semibold inline-flex items-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 min-h-[48px]"
                    >
                        <span className="relative z-10 flex items-center gap-2 md:gap-3">
                            Fazer um Orçamento
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                    </button>
                </div>
            </div>
        </section>
    );
};

// --- G. BRANDS ---
const Brands = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    const logos = [
        "https://framerusercontent.com/images/SOK8sbzKCNS7ckhufR27kK1Lw2Y.png",
        "https://framerusercontent.com/images/j23LDD9sApeSK8iMzb2ITZ1Yw1Q.png",
        "https://framerusercontent.com/images/Qxv218ZttPsstc7WVyEh3gItyw.png",
        "https://framerusercontent.com/images/oZSGxljN9tNtnoNvvb6p0sB7XPU.png",
        "https://framerusercontent.com/images/Ti8nqgwHET45A7HGUJqaMLVACi0.png",
        "https://framerusercontent.com/images/aZest98C1QQMn5qcYqkjIr0.png"
    ];

    // Scroll animations
    useGSAP(() => {
        gsap.from(contentRef.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            },
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="w-full py-24 bg-white border-t border-primary/5">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                <div ref={contentRef} className="bg-primary/5 rounded-[2rem] p-12 w-full max-w-4xl text-center shadow-inner border border-primary/10">
                    <span className="font-data text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Clientes Mr. Cleaner</span>
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-primary">Escolhido por grandes empresas</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
                        {logos.map((src, idx) => (
                            <img key={idx} src={src} alt={`Logo parceiro ${idx + 1}`} className="max-h-12 w-auto object-contain hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" style={{ filter: 'grayscale(100%)' }} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- H. FOOTER ---
const Footer = () => {
    return (
        <footer className="w-full bg-dark text-white rounded-t-[4rem] px-6 pt-24 pb-12 mt-24 relative z-50">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/logo.png" alt="Mr. Cleaner" className="h-8 md:h-10 w-auto filter brightness-0 invert opacity-90" />
                        </div>
                        <p className="font-body text-white/60 max-w-sm">
                            Há mais de 20 anos transformando ambientes com serviços de limpeza, impermeabilização de estofados e lavagem de tapetes no Rio de Janeiro.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-data text-accent font-bold mb-6 tracking-widest uppercase text-sm">Navegação</h4>
                        <ul className="space-y-4 font-body text-white/60">
                            <li><a href="#solucoes" className="hover:text-white transition-colors">Soluções</a></li>
                            <li><a href="#filosofia" className="hover:text-white transition-colors">Filosofia</a></li>
                            <li><a href="#protocolo" className="hover:text-white transition-colors">Protocolo</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-data text-accent font-bold mb-6 tracking-widest uppercase text-sm">Contato</h4>
                        <ul className="space-y-4 font-body text-white/60">
                            <li>WhatsApp: (21) 97158-6364</li>
                            <li>contato@mistercleaner.com.br</li>
                            <li>Rio de Janeiro, RJ</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="font-body text-white/40 text-xs">© 2026 Mr. Cleaner. Todos os direitos reservados.</p>

                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-data text-xs text-white/70 tracking-widest uppercase">Atendimento Online</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- G. BUBBLES COMPONENT ---
const Bubbles = () => {
    // Generate random bubbles with CSS custom properties
    const bubbles = Array.from({ length: 25 }).map((_, i) => {
        const size = Math.random() * 60 + 10; // Size between 10px and 70px
        const left = Math.random() * 100; // Random horizontal position
        const animationDuration = Math.random() * 12 + 8; // 8s to 20s
        const animationDelay = Math.random() * 10; // 0s to 10s delay
        const wobbleDuration = Math.random() * 4 + 2; // 2s to 6s wobble

        return (
            <div
                key={i}
                className="bubble"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    animationDuration: `${animationDuration}s, ${wobbleDuration}s`,
                    animationDelay: `${animationDelay}s, 0s`
                }}
            />
        );
    });

    return (
        <div className="bubbles-container">
            {bubbles}
        </div>
    );
};

export default function App() {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const openQuote = () => setIsQuoteOpen(true);

    return (
        <div className="relative w-full min-h-screen bg-background text-dark">
            <Bubbles />
            <Navbar openQuote={openQuote} />
            <Hero openQuote={openQuote} />
            <Features />
            <Philosophy />
            <ProtocolSection />
            <Testimonials openQuote={openQuote} />
            <Brands />
            <Footer />
            <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
        </div>
    );
}
