import { ArrowUpRight } from 'lucide-react'
import Brand from './Brand'

export default function Header() {
  return <header className="topbar">
    <Brand />
    <nav aria-label="Navegação principal"><a href="#inicio">Início</a><a href="#catalogo">Templates</a></nav>
    <a className="header-cta" href="#catalogo">Explorar coleção <ArrowUpRight size={14} /></a>
  </header>
}
