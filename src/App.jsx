import { useEffect, useMemo, useRef, useState } from 'react'
import { Apple, ArrowRight, ArrowUp, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Code2, Copy, Download, Eye, FileText, FolderOpen, Github, Instagram, Mail, Menu, MessageCircle, Monitor, PackageCheck, Pause, Play, Rocket, Search, Send, Sparkles, Target, Terminal, X } from 'lucide-react'
import Brand from './components/Brand'
import TemplateCard from './components/TemplateCard'
import PreviewModal from './components/PreviewModal'
import ResourcePreviewModal from './components/ResourcePreviewModal'
import ClientBriefingForm from './components/ClientBriefingForm'
import LazyTemplateFrame from './components/LazyTemplateFrame'
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
import tutorialExtractFolder from './assets/tutorial/abrir e extrair pasta baixada.gif'
import tutorialOpenTerminal from './assets/tutorial/abrir terminal.gif'
import tutorialNpmInstall from './assets/tutorial/npm install.gif'
import tutorialNpmRunDev from './assets/tutorial/npm run dev.gif'

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
const templateArchiveSlugs = { 1: 'avlegal', 2: 'almeida-vasconcelos', 3: 'aurea', 4: 'ferraz-saude', 5: 'lume', 6: 'aurea-dark', 7: 'civitas-advocacia', 8: 'maison-albuquerque', 9: 'nexus-law', 10: 'vertice-familia', 11: 'metodo-juridico-360', 12: 'alerta-criminal', 13: 'flora-legal', 14: 'orbe-advocacia', 15: 'alva-real-estate-law' }
const templateArchiveUrl = template => `/downloads/template-${String(template.id).padStart(2, '0')}-${templateArchiveSlugs[template.id]}.zip`
const templateTutorialSteps = [
  { icon: ClipboardList, title: 'O que o cliente deve informar no briefing', text: 'Todas as perguntas necessárias já estão organizadas no Formulário — Nova Landing Page, disponível logo abaixo do tutorial para visualizar, copiar ou baixar.', items: ['Envie o formulário ao cliente e aguarde o preenchimento', 'Confira os campos identificados como obrigatórios', 'Receba também logo, fotos, textos e demais materiais disponíveis'], result: 'Use sempre o formulário oficial abaixo; não é necessário criar outro briefing.' },
  { icon: Search, title: 'Escolha o template', text: 'Compare as miniaturas e abra os modelos em tela cheia. Escolha pela estrutura, conteúdo e objetivo — não apenas pelas cores.', items: ['Considere o público e a ação principal da página', 'Verifique se as seções atendem ao briefing', 'Anote o número ou o nome do modelo escolhido'], result: 'Sem preferência? A IA pode analisar e escolher o modelo mais adequado.' },
  { icon: FileText, title: 'Envie tudo para a IA', text: 'Baixe o Prompt — Criar Landing Page e envie-o em uma nova tarefa junto com o briefing preenchido e a pasta extraída do template.', items: ['Adicione logo, fotos, vídeos e demais mídias em src/assets; nos templates estáticos, utilize a pasta assets', 'Diga à IA os nomes exatos dos arquivos adicionados, o que cada um representa e onde deve aparecer', 'Informe onde a pasta extraída está salva', 'Peça a personalização completa do template baixado'], result: 'A IA trabalhará diretamente na pasta extraída e saberá como utilizar cada arquivo adicionado.' },
  { icon: FolderOpen, title: 'Organize a pasta do projeto', text: 'Depois de baixar o ZIP, extraia todo o conteúdo onde preferir e renomeie a pasta com o nome do cliente ou do projeto.', items: ['A pasta pode ficar em qualquer local escolhido pelo usuário', 'Não trabalhe com os arquivos ainda dentro do ZIP', 'Se precisar do modelo novamente, basta baixá-lo outra vez'], result: 'Não existe caminho obrigatório: o template baixado é o próprio projeto.' },
  { icon: Code2, title: 'Personalize conteúdo, identidade e imagens', text: 'Use o briefing como fonte principal para substituir todo o conteúdo demonstrativo e aplicar a identidade do cliente.', items: ['Aplique nome, OAB, biografia, serviços, contatos, cidade e regiões atendidas', 'Use a paleta de cores, o logotipo, as fontes e os materiais aprovados', 'Coloque imagens, logotipos, vídeos, ícones e qualquer outra mídia na pasta src/assets do projeto; nos templates estáticos, use a pasta assets', 'Depois de adicionar os arquivos, informe à IA os nomes exatos e explique o que cada mídia representa e onde deve ser utilizada', 'Atualize fotos, favicon, título, descrição SEO, WhatsApp e formulários', 'Prefira WebP para fotografias e PNG/SVG para marcas', 'Não invente dados, resultados, credenciais ou depoimentos e remova tudo que pertencer ao modelo'], result: 'O site deve refletir integralmente o briefing. A IA precisa saber quais arquivos foram adicionados à pasta assets e como deve usar cada um.' },
  { icon: CheckCircle2, title: 'Teste antes de entregar', text: 'Abra o projeto localmente e revise a página inteira no computador, tablet e celular.', items: ['Clique em menu, âncoras, CTAs e WhatsApp', 'Envie formulários e valide máscaras dos campos', 'Execute lint e build e corrija todos os erros'], result: 'Só avance quando não houver links quebrados ou conteúdo antigo.' },
  { icon: Rocket, title: 'Publique com GitHub e faça a revisão final', text: 'Depois de validar o projeto, envie o código para um repositório no GitHub e conecte-o à hospedagem utilizada pela equipe.', items: ['Crie um repositório vazio no GitHub e copie sua URL HTTPS', 'Use o Git Bash no Windows ou o Terminal no macOS/Linux para enviar os arquivos', 'Conecte o repositório à hospedagem, configure domínio e SSL', 'Teste novamente o endereço publicado e envie o link para aprovação'], result: 'O site só está pronto quando o repositório estiver atualizado e a versão publicada também tiver sido testada.', git: true },
]

