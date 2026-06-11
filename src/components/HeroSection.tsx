export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] bg-bark text-mist overflow-hidden noise-overlay grid-lines">
      {/* Background image — art-directed: portrait 9:16 on mobile, panorama on desktop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <picture>
          <source media="(min-width: 1024px)" srcSet="/images/foguete-orbital.png" />
          <img
            src="/images/foguete-orbital-portrait.jpg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover origin-center ken-burns"
          />
        </picture>
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)" }}
        />
      </div>

      {/* Wordmark — full width, bottom of hero */}
      <div className="absolute bottom-0 inset-x-0 z-10 w-full pb-6 lg:pb-6 px-5 lg:px-10">
        {/* Mobile: stacked, two lines, natural proportions (no stretching) */}
        <div
          className="block lg:hidden text-mist leading-[0.80] tracking-[-0.03em] select-none"
          style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontWeight: 900, opacity: 0.94 }}
          role="img"
          aria-label="Pax Brasiliana"
        >
          <span className="block text-[15.5vw]">PAX</span>
          <span className="block text-[15.5vw]">BRASILIANA</span>
        </div>

        {/* Desktop: single line, full width */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1400 120"
          className="hidden lg:block w-full h-auto"
          role="img"
          aria-label="Pax Brasiliana"
        >
          <text
            x="0"
            y="100"
            fontFamily="'Barlow Semi Condensed', sans-serif"
            fontWeight="900"
            fontSize="120"
            letterSpacing="-2"
            fill="#F8F6E8"
            opacity="0.92"
          >
            PAX BRASILIANA
          </text>
        </svg>
      </div>
    </section>
  );
}
