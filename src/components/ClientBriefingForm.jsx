import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowLeft, Check, ChevronDown, Copy, ExternalLink, RotateCcw, Save, Send, Trash2, UserPlus } from 'lucide-react'
import Brand from './Brand'
import LazyTemplateFrame from './LazyTemplateFrame'
import { templates } from '../data/templates'

const STORAGE_KEY = '4juris-client-briefing-draft-v1'
const BRAZILIAN_STATES = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'],
  ['ES', 'Espírito Santo'], ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
  ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
]
const STATE_CODES = new Set(BRAZILIAN_STATES.map(([code]) => code))

const formatPhone = value => {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2)
  digits = digits.slice(0, 11)
  if (!digits) return ''
  if (digits.length < 3) return `(${digits}`
  const areaCode = digits.slice(0, 2)
  const number = digits.slice(2)
  if (number.length <= 4) return `(${areaCode}) ${number}`
  const splitAt = number.length > 8 ? 5 : 4
  return `(${areaCode}) ${number.slice(0, splitAt)}-${number.slice(splitAt)}`
}

const formatOabNumber = value => {
  const normalized = value.toUpperCase().replace(/[^0-9A-Z]/g, '')
  const digits = (normalized.match(/^\d+/)?.[0] || '').slice(0, 7)
  const suffix = normalized.slice(digits.length).replace(/[^A-Z]/g, '').slice(0, 2)
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return suffix ? `${formatted}-${suffix}` : formatted
}

const formatDomain = value => value.toLowerCase().replace(/\s/g, '').replace(/^https?:\/\//, '').replace(/\/+$/, '')

const initialForm = {
  template: '', professionalName: '', officeName: '', oab: '', additionalLawyers: [], city: '', state: '', biography: '',
  whatsapp: '', email: '', phone: '', social: '', regions: '', attendance: '', address: '', hours: '',
  primaryColor: '', secondaryColor: '', appearance: '', faqs: '', situations: '', team: '', additionalRequests: '', testimonials: '',
  hasDomain: '', domain: '', domainPlatform: '', domainLogin: '', domainPassword: '',
  hasHosting: '', hostingPlatform: '', hostingLogin: '', hostingPassword: '', integrations: '',
}

const show = value => value?.trim() || 'Não informado'
const requiredLabels = {
  template: 'Template escolhido', professionalName: 'Nome do responsável', oab: 'Número da OAB', city: 'Cidade', state: 'Estado', whatsapp: 'WhatsApp', regions: 'Cidades ou regiões atendidas', attendance: 'Formato de atendimento', primaryColor: 'Cor principal', hasDomain: 'Informar se já possui domínio', domain: 'Endereço do domínio', domainPlatform: 'Plataforma do domínio', domainLogin: 'Login ou e-mail do domínio', hasHosting: 'Informar se já possui hospedagem', hostingPlatform: 'Plataforma de hospedagem', hostingLogin: 'Login ou e-mail da hospedagem',
}

function loadSavedForm() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved || typeof saved !== 'object') return initialForm
    const migrated = { ...initialForm, ...saved, additionalLawyers: Array.isArray(saved.additionalLawyers) ? saved.additionalLawyers : [] }
    const cityState = migrated.city.match(/^(.*?)\s*(?:-|\/)\s*([A-Z]{2})$/i)
    if (!migrated.state && cityState && STATE_CODES.has(cityState[2].toUpperCase())) {
      migrated.city = cityState[1].trim()
      migrated.state = cityState[2].toUpperCase()
    }
    const legacyOab = migrated.oab.match(/^OAB\/[A-Z]{2}\s*([\d.]+(?:-[A-Z]{1,2})?)$/i)
    if (legacyOab) migrated.oab = formatOabNumber(legacyOab[1])
    delete migrated.oabState
    migrated.additionalLawyers = migrated.additionalLawyers.map(lawyer => ({ name: String(lawyer?.name || ''), oab: formatOabNumber(String(lawyer?.oab || '')) }))
    migrated.whatsapp = formatPhone(migrated.whatsapp)
    migrated.phone = formatPhone(migrated.phone)
    return migrated
  } catch { return initialForm }
}

