import { ArrowDownRight } from 'lucide-react'

export default function Hero() {
  return <>
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <div className="eyebrow"><span /> Biblioteca 4Juris</div>
        <h1>Seu próximo site começa com uma <em>boa escolha.</em></h1>
        <p>Landing pages criadas para transformar autoridade jurídica em presença digital, confiança e novas oportunidades.</p>
        <div className="hero-actions">
          <a className="primary-button" href="#catalogo">Ver templates <ArrowDownRight size={18} /></a>
          <span className="microcopy">Selecione. Personalize.<br />Publique.</span>
        </div>
      </div>
      <div className="hero-board" aria-hidden="true">
        <div className="board-glow" /><span className="giant-four">4</span>
        <div className="floating-card fc-one"><small>Design jurídico</small><strong>Inteligente por<br />natureza.</strong><span>4Juris</span></div>
        <div className="floating-card fc-two"><span className="pulse" /><small>modelos ativos</small><strong>06</strong></div>
        <div className="floating-card fc-three">Estratégia <span>+</span> tecnologia</div>
      </div>
    </section>
    <section className="statement">
      <div className="statement-number">01</div>
      <p>Mais que um layout.<br /><strong>Uma estrutura para crescer.</strong></p>
      <span>Cada modelo combina estética, estratégia e uma experiência pensada para o mercado jurídico.</span>
    </section>
  </>
}
