import logo from '../assets/LOGO-4juris-site.svg'

export default function Brand({ className = '', href = '#inicio' }) {
  return <a className={`brand ${className}`} href={href} aria-label="4Juris — início"><img src={logo} alt="4Juris" /></a>
}
