/* ══════════════════════════════════════════════════════════
   ProcessSection — "Cómo comprar"
   Explains the 4-step manual-payment flow.
   Anchored at id="proceso" for navbar deep-link.
   Server Component — no client JS needed.
   ══════════════════════════════════════════════════════════ */

/* ── Step icons ─────────────────────────────────────────── */

function ShoppingBagIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ClipboardCheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function MessageSendIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M9 11l2 2 4-4" />
    </svg>
  );
}

/* ── Step data ───────────────────────────────────────────── */

const STEPS = [
  {
    step: "01",
    Icon: ShoppingBagIcon,
    title: "Elige tus productos",
    body: "Explora la colección, elige tus mieles o productos de la colmena favoritos y agrégalos al carrito.",
  },
  {
    step: "02",
    Icon: ClipboardCheckIcon,
    title: "Confirma tu pedido",
    body: "Revisa tu selección, ingresa tus datos de entrega y elige el método de pago que prefieras.",
  },
  {
    step: "03",
    Icon: BanknoteIcon,
    title: "Paga con flexibilidad",
    body: "Aceptamos transferencia SPEI, depósito bancario o pago contra entrega en tu domicilio.",
  },
  {
    step: "04",
    Icon: MessageSendIcon,
    title: "Envía tu comprobante",
    body: "Compártenos tu comprobante por WhatsApp o correo. Confirmamos tu pedido en menos de 24 h.",
  },
] as const;

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════ */
export default function ProcessSection() {
  return (
    <section
      id="proceso"
      /* scroll-mt-20 offsets the fixed navbar (~80px) on anchor jump */
      className="relative py-28 warm-dark-bg overflow-hidden scroll-mt-20"
    >

      {/* Top gold edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.5) 50%, transparent 100%)",
        }}
      />

      {/* Ambient top glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "60%",
          background:
            "radial-gradient(ellipse at top, rgba(184,117,20,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="gold-divider w-12" />
            <span
              className="text-[10px] uppercase tracking-[0.44em]"
              style={{ color: "#B87514" }}
            >
              Proceso de compra
            </span>
            <div className="gold-divider w-12" />
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "#F4EFE3" }}
          >
            Cómo{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #E5A93B 55%, #B87514 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              comprar
            </span>
          </h2>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: "rgba(244,239,227,0.60)" }}
          >
            Sin tarjeta, sin fricción. Elige, confirma y paga como prefieras.
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="relative">

          {/* Connector line — desktop only, runs behind step circles */}
          <div
            aria-hidden
            className="hidden md:block absolute"
            style={{
              top: 28,          /* centre of the 56px circle */
              left: "12.5%",    /* first circle centre */
              right: "12.5%",   /* last circle centre */
              height: 1,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.28) 12%, rgba(212,175,55,0.28) 88%, transparent 100%)",
            }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {STEPS.map(({ step, Icon, title, body }) => (
              <div key={step} className="flex flex-col items-center text-center">

                {/* Step circle */}
                <div
                  className="relative flex items-center justify-center rounded-full mb-5 shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    background:
                      "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(184,117,20,0.10) 100%)",
                    border: "1px solid rgba(212,175,55,0.38)",
                    boxShadow: [
                      "0 0 0 6px rgba(212,175,55,0.06)",
                      "0 4px 16px rgba(0,0,0,0.25)",
                    ].join(", "),
                    color: "#D4AF37",
                    /* Above the connector line */
                    zIndex: 1,
                  }}
                >
                  <Icon />
                  {/* Step number badge */}
                  <span
                    className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-[9px] font-bold"
                    style={{
                      width: 20,
                      height: 20,
                      background:
                        "linear-gradient(135deg, #D4AF37 0%, #B87514 100%)",
                      color: "#2C1E11",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {step}
                  </span>
                </div>

                {/* Text */}
                <h3
                  className="text-sm font-semibold mb-2 leading-snug"
                  style={{ fontFamily: "var(--font-playfair)", color: "#F4EFE3" }}
                >
                  {title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(244,239,227,0.52)" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="flex justify-center mt-14">
          <a href="/tienda" className="premium-button text-sm">
            Ir a la tienda
          </a>
        </div>
      </div>

      {/* Bottom gold edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 50%, transparent 100%)",
        }}
      />
    </section>
  );
}
