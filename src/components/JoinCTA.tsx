"use client";

export default function JoinCTA() {
  return (
    <section className="grid-lines relative min-h-[600px] flex flex-col lg:flex-row w-full">
      <img src="/images/futuro-terraco.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="media-overlay" aria-hidden="true" />

      <div className="lg:w-2/3 pt-10 pb-5 lg:py-10 z-[2] relative px-5 lg:pl-10 flex flex-col gap-6 justify-between">
        <h2 className="text-[#F8F6E8] text-h3 font-bold flex flex-col" style={{ fontFamily: "var(--font-heading)" }}>
          <span>Junte-se ao</span><span>Movimento</span>
        </h2>
        <div className="lg:max-w-[412px] text-[#F8F6E8] text-paragraphs flex flex-col gap-8">
          <p>Nossa comunidade é aberta e ambiciosa. Somos empreendedores, criadores, construtores. Pessoas que acreditam, que tentam.</p>
          <p>Alta agência, com altas expectativas de que podemos construir um Brasil melhor.</p>
        </div>
      </div>

      <div className="lg:w-1/3 z-[2] relative px-2.5 lg:pr-5 lg:pl-0 flex-1">
        <div className="px-2.5 lg:px-5 relative py-5 lg:py-10 border-t-[0.5px] border-t-[#F8F6E8]/50 lg:border-t-0 h-full">
          <img src="/images/pattern-bg.png" alt="" className="absolute inset-0 w-full z-[1] h-full" />
          <form className="bg-[#F8F6E8] p-10 rounded-[6px] border border-[#463C2E] relative z-10">
            <div className="text-paragraphs text-[#463C2E]" style={{ fontFamily: "var(--font-heading)" }}>Participe</div>
            <div className="pt-5" style={{ fontFamily: "var(--font-mono)" }}>
              <input type="text" placeholder="NOME" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40" />
              <input type="text" placeholder="SOBRENOME" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40" />
              <input type="email" placeholder="EMAIL" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40" />
              <select defaultValue="" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent appearance-none cursor-pointer">
                <option value="" disabled>ESTADO</option>
                <option value="ac">Acre</option><option value="al">Alagoas</option><option value="am">Amazonas</option>
                <option value="ba">Bahia</option><option value="ce">Ceará</option><option value="df">Distrito Federal</option>
                <option value="es">Espírito Santo</option><option value="go">Goiás</option><option value="ma">Maranhão</option>
                <option value="mg">Minas Gerais</option><option value="ms">Mato Grosso do Sul</option><option value="mt">Mato Grosso</option>
                <option value="pa">Pará</option><option value="pb">Paraíba</option><option value="pe">Pernambuco</option>
                <option value="pi">Piauí</option><option value="pr">Paraná</option><option value="rj">Rio de Janeiro</option>
                <option value="rn">Rio Grande do Norte</option><option value="ro">Rondônia</option><option value="rr">Roraima</option>
                <option value="rs">Rio Grande do Sul</option><option value="sc">Santa Catarina</option><option value="se">Sergipe</option>
                <option value="sp">São Paulo</option><option value="to">Tocantins</option><option value="exterior">Exterior</option>
              </select>
              <input type="text" placeholder="PROFISSÃO" required className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E]/30 w-full bg-transparent placeholder:text-[#463C2E]/40" />
            </div>
            <button type="submit" className="uppercase leading-none flex gap-2 px-4 py-3.5 items-center bg-[#463C2E] text-[#F8F6E8] w-full justify-between mt-10 transition-all duration-300 ease-out hover:opacity-80 cursor-pointer text-accents" style={{ fontFamily: "var(--font-mono)" }}>
              <span>JUNTE-SE AO MOVIMENTO</span>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M6.295 0.705L10.085 4.5H0V5.5H10.085L6.295 9.295L7 10L12 5L7 0L6.295 0.705Z" fill="#F8F6E8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
