"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#F8F6E8] pt-32 pb-12 px-5 lg:px-10 border-b-[0.5px] border-[#463C2E]/30">
          <div className="max-w-[1400px] mx-auto">
            <h1
              className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] tracking-[-0.04em] text-[#463C2E]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Política de Privacidade
            </h1>
          </div>
        </section>

        <section className="bg-[#F8F6E8] py-16 md:py-24 px-5 lg:px-10">
          <div className="max-w-3xl mx-auto">
            {[
              { title: "Informações que Coletamos", body: "Coletamos informações que você fornece diretamente, como seu nome, endereço de e-mail e localização quando você se junta ao movimento ou se inscreve para receber atualizações." },
              { title: "Como Usamos Suas Informações", body: "Usamos suas informações para comunicar atualizações do movimento, eventos, ensaios e notícias de projetos. Não vendemos seus dados a terceiros." },
              { title: "Armazenamento de Dados", body: "Seus dados são armazenados com segurança e retidos apenas pelo tempo necessário para cumprir os propósitos descritos nesta política." },
              { title: "Seus Direitos", body: "Você pode solicitar acesso, correção ou exclusão de suas informações pessoais a qualquer momento entrando em contato conosco." },
              { title: "Cookies", body: "Utilizamos cookies mínimos para fins analíticos, para entender como os visitantes interagem com nosso site. Você pode desativar os cookies nas configurações do seu navegador." },
              { title: "Contato", body: "Para questões de privacidade, entre em contato conosco pela nossa página de Contato ou envie-nos um e-mail diretamente." },
            ].map((section) => (
              <div key={section.title} className="mb-8 border-t border-[#463C2E]/30 pt-6">
                <h2 className="text-[20px] lg:text-[24px] leading-[120%] tracking-[-0.02em] text-[#463C2E] font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  {section.title}
                </h2>
                <p className="mt-3 text-[#463C2E]/70 text-[14px] lg:text-[16px] leading-[140%]">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