function TutorialGif({ src, alt, caption }) {
  const imageRef = useRef(null)
  const [pausedFrame, setPausedFrame] = useState('')
  const pause = () => {
    const image = imageRef.current
    if (!image) return
    try {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      canvas.getContext('2d').drawImage(image, 0, 0)
      setPausedFrame(canvas.toDataURL('image/png'))
    } catch { setPausedFrame(src) }
  }
  return <figure className={`tutorial-gif ${pausedFrame ? 'is-paused' : ''}`}><div className="tutorial-gif-media"><img ref={imageRef} src={pausedFrame || src} alt={alt} loading="lazy" /><button type="button" onClick={() => pausedFrame ? setPausedFrame('') : pause()} aria-label={pausedFrame ? 'Reproduzir demonstração' : 'Pausar demonstração'}>{pausedFrame ? <Play size={15} /> : <Pause size={15} />}<span>{pausedFrame ? 'Reproduzir' : 'Pausar'}</span></button></div><figcaption><Eye size={13} /> {caption}</figcaption></figure>
}

export default function App() {
  const currentPath = window.location.pathname.replace(/\/+$/, '')
  const templatesRoute = currentPath === '/templates' || currentPath === '/templates-lp'
  const teamTemplatesRoute = currentPath === '/templates-equipe'
  const clientFormRoute = currentPath === '/formulario-landing-page'
  const catalogRoute = templatesRoute || teamTemplatesRoute || clientFormRoute
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
  const [tutorialIndex, setTutorialIndex] = useState(0)
  const [copiedResource, setCopiedResource] = useState(null)
  const [resourcePreview, setResourcePreview] = useState(null)
  const feedbackDragStart = useRef(0)
  const tutorialOrder = [0, 1, 2, 3, 4, 5, 6, 8, 7]
  const tutorialPosition = tutorialOrder.indexOf(tutorialIndex)
  const goToTutorial = direction => setTutorialIndex(tutorialOrder[Math.max(0, Math.min(tutorialOrder.length - 1, tutorialPosition + direction))])
  const filtered = useMemo(() => templates.filter(template => Object.values(template).flat().join(' ').toLowerCase().includes(query.toLowerCase())), [query])

  useEffect(() => {
    document.body.style.overflow = selected || resourcePreview || menuOpen || exitOpen ? 'hidden' : ''
    const close = event => event.key === 'Escape' && (setSelected(null), setResourcePreview(null), setMenuOpen(false), setExitOpen(false))
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close) }
  }, [selected, resourcePreview, menuOpen, exitOpen])

  useEffect(() => {
    if (catalogRoute) return undefined
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
  }, [catalogRoute])

  useEffect(() => {
    if (!catalogRoute) return undefined
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    document.title = 'Catálogo de templates | 4Juris'
    if (description) description.content = 'Catálogo reservado de landing pages jurídicas da 4Juris.'
    if (teamTemplatesRoute) {
      document.title = 'Downloads de templates | Equipe 4Juris'
      if (description) description.content = 'Área interna para download dos templates da 4Juris.'
    }
    if (clientFormRoute) {
      document.title = 'Briefing para Landing Page | 4Juris'
      if (description) description.content = 'Formulário para preencher o briefing de uma nova Landing Page Jurídica.'
    }
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow, noarchive'
    document.head.appendChild(robots)
    return () => { document.title = previousTitle; if (description && previousDescription) description.content = previousDescription; robots.remove() }
  }, [catalogRoute, teamTemplatesRoute, clientFormRoute])

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
  const copyResource = async (url, resource) => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Arquivo indisponível')
      const content = await response.text()
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(content)
      else {
        const field = document.createElement('textarea')
        field.value = content
        field.style.position = 'fixed'
        field.style.opacity = '0'
        document.body.appendChild(field)
        field.select()
        const copied = document.execCommand('copy')
        field.remove()
        if (!copied) throw new Error('Cópia não permitida')
      }
      setCopiedResource(resource)
      window.setTimeout(() => setCopiedResource(current => current === resource ? null : current), 2500)
    } catch {
      setCopiedResource(`error-${resource}`)
    }
  }

  if (clientFormRoute) return <ClientBriefingForm />

  if (teamTemplatesRoute) return <div className="team-templates-shell">
    <header className="team-templates-header"><Brand href="/" /><div className="team-templates-title"><span>ÁREA INTERNA</span><strong>Downloads de templates</strong></div><label className="search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Buscar por nome, estilo ou recurso" aria-label="Buscar templates para download" /></label></header>
    <main className="team-templates-main"><section className="team-downloads section">
      <div className="team-downloads-hero"><div><span className="library-kicker">BIBLIOTECA DA EQUIPE 4JURIS</span><h1>Arquivos prontos para <em>usar e personalizar.</em></h1><p>Escolha visualmente o melhor ponto de partida, confira a versão completa e baixe o pacote com a página, estilos, scripts e recursos do projeto.</p></div><aside><PackageCheck /><strong>{String(filtered.length).padStart(2, '0')}</strong><span>pacotes disponíveis</span></aside></div>
      <details className="template-tutorial" aria-labelledby="template-tutorial-title">
        <summary className="tutorial-heading"><span className="tutorial-icon"><Sparkles /></span><div><span className="library-kicker">TUTORIAL OPCIONAL</span><h2 id="template-tutorial-title">Precisa de ajuda para começar?</h2><p>Abra o guia e avance pelas etapas usando as setas. Você pode consultar somente o assunto de que precisa.</p></div><span className="tutorial-start">Iniciar tutorial <ChevronDown size={18} /></span></summary>
        <div className="tutorial-body">
          <div className="tutorial-navigation"><button type="button" onClick={() => goToTutorial(-1)} disabled={tutorialPosition === 0} aria-label="Assunto anterior"><ChevronLeft /></button><div><span>PASSO {String(tutorialPosition + 1).padStart(2, '0')} DE 09</span><div>{tutorialOrder.map((_, position) => <i className={position === tutorialPosition ? 'active' : ''} key={position} />)}</div></div><button type="button" onClick={() => goToTutorial(1)} disabled={tutorialPosition === tutorialOrder.length - 1} aria-label="Próximo assunto"><ChevronRight /></button></div>
          {tutorialIndex === 0 && <div className="tutorial-slide tutorial-welcome"><span className="tutorial-slide-icon"><ClipboardList /></span><div><small>ANTES DE COMEÇAR</small><h3>Prepare o briefing e os arquivos do cliente</h3><p>Envie ao cliente o link do formulário preenchível. Ao terminar, ele copiará o briefing gerado e devolverá o conteúdo à equipe junto com os materiais autorizados.</p><ul><li><Check size={14} /> Formulário preenchido e copiado pelo cliente</li><li><Check size={14} /> Logo, fotos e textos autorizados</li><li><Check size={14} /> Prompt oficial para uso interno da equipe</li></ul><a className="tutorial-resource-preview" href="/formulario-landing-page" target="_blank" rel="noreferrer"><Eye size={16} /> Abrir formulário preenchível</a></div></div>}
        {tutorialIndex > 0 && tutorialIndex < 8 && (() => { const step = templateTutorialSteps[tutorialIndex - 1]; const Icon = step.icon; return <article className={`tutorial-slide tutorial-topic ${step.git ? 'tutorial-publish' : ''}`}><span className="tutorial-slide-icon"><Icon /></span><div><small>ASSUNTO {String(tutorialIndex).padStart(2, '0')}</small><h3>{step.title}</h3><p>{step.text}</p><ul>{step.items.map(item => <li key={item}><Check size={14} /> <span>{item}</span></li>)}</ul><strong className="tutorial-result">{step.result}</strong>{step.git && <details className="git-publish-guide"><summary><span><Github size={19} /><span><strong>Como enviar o site para o GitHub</strong><small>Instalação do Git e envio do projeto em todos os sistemas</small></span></span><ChevronDown size={18} /></summary><div className="git-guide-content"><section className="git-install-integrated"><div className="publish-guide-title"><Download /><div><small>INSTALAÇÃO DO GIT</small><h3>Instale o Git antes de enviar</h3><p>Este processo é necessário apenas uma vez no computador.</p></div></div><div className="unix-install-grid"><article><Monitor /><div><h4>Windows</h4><p>Instale o Git Bash e use-o para executar os comandos do projeto.</p><a className="git-windows-download" href="https://github.com/git-for-windows/git/releases/download/v2.55.0.windows.3/Git-2.55.0.3-64-bit.exe" target="_blank" rel="noreferrer"><Download size={15} /> Baixar Git Bash</a><small>Depois confirme com <b>git --version</b>.</small></div></article><article><Apple /><div><h4>macOS</h4><p>Não precisa do Git Bash. No Terminal, use uma das opções:</p><code>xcode-select --install</code><code>brew install git</code><small>Depois confirme com <b>git --version</b>.</small></div></article><article><Terminal /><div><h4>Ubuntu e Debian</h4><p>Use o Terminal e o gerenciador <b>apt</b>:</p><code>sudo apt update</code><code>sudo apt install git</code><small>Depois execute <b>git --version</b>.</small></div></article><article><Terminal /><div><h4>Fedora e derivados</h4><p>Use o Terminal e o gerenciador <b>dnf</b>:</p><code>sudo dnf install git</code><small>Depois execute <b>git --version</b>.</small></div></article></div></section><div className="github-steps"><h4>Enviar o projeto pela primeira vez</h4><ol><li>Entre em <b>github.com</b>, clique em <b>New repository</b>, dê um nome ao projeto e crie um repositório vazio.</li><li>Copie a URL HTTPS do repositório e execute os comandos abaixo dentro da pasta do site.</li></ol><div className="git-commands"><code>git init</code><code>git add .</code><code>git commit -m "Primeira versão"</code><code>git branch -M main</code><code>git remote add origin URL_DO_REPOSITORIO</code><code>git push -u origin main</code></div><p>Substitua <code>URL_DO_REPOSITORIO</code> pela URL copiada no GitHub. Se o navegador solicitar autorização, entre na conta e confirme.</p><h4>Enviar alterações futuras</h4><div className="git-commands"><code>git add .</code><code>git commit -m "Descreva a alteração"</code><code>git push</code></div><p>Depois, conecte o repositório à hospedagem usada pela equipe. O GitHub armazena o código; a hospedagem é responsável por publicar o site.</p></div></div></details>}</div></article> })()}
        {tutorialIndex === 7 && <div className="publish-companion-guides"><section className="git-install-unix"><div className="publish-guide-title"><Terminal /><div><small>INSTALAÇÃO DO GIT</small><h3>Git no macOS e Linux</h3><p>Esses sistemas não precisam do Git Bash. Instale o Git quando necessário e use o Terminal nativo.</p></div></div><div className="unix-install-grid"><article><Apple /><div><h4>macOS</h4><p>No Terminal, instale pelas ferramentas da Apple ou pelo Homebrew:</p><code>xcode-select --install</code><code>brew install git</code><small>Use uma das opções e confirme com <b>git --version</b>.</small></div></article><article><Terminal /><div><h4>Ubuntu e Debian</h4><p>Use o gerenciador de pacotes <b>apt</b>:</p><code>sudo apt update</code><code>sudo apt install git</code><small>Depois execute <b>git --version</b>.</small></div></article><article><Terminal /><div><h4>Fedora e derivados</h4><p>Use o gerenciador de pacotes <b>dnf</b>:</p><code>sudo dnf install git</code><small>Depois execute <b>git --version</b>.</small></div></article></div></section><section className="vercel-publish-guide"><div className="publish-guide-title"><Rocket /><div><small>HOSPEDAGEM</small><h3>Como publicar a LP na Vercel</h3><p>Importe o repositório do GitHub e deixe a Vercel criar uma nova publicação sempre que a equipe enviar alterações.</p></div></div><ol className="vercel-steps"><li><span>01</span><div><h4>Entre na Vercel</h4><p>Acesse <a href="https://vercel.com/new" target="_blank" rel="noreferrer">vercel.com/new</a>, entre com a conta do GitHub e autorize o acesso aos repositórios.</p></div></li><li><span>02</span><div><h4>Importe o repositório</h4><p>Clique em <b>New Project</b>, localize o repositório da LP no GitHub e selecione <b>Import</b>.</p></div></li><li><span>03</span><div><h4>Revise a configuração</h4><p>A Vercel normalmente detecta o Vite. Confirme o comando de build <code>npm run build</code> e, se necessário, o diretório de saída <code>dist</code>.</p></div></li><li><span>04</span><div><h4>Faça a primeira publicação</h4><p>Clique em <b>Deploy</b>, aguarde o build e abra o endereço <code>.vercel.app</code> gerado para testar a página completa.</p></div></li><li><span>05</span><div><h4>Conecte o domínio</h4><p>No projeto, abra <b>Settings → Domains</b>, informe o domínio e siga os registros DNS indicados. A Vercel configura o SSL.</p></div></li><li><span>06</span><div><h4>Publique futuras alterações</h4><p>Depois da integração, novos envios para a branch principal com <code>git push</code> criam novas publicações automaticamente.</p></div></li></ol><div className="vercel-final-check"><CheckCircle2 /><p><strong>Revisão final:</strong> teste menus, WhatsApp, formulários, celular, domínio e HTTPS no endereço publicado.</p></div></section></div>}
        {tutorialIndex === 8 && <section className="developer-guide" aria-labelledby="developer-guide-title">
          <div className="developer-guide-heading"><span><Code2 /></span><div><small>PASSO A PASSO TÉCNICO</small><h3 id="developer-guide-title">Como abrir e executar o site no VS Code</h3><p>Este procedimento instala as ferramentas necessárias, abre a pasta extraída do template e inicia um servidor local para acompanhar as alterações no navegador.</p></div></div>
          <details className="tools-installer">
            <summary><span><span className="tools-installer-icon"><Download size={22} /></span><span><b>INSTALAÇÃO</b><strong>Precisa instalar as ferramentas?</strong><small>Baixe o Visual Studio Code, o Node.js e o npm aqui</small></span></span><span className="tools-installer-open">Ver instaladores <ChevronDown size={19} /></span></summary>
            <div className="tools-installer-content"><div className="install-once"><CheckCircle2 size={21} /><div><strong>Você só precisa fazer este processo uma única vez</strong><p>Depois que o VS Code e o Node.js estiverem instalados no computador, eles poderão ser usados em todos os próximos projetos.</p></div></div><div className="installation-groups"><section className="installation-group vscode-group"><div className="installation-group-heading"><span>01</span><div><h4>Visual Studio Code</h4><p>Editor utilizado para abrir a pasta, alterar os arquivos e acessar o terminal do projeto.</p></div></div><a className="tool-download vscode-download" href="https://code.visualstudio.com/download?_exp_download=fb315fc982" target="_blank" rel="noreferrer"><Code2 size={17} /><span><strong>Baixar Visual Studio Code</strong><small>Escolha a versão para o seu computador</small></span><Download size={15} /></a></section><section className="installation-group node-group"><div className="installation-group-heading"><span>02</span><div><h4>Node.js e npm</h4><p>O Node.js executa o projeto. O npm será instalado automaticamente junto com ele.</p></div></div><div className="tools-download-grid"><a className="tool-download" href="https://nodejs.org/dist/v24.19.0/node-v24.19.0-x64.msi" target="_blank" rel="noreferrer"><Monitor size={17} /><span><strong>Node.js para Windows</strong><small>Instalador .msi</small></span><Download size={15} /></a><a className="tool-download" href="https://nodejs.org/dist/v24.19.0/node-v24.19.0.pkg" target="_blank" rel="noreferrer"><Apple size={17} /><span><strong>Node.js para macOS</strong><small>Instalador .pkg</small></span><Download size={15} /></a><a className="tool-download" href="https://nodejs.org/dist/v24.19.0/node-v24.19.0-linux-x64.tar.xz" target="_blank" rel="noreferrer"><Terminal size={17} /><span><strong>Node.js para Linux</strong><small>Pacote .tar.xz</small></span><Download size={15} /></a></div></section></div><div className="tools-check"><p>Depois da instalação, abra um novo terminal e confirme se instalou corretamente:</p><div className="tools-check-commands"><div className="terminal-line"><code>node --version</code><small>confirma o Node.js</small></div><div className="terminal-line"><code>npm --version</code><small>confirma o npm</small></div></div></div></div>
          </details>
          <div className="developer-steps">
            <article><span>01</span><h4>Abra a pasta baixada</h4><p>Extraia o ZIP, renomeie a pasta com o nome do cliente e, no VS Code, use <b>Arquivo → Abrir Pasta</b>. Selecione essa pasta e confirme que ela contém o <code>package.json</code>.</p><TutorialGif src={tutorialExtractFolder} alt="Demonstração de como extrair e abrir a pasta baixada" caption="Extraia o ZIP antes de abrir o projeto." /></article>
            <article><span>02</span><h4>Abra o terminal integrado</h4><p>Use <b>Terminal → Novo Terminal</b> ou o atalho <kbd>Ctrl</kbd> + <kbd>`</kbd>. O caminho exibido deve terminar com o nome do projeto do cliente.</p><TutorialGif src={tutorialOpenTerminal} alt="Demonstração de como abrir o terminal integrado do VS Code" caption="Abra um novo terminal dentro do projeto." /><div className="terminal-line"><code>npm install</code><small>instala as dependências</small></div><TutorialGif src={tutorialNpmInstall} alt="Demonstração da execução do comando npm install" caption="Digite npm install e aguarde a conclusão." /></article>
            <article><span>03</span><h4>Inicie o site para testar</h4><p>Execute <code>npm run dev</code> no terminal do VS Code. Esse comando inicia uma <b>versão de testes da LP somente no seu computador</b>: ela ainda não estará publicada na internet nem acessível ao cliente.</p><TutorialGif src={tutorialNpmRunDev} alt="Demonstração da execução do comando npm run dev" caption="Digite npm run dev para iniciar os testes locais." /><p>Enquanto o comando estiver rodando, clique no endereço abaixo para abrir o site no navegador. Use essa página para conferir textos, imagens, botões, links e o funcionamento da LP durante a edição. Sempre que você salvar uma alteração, a prévia normalmente será atualizada automaticamente.</p><a className="local-preview-link" href="http://localhost:5173" target="_blank" rel="noreferrer">Abrir ambiente de testes — http://localhost:5173</a><div className="terminal-line"><code>npm run dev</code><small>inicia o ambiente local de testes</small></div><p><small><b>Importante:</b> o endereço funciona apenas enquanto o terminal estiver executando o comando. Para encerrar os testes, volte ao terminal e pressione <kbd>Ctrl</kbd> + <kbd>C</kbd>.</small></p></article>
            <article><span>04</span><h4>Edite e acompanhe</h4><p>Altere os arquivos dentro de <code>src</code>, salve com <kbd>Ctrl</kbd> + <kbd>S</kbd> e acompanhe a atualização automática no navegador. Para parar o servidor, use <kbd>Ctrl</kbd> + <kbd>C</kbd>.</p></article>
            <article><span>05</span><h4>Valide a versão final</h4><p>Antes de publicar, execute os comandos abaixo. O lint procura problemas no código; o build cria a versão otimizada na pasta <code>dist</code>.</p><div className="terminal-line"><code>npm run lint</code><small>verifica o código</small></div><div className="terminal-line"><code>npm run build</code><small>gera a versão final</small></div></article>
          </div>
          <div className="npm-help"><strong>Se um comando falhar</strong><p>Confira se o terminal está na pasta extraída que contém o <code>package.json</code>, leia a mensagem completa e corrija o erro antes de continuar.</p></div>
        </section>}
        </div>
      </details>
      <section className="team-resources" aria-labelledby="team-resources-title">
        <div className="team-resources-intro"><span className="library-kicker">MATERIAIS DE APOIO</span><h2 id="team-resources-title">Comece o projeto com todas as informações.</h2><p>Baixe o formulário para coletar os dados do cliente e use o prompt oficial para transformar o briefing em uma nova landing page.</p></div>
        <div className="team-resource-list">
          <article><span className="team-resource-icon"><ClipboardList /></span><div><small>ETAPA 01 · BRIEFING</small><h3>Formulário — Nova Landing Page</h3><p>Envie esta página ao cliente para ele preencher, marcar as opções e copiar o briefing pronto.</p></div><div className="team-resource-actions"><a className="resource-view-button" href="/formulario-landing-page" target="_blank" rel="noreferrer"><Eye size={16} /> Preencher formulário</a><button type="button" onClick={() => copyResource('/downloads/FORMULARIO-NOVA-LANDING-PAGE.md', 'formulario')} className={copiedResource === 'formulario' ? 'copied' : copiedResource === 'error-formulario' ? 'copy-error' : ''}>{copiedResource === 'formulario' ? <Check size={16} /> : <Copy size={16} />} {copiedResource === 'formulario' ? 'Copiado' : copiedResource === 'error-formulario' ? 'Erro ao copiar' : 'Copiar modelo'}</button><a href="/downloads/FORMULARIO-NOVA-LANDING-PAGE.md" download><Download size={16} /> Baixar</a></div></article>
          <article><span className="team-resource-icon"><FileText /></span><div><small>ETAPA 02 · PRODUÇÃO</small><h3>Prompt — Criar Landing Page</h3><p>Instruções internas para a equipe personalizar e validar o template usando o briefing.</p></div><div className="team-resource-actions"><button className="resource-view-button" type="button" onClick={() => setResourcePreview({ title: 'Prompt — Criar Landing Page', url: '/downloads/PROMPT-CRIAR-LANDING-PAGE.md' })}><Eye size={16} /> Visualizar</button><button type="button" onClick={() => copyResource('/downloads/PROMPT-CRIAR-LANDING-PAGE.md', 'prompt')} className={copiedResource === 'prompt' ? 'copied' : copiedResource === 'error-prompt' ? 'copy-error' : ''}>{copiedResource === 'prompt' ? <Check size={16} /> : <Copy size={16} />} {copiedResource === 'prompt' ? 'Copiado' : copiedResource === 'error-prompt' ? 'Erro ao copiar' : 'Copiar'}</button><a href="/downloads/PROMPT-CRIAR-LANDING-PAGE.md" download><Download size={16} /> Baixar</a></div></article>
        </div>
      </section>
      <div className="download-grid">{filtered.map((template, index) => <article className="download-card" key={template.id}>
        <button className="download-preview" type="button" onClick={() => setSelected(template)} aria-label={`Abrir prévia do template ${template.name}`}><LazyTemplateFrame template={template} priority={index < 2} title={`Foto do template ${template.name}`} /><div className="download-preview-overlay"><span>LP / {String(template.id).padStart(2, '0')}</span><strong>Clique para visualizar</strong></div></button>
        <div className="download-card-content"><div className="download-card-top"><span>Template {String(template.id).padStart(2, '0')}</span><small>v{template.version}</small></div>
        <h2>{template.name}</h2><p>{template.direction}</p>
        <div className="download-card-meta"><span>Pacote completo</span><span>HTML · CSS · Assets</span></div>
        <div className="download-card-actions"><a className="download-primary" href={templateArchiveUrl(template)} download><Download size={16} /> Baixar ZIP</a></div>
        </div>
      </article>)}</div>
      {filtered.length === 0 && <p className="empty">Nenhum pacote encontrado para essa busca.</p>}
    </section></main>
    <PreviewModal template={selected} onClose={() => setSelected(null)} />
    <ResourcePreviewModal resource={resourcePreview} onClose={() => setResourcePreview(null)} />
  </div>

  if (templatesRoute) return <div className="templates-page-shell">
    <header className="templates-page-header"><Brand href="/" /><div className="templates-toolbar-title"><strong>Templates LP</strong><span>Biblioteca reservada</span></div><label className="search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Buscar template" aria-label="Buscar templates" /></label></header>
    <main className="templates-page-main"><section className="catalog section">
      <div className="catalog-tools"><div><span className="library-kicker">COLEÇÃO 4JURIS</span><h1>Escolha a direção visual ideal.</h1><p>Explore cada proposta em tela cheia e compare estilos, estrutura e posicionamento.</p></div><strong><b>{String(filtered.length).padStart(2, '0')}</b><span>modelos</span></strong></div>
      <div className="grid">{filtered.map((template, index) => <TemplateCard key={template.id} template={template} priority={index < 2} onPreview={setSelected} />)}</div>
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
