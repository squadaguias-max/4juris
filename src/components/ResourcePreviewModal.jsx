import { useEffect, useState } from 'react'
import { Check, Copy, Download, X } from 'lucide-react'

function InlineText({ children }) {
  const parts = String(children).split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
    return part
  })
}

function MarkdownDocument({ content }) {
  return <article className="resource-document">{content.split('\n').map((line, index) => {
    if (line.startsWith('# ')) return <h1 key={index}><InlineText>{line.slice(2)}</InlineText></h1>
    if (line.startsWith('## ')) return <h2 key={index}><InlineText>{line.slice(3)}</InlineText></h2>
    if (line.startsWith('### ')) return <h3 key={index}><InlineText>{line.slice(4)}</InlineText></h3>
    if (line === '---') return <hr key={index} />
    if (/^- \[[ x]\] /.test(line)) return <label className="resource-checkbox" key={index}><span /> <InlineText>{line.slice(6)}</InlineText></label>
    if (line.startsWith('- ')) return <div className="resource-list-item" key={index}><span>•</span><p><InlineText>{line.slice(2)}</InlineText></p></div>
    if (line.startsWith('> ')) return <blockquote key={index}><InlineText>{line.slice(2)}</InlineText></blockquote>
    if (!line.trim()) return <span className="resource-space" key={index} />
    return <p key={index}><InlineText>{line.replace(/ {2}$/, '')}</InlineText></p>
  })}</article>
}

export default function ResourcePreviewModal({ resource, onClose }) {
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!resource) return undefined
    setContent('')
    setError(false)
    fetch(resource.url).then(response => {
      if (!response.ok) throw new Error('Arquivo indisponível')
      return response.text()
    }).then(setContent).catch(() => setError(true))
  }, [resource])

  if (!resource) return null
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch { setError(true) }
  }

  return <div className="resource-modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="resource-modal" role="dialog" aria-modal="true" aria-labelledby="resource-preview-title">
      <header><div><small>PRÉ-VISUALIZAÇÃO</small><h2 id="resource-preview-title">{resource.title}</h2></div><div className="resource-modal-actions"><button type="button" onClick={copy} disabled={!content}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copiado' : 'Copiar'}</button><a href={resource.url} download><Download size={16} /> Baixar</a><button className="resource-modal-close" type="button" onClick={onClose} aria-label="Fechar pré-visualização"><X size={20} /></button></div></header>
      <div className="resource-modal-body">{error ? <div className="resource-preview-error">Não foi possível carregar o documento.</div> : content ? <MarkdownDocument content={content} /> : <div className="resource-preview-loading">Carregando documento…</div>}</div>
    </section>
  </div>
}
