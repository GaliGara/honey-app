import { siteConfig } from "@/constants/site";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen warm-radial-bg px-6">
      <div className="glass-panel rounded-3xl px-10 py-14 text-center max-w-lg w-full">
        {/* Ornamento decorativo */}
        <div
          aria-hidden
          className="mx-auto mb-6 h-px w-16"
          style={{
            background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />

        {/* Logotipo / nombre */}
        <h1
          className="text-6xl font-bold tracking-wide mb-2"
          style={{
            fontFamily: "var(--font-playfair)",
            background: "linear-gradient(135deg, #D4AF37 0%, #E5A93B 60%, #B87514 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {siteConfig.name}
        </h1>

        {/* Descriptor */}
        <p
          className="text-sm uppercase tracking-[0.3em] mb-8"
          style={{ color: "#6F5635", fontFamily: "var(--font-inter)" }}
        >
          {siteConfig.descriptor}
        </p>

        {/* Separador */}
        <div
          aria-hidden
          className="mx-auto mb-8 h-px w-24"
          style={{
            background: "linear-gradient(90deg, transparent, #B87514, transparent)",
          }}
        />

        {/* Tagline */}
        <p
          className="text-xl leading-relaxed"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          {siteConfig.tagline}
        </p>

        {/* Ornamento inferior */}
        <div
          aria-hidden
          className="mx-auto mt-10 h-px w-16"
          style={{
            background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />
      </div>
    </main>
  );
}
