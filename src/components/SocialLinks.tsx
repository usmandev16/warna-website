import { socials } from '../content/site'

/** Renders only the social profiles that have a URL; nothing until the client supplies them. */
export function SocialLinks({ className }: { className?: string }) {
  const linked = socials.filter((social) => social.url)
  if (!linked.length) return null
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className ?? ''}`}>
      {linked.map((social) => (
        <li key={social.id}>
          <a href={social.url ?? undefined} target="_blank" rel="noreferrer" className="t-small link-underline text-sand/85">
            {social.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
