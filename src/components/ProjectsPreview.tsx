import Link from "next/link";
import { ensaios } from "@/data/ensaios";

// Ensaio em destaque: sempre o mais recente. Mantém o card em sincronia
// automática com a fonte de dados, sem precisar atualizar à mão.
const latestEnsaio = ensaios[0];

const featured = [
  {
    title: "O que o Brasil pode construir?",
    description:
      "Um guia interativo e pesquisável que mapeia o que o Brasil produz, o que poderia produzir e o que ainda importa. De placas solares a foguetes orbitais.",
    image: "/images/o-que-o-brasil-cover.jpg",
    href: "/projetos/o-que-o-brasil-pode-construir",
    cta: "EXPLORAR PROJETO",
  },
  {
    title: latestEnsaio.title,
    description: latestEnsaio.desc,
    image: latestEnsaio.image,
    href: `/ensaios/${latestEnsaio.slug}`,
    cta: "LER ENSAIO",
  },
];

function ArrowRight() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
      <path
        d="M6.295 0.705L10.085 4.5L-2.40413e-07 4.5L-1.96701e-07 5.5L10.085 5.5L6.295 9.295L7 10L12 5L7 -3.0598e-07L6.295 0.705Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ProjectsPreview() {
  return (
    <section className="bg-mist grid-lines relative flex flex-col lg:flex-row border-t-[0.5px] border-t-bark/40">
      {/* Left 1/3: pattern-bg (matches BA) */}
      <div className="w-full lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0">
        <div className="relative w-full min-h-[120px] lg:min-h-0 h-full">
          <img
            src="/images/pattern-bg.png"
            alt=""
            className="absolute inset-0 w-full h-full z-[1] object-cover"
          />
        </div>
      </div>

      {/* Mobile section label */}
      <div className="pl-2.5 pt-10 lg:hidden">
        <div className="border-l-[0.5px] border-l-clay text-accents uppercase font-mono pl-2.5">
          O mais recente
        </div>
      </div>

      {/* Right 2/3: intro + cards */}
      <div className="w-full lg:w-2/3 flex-1 flex flex-col gap-10 lg:gap-16 pt-10 lg:pt-20 px-5 lg:pl-5 lg:pr-5 pb-10 lg:pb-[100px]">
        <p className="text-paragraphs text-bark">
          Conheça nossos projetos e ensaios mais recentes. Para submeter uma ideia, <Link href="/contribute" className="underline">entre em contato</Link>.
        </p>

        <div className="flex flex-col lg:flex-row w-full gap-5 lg:pr-5">
          {featured.map((item) => (
            <article
              key={item.href}
              className="border-[0.5px] border-bark rounded-[6px] bg-sand overflow-hidden flex flex-col flex-1"
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="w-full h-[200px] object-cover"
              />
              <div className="p-5 flex flex-col gap-5 flex-1">
                <div className="flex flex-col gap-2.5 text-paragraphs">
                  <h3 className="text-bark">{item.title}</h3>
                  <p className="text-bark/60">{item.description}</p>
                </div>
                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={() => window.location.href = item.href}
                    className="inline-flex items-center gap-2 px-2.5 py-2.5 bg-coast text-mist uppercase text-accents transition-opacity duration-300 ease-out hover:opacity-80 w-fit"
                  >
                    {item.cta}
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
