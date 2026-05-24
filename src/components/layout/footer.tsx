import { siteConfig } from "@/constants/site";

const FOOTER_LINKS = [
  { label: "Tienda",      href: "#" },
  { label: "Origen",      href: "#" },
  { label: "Colecciones", href: "#" },
  { label: "Contacto",    href: "#" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacidad", href: "#" },
  { label: "Términos",   href: "#" },
] as const;

export default function Footer() {
  return (
    <footer style={{ background: "#1A1008", borderTop: "1px solid rgba(212,175,55,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
            >
              {siteConfig.name}
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "rgba(244,239,227,0.4)" }}
            >
              {siteConfig.descriptor}
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {FOOTER_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="footer-link">
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          aria-hidden
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
            marginBottom: "2rem",
          }}
        />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(244,239,227,0.28)" }}>
            &copy; {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="footer-legal-link">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
