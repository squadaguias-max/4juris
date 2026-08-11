import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import LazyTemplateFrame from './LazyTemplateFrame'

export default function TemplateCard({ template, onPreview, priority = false }) {
  const [loaded, setLoaded] = useState(false)
  return <article className="card">
    <div className={`visual ${loaded ? 'is-loaded' : 'is-loading'}`}>
      <div className="template-loading" aria-hidden="true"><span /><strong>Carregando preview</strong></div>
      <LazyTemplateFrame template={template} priority={priority} onLoad={() => setLoaded(true)} title={`Miniatura do ${template.name}`} />
      <div className="visual-shade" /><span className="visual-number">0{template.id}</span><button className="visual-open" type="button" onClick={() => onPreview(template)} aria-label={`Explorar o template ${template.name}`}>Explorar <ArrowUpRight size={14} /></button>
    </div>
    <div className="card-body">
      <div className="card-top"><span className="template-id">Template 0{template.id}</span><span className="version">v{template.version}</span></div>
      <h3>{template.name}</h3>
      <p>{template.direction}. {template.purpose}</p>
      <div className="tags">{template.features.map(feature => <span className="tag" key={feature}>{feature}</span>)}</div>
      <button className="preview-button" type="button" onClick={() => onPreview(template)}>Ver apresentação completa <ArrowUpRight size={15} /></button>
    </div>
  </article>
}
