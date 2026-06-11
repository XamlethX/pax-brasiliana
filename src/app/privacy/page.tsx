"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tocSections = [
  { id: "quem-somos", label: "Quem somos" },
  { id: "informacoes-coletadas", label: "Informações que coletamos" },
  { id: "como-coletamos", label: "Como coletamos suas informações" },
  { id: "por-que-coletamos", label: "Por que coletamos e usamos suas informações" },
  { id: "marketing-direto", label: "Marketing direto e suas escolhas" },
  { id: "quando-compartilhamos", label: "Quando compartilhamos suas informações" },
  { id: "divulgacao-exterior", label: "Divulgação ao exterior" },
  { id: "armazenamento", label: "Como armazenamos e protegemos suas informações" },
  { id: "acesso-correcao", label: "Acesso e correção de suas informações" },
  { id: "cookies", label: "Cookies e analytics" },
  { id: "links-terceiros", label: "Links de terceiros" },
  { id: "alteracoes", label: "Alterações nesta política" },
  { id: "contato", label: "Como nos contatar ou fazer uma reclamação" },
];

export default function PrivacyPage() {
  const [activeTocId, setActiveTocId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    const headings = document.querySelectorAll(".page-content h2");
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1 pb-10 lg:pb-30 pt-10 lg:pt-20 grid-lines relative bg-mist">
        <div className="grid grid-cols-1 lg:grid-cols-[33.33%_1fr]">
          {/* LEFT: Sticky Sidebar */}
          <div>
            <div className="lg:sticky lg:top-24 pb-10">
              <div className="px-5 lg:pl-10 lg:pr-5">
                <div className="text-coast text-accents font-mono uppercase">
                  Última atualização: mai 2025
                </div>
                <div className="text-h3 pt-5 font-bold text-bark">
                  Política de Privacidade
                </div>
              </div>
              <div className="px-2.5 lg:pl-5">
                <nav className="flex flex-col mt-5" id="page-toc">
                  {tocSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`font-mono text-accents uppercase toc-link py-2.5 pl-2.5 lg:pl-5 border-l transition-colors duration-200 ease-out ${
                        activeTocId === section.id
                          ? "text-bark border-l-clay"
                          : "text-bark/40 border-l-transparent hover:text-bark/70"
                      }`}
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="px-5">
            <div className="lg:pr-5 page-content text-bark max-w-[900px]">
              <h2 id="quem-somos">Quem somos</h2>
              <p>
                A Pax Brasiliana é um movimento cultural-industrial voltado a imaginar, construir e acelerar o futuro brasileiro. Coletamos e utilizamos informações pessoais no Brasil em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018) e demais legislações aplicáveis.
              </p>
              <p>
                Para qualquer questão relacionada a esta política ou ao tratamento dos seus dados pessoais, entre em contato conosco pelo e-mail:{" "}
                <a
                  href="mailto:contato@paxbrasiliana.com"
                  className="text-bark underline underline-offset-2 decoration-bark/30 hover:decoration-bark transition-colors"
                >
                  contato@paxbrasiliana.com
                </a>
              </p>

              <h2 id="informacoes-coletadas">Informações que coletamos</h2>
              <p>
                Coletamos informações pessoais que você nos fornece diretamente quando:
              </p>
              <ul>
                <li>Se cadastra para participar do movimento ou receber nossa newsletter</li>
                <li>Preenche nosso formulário de contribuição</li>
                <li>Entra em contato conosco por e-mail ou formulário</li>
                <li>Realiza uma compra em nossa loja</li>
              </ul>
              <p>
                As informações coletadas podem incluir: nome completo, endereço de e-mail, estado de residência, profissão, disponibilidade de tempo e habilidades que você deseja compartilhar conosco.
              </p>
              <p>
                Também coletamos automaticamente informações sobre como você interage com nosso site, incluindo endereço IP, tipo de navegador, páginas visitadas e tempo de permanência.
              </p>

              <h2 id="como-coletamos">Como coletamos suas informações</h2>
              <p>
                Coletamos informações pessoais por meio das seguintes formas:
              </p>
              <ul>
                <li>Diretamente de você quando preenche nossos formulários</li>
                <li>Automaticamente por meio de cookies e tecnologias similares</li>
                <li>De terceiros, como ferramentas de analytics (Google Analytics, Plausible)</li>
              </ul>

              <h2 id="por-que-coletamos">Por que coletamos e usamos suas informações</h2>
              <p>
                Utilizamos suas informações pessoais para as seguintes finalidades:
              </p>
              <ul>
                <li>Comunicar atualizações do movimento, eventos, ensaios e novidades sobre projetos</li>
                <li>Processar sua participação como colaborador ou membro da comunidade</li>
                <li>Enviar nossa newsletter quando você se inscrever</li>
                <li>Processar compras realizadas em nossa loja</li>
                <li>Melhorar nosso site e entender como os visitantes interagem com ele</li>
                <li>Responder a suas solicitações e mensagens</li>
              </ul>
              <p>
                O tratamento dos seus dados é baseado nas seguintes bases legais previstas na LGPD: consentimento, execução de contrato, legítimo interesse e cumprimento de obrigação legal.
              </p>

              <h2 id="marketing-direto">Marketing direto e suas escolhas</h2>
              <p>
                Se você consentiu em receber nossas comunicações, enviaremos periodicamente ensaios, atualizações de projetos e informações sobre o movimento. Você pode cancelar a qualquer momento clicando no link de descadastramento presente em cada e-mail ou entrando em contato conosco diretamente.
              </p>
              <p>
                Não compartilhamos seus dados com terceiros para fins de marketing.
              </p>

              <h2 id="quando-compartilhamos">Quando compartilhamos suas informações</h2>
              <p>
                Não vendemos suas informações pessoais. Podemos compartilhá-las nas seguintes situações:
              </p>
              <ul>
                <li>
                  <strong>Prestadores de serviços:</strong> empresas que nos auxiliam na operação do site e serviços (hospedagem, e-mail marketing, processamento de pagamentos), que estão contratualmente obrigadas a proteger seus dados
                </li>
                <li>
                  <strong>Obrigação legal:</strong> quando exigido por lei, decisão judicial ou autoridade competente
                </li>
                <li>
                  <strong>Com seu consentimento:</strong> em qualquer outra situação, apenas com sua autorização expressa
                </li>
              </ul>

              <h2 id="divulgacao-exterior">Divulgação ao exterior</h2>
              <p>
                Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. Quando seus dados são transferidos para outros países, tomamos as medidas necessárias para garantir que recebam proteção adequada, em conformidade com a LGPD e as orientações da Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
              <p>
                Utilizamos ferramentas como Vercel (hospedagem) e Google Analytics (analytics), que podem processar dados fora do Brasil, sempre sob proteções contratuais adequadas.
              </p>

              <h2 id="armazenamento">Como armazenamos e protegemos suas informações</h2>
              <p>
                Seus dados são armazenados em servidores seguros com acesso restrito. Adotamos medidas técnicas e organizacionais adequadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
              <p>
                Retemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei. Dados de newsletter são mantidos enquanto você permanecer inscrito. Dados de compra são mantidos pelo período exigido pela legislação fiscal brasileira.
              </p>

              <h2 id="acesso-correcao">Acesso e correção de suas informações</h2>
              <p>
                Nos termos da LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
              </p>
              <ul>
                <li>Confirmar se tratamos seus dados</li>
                <li>Acessar os dados que temos sobre você</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade</li>
                <li>Solicitar a portabilidade dos seus dados</li>
                <li>Revogar o consentimento a qualquer momento</li>
                <li>Opor-se ao tratamento realizado com base em legítimo interesse</li>
              </ul>
              <p>
                Para exercer qualquer um desses direitos, entre em contato pelo e-mail contato@paxbrasiliana.com. Responderemos no prazo de 15 dias corridos.
              </p>

              <h2 id="cookies">Cookies e analytics</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site. Os cookies que utilizamos incluem:
              </p>
              <ul>
                <li>
                  <strong>Cookies essenciais:</strong> necessários para o funcionamento básico do site
                </li>
                <li>
                  <strong>Cookies analíticos:</strong> nos ajudam a entender como os visitantes interagem com o site (Google Analytics ou Plausible Analytics)
                </li>
              </ul>
              <p>
                Você pode desativar cookies nas configurações do seu navegador. Note que isso pode afetar a funcionalidade de algumas partes do site.
              </p>

              <h2 id="links-terceiros">Links de terceiros</h2>
              <p>
                Nosso site pode conter links para sites de terceiros. Esta política de privacidade não se aplica a esses sites. Recomendamos que você leia a política de privacidade de cada site que visitar. Não nos responsabilizamos pelo conteúdo ou práticas de privacidade de sites externos.
              </p>

              <h2 id="alteracoes">Alterações nesta política</h2>
              <p>
                Podemos atualizar esta política de privacidade periodicamente para refletir mudanças em nossas práticas ou na legislação aplicável. Quando fizermos alterações significativas, notificaremos você por e-mail (se tivermos seu endereço) ou por meio de aviso em destaque em nosso site.
              </p>
              <p>
                A data da última atualização está indicada no topo desta política. Recomendamos que você consulte esta página periodicamente.
              </p>

              <h2 id="contato">Como nos contatar ou fazer uma reclamação</h2>
              <p>
                Para questões sobre esta política de privacidade, sobre o tratamento dos seus dados pessoais ou para exercer seus direitos, entre em contato com nossa equipe:
              </p>
              <ul>
                <li>
                  <strong>E-mail:</strong>{" "}
                  <a
                    href="mailto:contato@paxbrasiliana.com"
                    className="text-bark underline underline-offset-2 decoration-bark/30 hover:decoration-bark transition-colors"
                  >
                    contato@paxbrasiliana.com
                  </a>
                </li>
              </ul>
              <p>
                Se você acredita que seus direitos foram violados e não ficou satisfeito com nossa resposta, pode apresentar uma reclamação à Autoridade Nacional de Proteção de Dados (ANPD), o órgão regulador responsável pela proteção de dados no Brasil, pelo site{" "}
                <a
                  href="https://www.gov.br/anpd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bark underline underline-offset-2 decoration-bark/30 hover:decoration-bark transition-colors"
                >
                  www.gov.br/anpd
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