export default function ClientBriefingForm() {
  const [form, setForm] = useState(loadSavedForm)
  const [copied, setCopied] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const update = event => {
    setSubmitted(false)
    setSubmitError('')
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  }
  const selectTemplate = template => {
    setSubmitted(false)
    setSubmitError('')
    setForm(current => ({ ...current, template: `Template ${String(template.id).padStart(2, '0')} — ${template.name}` }))
    setTemplatesOpen(false)
  }
  const addLawyer = () => {
    setSubmitted(false)
    setSubmitError('')
    setForm(current => ({ ...current, additionalLawyers: [...current.additionalLawyers, { name: '', oab: '' }] }))
  }
  const updateLawyer = (index, field, value) => {
    setSubmitted(false)
    setSubmitError('')
    setForm(current => ({ ...current, additionalLawyers: current.additionalLawyers.map((lawyer, lawyerIndex) => lawyerIndex === index ? { ...lawyer, [field]: value } : lawyer) }))
  }
  const removeLawyer = index => {
    setSubmitted(false)
    setSubmitError('')
    setForm(current => ({ ...current, additionalLawyers: current.additionalLawyers.filter((_, lawyerIndex) => lawyerIndex !== index) }))
  }

  useEffect(() => {
    setSaved(false)
    const timer = window.setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form, domainPassword: '', hostingPassword: '' })) } catch { /* Storage may be disabled by the browser. */ }
      setSaved(true)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [form])

  const requiredFieldNames = useMemo(() => {
    const requiredFields = ['template', 'professionalName', 'oab', 'city', 'state', 'whatsapp', 'regions', 'attendance', 'primaryColor', 'hasDomain', 'hasHosting']
    if (form.hasDomain === 'Sim') requiredFields.push('domain', 'domainPlatform', 'domainLogin')
    if (form.hasHosting === 'Sim') requiredFields.push('hostingPlatform', 'hostingLogin')
    return requiredFields
  }, [form.hasDomain, form.hasHosting])
  const missingRequired = useMemo(() => {
    const missing = requiredFieldNames.filter(field => !form[field]?.trim())
    form.additionalLawyers.forEach((lawyer, index) => {
      if (!lawyer.name.trim()) missing.push(`additionalLawyerName-${index}`)
      if (!lawyer.oab.trim()) missing.push(`additionalLawyerOab-${index}`)
    })
    return missing
  }, [form, requiredFieldNames])
  const canCopy = missingRequired.length === 0
  const totalRequired = requiredFieldNames.length + (form.additionalLawyers.length * 2)
  const completedRequired = totalRequired - missingRequired.length
  const completion = Math.round((completedRequired / totalRequired) * 100)

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
    setSubmitted(false)
    setSubmitError('')
  }

  const result = useMemo(() => `# Informações do cliente — Landing Page Jurídica

## 🖼️ Template
- Template escolhido: ${show(form.template)}

## ⚖️ Identificação profissional
- Nome do responsável: ${show(form.professionalName)}
- Escritório: ${show(form.officeName)}
- OAB: ${show(form.oab)}
${form.additionalLawyers.length ? form.additionalLawyers.map((lawyer, index) => `- Advogado adicional ${index + 1}: ${show(lawyer.name)} — OAB ${show(lawyer.oab)}`).join('\n') : '- Advogados adicionais: Nenhum informado'}
- Cidade: ${show(form.city)}
- Estado: ${show(form.state)}
- Biografia: ${show(form.biography)}

## 📞 Contato e atendimento
- WhatsApp: ${show(form.whatsapp)}
- E-mail: ${show(form.email)}
- Telefone: ${show(form.phone)}
- Rede profissional: ${show(form.social)}
- Regiões atendidas: ${show(form.regions)}
- Formato: ${show(form.attendance)}
- Endereço: ${show(form.address)}
- Horários: ${show(form.hours)}

## 🎨 Identidade visual
- Cor principal: ${show(form.primaryColor)}
- Cor secundária: ${show(form.secondaryColor)}
- Aparência: ${show(form.appearance)}

## ➕ Conteúdos adicionais
- Perguntas frequentes: ${show(form.faqs)}
- Situações atendidas: ${show(form.situations)}
- Equipe: ${show(form.team)}
- Pedidos adicionais: ${show(form.additionalRequests)}
- Depoimentos ou feedbacks: ${show(form.testimonials)}

## 🌐 Domínio, hospedagem e publicação
- Já possui domínio: ${show(form.hasDomain)}
${form.hasDomain === 'Sim' ? `- Domínio: ${show(form.domain)}\n- Plataforma do domínio: ${show(form.domainPlatform)}\n- Login/e-mail da conta: ${show(form.domainLogin)}\n- Senha do domínio: ${show(form.domainPassword)}` : ''}
- Já possui hospedagem: ${show(form.hasHosting)}
${form.hasHosting === 'Sim' ? `- Plataforma de hospedagem: ${show(form.hostingPlatform)}\n- Login/e-mail da conta: ${show(form.hostingLogin)}\n- Senha da hospedagem: ${show(form.hostingPassword)}` : ''}
- Outras integrações: ${show(form.integrations)}
`, [form])

  const submitBriefing = async event => {
    event.preventDefault()
    if (!canCopy || submitting) return
    setSubmitting(true)
    setSubmitted(false)
    setSubmitError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, formType: 'landing-page-briefing', briefing: result }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Não foi possível enviar o briefing.')
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message || 'Não foi possível enviar. Tente novamente em instantes.')
    } finally {
      setSubmitting(false)
    }
  }

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
        <p>Preencha as informações abaixo para nos ajudar a compreender sua identidade, suas preferências e os objetivos do projeto. Ao finalizar, envie o briefing completo diretamente para a equipe responsável pelo seu novo site.</p>
        <div><b>🔴 Obrigatório</b><span>Campos essenciais para iniciar o site</span></div>
        <div className="draft-status"><span><Save size={15}/>{saved ? 'Rascunho salvo automaticamente' : 'Salvando alterações…'}</span><button type="button" onClick={clearDraft}><RotateCcw size={14}/> Limpar formulário</button></div>
      </section>
      <div className="client-form-layout">
        <form className="client-briefing-form" onSubmit={submitBriefing}>
          <section className={`required-progress ${canCopy ? 'is-complete' : ''}`} aria-live="polite">
            <div className="required-progress-heading"><span>{canCopy ? <Check size={19}/> : <AlertCircle size={19}/>}</span><div><small>PREENCHIMENTO OBRIGATÓRIO</small><h2>{canCopy ? 'Tudo pronto para enviar' : `${missingRequired.length} ${missingRequired.length === 1 ? 'campo pendente' : 'campos pendentes'}`}</h2></div><strong>{completion}%</strong></div>
            <div className="required-progress-bar"><i style={{ width: `${completion}%` }}/></div>
            {!canCopy && <div className="missing-required-list">{missingRequired.map(name => <button type="button" key={name} onClick={() => goToField(name)}>{requiredLabels[name] || (name.includes('Name') ? 'Nome do advogado adicional' : 'OAB do advogado adicional')}<span>Ir ao campo</span></button>)}</div>}
          </section>
          <Group title="🖼️ 1. Escolha do template">
            <div className="template-explanation">
              <span>REFERÊNCIA VISUAL</span>
              <h3>O template define uma direção, não o resultado final.</h3>
              <p>Os templates servem para você indicar o estilo visual que mais combina com o seu projeto. A escolha nos ajuda a compreender suas preferências de composição, organização das informações, tipografia, cores, formas e atmosfera geral da página.</p>
              <p>O seu site <strong>não será uma cópia exata do modelo selecionado</strong>. Usaremos essa referência como ponto de partida para criar uma identidade própria, adaptada ao seu perfil profissional, à sua área de atuação, ao seu conteúdo e aos objetivos do seu negócio. Cores, imagens, textos, seções e outros elementos poderão ser ajustados ou reorganizados para que o resultado seja coerente, exclusivo e verdadeiramente personalizado.</p>
              <p className="template-explanation-summary"><strong>Em resumo:</strong> você escolhe a direção visual que prefere, e nós a transformamos em um site único para você.</p>
            </div>
            <TemplateSelector value={form.template} open={templatesOpen} onToggle={() => setTemplatesOpen(open => !open)} onSelect={selectTemplate}/>
          </Group>

          <Group title="⚖️ 2. Identificação profissional">
            <Field icon="👤" label="Nome completo do advogado ou responsável" required name="professionalName" value={form.professionalName} onChange={update}/>
            <Field icon="🏛️" label="Nome do escritório" name="officeName" value={form.officeName} onChange={update}/>
            <Field icon="🪪" label="Número da OAB" required name="oab" value={form.oab} onChange={update} format={formatOabNumber} inputMode="text" autoCapitalize="characters" maxLength={12} placeholder="123.456"/>
            <div className="additional-lawyers">
              <div className="additional-lawyers-heading"><div><h3>Sócios ou advogados adicionais</h3><p>Adicione os demais profissionais que devem aparecer na página.</p></div><button type="button" onClick={addLawyer}><UserPlus size={16}/> Adicionar advogado</button></div>
              {form.additionalLawyers.map((lawyer, index) => <section className="additional-lawyer-card" key={index}>
                <div className="additional-lawyer-title"><strong>Advogado adicional {index + 1}</strong><button type="button" onClick={() => removeLawyer(index)} aria-label={`Remover advogado adicional ${index + 1}`}><Trash2 size={15}/> Remover</button></div>
                <Field icon="👤" label="Nome completo" required name={`additionalLawyerName-${index}`} value={lawyer.name} onChange={event => updateLawyer(index, 'name', event.target.value)}/>
                <Field icon="🪪" label="Número da OAB" required name={`additionalLawyerOab-${index}`} value={lawyer.oab} onChange={event => updateLawyer(index, 'oab', event.target.value)} format={formatOabNumber} inputMode="text" autoCapitalize="characters" maxLength={12} placeholder="123.456"/>
              </section>)}
            </div>
            <Field icon="📍" label="Cidade" required name="city" value={form.city} onChange={update} autoComplete="address-level2" placeholder="Ex.: São Paulo"/>
            <SelectField icon="🇧🇷" label="Estado" required name="state" value={form.state} onChange={update} autoComplete="address-level1" options={BRAZILIAN_STATES}/>
            <Field icon="📝" label="Breve biografia profissional" area name="biography" value={form.biography} onChange={update}/>
          </Group>

          <Group title="📞 3. Contato e atendimento">
            <Field icon="💬" label="WhatsApp" required type="tel" name="whatsapp" value={form.whatsapp} onChange={update} format={formatPhone} inputMode="tel" autoComplete="tel" maxLength={15} placeholder="(00) 00000-0000"/>
            <Field icon="✉️" label="E-mail profissional" type="email" name="email" value={form.email} onChange={update} inputMode="email" autoComplete="email" spellCheck={false} placeholder="nome@escritorio.com.br"/>
            <Field icon="☎️" label="Telefone adicional" type="tel" name="phone" value={form.phone} onChange={update} format={formatPhone} inputMode="tel" autoComplete="tel" maxLength={15} placeholder="(00) 0000-0000"/>
            <Field icon="🔗" label="LinkedIn ou outra rede" type="url" name="social" value={form.social} onChange={update} inputMode="url" spellCheck={false} placeholder="https://linkedin.com/in/seu-perfil"/>
            <Field icon="🗺️" label="Cidades ou regiões atendidas" required name="regions" value={form.regions} onChange={update}/>
            <Choice icon="🤝" label="Formato de atendimento" required name="attendance" value={form.attendance} onChange={update} options={['Presencial', 'On-line', 'Presencial e on-line']}/>
            <Field icon="📌" label="Endereço" name="address" value={form.address} onChange={update}/>
            <Field icon="🕐" label="Dias e horários" name="hours" value={form.hours} onChange={update}/>
          </Group>

          <Group title="🎨 4. Identidade visual">
            <Field icon="🎨" label="Cor principal" required name="primaryColor" value={form.primaryColor} onChange={update}/>
            <Field icon="🖌️" label="Cor secundária" name="secondaryColor" value={form.secondaryColor} onChange={update}/>
            <Choice icon="🌓" label="Preferência de aparência" name="appearance" value={form.appearance} onChange={update} options={['Página clara', 'Página escura', 'Áreas claras e escuras', 'Seguir o template']}/>
          </Group>

          <Group title="➕ 5. Conteúdos adicionais">
            <Field icon="❓" label="Perguntas frequentes" area name="faqs" value={form.faqs} onChange={update}/>
            <Field icon="🧩" label="Situações ou problemas atendidos" area name="situations" value={form.situations} onChange={update}/>
            <Field icon="👥" label="Informações da equipe" area name="team" value={form.team} onChange={update}/>
            <Field icon="📋" label="Outros pedidos" area name="additionalRequests" value={form.additionalRequests} onChange={update}/>
            <Field icon="💬" label="Depoimentos ou feedbacks autorizados" area name="testimonials" value={form.testimonials} onChange={update}/>
          </Group>

          <Group title="🌐 6. Domínio, hospedagem e publicação">
            <Choice icon="🌍" label="Você já possui um domínio?" required name="hasDomain" value={form.hasDomain} onChange={update} options={['Sim', 'Não']}/>
            {form.hasDomain === 'Sim' && <ConditionalFields title="Dados do domínio">
              <Field icon="🔗" label="Qual é o domínio?" required name="domain" value={form.domain} onChange={update} format={formatDomain} inputMode="url" autoCapitalize="none" spellCheck={false} placeholder="exemplo.com.br"/>
              <Field icon="🏪" label="Em qual plataforma ele foi comprado?" required name="domainPlatform" value={form.domainPlatform} onChange={update} placeholder="Ex.: Registro.br, GoDaddy, Hostinger"/>
              <Field icon="👤" label="Login ou e-mail usado na plataforma" required name="domainLogin" value={form.domainLogin} onChange={update}/>
              <Field icon="🔐" label="Senha de acesso (opcional)" type="password" name="domainPassword" value={form.domainPassword} onChange={update} autoComplete="current-password" placeholder="Informe a senha para envio à equipe"/>
            </ConditionalFields>}
            <Choice icon="🖥️" label="Você já possui hospedagem?" required name="hasHosting" value={form.hasHosting} onChange={update} options={['Sim', 'Não']}/>
            {form.hasHosting === 'Sim' && <ConditionalFields title="Dados da hospedagem">
              <Field icon="☁️" label="Qual é a plataforma de hospedagem?" required name="hostingPlatform" value={form.hostingPlatform} onChange={update} placeholder="Ex.: Vercel, Hostinger, Locaweb"/>
              <Field icon="👤" label="Login ou e-mail usado na plataforma" required name="hostingLogin" value={form.hostingLogin} onChange={update}/>
              <Field icon="🔐" label="Senha de acesso (opcional)" type="password" name="hostingPassword" value={form.hostingPassword} onChange={update} autoComplete="current-password" placeholder="Informe a senha para envio à equipe"/>
            </ConditionalFields>}
            <Field icon="🔌" label="Outras integrações" area name="integrations" value={form.integrations} onChange={update}/>
          </Group>
          <button className="generate-briefing" type="submit" disabled={!canCopy || submitting}>{submitted ? <Check size={18}/> : <Send size={18}/>} {submitting ? 'Enviando briefing…' : submitted ? 'Briefing enviado com sucesso!' : canCopy ? 'Enviar briefing para a 4Juris' : `Preencha mais ${missingRequired.length} ${missingRequired.length === 1 ? 'campo obrigatório' : 'campos obrigatórios'}`}</button>
          <div className="briefing-send-feedback" aria-live="polite">{submitted && <p className="is-success"><Check size={16}/> Todos os dados foram enviados para a equipe 4Juris.</p>}{submitError && <p className="is-error"><AlertCircle size={16}/> {submitError}</p>}</div>
        </form>

        <aside className="briefing-result">
          <div className="briefing-result-heading"><span><Send size={17}/></span><div><small>RESULTADO</small><h2>Seu briefing pronto</h2></div></div>
          <p>O conteúdo é atualizado enquanto você preenche e será enviado integralmente para a equipe 4Juris. Você também pode copiá-lo como backup.</p>
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
  return <section className="conditional-fields"><h3>🔒 {title}</h3><p>O login e a senha informados serão enviados diretamente para a equipe 4Juris por e-mail. As senhas não ficam salvas no rascunho deste navegador.</p>{children}</section>
}

