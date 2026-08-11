import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, Check, ChevronDown, Copy, ExternalLink, RotateCcw, Save, Send } from 'lucide-react'
import Brand from './Brand'
import LazyTemplateFrame from './LazyTemplateFrame'
import { templates } from '../data/templates'

const STORAGE_KEY = '4juris-client-briefing-draft-v1'

const initialForm = {
  projectName: '', legalArea: '', objective: '', audience: '', highlight: '', action: '', actionOther: '', cta: '', template: '',
  professionalName: '', officeName: '', oab: '', city: '', biography: '', mainService: '', mainServiceDescription: '', additionalServices: '',
  whatsapp: '', whatsappMessage: '', email: '', phone: '', social: '', regions: '', attendance: '', address: '', hours: '',
  primaryColor: '', secondaryColor: '', appearance: '', tone: '', brandWords: '', materials: '', faqs: '', situations: '', team: '',
  additionalRequests: '', testimonials: '', hasDomain: '', domain: '', domainPlatform: '', domainLogin: '', domainAccess: '',
  hasHosting: '', hostingPlatform: '', hostingLogin: '', hostingAccess: '', contactForm: '', integrations: '',
}

const show = value => value?.trim() || 'Não informado'
const requiredLabels = {
  projectName: 'Nome do projeto ou escritório', legalArea: 'Área jurídica principal', objective: 'Objetivo principal da página', audience: 'Público desejado', highlight: 'Serviço em destaque', action: 'Ação esperada do visitante', actionOther: 'Descrição da outra ação', template: 'Template escolhido', professionalName: 'Nome do responsável', oab: 'Número da OAB', city: 'Cidade e estado', mainService: 'Serviço principal', mainServiceDescription: 'Descrição do serviço', whatsapp: 'WhatsApp', regions: 'Cidades ou regiões atendidas', attendance: 'Formato de atendimento', primaryColor: 'Cor principal', hasDomain: 'Informar se já possui domínio', domain: 'Endereço do domínio', domainPlatform: 'Plataforma do domínio', domainLogin: 'Login ou e-mail do domínio', hasHosting: 'Informar se já possui hospedagem', hostingPlatform: 'Plataforma de hospedagem', hostingLogin: 'Login ou e-mail da hospedagem',
}

function loadSavedForm() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved && typeof saved === 'object' ? { ...initialForm, ...saved } : initialForm
  } catch { return initialForm }
}

