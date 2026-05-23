interface ManifestoSectionProps {
  lines: string[];
  image: string;
  overlay?: boolean;
  align?: "end" | "center";
  italic?: boolean;
  attribution?: string;
}

export default function ManifestoSection({
  lines,
  image,
  overlay = true,
  align = "end",
  italic = false,
  attribution,
}: ManifestoSectionProps) {
  return (
    <section className="grid-lines relative z-10 min-h-screen flex flex-col px-5 lg:px-10 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover ken-burns"
        />
      </div>

      {overlay && <div className="absolute inset-0 bg-black/30" />}

      <div
        className={`relative z-[2] flex flex-col flex-1 w-full items-center text-center ${
          align === "center" ? "justify-center" : "justify-end"
        }`}
      >
        <h2
          className={`text-h2 font-heading flex flex-col max-w-[1200px] text-[#F8F6E8] ${
            italic ? "italic" : ""
          }`}
        >
          {lines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </h2>
        {attribution && (
          <p
            className="text-accents text-[#F8F6E8]/60 mt-6"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            — {attribution}
          </p>
        )}
      </div>
    </section>
  );
}