function Field({ icon, label, required, area, format, onChange, ...props }) {
  const Element = area ? 'textarea' : 'input'
  const invalid = Boolean(required && !props.value?.trim())
  const handleChange = event => onChange(format ? { target: { name: props.name, value: format(event.target.value) } } : event)
  return <label className={`client-field ${invalid ? 'is-required-missing' : ''}`}><span><span className="field-label"><i aria-hidden="true">{icon}</i>{label}</span>{required && <b>🔴 Obrigatório</b>}</span><Element required={required} aria-invalid={invalid} onChange={handleChange} {...props}/></label>
}

function SelectField({ icon, label, required, options, ...props }) {
  const invalid = Boolean(required && !props.value?.trim())
  return <label className={`client-field ${invalid ? 'is-required-missing' : ''}`}><span><span className="field-label"><i aria-hidden="true">{icon}</i>{label}</span>{required && <b>🔴 Obrigatório</b>}</span><select required={required} aria-invalid={invalid} {...props}><option value="">Selecione</option>{options.map(([value, name]) => <option value={value} key={value}>{value} — {name}</option>)}</select></label>
}

function Choice({ icon, label, required, options, name, value, onChange }) {
  const invalid = Boolean(required && !value?.trim())
  return <fieldset className={`client-choice ${invalid ? 'is-required-missing' : ''}`}><legend><span className="field-label"><i aria-hidden="true">{icon}</i>{label}</span>{required && <b>🔴 Obrigatório</b>}</legend><div>{options.map(option => <label key={option}><input type="radio" name={name} value={option} checked={value === option} onChange={onChange} required={required} aria-invalid={invalid}/><span>{option}</span></label>)}</div></fieldset>
}

