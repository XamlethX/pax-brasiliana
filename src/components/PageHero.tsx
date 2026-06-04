export default function PageHero({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative min-h-[100dvh] bg-[#463C2E] text-[#F8F6E8] overflow-hidden flex flex-col justify-end">
      {image && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover origin-center ken-burns"
          />
          <div className="media-overlay" aria-hidden="true" />
        </div>
      )}
      <div className="relative z-10 w-full px-5 lg:px-10 pb-20 pt-32">
        <h1 className="text-h2" style={{ textWrap: "balance" }}>{title}</h1>
        {description && (
          <p className="text-[#F8F6E8]/60 mt-10 max-w-[700px] text-[14px] lg:text-[16px] leading-[140%]">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
