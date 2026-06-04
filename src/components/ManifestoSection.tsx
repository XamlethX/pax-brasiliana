import Image from "next/image";

interface ManifestoSectionProps {
  lines: string[];
  image: string;
  /** Describe the image when it carries meaning; leave empty for decorative. */
  alt?: string;
  overlay?: boolean;
  align?: "end" | "center";
  italic?: boolean;
  attribution?: string;
}

export default function ManifestoSection({
  lines,
  image,
  alt = "",
  overlay = true,
  align = "end",
  italic = false,
  attribution,
}: ManifestoSectionProps) {
  return (
    <section className="grid-lines relative z-10 min-h-screen flex flex-col px-5 lg:px-10 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image}
          alt={alt}
          aria-hidden={alt ? undefined : "true"}
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover ken-burns"
        />
      </div>

      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.32) 45%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      )}

      <div
        className={`relative z-[2] flex flex-col flex-1 w-full items-center text-center ${
          align === "center" ? "justify-center" : "justify-end"
        }`}
      >
        <h2
          className={`max-w-[1200px] text-mist ${italic ? "italic" : ""}`}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.8rem, 6vw, 6.25rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          }}
        >
          {lines.join(" ")}
        </h2>
        {attribution && (
          <div className="mt-8 flex items-center gap-3">
            <div className="w-8 h-[1px] bg-mist/40" />
            <p
              className="text-mist/85 font-mono uppercase tracking-[0.14em]"
              style={{ fontSize: "clamp(10px, 1.1vw, 13px)" }}
            >
              {attribution}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