function TemplateSelector({ value, open, onToggle, onSelect }) {
  return <section className={`template-form-selector ${value ? '' : 'is-required-missing'}`} data-field-name="template">
    <div className="template-selector-label"><span className="field-label"><i aria-hidden="true">🖼️</i>Template de referência</span><b>🔴 Obrigatório</b></div>
    <button className={`template-selector-trigger ${value ? 'has-value' : ''}`} type="button" onClick={onToggle} aria-expanded={open}>
      <span>{value || 'Clique para visualizar e escolher sua referência visual'}</span><ChevronDown size={19}/>
    </button>
    <input className="template-selection-validation" tabIndex="-1" aria-hidden="true" required value={value} onChange={() => {}}/>
    {open && <div className="template-choice-grid">{templates.map((template, index) => <article className="template-choice-card" key={template.id}>
      <div className="template-choice-preview"><LazyTemplateFrame template={template} priority={index < 2} title={`Prévia do template ${template.name}`}/><span>Template {String(template.id).padStart(2, '0')}</span></div>
      <div><h3>{template.name}</h3><p>{template.direction}</p><div className="template-choice-actions"><button type="button" onClick={() => onSelect(template)}>Selecionar</button><a href={`/templates/template-${template.id}/index.html`} target="_blank" rel="noreferrer" aria-label={`Abrir prévia do template ${template.name}`}><ExternalLink size={15}/></a></div></div>
    </article>)}</div>}
  </section>
}
