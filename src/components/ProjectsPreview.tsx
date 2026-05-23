import Link from "next/link";

const featured = [
  {
    title: "O que o Brasil pode construir?",
    description:
      "Um guia interativo e pesquisável que mapeia o que o Brasil produz, o que poderia produzir e o que ainda importa. De placas solares a foguetes orbitais.",
    image: "/images/hero.jpg",
    href: "/projetos/o-que-o-brasil-pode-construir",
    cta: "EXPLORAR PROJETO",
  },
  {
    title: "Está na hora de construir o Brasil",
    description:
      "Pax Brasiliana é um movimento para reacender a indústria, a criatividade e a ambição brasileira. Uma breve introdução à nossa missão.",
    image: "/images/hero.jpg",
    href: "/ensaios/o-brasil-que-pode-ser",
    cta: "LER ENSAIO",
  },
];

function ArrowRight() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
      <path
        d="M1 5h10M7 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function ProjectsPreview() {
  return (
    <section className="bg-[#F8F6E8] grid-lines relative flex flex-col lg:flex-row border-t-[0.5px] border-t-[#463C2E]/40">
      {/* Left 1/3: side image */}
      <div className="w-full lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0">
        <div className="relative w-full h-64 lg:h-full">
          <img
            src="/images/hero.jpg"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full z-[1] object-cover"
          />
        </div>
      </div>

      {/* Right 2/3: intro + cards */}
      <div className="w-full lg:w-2/3 flex-1 flex flex-col gap-10 lg:gap-16 pt-10 lg:pt-20 px-5 lg:pl-5 lg:pr-5 pb-10 lg:pb-[100px]">
        <p className="text-paragraphs text-[#463C2E]">
          Conheça nossos projetos e ensaios mais recentes. Para submeter uma ideia, <Link href="/contribute" className="underline">entre em contato</Link>.
        </p>

        <div className="flex flex-col lg:flex-row w-full gap-5 lg:pr-5">
          {featured.map((item) => (
            <article
              key={item.href}
              className="border-[0.5px] border-[#463C2E] rounded-[6px] bg-[#E4DECC] overflow-hidden flex flex-col flex-1"
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="w-full h-[200px] object-cover"
              />
              <div className="p-5 flex flex-col gap-5 flex-1">
                <div className="flex flex-col gap-2.5 text-paragraphs">
                  <h3 className="text-[#463C2E]">{item.title}</h3>
                  <p className="text-[#463C2E]/60">{item.description}</p>
                </div>
                <div className="mt-auto">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 px-2.5 py-2.5 bg-[#417CE5] text-[#F8F6E8] uppercase leading-none tracking-[-0.06em] text-[14px] transition-opacity duration-300 hover:opacity-80 w-fit"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {item.cta}
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
