import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, ArrowUp, Check, ChevronDown, ChevronLeft, ChevronRight, Instagram, Mail, Menu, MessageCircle, Search, Send, Target, X } from 'lucide-react'
import Brand from './components/Brand'
import TemplateCard from './components/TemplateCard'
import PreviewModal from './components/PreviewModal'
import { templates } from './data/templates'
import case01 from './assets/CASES_4J-1.webp'
import case02 from './assets/CASES_4J-2.webp'
import case03 from './assets/CASES_4J-3.webp'
import case04 from './assets/CASES_4J-4.webp'
import case05 from './assets/CASES_4J-5.webp'
import case06 from './assets/CASES_4J-6.webp'
import case07 from './assets/CASES_4J-7.webp'
import case08 from './assets/CASES_4J-8.webp'
import case09 from './assets/CASES_4J-9.webp'
import socios from './assets/Socios.png'
import brazilMap from './assets/mapa-brasil-1.svg'
import heroImage from './assets/hero.jpg'
import brandLogo from './assets/LOGO-4juris-site.svg'
import adsImage from './assets/imgADS.webp'
import whatsAppImage from './assets/whatsApp-img.webp'
import fourJurisAiLogo from './assets/logo-4juris-ai-transparent.png'

const faqs = [
  ['O resultado é garantido?', 'Marketing e vendas dependem de diversos fatores, por isso não trabalhamos com promessas irreais. A 4Juris estrutura estratégia, operação e acompanhamento para aumentar a previsibilidade e criar condições consistentes de crescimento.'],
  ['Qual o período de contratação da assessoria?', 'O prazo é definido na proposta comercial conforme a solução, o estágio do escritório e os objetivos estabelecidos na sessão estratégica.'],
  ['Suas ações são permitidas pela OAB?', 'As estratégias são planejadas para respeitar as normas de publicidade da advocacia e os limites éticos aplicáveis à comunicação jurídica.'],
  ['A 4Juris tem multa de cancelamento de contrato?', 'As condições de cancelamento são apresentadas com transparência no contrato de cada solução antes da contratação.'],
  ['Se eu contratar a 4Juris, vou ter apenas tráfego pago?', 'Não. A 4Juris atua como um hub: estratégia, mídia, tecnologia, atendimento, CRM e processo comercial podem trabalhar juntos conforme a necessidade do escritório.'],
]

const solutions = [
  { icon: Target, logo: brandLogo, logoTheme: 'dark', image: adsImage, eyebrow: 'Agência de marketing', title: 'Gestão de Tráfego Pago', text: 'Estratégias para posicionar seu escritório à frente da concorrência e gerar oportunidades realmente qualificadas todos os meses.', items: ['Meta Ads', 'Google Ads'] },
  { icon: MessageCircle, logo: fourJurisAiLogo, image: whatsAppImage, eyebrow: 'CRM para advogados', title: 'Plataforma de WhatsApp', text: 'Centralize WhatsApp, Instagram Direct e Messenger em uma fila única, acompanhando equipes, conversas e atendimentos.', items: ['Atendimento centralizado', 'Gestão comercial'] },
]

const feedbackImages = [case01, case02, case03, case04, case05, case06, case07, case08, case09]
const videoTestimonials = ['5or-DD6mkzw', 'U357nUbn0jk', 'ysRkF2pSFcw']
const strategicTeamFiles = ['leticia-fernandes-hd.png', 'gilson-filho-hd.png', 'lucas-costa-hd.png']
const legacyStrategicTeamFiles = ['7-240x300.jpg', '13-240x300.jpg', '9-240x300.jpg']
const founderTeamFiles = ['time_erik_navarro.webp', 'time_nickson.webp']
const teamAssets = Object.entries(import.meta.glob('./assets/time/*', { eager: true, import: 'default' })).map(([path, image]) => ({ path, image, file: path.split('/').pop() }))
const teamMembers = teamAssets.filter(member => !strategicTeamFiles.includes(member.file) && !legacyStrategicTeamFiles.includes(member.file) && !founderTeamFiles.includes(member.file))
const strategicTeam = strategicTeamFiles.map(file => teamAssets.find(member => member.file === file)).filter(Boolean)
const erikPhoto = teamAssets.find(member => member.file === 'time_erik_navarro.webp')?.image
const nicksonPhoto = teamAssets.find(member => member.file === 'time_nickson.webp')?.image
const clientLogos = Object.entries(import.meta.glob('./assets/clientes/*', { eager: true, import: 'default' })).map(([path, image]) => ({ path, image, name: path.split('/').pop().replace(/^cliente_/i, '').replace(/-1|\.[^.]+$/g, '').replace(/_/g, ' ') }))

