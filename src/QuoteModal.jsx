import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { X, Camera, MapPin, Mail, Phone, MessageCircle, ArrowRight, ArrowLeft, CheckCircle2, Ruler, Upload, Sofa, Grid3X3 } from 'lucide-react';

const QuoteModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [serviceType, setServiceType] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [dimensions, setDimensions] = useState({ comprimento: '', largura: '' });
    const [cep, setCep] = useState('');
    const [contact, setContact] = useState({ email: '', telefone: '', whatsapp: '' });
    const [sameWhatsapp, setSameWhatsapp] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const contentRef = useRef(null);
    const fileInputRef = useRef(null);

    // Reset form when closing
    const resetForm = useCallback(() => {
        setStep(1);
        setServiceType(null);
        setPhotoFile(null);
        setPhotoPreview(null);
        setDimensions({ comprimento: '', largura: '' });
        setCep('');
        setContact({ email: '', telefone: '', whatsapp: '' });
        setSameWhatsapp(false);
        setErrors({});
        setIsSubmitting(false);
    }, []);

    // Open/close animations
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(backdropRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            gsap.fromTo(modalRef.current,
                { scale: 0.9, opacity: 0, y: 30 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
            );
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close with animation
    const handleClose = useCallback(() => {
        gsap.to(backdropRef.current, { opacity: 0, duration: 0.25 });
        gsap.to(modalRef.current, {
            scale: 0.95, opacity: 0, y: 20, duration: 0.25,
            onComplete: () => {
                resetForm();
                onClose();
            }
        });
    }, [onClose, resetForm]);

    // Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') handleClose(); };
        if (isOpen) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, handleClose]);

    // Animate step content on change
    useEffect(() => {
        if (contentRef.current && isOpen) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [step, isOpen]);

    // Copy telefone to whatsapp
    useEffect(() => {
        if (sameWhatsapp) {
            setContact(prev => ({ ...prev, whatsapp: prev.telefone }));
        }
    }, [sameWhatsapp, contact.telefone]);

    // --- Service selection ---
    const handleServiceSelect = (type) => {
        setServiceType(type);
        setErrors({});

        // Animate selected card
        const cards = document.querySelectorAll('.service-card');
        cards.forEach((card, i) => {
            const isSelected = (i === 0 && type === 'tapete') || (i === 1 && type === 'estofado');
            if (isSelected) {
                gsap.fromTo(card, { scale: 1 }, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
            } else {
                gsap.to(card, { opacity: 0.5, scale: 0.97, duration: 0.3 });
            }
        });

        // Auto advance
        setTimeout(() => {
            cards.forEach(card => gsap.to(card, { opacity: 1, scale: 1, duration: 0.2 }));
            setStep(2);
        }, 600);
    };

    // --- File handling ---
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
            setErrors(prev => ({ ...prev, photo: undefined }));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
            setErrors(prev => ({ ...prev, photo: undefined }));
        }
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // --- CEP mask ---
    const handleCepChange = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
        setCep(formatted);
    };

    // --- Phone mask ---
    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    // --- Validation ---
    const validateStep2 = () => {
        const newErrors = {};
        if (serviceType === 'tapete') {
            if (!dimensions.comprimento || parseFloat(dimensions.comprimento) <= 0) newErrors.comprimento = 'Informe o comprimento';
            if (!dimensions.largura || parseFloat(dimensions.largura) <= 0) newErrors.largura = 'Informe a largura';
        }
        const cepDigits = cep.replace(/\D/g, '');
        if (!cepDigits || cepDigits.length !== 8) newErrors.cep = 'CEP inválido';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Shake invalid fields
            Object.keys(newErrors).forEach(key => {
                const el = document.querySelector(`[data-field="${key}"]`);
                if (el) gsap.fromTo(el, { x: -6 }, { x: 6, duration: 0.08, repeat: 5, yoyo: true, ease: 'power2.inOut', onComplete: () => gsap.set(el, { x: 0 }) });
            });
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!contact.email || !emailRegex.test(contact.email)) newErrors.email = 'Email inválido';

        const telDigits = contact.telefone.replace(/\D/g, '');
        if (!telDigits || telDigits.length < 10) newErrors.telefone = 'Telefone inválido';

        const whatsDigits = contact.whatsapp.replace(/\D/g, '');
        if (!whatsDigits || whatsDigits.length < 10) newErrors.whatsapp = 'WhatsApp inválido';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            Object.keys(newErrors).forEach(key => {
                const el = document.querySelector(`[data-field="${key}"]`);
                if (el) gsap.fromTo(el, { x: -6 }, { x: 6, duration: 0.08, repeat: 5, yoyo: true, ease: 'power2.inOut', onComplete: () => gsap.set(el, { x: 0 }) });
            });
            return false;
        }
        return true;
    };

    // --- Submit ---
    const handleSubmit = () => {
        if (!validateStep3()) return;
        setIsSubmitting(true);

        const formData = {
            serviceType,
            photoFileName: photoFile?.name || null,
            dimensions: serviceType === 'tapete' ? dimensions : null,
            cep: cep.replace(/\D/g, ''),
            contact: {
                email: contact.email,
                telefone: contact.telefone.replace(/\D/g, ''),
                whatsapp: contact.whatsapp.replace(/\D/g, '')
            },
            submittedAt: new Date().toISOString()
        };

        console.log('[Mr. Cleaner Quote Request]', formData);

        const existing = JSON.parse(localStorage.getItem('mc_quotes') || '[]');
        existing.push(formData);
        localStorage.setItem('mc_quotes', JSON.stringify(existing));

        setTimeout(() => {
            setIsSubmitting(false);
            setStep(4);
        }, 1200);
    };

    if (!isOpen) return null;

    const stepLabels = ['Serviço', 'Detalhes', 'Contato'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div ref={backdropRef} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative bg-background w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border border-primary/10"
                role="dialog"
                aria-modal="true"
                aria-label="Solicitar Orçamento"
                style={{ scrollbarWidth: 'thin' }}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors"
                    aria-label="Fechar"
                >
                    <X className="w-5 h-5 text-primary" />
                </button>

                {/* Progress bar */}
                {step < 4 && (
                    <div className="px-8 pt-6">
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex-1 h-1.5 rounded-full bg-primary/10 overflow-hidden">
                                    <div
                                        className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                                        style={{ width: step >= s ? '100%' : '0%' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {stepLabels.map((label, i) => (
                                <span key={i} className={`flex-1 text-center text-xs font-body font-medium transition-colors ${step >= i + 1 ? 'text-accent' : 'text-primary/30'}`}>
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div ref={contentRef} className="px-8 py-6">

                    {/* ==================== STEP 1: Service Selection ==================== */}
                    {step === 1 && (
                        <div>
                            <div className="text-center mb-8">
                                <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-2">
                                    O que vamos <span className="text-accent italic font-drama font-normal">renovar</span>?
                                </h3>
                                <p className="font-body text-dark/60 text-sm">Escolha o tipo de serviço que precisa</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Tapete card */}
                                <button
                                    className={`service-card group flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${serviceType === 'tapete'
                                        ? 'bg-primary text-white border-primary shadow-lg'
                                        : 'bg-white text-primary border-primary/10 hover:border-accent/40'
                                        }`}
                                    onClick={() => handleServiceSelect('tapete')}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${serviceType === 'tapete' ? 'bg-white/20' : 'bg-accent/10 group-hover:bg-accent/20'
                                        }`}>
                                        <Grid3X3 className={`w-8 h-8 ${serviceType === 'tapete' ? 'text-white' : 'text-accent'}`} />
                                    </div>
                                    <div className="text-center">
                                        <span className="font-heading font-bold text-lg block">Tapete</span>
                                        <span className={`font-body text-xs ${serviceType === 'tapete' ? 'text-white/70' : 'text-dark/50'}`}>
                                            Tapetes, carpetes e passadeiras
                                        </span>
                                    </div>
                                </button>

                                {/* Estofado card */}
                                <button
                                    className={`service-card group flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${serviceType === 'estofado'
                                        ? 'bg-primary text-white border-primary shadow-lg'
                                        : 'bg-white text-primary border-primary/10 hover:border-accent/40'
                                        }`}
                                    onClick={() => handleServiceSelect('estofado')}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${serviceType === 'estofado' ? 'bg-white/20' : 'bg-accent/10 group-hover:bg-accent/20'
                                        }`}>
                                        <Sofa className={`w-8 h-8 ${serviceType === 'estofado' ? 'text-white' : 'text-accent'}`} />
                                    </div>
                                    <div className="text-center">
                                        <span className="font-heading font-bold text-lg block">Estofado</span>
                                        <span className={`font-body text-xs ${serviceType === 'estofado' ? 'text-white/70' : 'text-dark/50'}`}>
                                            Sofás, cadeiras e poltronas
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==================== STEP 2: Photo + Details ==================== */}
                    {step === 2 && (
                        <div>
                            <div className="text-center mb-6">
                                <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                                    {serviceType === 'tapete' ? 'Sobre o seu tapete' : 'Sobre o seu estofado'}
                                </h3>
                                <p className="font-body text-dark/60 text-sm">
                                    {serviceType === 'tapete'
                                        ? 'Envie uma foto e as medidas para um orçamento preciso'
                                        : 'Envie uma foto para um orçamento preciso'}
                                </p>
                            </div>

                            {/* Photo upload */}
                            <div className="mb-6">
                                <label className="font-body text-sm font-medium text-primary mb-2 block">
                                    Foto {serviceType === 'tapete' ? 'do tapete' : 'do estofado'}
                                    <span className="text-dark/40 font-normal ml-1">(opcional)</span>
                                </label>

                                {!photoPreview ? (
                                    <div
                                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging
                                            ? 'border-accent bg-accent/5 scale-[1.02]'
                                            : 'border-primary/20 hover:border-accent/40 hover:bg-accent/5'
                                            }`}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                                                <Camera className="w-7 h-7 text-accent" />
                                            </div>
                                            <div>
                                                <p className="font-body text-sm font-medium text-primary">
                                                    Clique ou arraste uma foto
                                                </p>
                                                <p className="font-body text-xs text-dark/40 mt-1">
                                                    A foto ajuda na precisão do orçamento
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative rounded-2xl overflow-hidden group">
                                        <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                                        <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={removePhoto}
                                                className="bg-white text-dark px-4 py-2 rounded-full font-body text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                Remover foto
                                            </button>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dimensions (tapete only) */}
                            {serviceType === 'tapete' && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div data-field="comprimento">
                                        <label className="font-body text-sm font-medium text-primary mb-1.5 block flex items-center gap-1.5">
                                            <Ruler className="w-3.5 h-3.5 text-accent" />
                                            Comprimento
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={dimensions.comprimento}
                                                onChange={(e) => {
                                                    setDimensions(prev => ({ ...prev, comprimento: e.target.value }));
                                                    setErrors(prev => ({ ...prev, comprimento: undefined }));
                                                }}
                                                className={`w-full bg-white rounded-xl border px-4 py-3 pr-10 font-body text-sm text-primary placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all ${errors.comprimento ? 'border-red-400' : 'border-primary/10'
                                                    }`}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-dark/40">m</span>
                                        </div>
                                        {errors.comprimento && <p className="font-body text-xs text-red-500 mt-1">{errors.comprimento}</p>}
                                    </div>
                                    <div data-field="largura">
                                        <label className="font-body text-sm font-medium text-primary mb-1.5 block flex items-center gap-1.5">
                                            <Ruler className="w-3.5 h-3.5 text-accent" />
                                            Largura
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={dimensions.largura}
                                                onChange={(e) => {
                                                    setDimensions(prev => ({ ...prev, largura: e.target.value }));
                                                    setErrors(prev => ({ ...prev, largura: undefined }));
                                                }}
                                                className={`w-full bg-white rounded-xl border px-4 py-3 pr-10 font-body text-sm text-primary placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all ${errors.largura ? 'border-red-400' : 'border-primary/10'
                                                    }`}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-dark/40">m</span>
                                        </div>
                                        {errors.largura && <p className="font-body text-xs text-red-500 mt-1">{errors.largura}</p>}
                                    </div>
                                </div>
                            )}

                            {/* CEP */}
                            <div data-field="cep" className="mb-6">
                                <label className="font-body text-sm font-medium text-primary mb-1.5 block flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-accent" />
                                    CEP
                                </label>
                                <input
                                    type="text"
                                    placeholder="00000-000"
                                    value={cep}
                                    onChange={(e) => {
                                        handleCepChange(e.target.value);
                                        setErrors(prev => ({ ...prev, cep: undefined }));
                                    }}
                                    className={`w-full bg-white rounded-xl border px-4 py-3 font-body text-sm text-primary placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all ${errors.cep ? 'border-red-400' : 'border-primary/10'
                                        }`}
                                />
                                {errors.cep && <p className="font-body text-xs text-red-500 mt-1">{errors.cep}</p>}
                            </div>

                            {/* Navigation */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setStep(1); setErrors({}); }}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-body text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Voltar
                                </button>
                                <button
                                    onClick={() => { if (validateStep2()) setStep(3); }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-5 py-3 rounded-xl font-body text-sm font-semibold hover:bg-accent/90 active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
                                >
                                    Continuar
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==================== STEP 3: Contact Info ==================== */}
                    {step === 3 && (
                        <div>
                            <div className="text-center mb-6">
                                <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                                    Quase lá!
                                </h3>
                                <p className="font-body text-dark/60 text-sm">
                                    Onde você quer receber o orçamento?
                                </p>
                            </div>

                            {/* Email */}
                            <div data-field="email" className="mb-4">
                                <label className="font-body text-sm font-medium text-primary mb-1.5 block flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-accent" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={contact.email}
                                    onChange={(e) => {
                                        setContact(prev => ({ ...prev, email: e.target.value }));
                                        setErrors(prev => ({ ...prev, email: undefined }));
                                    }}
                                    className={`w-full bg-white rounded-xl border px-4 py-3 font-body text-sm text-primary placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all ${errors.email ? 'border-red-400' : 'border-primary/10'
                                        }`}
                                />
                                {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            {/* Telefone */}
                            <div data-field="telefone" className="mb-4">
                                <label className="font-body text-sm font-medium text-primary mb-1.5 block flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-accent" />
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    placeholder="(21) 99999-9999"
                                    value={contact.telefone}
                                    onChange={(e) => {
                                        const formatted = formatPhone(e.target.value);
                                        setContact(prev => ({
                                            ...prev,
                                            telefone: formatted,
                                            ...(sameWhatsapp ? { whatsapp: formatted } : {})
                                        }));
                                        setErrors(prev => ({ ...prev, telefone: undefined }));
                                    }}
                                    className={`w-full bg-white rounded-xl border px-4 py-3 font-body text-sm text-primary placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all ${errors.telefone ? 'border-red-400' : 'border-primary/10'
                                        }`}
                                />
                                {errors.telefone && <p className="font-body text-xs text-red-500 mt-1">{errors.telefone}</p>}
                            </div>

                            {/* Same WhatsApp toggle */}
                            <label className="flex items-center gap-3 mb-4 cursor-pointer select-none group">
                                <div className={`relative w-10 h-6 rounded-full transition-colors ${sameWhatsapp ? 'bg-accent' : 'bg-primary/15'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${sameWhatsapp ? 'translate-x-5' : 'translate-x-1'}`} />
                                </div>
                                <span className="font-body text-sm text-dark/70 group-hover:text-dark transition-colors">
                                    Mesmo número para WhatsApp
                                </span>
                            </label>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={sameWhatsapp}
                                onChange={(e) => setSameWhatsapp(e.target.checked)}
                            />

                            {/* WhatsApp */}
                            <div data-field="whatsapp" className={`mb-6 transition-all ${sameWhatsapp ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label className="font-body text-sm font-medium text-primary mb-1.5 block flex items-center gap-1.5">
                                    <MessageCircle className="w-3.5 h-3.5 text-accent" />
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    placeholder="(21) 99999-9999"
                                    value={contact.whatsapp}
                                    onChange={(e) => {
                                        setContact(prev => ({ ...prev, whatsapp: formatPhone(e.target.value) }));
                                        setErrors(prev => ({ ...prev, whatsapp: undefined }));
                                    }}
                                    disabled={sameWhatsapp}
                                    className={`w-full bg-white rounded-xl border px-4 py-3 font-body text-sm text-primary placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all ${errors.whatsapp ? 'border-red-400' : 'border-primary/10'
                                        }`}
                                />
                                {errors.whatsapp && <p className="font-body text-xs text-red-500 mt-1">{errors.whatsapp}</p>}
                            </div>

                            {/* Navigation */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setStep(2); setErrors({}); }}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-body text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Voltar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="w-5 h-5">
                                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                            </svg>
                                            Orçamento via WhatsApp
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==================== STEP 4: Success ==================== */}
                    {step === 4 && (
                        <div className="text-center py-8">
                            <div className="mb-6">
                                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-3">
                                    Orçamento Solicitado!
                                </h3>
                                <p className="font-body text-dark/60 text-sm max-w-xs mx-auto">
                                    Entraremos em contato em breve pelo WhatsApp ou email informado.
                                </p>
                            </div>

                            <button
                                onClick={handleClose}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
                            >
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuoteModal;
