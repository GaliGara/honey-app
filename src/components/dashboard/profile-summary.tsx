const profile = {
  name: "Isabella Rose",
  email: "isabella.rose@email.com",
  phone: "+1 (555) 234-5678",
  memberSince: "Mayo 2025",
} as const;

const addresses = [
  {
    label: "Casa",
    line1: "123 Blossom Lane",
    line2: "Garden City, CA 90210",
    isDefault: true,
  },
] as const;

const paymentMethods = [
  {
    type: "Visa",
    last4: "4242",
    expiry: "12/27",
    isDefault: true,
  },
] as const;

function MapPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

export default function ProfileSummary() {
  return (
    <div
      id="perfil"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Mi perfil
          </h2>
          <div className="gold-divider mt-1.5" style={{ maxWidth: 80 }} />
        </div>
        <a
          href="#"
          className="text-[10px] uppercase tracking-[0.2em] transition-colors duration-200"
          style={{ color: "#B87514" }}
        >
          Editar
        </a>
      </div>

      {/* Profile data */}
      <div
        className="rounded-xl p-4 flex flex-col gap-3"
        style={{
          background: "rgba(255,255,255,0.45)",
          border: "1px solid rgba(212,175,55,0.18)",
        }}
      >
        {[
          { label: "Nombre",          value: profile.name },
          { label: "Email",           value: profile.email },
          { label: "Teléfono",        value: profile.phone },
          { label: "Miembro desde",   value: profile.memberSince },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-start justify-between gap-4 text-sm"
            style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.14em] py-1.5"
              style={{ color: "rgba(111,86,53,0.55)", minWidth: 80 }}
            >
              {label}
            </span>
            <span
              className="text-right py-1.5 font-medium flex-1"
              style={{ color: "#2C1E11", wordBreak: "break-all" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Address */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs" style={{ color: "#B87514" }}>
          <MapPinIcon />
          <span className="uppercase tracking-[0.14em]">Dirección principal</span>
        </div>
        {addresses.map((addr) => (
          <div
            key={addr.label}
            className="rounded-xl px-4 py-3 flex items-start justify-between gap-3"
            style={{
              background: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(212,175,55,0.18)",
            }}
          >
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: "#2C1E11" }}>
                {addr.label}
                {addr.isDefault && (
                  <span
                    className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-[0.1em]"
                    style={{ background: "rgba(212,175,55,0.15)", color: "#B87514" }}
                  >
                    Principal
                  </span>
                )}
              </p>
              <p className="text-xs" style={{ color: "#6F5635" }}>
                {addr.line1}
              </p>
              <p className="text-xs" style={{ color: "#6F5635" }}>
                {addr.line2}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs" style={{ color: "#B87514" }}>
          <CardIcon />
          <span className="uppercase tracking-[0.14em]">Método de pago</span>
        </div>
        {paymentMethods.map((pm) => (
          <div
            key={pm.last4}
            className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            style={{
              background: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(212,175,55,0.18)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Card visual */}
              <div
                style={{
                  width: 36,
                  height: 24,
                  borderRadius: 5,
                  background: "linear-gradient(135deg, #1A1F71, #2B3499)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "white", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                  {pm.type.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "#2C1E11" }}>
                  •••• •••• •••• {pm.last4}
                </p>
                <p className="text-[10px]" style={{ color: "#6F5635" }}>
                  Expira {pm.expiry}
                </p>
              </div>
            </div>
            {pm.isDefault && (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-[0.1em] shrink-0"
                style={{ background: "rgba(212,175,55,0.15)", color: "#B87514" }}
              >
                Principal
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