export default function ClientBriefingForm() {
  const [form, setForm] = useState(loadSavedForm)
  const [copied, setCopied] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const selectTemplate = template => {
    setForm(current => ({ ...current, template: `Template ${String(template.id).padStart(2, '0')} — ${template.name}` }))
    setTemplatesOpen(false)
  }

  useEffect(() => {
    setSaved(false)
    const timer = window.setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)) } catch { /* Storage may be disabled by the browser. */ }
      setSaved(true)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [form])

  const requiredFieldNames = useMemo(() => {
    const requiredFields = ['projectName', 'legalArea', 'objective', 'audience', 'highlight', 'action', 'template', 'professionalName', 'oab', 'city', 'mainService', 'mainServiceDescription', 'whatsapp', 'regions', 'attendance', 'primaryColor', 'hasDomain', 'hasHosting']
    if (form.action === 'Outra') requiredFields.push('actionOther')
    if (form.hasDomain === 'Sim') requiredFields.push('domain', 'domainPlatform', 'domainLogin')
    if (form.hasHosting === 'Sim') requiredFields.push('hostingPlatform', 'hostingLogin')
    return requiredFields
  }, [form.action, form.hasDomain, form.hasHosting])
  const missingRequired = useMemo(() => requiredFieldNames.filter(field => !form[field]?.trim()), [form, requiredFieldNames])
  const canCopy = missingRequired.length === 0
  const completedRequired = requiredFieldNames.length - missingRequired.length
  const completion = Math.round((completedRequired / requiredFieldNames.length) * 100)

  const goToField = name => {
    const element = document.querySelector(`[name="${name}"]`) || document.querySelector(`[data-field-name="${name}"] button`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => element?.focus(), 450)
  }

  const clearDraft = () => {
    if (!window.confirm('Deseja apagar todas as respostas salvas neste formulário?')) return
    localStorage.removeItem(STORAGE_KEY)
    setForm(initialForm)
    setTemplatesOpen(false)
  }

  const result = useMemo(() => `# Briefing preenchido — Landing Page Jurídica

## 🎯 Projeto
- Nome do projeto ou escritório: ${show(form.projectName)}
- Área jurídica principal: ${show(form.legalArea)}
- Objetivo da página: ${show(form.objective)}
- Público desejado: ${show(form.audience)}
- Serviço em destaque: ${show(form.highlight)}
- Ação esperada: ${show(form.action === 'Outra' ? form.actionOther : form.action)}
- Texto do botão: ${show(form.cta)}
- Template escolhido: ${show(form.template)}

## ⚖️ Identificação profissional
- Nome do responsável: ${show(form.professionalName)}
- Escritório: ${show(form.officeName)}
- OAB: ${show(form.oab)}
- Cidade e estado: ${show(form.city)}
- Biografia: ${show(form.biography)}

## 📚 Serviços
- Serviço principal: ${show(form.mainService)}
- Descrição: ${show(form.mainServiceDescription)}
- Outros serviços: ${show(form.additionalServices)}

## 📞 Contato e atendimento
- WhatsApp: ${show(form.whatsapp)}
- Mensagem do WhatsApp: ${show(form.whatsappMessage)}
- E-mail: ${show(form.email)}
- Telefone: ${show(form.phone)}
- Rede profissional: ${show(form.social)}
- Regiões atendidas: ${show(form.regions)}
- Formato: ${show(form.attendance)}
- Endereço: ${show(form.address)}
- Horários: ${show(form.hours)}

## 🎨 Identidade e comunicação
- Cor principal: ${show(form.primaryColor)}
- Cor secundária: ${show(form.secondaryColor)}
- Aparência: ${show(form.appearance)}
- Tom de voz: ${show(form.tone)}
- Palavras da marca: ${show(form.brandWords)}

## 📎 Materiais e conteúdos
- Materiais disponíveis: ${show(form.materials)}
- Perguntas frequentes: ${show(form.faqs)}
- Situações atendidas: ${show(form.situations)}
- Equipe: ${show(form.team)}
- Pedidos adicionais: ${show(form.additionalRequests)}
- Depoimentos ou feedbacks: ${show(form.testimonials)}

## 🌐 Domínio, hospedagem e publicação
- Já possui domínio: ${show(form.hasDomain)}
${form.hasDomain === 'Sim' ? `- Domínio: ${show(form.domain)}\n- Plataforma do domínio: ${show(form.domainPlatform)}\n- Login/e-mail da conta: ${show(form.domainLogin)}\n- Forma de conceder o acesso: ${show(form.domainAccess)}` : ''}
- Já possui hospedagem: ${show(form.hasHosting)}
${form.hasHosting === 'Sim' ? `- Plataforma de hospedagem: ${show(form.hostingPlatform)}\n- Login/e-mail da conta: ${show(form.hostingLogin)}\n- Forma de conceder o acesso: ${show(form.hostingAccess)}` : ''}
- Formulário de contato: ${show(form.contactForm)}
- Outras integrações: ${show(form.integrations)}
`, [form])

  const copyResult = async () => {
    if (!canCopy) return
    try { await navigator.clipboard.writeText(result) }
    catch {
      const field = document.createElement('textarea')
      field.value = result
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  return <div className="client-form-page">
    <header className="client-form-header"><Brand href="/"/><a href="/templates-equipe"><ArrowLeft size={17}/> Voltar</a></header>
    <main className="client-form-main">
      <section className="client-form-intro">
        <span>FORMULÁRIO 4JURIS</span><h1>Conte-nos sobre o seu novo site.</h1>
        <p>Preencha as informações abaixo. Ao finalizar, copie o briefing gerado e envie para a equipe responsável pelo seu projeto.</p>
        <div><b>🔴 Obrigatório</b><span>Campos essenciais para iniciar o site</span></div>
        <div className="draft-status"><span><Save size={15}/>{saved ? 'Rascunho salvo automaticamente' : 'Salvando alterações…'}</span><button type="button" onClick={clearDraft}><RotateCcw size={14}/> Limpar formulário</button></div>
      </section>
      <div className="client-form-layout">
        <form className="client-briefing-form" onSubmit={event => { event.preventDefault(); copyResult() }}>
          <section className={`required-progress ${canCopy ? 'is-complete' : ''}`} aria-live="polite">
            <div className="required-progress-heading"><span>{canCopy ? <Check size={19}/> : <AlertCircle size={19}/>}</span><div><small>PREENCHIMENTO OBRIGATÓRIO</small><h2>{canCopy ? 'Tudo pronto para copiar' : `${missingRequired.length} ${missingRequired.length === 1 ? 'campo pendente' : 'campos pendentes'}`}</h2></div><strong>{completion}%</strong></div>
            <div className="required-progress-bar"><i style={{ width: `${completion}%` }}/></div>
            {!canCopy && <div className="missing-required-list">{missingRequired.map(name => <button type="button" key={name} onClick={() => goToField(name)}>{requiredLabels[name]}<span>Ir ao campo</span></button>)}</div>}
          </section>
          <Group title="🎯 1. Sobre o projeto">
            <Field icon="🏢" label="Nome do projeto ou escritório" required name="projectName" value={form.projectName} onChange={update}/>
            <Field icon="⚖️" label="Área jurídica principal" required name="legalArea" value={form.legalArea} onChange={update}/>
            <Field icon="🎯" label="Objetivo principal da página" required area name="objective" value={form.objective} onChange={update}/>
            <Field icon="👥" label="Quem você deseja atender?" required area name="audience" value={form.audience} onChange={update}/>
            <Field icon="⭐" label="Serviço ou demanda em destaque" required name="highlight" value={form.highlight} onChange={update}/>
            <Choice icon="👆" label="Ação esperada do visitante" required name="action" value={form.action} onChange={update} options={['Entrar em contato pelo WhatsApp', 'Preencher um formulário', 'Telefonar', 'Outra']}/>
            {form.action === 'Outra' && <Field icon="✏️" label="Qual ação?" required name="actionOther" value={form.actionOther} onChange={update}/>} 
            <Field icon="🔘" label="Texto do botão principal" name="cta" value={form.cta} onChange={update}/>
            <TemplateSelector value={form.template} open={templatesOpen} onToggle={() => setTemplatesOpen(open => !open)} onSelect={selectTemplate}/>
          </Group>

          <Group title="⚖️ 2. Identificação profissional">
            <Field icon="👤" label="Nome completo do advogado ou responsável" required name="professionalName" value={form.professionalName} onChange={update}/>
            <Field icon="🏛️" label="Nome do escritório" name="officeName" value={form.officeName} onChange={update}/>
            <Field icon="🪪" label="Número da OAB" required name="oab" value={form.oab} onChange={update} placeholder="OAB/UF 000.000"/>
            <Field icon="📍" label="Cidade e estado" required name="city" value={form.city} onChange={update}/>
            <Field icon="📝" label="Breve biografia profissional" area name="biography" value={form.biography} onChange={update}/>
          </Group>

          <Group title="📚 3. Serviços">
            <Field icon="💼" label="Serviço principal" required name="mainService" value={form.mainService} onChange={update}/>
            <Field icon="📖" label="Descrição do serviço" required area name="mainServiceDescription" value={form.mainServiceDescription} onChange={update}/>
            <Field icon="➕" label="Outros serviços" area name="additionalServices" value={form.additionalServices} onChange={update}/>
          </Group>

          <Group title="📞 4. Contato e atendimento">
            <Field icon="💬" label="WhatsApp" required name="whatsapp" value={form.whatsapp} onChange={update}/>
            <Field icon="👋" label="Mensagem inicial do WhatsApp" name="whatsappMessage" value={form.whatsappMessage} onChange={update}/>
            <Field icon="✉️" label="E-mail profissional" type="email" name="email" value={form.email} onChange={update}/>
            <Field icon="☎️" label="Telefone adicional" name="phone" value={form.phone} onChange={update}/>
            <Field icon="🔗" label="LinkedIn ou outra rede" name="social" value={form.social} onChange={update}/>
            <Field icon="🗺️" label="Cidades ou regiões atendidas" required name="regions" value={form.regions} onChange={update}/>
            <Choice icon="🤝" label="Formato de atendimento" required name="attendance" value={form.attendance} onChange={update} options={['Presencial', 'On-line', 'Presencial e on-line']}/>
            <Field icon="📌" label="Endereço" name="address" value={form.address} onChange={update}/>
            <Field icon="🕐" label="Dias e horários" name="hours" value={form.hours} onChange={update}/>
          </Group>

          <Group title="🎨 5. Identidade visual">
            <Field icon="🎨" label="Cor principal" required name="primaryColor" value={form.primaryColor} onChange={update}/>
            <Field icon="🖌️" label="Cor secundária" name="secondaryColor" value={form.secondaryColor} onChange={update}/>
            <Choice icon="🌓" label="Preferência de aparência" name="appearance" value={form.appearance} onChange={update} options={['Página clara', 'Página escura', 'Áreas claras e escuras', 'Seguir o template']}/>
          </Group>

          <Group title="💬 6. Comunicação">
            <Choice icon="🗣️" label="Tom de voz" name="tone" value={form.tone} onChange={update} options={['Formal', 'Próximo e acolhedor', 'Didático', 'Direto']}/>
            <Field icon="✨" label="Três palavras que definem a página" name="brandWords" value={form.brandWords} onChange={update}/>
          </Group>

          <Group title="📎 7. Materiais disponíveis" note="Envie à equipe o máximo de materiais autorizados: logotipo, fotos, manual da marca, textos e vídeos.">
            <Field icon="📦" label="Descreva os materiais que serão enviados" area name="materials" value={form.materials} onChange={update}/>
          </Group>

          <Group title="➕ 8. Conteúdos adicionais">
            <Field icon="❓" label="Perguntas frequentes" area name="faqs" value={form.faqs} onChange={update}/>
            <Field icon="🧩" label="Situações ou problemas atendidos" area name="situations" value={form.situations} onChange={update}/>
            <Field icon="👥" label="Informações da equipe" area name="team" value={form.team} onChange={update}/>
            <Field icon="📋" label="Outros pedidos" area name="additionalRequests" value={form.additionalRequests} onChange={update}/>
            <Field icon="💬" label="Depoimentos ou feedbacks autorizados" area name="testimonials" value={form.testimonials} onChange={update}/>
          </Group>

          <Group title="🌐 9. Domínio, hospedagem e publicação">
            <Choice icon="🌍" label="Você já possui um domínio?" required name="hasDomain" value={form.hasDomain} onChange={update} options={['Sim', 'Não']}/>
            {form.hasDomain === 'Sim' && <ConditionalFields title="Dados do domínio">
              <Field icon="🔗" label="Qual é o domínio?" required name="domain" value={form.domain} onChange={update} placeholder="exemplo.com.br"/>
              <Field icon="🏪" label="Em qual plataforma ele foi comprado?" required name="domainPlatform" value={form.domainPlatform} onChange={update} placeholder="Ex.: Registro.br, GoDaddy, Hostinger"/>
              <Field icon="👤" label="Login ou e-mail usado na plataforma" required name="domainLogin" value={form.domainLogin} onChange={update}/>
              <Field icon="🔐" label="Como a equipe receberá o acesso?" area name="domainAccess" value={form.domainAccess} onChange={update} placeholder="Prefira adicionar a equipe como colaboradora ou combinar o envio seguro. Não escreva sua senha neste formulário."/>
            </ConditionalFields>}
            <Choice icon="🖥️" label="Você já possui hospedagem?" required name="hasHosting" value={form.hasHosting} onChange={update} options={['Sim', 'Não']}/>
            {form.hasHosting === 'Sim' && <ConditionalFields title="Dados da hospedagem">
              <Field icon="☁️" label="Qual é a plataforma de hospedagem?" required name="hostingPlatform" value={form.hostingPlatform} onChange={update} placeholder="Ex.: Vercel, Hostinger, Locaweb"/>
              <Field icon="👤" label="Login ou e-mail usado na plataforma" required name="hostingLogin" value={form.hostingLogin} onChange={update}/>
              <Field icon="🔐" label="Como a equipe receberá o acesso?" area name="hostingAccess" value={form.hostingAccess} onChange={update} placeholder="Prefira convidar a equipe para o projeto ou combinar o envio seguro. Não escreva sua senha neste formulário."/>
            </ConditionalFields>}
            <Choice icon="📨" label="Precisa de formulário de contato?" name="contactForm" value={form.contactForm} onChange={update} options={['Sim', 'Não']}/>
            <Field icon="🔌" label="Outras integrações" area name="integrations" value={form.integrations} onChange={update}/>
          </Group>
          <button className="generate-briefing" type="submit" disabled={!canCopy}><Copy size={18}/> {canCopy ? 'Gerar e copiar meu briefing' : `Preencha mais ${missingRequired.length} ${missingRequired.length === 1 ? 'campo obrigatório' : 'campos obrigatórios'}`}</button>
        </form>

        <aside className="briefing-result">
          <div className="briefing-result-heading"><span><Send size={17}/></span><div><small>RESULTADO</small><h2>Seu briefing pronto</h2></div></div>
          <p>O conteúdo é atualizado enquanto você preenche. Ao terminar, copie e envie para a equipe 4Juris.</p>
          <pre>{result}</pre>
          <button type="button" onClick={copyResult} disabled={!canCopy} aria-disabled={!canCopy}>{copied ? <Check size={17}/> : <Copy size={17}/>} {copied ? 'Briefing copiado!' : canCopy ? 'Copiar resultado' : `Faltam ${missingRequired.length} ${missingRequired.length === 1 ? 'campo obrigatório' : 'campos obrigatórios'}`}</button>
        </aside>
      </div>
    </main>
  </div>
}

function Group({ title, note, children }) {
  return <section className="client-group" aria-label={title}><h2 className="client-group-title">{title}</h2>{note && <p className="form-section-note">💡 {note}</p>}{children}</section>
}

function ConditionalFields({ title, children }) {
  return <section className="conditional-fields"><h3>🔓 {title}</h3><p>Informe o usuário de acesso, mas não escreva senhas neste formulário.</p>{children}</section>
}

function Field({ icon, label, required, area, ...props }) {
  const Element = area ? 'textarea' : 'input'
  const invalid = Boolean(required && !props.value?.trim())
  return <label className={`client-field ${invalid ? 'is-required-missing' : ''}`}><span><span className="field-label"><i aria-hidden="true">{icon}</i>{label}</span>{required && <b>🔴 Obrigatório</b>}</span><Element required={required} aria-invalid={invalid} {...props}/></label>
}

function Choice({ icon, label, required, options, name, value, onChange }) {
  const invalid = Boolean(required && !value?.trim())
  return <fieldset className={`client-choice ${invalid ? 'is-required-missing' : ''}`}><legend><span className="field-label"><i aria-hidden="true">{icon}</i>{label}</span>{required && <b>🔴 Obrigatório</b>}</legend><div>{options.map(option => <label key={option}><input type="radio" name={name} value={option} checked={value === option} onChange={onChange} required={required} aria-invalid={invalid}/><span>{option}</span></label>)}</div></fieldset>
}

function TemplateSelector({ value, open, onToggle, onSelect }) {
  return <section className={`template-form-selector ${value ? '' : 'is-required-missing'}`} data-field-name="template">
    <div className="template-selector-label"><span className="field-label"><i aria-hidden="true">🖼️</i>Template escolhido</span><b>🔴 Obrigatório</b></div>
    <button className={`template-selector-trigger ${value ? 'has-value' : ''}`} type="button" onClick={onToggle} aria-expanded={open}>
      <span>{value || 'Clique para visualizar e selecionar um template'}</span><ChevronDown size={19}/>
    </button>
    <input className="template-selection-validation" tabIndex="-1" aria-hidden="true" required value={value} onChange={() => {}}/>
    {open && <div className="template-choice-grid">{templates.map((template, index) => <article className="template-choice-card" key={template.id}>
      <div className="template-choice-preview"><LazyTemplateFrame template={template} priority={index < 2} title={`Prévia do template ${template.name}`}/><span>Template {String(template.id).padStart(2, '0')}</span></div>
      <div><h3>{template.name}</h3><p>{template.direction}</p><div className="template-choice-actions"><button type="button" onClick={() => onSelect(template)}>Selecionar</button><a href={`/templates/template-${template.id}/index.html`} target="_blank" rel="noreferrer" aria-label={`Abrir prévia do template ${template.name}`}><ExternalLink size={15}/></a></div></div>
    </article>)}</div>}
  </section>
}
