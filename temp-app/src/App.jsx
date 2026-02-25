import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './App.css'

function App() {
  const heroTextRef = useRef(null)
  const carouselRef = useRef(null)
  const carouselTrackRef = useRef(null)

  // Imagens do carrossel - antes e depois de limpeza de tapetes
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1200',
      alt: 'Tapete limpo e renovado'
    },
    {
      url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200',
      alt: 'Limpeza profissional de tapete'
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
      alt: 'Tapete luxuoso após higienização'
    },
    {
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200',
      alt: 'Sala com tapete impecável'
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200',
      alt: 'Detalhes de tapete limpo'
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação de entrada do texto hero
      gsap.from(heroTextRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
      })

      // Animação infinita do carrossel para a direita
      const track = carouselTrackRef.current
      const images = track.children
      const imageWidth = images[0]?.offsetWidth || 400
      const gap = 32 // 2rem em pixels
      const totalWidth = (imageWidth + gap) * carouselImages.length

      // Duplicar as imagens para loop infinito
      track.innerHTML += track.innerHTML

      // Animação infinita suave
      gsap.to(track, {
        x: -totalWidth,
        duration: 30,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
      })

      // Pausar no hover
      const carousel = carouselRef.current
      carousel.addEventListener('mouseenter', () => {
        gsap.to(track, { timeScale: 0.3, duration: 0.5 })
      })
      carousel.addEventListener('mouseleave', () => {
        gsap.to(track, { timeScale: 1, duration: 0.5 })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="app">
      {/* Hero Section */}
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
            <span className="title-accent">cuidado.</span>
          </h1>

          <p className="hero-description">
            Removemos sujeira profunda, manchas difíceis e ácaros com tecnologia avançada.
            Devolva a vida e a beleza aos seus tapetes.
          </p>

          <div className="hero-cta">
            <button className="btn-primary">
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
            {carouselImages.map((image, index) => (
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
    </div>
  )
}

export default App
