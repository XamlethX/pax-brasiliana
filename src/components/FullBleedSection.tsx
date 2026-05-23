interface FullBleedSectionProps {
  src?: string;
  headline: string;
  overlayOpacity?: number;
}

export default function FullBleedSection({ src, headline, overlayOpacity = 0.35 }: FullBleedSectionProps) {
  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden flex items-center justify-center px-5 lg:px-10">
      {src ? (
        <>
          <div className="absolute inset-0 overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover ken-burns" />
          </div>
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#463C2E]" />
      )}
      <h2
        className="relative z-[2] text-h3 text-[#F8F6E8] text-center max-w-[1000px]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {headline}
      </h2>
    </section>
  );
}
