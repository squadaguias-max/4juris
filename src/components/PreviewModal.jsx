import { ExternalLink, X } from 'lucide-react'

export default function PreviewModal({ template, onClose }) {
  if (!template) return null
  const url = `/templates/template-${template.id}/index.html`
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <header><div><small>Visualização</small><strong id="preview-title">Template 0{template.id} — {template.name}</strong></div><div className="modal-actions"><a href={url} target="_blank" rel="noreferrer">Abrir em nova aba <ExternalLink size={14} /></a><button type="button" onClick={onClose} aria-label="Fechar visualização"><X size={19} /></button></div></header>
      <iframe src={url} title={`Prévia do template ${template.name}`} />
    </section>
  </div>
}