export default function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, '')
  const templatesRoute = currentPath === '/templates' || currentPath === '/templates-lp'
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [openFaq, setOpenFaq] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [exitSent, setExitSent] = useState(false)
  const [feedbackIndex, setFeedbackIndex] = useState(0)
  const [feedbackPaused, setFeedbackPaused] = useState(false)
  const [feedbackDragging, setFeedbackDragging] = useState(false)
  const [feedbackDragOffset, setFeedbackDragOffset] = useState(0)
  const [teamIndex, setTeamIndex] = useState(0)
  const feedbackDragStart = useRef(0)
  const filtered = useMemo(() => templates.filter(template => Object.values(template).flat().join(' ').toLowerCase().includes(query.toLowerCase())), [query])

  useEffect(() => {
    document.body.style.overflow = selected || menuOpen || exitOpen ? 'hidden' : ''
    const close = event => event.key === 'Escape' && (setSelected(null), setMenuOpen(false), setExitOpen(false))
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close) }
  }, [selected, menuOpen, exitOpen])

  useEffect(() => {
    if (templatesRoute) return undefined
    if (sessionStorage.getItem('4juris-exit-offer-seen')) return
    let enabled = false
    const timer = window.setTimeout(() => { enabled = true }, 4000)
    const detectExit = event => {
      if (!enabled || event.relatedTarget || event.clientY > 10) return
      sessionStorage.setItem('4juris-exit-offer-seen', 'true')
      setExitOpen(true)
    }
    document.addEventListener('mouseout', detectExit)
    return () => { window.clearTimeout(timer); document.removeEventListener('mouseout', detectExit) }
  }, [templatesRoute])

  useEffect(() => {
    if (!templatesRoute) return undefined
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    document.title = 'Catálogo de templates | 4Juris'
    if (description) description.content = 'Catálogo reservado de landing pages jurídicas da 4Juris.'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow, noarchive'
    document.head.appendChild(robots)
    return () => { document.title = previousTitle; if (description && previousDescription) description.content = previousDescription; robots.remove() }
  }, [templatesRoute])

  useEffect(() => {
    if (feedbackPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const autoplay = window.setInterval(() => setFeedbackIndex(current => (current + 1) % feedbackImages.length), 3000)
    return () => window.clearInterval(autoplay)
  }, [feedbackPaused])

  useEffect(() => {
    const elements = document.querySelectorAll('main > section, .solution-card, .leaders > article, .blog-grid article, .client-logo-grid figure, .strategic-team-grid figure')
    elements.forEach((element, index) => { element.classList.add('motion-reveal'); element.style.setProperty('--motion-delay', `${Math.min(index % 5, 4) * 55}ms`) })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { elements.forEach(element => element.classList.add('motion-visible')); return undefined }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('motion-visible'); observer.unobserve(entry.target) } }), { threshold: 0.08, rootMargin: '0px 0px -8% 0px' })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const submit = event => { event.preventDefault(); setSent(true) }
  const closeMenu = () => setMenuOpen(false)
  const moveFeedback = direction => setFeedbackIndex(current => (current + direction + feedbackImages.length) % feedbackImages.length)
  const startFeedbackDrag = event => { feedbackDragStart.current = event.clientX; setFeedbackDragging(true); setFeedbackPaused(true); event.currentTarget.setPointerCapture(event.pointerId) }
  const dragFeedback = event => { if (feedbackDragging) setFeedbackDragOffset(event.clientX - feedbackDragStart.current) }
  const endFeedbackDrag = event => { if (!feedbackDragging) return; if (Math.abs(feedbackDragOffset) > 45) moveFeedback(feedbackDragOffset < 0 ? 1 : -1); setFeedbackDragging(false); setFeedbackDragOffset(0); setFeedbackPaused(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }
  const moveTeam = direction => setTeamIndex(current => (current + direction + teamMembers.length) % teamMembers.length)
  const visibleTeam = Array.from({ length: 4 }, (_, offset) => teamMembers[(teamIndex + offset) % teamMembers.length])
  const visibleFeedback = Array.from({ length: 3 }, (_, offset) => ({ image: feedbackImages[(feedbackIndex + offset) % feedbackImages.length], position: (feedbackIndex + offset) % feedbackImages.length }))

  if (templatesRoute) return <div className="templates-page-shell">
    <header className="templates-page-header"><Brand href="/" /><div className="templates-toolbar-title"><strong>Templates LP</strong><span>Biblioteca reservada</span></div><label className="search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Buscar template" aria-label="Buscar templates" /></label></header>
    <main className="templates-page-main"><section className="catalog section">
      <div className="catalog-tools"><div><span className="library-kicker">COLEÇÃO 4JURIS</span><h1>Escolha a direção visual ideal.</h1><p>Explore cada proposta em tela cheia e compare estilos, estrutura e posicionamento.</p></div><strong><b>{String(filtered.length).padStart(2, '0')}</b><span>modelos</span></strong></div>
      <div className="grid">{filtered.map(template => <TemplateCard key={template.id} template={template} onPreview={setSelected} />)}</div>
      {filtered.length === 0 && <p className="empty">Nenhum template encontrado para essa busca.</p>}
    </section></main>
    <PreviewModal template={selected} onClose={() => setSelected(null)} />
  </div>

  return <>
    <header className="site-header">
      <Brand />
      <nav className={menuOpen ? 'nav-open' : ''} aria-label="Navegação principal">
        <button className="nav-close" onClick={closeMenu} aria-label="Fechar menu"><X /></button>
        <a onClick={closeMenu} href="#inicio">Home</a><a onClick={closeMenu} href="#quem-somos">Quem Somos</a><a onClick={closeMenu} href="#solucoes">Soluções</a>
      </nav>
      <a className="header-button" href="#contrate">Contrate a 4Juris <ArrowRight size={15} /></a>
      <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
    </header>

    <main>
      <section className="home-hero" id="inicio">
        <div className="hero-background" aria-hidden="true"><img src={heroImage} alt="" fetchPriority="high" /><div /></div>
        <div className="hero-grid" aria-hidden="true" />
        <div className="home-copy">
          <div className="kicker"><span /> Marketing, vendas e tecnologia</div>
          <h1>O primeiro hub de soluções para <em>escritórios de advocacia.</em></h1>
          <p>Desde 2021, gerando contratos com previsibilidade e escala para advogados em todo o Brasil.</p>
          <div className="hero-buttons"><a className="button-primary" href="#contrate">Contrate a 4Juris <ArrowRight /></a><a className="text-link" href="#quem-somos">Conheça o hub <span>↘</span></a></div>
        </div>
        <div className="hero-art hero-art-modern" aria-hidden="true">
          <div className="hero-brand-four"><img src={brandLogo} alt="" /></div>
        </div>
      </section>

      <section className="about section" id="quem-somos">
        <div className="about-heading">
          <span className="section-index">01 / QUEM SOMOS</span>
          <div className="about-title"><h2>O que é a <em>4juris?</em></h2></div>
        </div>
        <div className="about-content">
          <p className="about-statement">A 4juris é um hub de soluções focada em gerar e gerenciar demanda, através de tecnologia e marketing digital, para advogados e escritórios de advocacia por todo o Brasil.</p>
        </div>
        <figure className="about-photo"><img src={socios} alt="Erik Navarro e Nickson Carvalho, sócios da 4Juris" /></figure>
      </section>

      <section className="solutions section" id="solucoes">
        <div className="section-head"><div><span className="section-index">02 / SOLUÇÕES</span><h2>Marketing e vendas para crescer com <em>previsibilidade.</em></h2></div><p>Uma estrutura integrada para atrair, atender e transformar oportunidades em contratos.</p></div>
        <div className="solution-grid">{solutions.map((solution, index) => { const Icon = solution.icon; return <article className="solution-card" key={solution.title}><div className="solution-top"><span>0{index + 1}</span>{solution.logo ? <div className="solution-signature"><img className={`solution-brand-logo ${solution.logoTheme === 'dark' ? 'on-dark' : ''}`} src={solution.logo} alt={solution.logoTheme === 'dark' ? '4Juris' : '4JURIS.AI'} /><strong>{solution.eyebrow}</strong></div> : <Icon />}</div><figure className="solution-image"><img src={solution.image} alt="" loading="lazy" /></figure><h3>{solution.title}</h3><p>{solution.text}</p><ul>{solution.items.map(item => <li key={item}><Check size={14} />{item}</li>)}</ul><a href="#contrate">Mais sobre essa solução <ArrowRight size={16} /></a></article> })}</div>
      </section>

      <section className="testimonials section" id="depoimentos">
        <div className="section-head compact"><div><span className="section-index">03 / CLIENTES 4JURIS</span><h2>Veja o que nossos clientes estão dizendo <em>sobre a 4Juris.</em></h2></div><p>Resultados compartilhados por escritórios que estruturaram sua aquisição de clientes com a nossa equipe.</p></div>
        <div className="feedback-showcase">
          <div className="feedback-copy"><span>RESULTADOS REAIS</span><h3>Estratégia que se transforma em contratos.</h3><p>Mensagens enviadas por clientes durante o acompanhamento das campanhas e da operação comercial.</p><div className="feedback-controls"><button type="button" onClick={() => moveFeedback(-1)} aria-label="Feedback anterior"><ChevronLeft /></button><span><strong>{String(feedbackIndex + 1).padStart(2, '0')}</strong> / {String(feedbackImages.length).padStart(2, '0')}</span><button type="button" onClick={() => moveFeedback(1)} aria-label="Próximo feedback"><ChevronRight /></button></div></div>
          <div className={`feedback-carousel ${feedbackDragging ? 'dragging' : ''}`} aria-live="polite" onMouseEnter={() => setFeedbackPaused(true)} onMouseLeave={() => !feedbackDragging && setFeedbackPaused(false)} onPointerDown={startFeedbackDrag} onPointerMove={dragFeedback} onPointerUp={endFeedbackDrag} onPointerCancel={endFeedbackDrag}>
            <div className="feedback-glow" aria-hidden="true" /><div className="feedback-track" style={{ '--feedback-drag': `${feedbackDragOffset}px` }}>{visibleFeedback.map(({ image, position }, index) => <figure key={`${position}-${feedbackIndex}`} className={index === 1 ? 'featured' : ''}><img src={image} draggable="false" alt={`Mensagem de feedback de cliente 4Juris, item ${position + 1} de ${feedbackImages.length}`} /></figure>)}</div>
          </div>
        </div>
        <div className="feedback-dots" aria-label="Selecionar feedback">{feedbackImages.map((image, index) => <button type="button" key={image} className={index === feedbackIndex ? 'active' : ''} onClick={() => setFeedbackIndex(index)} aria-label={`Mostrar feedback ${index + 1}`} aria-current={index === feedbackIndex ? 'true' : undefined} />)}</div>
        <div className="video-testimonials">
          <div className="video-intro"><span>DEPOIMENTOS EM VÍDEO</span><h3>Histórias contadas por quem viveu a transformação.</h3></div>
          {videoTestimonials.map((videoId, index) => <article className="video-card" key={videoId}><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`} title={`Depoimento em vídeo de cliente 4Juris ${index + 1}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div><div><span>CLIENTE 4JURIS</span><strong>Depoimento {String(index + 1).padStart(2, '0')}</strong></div></article>)}
        </div>
      </section>

      <section className="clients section" aria-labelledby="clients-title">
        <div className="clients-intro"><span className="section-index">CLIENTES 4JURIS</span><h2 id="clients-title">Escritórios que escolheram <em>crescer com método.</em></h2><p>Marcas jurídicas que confiam na 4Juris para estruturar marketing, demanda e operação comercial.</p></div>
        <div className="client-logo-marquee" aria-label="Clientes 4Juris"><div className="client-logo-track">{[0, 1].map(group => <div className="client-logo-group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>{clientLogos.map(client => <figure key={`${group}-${client.path}`}><img src={client.image} alt={group === 0 ? `Logotipo do cliente ${client.name}` : ''} /></figure>)}</div>)}</div></div>
      </section>

      <section className="reach section">
        <div className="reach-copy"><span className="section-index">05 / ALCANCE</span><h2>Use a 4Juris para encontrar clientes em <em>qualquer lugar do Brasil.</em></h2><p>Sabemos que a OAB, hoje, conta com quase <strong>2 milhões de advogados</strong> registrados. Contudo, a minoria está investindo em ferramentas digitais para crescer com previsibilidade e escala.</p><p>Por isso, estamos aqui para <strong>conectar você ao cliente, de forma previsível e massiva, com um método</strong> que tem esses números:</p></div>
        <div className="reach-board"><div className="map-visual"><img className="brazil-map" src={brazilMap} alt="Mapa do Brasil representando a atuação nacional da 4Juris" /></div><div className="reach-data"><div className="map-label"><span>ATUAÇÃO NACIONAL</span><strong>Do seu escritório para todo o Brasil.</strong></div><div className="reach-stats"><article><strong>2021</strong><span>início da nossa história</span></article><article><strong>360°</strong><span>marketing, vendas e tecnologia</span></article><article><strong>BR</strong><span>atendimento em todo o país</span></article></div></div></div>
      </section>

      <section className="team section">
        <div className="section-head"><div><span className="section-index">06 / NOSSO TIME</span><h2>Liderança que entende <em>advocacia e crescimento.</em></h2></div><p>Um time multidisciplinar de profissionais pronto para acelerar os resultados do seu escritório.</p></div>
        <div className="leaders">
          <article><div className="leader-portrait"><img src={erikPhoto} alt="Erik Navarro, embaixador e sócio da 4Juris" /><div>Embaixador & Sócio</div></div><div className="leader-copy"><small>Embaixador & Sócio</small><h3>Erik Navarro</h3><p>Advogado, educador e empreendedor jurídico. Após 19 anos como juiz federal, passou a dedicar sua experiência à capacitação de advogados em prospecção, posicionamento e fechamento de contratos. Tem formação pela UERJ e Harvard Law School, pós-doutorado em Stanford e atuação reconhecida em inovação jurídica.</p></div></article>
          <article><div className="leader-portrait second"><img src={nicksonPhoto} alt="Nickson Carvalho, CEO e sócio fundador da 4Juris" /><div>CEO & Sócio Founder</div></div><div className="leader-copy"><small>CEO & Sócio Founder</small><h3>Nickson Carvalho</h3><p>Bacharelando em Direito, estrategista digital e copywriter. À frente da 4Juris, lidera a construção de soluções especializadas para o mercado jurídico. Em 2023, a empresa foi reconhecida pela ANCEC com o selo Referência Nacional.</p></div></article>
        </div>
        <div className="team-carousel-section">
          <div className="team-carousel-head"><div><span className="section-index">ESPECIALISTAS 4JURIS</span><h2>Um time de especialistas <em>prontos para te ajudar.</em></h2><p>A 4Juris conta com um time multidisciplinar de profissionais para te ajudar a acelerar os seus resultados.</p></div><div className="team-controls"><button type="button" onClick={() => moveTeam(-1)} aria-label="Integrantes anteriores"><ChevronLeft /></button><span><strong>{String(teamIndex + 1).padStart(2, '0')}</strong> / {String(teamMembers.length).padStart(2, '0')}</span><button type="button" onClick={() => moveTeam(1)} aria-label="Próximos integrantes"><ChevronRight /></button></div></div>
          <div className="team-carousel" aria-live="polite">{visibleTeam.map((member, offset) => <article key={`${member.path}-${teamIndex}`}><div className="team-photo"><img src={member.image} alt={`Integrante do time 4Juris ${teamIndex + offset + 1}`} /></div><span>TIME 4JURIS</span></article>)}</div>
        </div>
        <div className="strategic-team"><div className="strategic-team-copy"><span className="section-index">SESSÃO ESTRATÉGICA</span><h2>Estes profissionais vão te acompanhar <em>na sessão estratégica.</em></h2><p>Uma equipe preparada para entender o momento do seu escritório e orientar os próximos passos.</p><a className="button-primary" href="#contrate">Agendar minha sessão <ArrowRight size={16} /></a></div><div className="strategic-team-grid">{strategicTeam.map((member, index) => <figure key={member.path}><img src={member.image} alt={`Profissional da sessão estratégica ${index + 1}`} /></figure>)}</div></div>
      </section>

      <section className="process section" id="contrate">
        <div className="process-copy"><span className="section-index">07 / SESSÃO ESTRATÉGICA</span><h2>Dar o próximo passo leva <em>menos de um minuto.</em></h2><div className="steps"><article><span>01</span><div><h3>Preencha o formulário</h3><p>Envie suas informações de contato. Seus dados estarão seguros com a nossa equipe.</p></div></article><article><span>02</span><div><h3>Receba uma ligação</h3><p>Em até 12 horas, um especialista entrará em contato para agendar sua sessão estratégica.</p></div></article></div></div>
        <form className="lead-form" onSubmit={submit}>{sent ? <div className="form-success"><Check /><h3>Cadastro recebido.</h3><p>Nossa equipe entrará em contato para agendar sua sessão estratégica.</p><button type="button" onClick={() => setSent(false)}>Enviar outro contato</button></div> : <><small>Sessão estratégica</small><h3>Vamos acelerar o seu escritório?</h3><label>Nome completo<input required name="name" placeholder="Como podemos chamar você?" /></label><label>E-mail profissional<input required type="email" name="email" placeholder="voce@escritorio.com.br" /></label><label>WhatsApp<input required type="tel" name="phone" placeholder="(00) 00000-0000" /></label><label>Nome do escritório<input name="company" placeholder="Seu escritório" /></label><button type="submit">Quero uma sessão estratégica <Send size={16} /></button><p>Ao enviar, você concorda em receber o contato da equipe 4Juris.</p></>}</form>
      </section>

      <section className="faq section"><div className="faq-title"><span className="section-index">08 / F.A.Q.</span><h2>Perguntas<br /><em>frequentes.</em></h2><p>Ainda ficou com alguma dúvida?</p><a href="#contrate">Fale com um especialista <ArrowRight size={15} /></a></div><div className="faq-list">{faqs.map(([question, answer], index) => <article className={openFaq === index ? 'open' : ''} key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><ChevronDown /></button><div><p>{answer}</p></div></article>)}</div></section>
    </main>

    <footer className="site-footer"><div className="footer-main"><div><Brand /><p>Marketing, vendas e tecnologia para escritórios de advocacia.</p></div><div><strong>Navegue</strong><a href="#quem-somos">Quem Somos</a><a href="#solucoes">Soluções</a></div><div><strong>Contato</strong><a href="#contrate"><Mail size={14} /> Sessão estratégica</a><a href="#contrate"><MessageCircle size={14} /> Fale com a 4Juris</a><a href="https://www.instagram.com/somos4juris/" target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a></div><a className="back-top" href="#inicio" aria-label="Voltar ao topo"><ArrowUp /></a></div><div className="footer-bottom"><span>4JURIS • 2026 | Todos os direitos reservados.</span><span>Estratégia que conecta.</span></div></footer>
    <PreviewModal template={selected} onClose={() => setSelected(null)} />
    {exitOpen && <div className="exit-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && setExitOpen(false)}>
      <section className="exit-modal" role="dialog" aria-modal="true" aria-labelledby="exit-title">
        <button className="exit-close" type="button" onClick={() => setExitOpen(false)} aria-label="Fechar oferta"><X /></button>
        <div className="exit-art"><img src="/teses-escalaveis.png" alt="E-book Teses Escaláveis no Digital, por 4Juris" /><span>Material exclusivo 4Juris</span></div>
        <div className="exit-content">{exitSent ? <div className="exit-success"><Check /><small>Cadastro recebido</small><h2>O material está a caminho.</h2><p>Confira sua caixa de entrada. Em breve, você receberá as melhores teses para escalar no digital.</p><button type="button" onClick={() => setExitOpen(false)}>Continuar no site</button></div> : <>
          <span className="exit-kicker">Espere <b>✋</b></span><h2 id="exit-title">Não saia de mãos abanando!</h2><p>Tenha acesso às melhores <strong>Teses para Escalar no Digital.</strong></p><small>Coloque suas informações abaixo para receber ↓</small>
          <form onSubmit={event => { event.preventDefault(); setExitSent(true) }}><div className="exit-fields"><label>Nome<input required name="exit-name" placeholder="Seu nome..." /></label><label>E-mail<input required type="email" name="exit-email" placeholder="Seu melhor e-mail..." /></label><label>Contato<input required type="tel" name="exit-phone" placeholder="Seu WhatsApp..." /></label><label>Qual o faturamento médio mensal do escritório?<select required name="exit-revenue" defaultValue=""><option value="" disabled>Selecione uma faixa</option><option>Menos de R$ 10 mil</option><option>De R$ 10 mil a R$ 30 mil</option><option>De R$ 30 mil a R$ 50 mil</option><option>De R$ 50 mil a R$ 100 mil</option><option>Acima de R$ 100 mil</option></select></label></div><button type="submit">Quero receber as teses <ArrowRight size={17} /></button><small>Seus dados estão seguros com a 4Juris.</small></form>
        </>}</div>
      </section>
    </div>}
  </>
}
