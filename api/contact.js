import { Resend } from 'resend'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const clean = (value, maxLength = 500) => typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
const escapeHtml = value => clean(value).replace(/[&<>"]/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}[character]))

function fieldRow(label, value) {
  if (!value) return ''
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #e7ebf1;color:#697386;font-size:12px;width:34%;vertical-align:top">${label}</td>
    <td style="padding:12px 0;border-bottom:1px solid #e7ebf1;color:#07111f;font-size:14px;font-weight:600;vertical-align:top">${escapeHtml(value)}</td>
  </tr>`
}

function emailHtml({ eyebrow, title, name, email, phone, fields }) {
  const rows = [
    fieldRow('Nome', name),
    fieldRow('E-mail', email),
    fieldRow('WhatsApp', phone),
    ...fields.map(({ label, value }) => fieldRow(label, value)),
  ].join('')

  return `<!doctype html>
  <html lang="pt-BR">
    <body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,sans-serif;color:#07111f">
      <div style="display:none;max-height:0;overflow:hidden">Novo contato recebido pelo site da 4Juris.</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:32px 16px">
        <tr><td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 14px 45px rgba(7,17,31,.1)">
            <tr><td style="padding:30px 34px;background:#07111f;color:#ffffff">
              <div style="font-size:25px;font-weight:700;letter-spacing:-1px">4<span style="color:#2856ff">juris</span></div>
              <div style="margin-top:24px;color:#7894ff;font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase">${eyebrow}</div>
              <h1 style="margin:9px 0 0;font-size:28px;line-height:1.15;letter-spacing:-.8px">${title}</h1>
            </td></tr>
            <tr><td style="padding:26px 34px 34px">
              <p style="margin:0 0 18px;color:#697386;font-size:13px;line-height:1.6">Uma nova conversão foi registrada no site. Responda diretamente a este e-mail para falar com o contato.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
              <a href="mailto:${encodeURIComponent(email)}" style="display:inline-block;margin-top:26px;padding:13px 20px;border-radius:999px;background:#123fe4;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700">Responder ao contato</a>
            </td></tr>
          </table>
          <p style="margin:16px 0 0;color:#8b96a7;font-size:10px">Mensagem enviada automaticamente pelo site 4Juris.</p>
        </td></tr>
      </table>
    </body>
  </html>`
}

function briefingEmailHtml({ referenceName, professionalName, briefing }) {
  const formattedBriefing = briefing.split('\n').map(line => {
    const value = escapeHtml(line)
    if (line.startsWith('# ')) return `<h2 style="margin:0 0 24px;color:#07111f;font-size:24px;line-height:1.2">${escapeHtml(line.slice(2))}</h2>`
    if (line.startsWith('## ')) return `<h3 style="margin:28px 0 10px;padding-bottom:8px;border-bottom:2px solid #e5eaff;color:#123fe4;font-size:17px;line-height:1.3">${escapeHtml(line.slice(3))}</h3>`
    if (line.startsWith('- ')) return `<p style="margin:0;padding:7px 0;border-bottom:1px solid #edf0f4;color:#344256;font-size:13px;line-height:1.55">${escapeHtml(line.slice(2))}</p>`
    return value ? `<p style="margin:7px 0;color:#344256;font-size:13px;line-height:1.55">${value}</p>` : '<div style="height:5px"></div>'
  }).join('')

  return `<!doctype html>
  <html lang="pt-BR">
    <body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,sans-serif;color:#07111f">
      <div style="display:none;max-height:0;overflow:hidden">Novo briefing completo de Landing Page recebido.</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:32px 16px">
        <tr><td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 14px 45px rgba(7,17,31,.1)">
            <tr><td style="padding:30px 36px;background:#07111f;color:#ffffff">
              <div style="font-size:25px;font-weight:700;letter-spacing:-1px">4<span style="color:#2856ff">juris</span></div>
              <div style="margin-top:24px;color:#7894ff;font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase">Landing Page Jurídica</div>
              <h1 style="margin:9px 0 0;font-size:28px;line-height:1.15;letter-spacing:-.8px">Novo briefing completo</h1>
              <p style="margin:10px 0 0;color:#aebbd0;font-size:13px">${escapeHtml(referenceName)}${referenceName !== professionalName ? ` · ${escapeHtml(professionalName)}` : ''}</p>
            </td></tr>
            <tr><td style="padding:30px 36px 38px">${formattedBriefing}</td></tr>
          </table>
          <p style="margin:16px 0 0;color:#8b96a7;font-size:10px">Briefing enviado automaticamente pelo formulário da 4Juris.</p>
        </td></tr>
      </table>
    </body>
  </html>`
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ success: false, message: 'Método não permitido.' })
  if (!process.env.RESEND_API_KEY) return response.status(500).json({ success: false, message: 'O serviço de e-mail ainda não foi configurado.' })

  const body = request.body || {}
  if (body.botcheck) return response.status(200).json({ success: true })

  const formType = clean(body.formType, 40)
  const isBriefing = formType === 'landing-page-briefing'
  if (isBriefing) {
    const professionalName = clean(body.professionalName, 180)
    const officeName = clean(body.officeName, 180)
    const referenceName = officeName || professionalName
    const email = clean(body.email, 180).toLowerCase()
    const briefing = clean(body.briefing, 30000)
    if (!professionalName || !briefing) {
      return response.status(400).json({ success: false, message: 'Preencha todos os campos obrigatórios antes de enviar.' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const message = {
      from: process.env.RESEND_FROM_EMAIL || '4Juris <onboarding@resend.dev>',
      to: [process.env.RESEND_TO_EMAIL || 'pauloguilherme@4juristech.com.br'],
      subject: `Novo briefing de Landing Page — ${referenceName}`,
      html: briefingEmailHtml({ referenceName, professionalName, briefing }),
      text: briefing,
      tags: [{ name: 'formulario', value: 'briefing-landing-page' }],
    }
    if (emailPattern.test(email)) message.replyTo = email

    const { data, error } = await resend.emails.send(message)
    if (error) {
      console.error('Resend briefing error:', error)
      return response.status(502).json({ success: false, message: 'Não foi possível enviar o briefing agora. Tente novamente em instantes.' })
    }
    return response.status(200).json({ success: true, id: data?.id })
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 180).toLowerCase()
  const phone = clean(body.phone, 40)

  if (!name || !emailPattern.test(email) || !phone) {
    return response.status(400).json({ success: false, message: 'Confira seu nome, e-mail e WhatsApp antes de enviar.' })
  }

  const isEbook = formType === 'ebook'
  const company = clean(body.company, 160)
  const revenue = clean(body.revenue, 100)
  if (isEbook && !revenue) return response.status(400).json({ success: false, message: 'Selecione a faixa de faturamento.' })

  const content = isEbook
    ? {
        subject: `Novo lead do e-book — ${name}`,
        eyebrow: 'E-book Teses Escaláveis',
        title: 'Novo pedido de material',
        fields: [{ label: 'Faturamento mensal', value: revenue }],
      }
    : {
        subject: `Nova sessão estratégica — ${name}`,
        eyebrow: 'Sessão estratégica',
        title: 'Novo contato comercial',
        fields: [{ label: 'Escritório', value: company }],
      }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || '4Juris <onboarding@resend.dev>',
    to: [process.env.RESEND_TO_EMAIL || 'pauloguilherme@4juristech.com.br'],
    replyTo: email,
    subject: content.subject,
    html: emailHtml({ ...content, name, email, phone }),
    text: [content.title, `Nome: ${name}`, `E-mail: ${email}`, `WhatsApp: ${phone}`, ...content.fields.filter(field => field.value).map(field => `${field.label}: ${field.value}`)].join('\n'),
    tags: [{ name: 'formulario', value: isEbook ? 'ebook' : 'sessao-estrategica' }],
  })

  if (error) {
    console.error('Resend error:', error)
    return response.status(502).json({ success: false, message: 'Não foi possível enviar agora. Tente novamente em instantes.' })
  }

  return response.status(200).json({ success: true, id: data?.id })
}
