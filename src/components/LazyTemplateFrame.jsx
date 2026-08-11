import { useEffect, useRef, useState } from 'react'

export default function LazyTemplateFrame({ template, className = '', title, onLoad, priority = false }) {
  const containerRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(priority)

  useEffect(() => {
    const element = containerRef.current
    if (!element || shouldLoad) return undefined
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return undefined
    }
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) return
      setShouldLoad(true)
      observer.disconnect()
    // Start shortly before the card reaches the viewport. This avoids blank
    // previews during fast scrolling without mounting the whole catalog.
    }, { rootMargin: '900px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [shouldLoad])

  return <div ref={containerRef} className={`lazy-template-frame ${className}`.trim()}>
    {shouldLoad
      ? <iframe src={`/templates/template-${template.id}/index.html`} onLoad={onLoad} tabIndex="-1" title={title || `Prévia do template ${template.name}`} />
      : <div className="lazy-template-placeholder" aria-hidden="true"><span>0{template.id}</span><small>Prévia carregada ao visualizar</small></div>}
  </div>
}
