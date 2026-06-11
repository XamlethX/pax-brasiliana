import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] bg-bark text-mist overflow-hidden noise-overlay grid-lines">
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/foguete-orbital.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover origin-center ken-burns"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)" }}
        />
      </div>

      {/* Wordmark — full width, bottom of hero */}
      <div className="absolute bottom-0 inset-x-0 z-10 w-full pb-6 lg:pb-6 px-5 lg:px-10">
        {/* Mobile: stacked, two lines, full-bleed (BA-style impact) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 760 330"
          className="block lg:hidden w-full h-auto"
          role="img"
          aria-label="Pax Brasiliana"
        >
          <text
            x="4"
            y="150"
            textLength="752"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="'Barlow Semi Condensed', sans-serif"
            fontWeight="900"
            fontSize="160"
            fill="#F8F6E8"
            opacity="0.94"
          >
            PAX
          </text>
          <text
            x="4"
            y="312"
            textLength="752"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="'Barlow Semi Condensed', sans-serif"
            fontWeight="900"
            fontSize="160"
            fill="#F8F6E8"
            opacity="0.94"
          >
            BRASILIANA
          </text>
        </svg>

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
