export function FeatureCard({ icon: Icon, eyebrow, title, description, href, action }) {
  const content = (
    <article className="glass-strong group h-full rounded-[1.5rem] p-5 transition-transform duration-200 hover:-translate-y-1">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-aid-teal/10 text-aid-teal">
        <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
      </span>
      {eyebrow ? <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-aid-teal">{eyebrow}</p> : null}
      <h2 className="mt-1 font-quicksand text-xl font-bold text-aid-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-aid-muted">{description}</p>
      {action ? <p className="mt-4 text-sm font-bold text-aid-teal">{action} →</p> : null}
    </article>
  );

  return href ? <a href={href} className="block rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aid-teal">{content}</a> : content;
}
