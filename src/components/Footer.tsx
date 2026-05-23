"use client";

import { useState } from "react";
import Link from "next/link";

const sitemap = [
  { label: "Sobre", href: "/about" },
  { label: "Projetos", href: "/projetos" },
  { label: "Ensaios", href: "/ensaios" },
  { label: "Loja", href: "/store" },
  { label: "Contato", href: "/contact" },
  { label: "Contribua", href: "/contribute" },
];

const social = [
  { label: "X", href: "https://x.com/paxbrasiliana" },
  { label: "Instagram", href: "https://instagram.com/paxbrasiliana" },
  { label: "LinkedIn", href: "https://linkedin.com/company/paxbrasiliana" },
];

const legal = [
  { label: "Política de Privacidade", href: "/privacy" },
  { label: "Participe", href: "/get-involved" },
  { label: "llms.txt", href: "/llms.txt" },
];

function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const props = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
  return (
    <a
      href={href}
      {...props}
      className="w-fit text-[#463C2E] relative
                 before:absolute before:bottom-0 before:left-0 before:right-0
                 before:h-[1px] before:bg-current before:origin-left
                 before:scale-x-0 hover:before:scale-x-100
                 before:transition-transform before:duration-300"
    >
      {label}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <footer className="bg-[#c3be92] relative">
      <div className="mx-auto grid-lines">
        {/* 3 columns */}
        <div className="flex flex-col lg:flex-row lg:border-b-[0.5px] border-b-[#463C2E4D] lg:pb-10">
          {/* Col 1: Logo + Newsletter */}
          <div className="lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0">
            <div className="mt-auto text-paragraphs flex flex-col gap-10 px-2.5 lg:px-5 border-b-[0.5px] border-b-[#463C2E4D] lg:border-b-0 pb-10 lg:pb-0 pt-10 lg:pt-20">
              <img
                src="/images/logo-dark.png"
                alt="Pax Brasiliana"
                className="object-contain w-[73px] h-auto border-l-[3px] border-l-[#E4DECC] shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
              />
              <form
                className="flex flex-col gap-5"
                style={{ fontFamily: "var(--font-mono)" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setStatus("success");
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="text-accents text-[#463C2E] uppercase outline-none py-5 border-b border-dashed border-[#463C2E] w-full bg-transparent placeholder:text-[#463C2E]/60"
                />
                <button
                  type="submit"
                  className="uppercase text-accents bg-[#463C2E] text-[#F8F6E8] px-4 py-3.5 hover:opacity-80 transition-opacity duration-300 self-start"
                >
                  {status === "success" ? "Inscrito" : "Inscrever-se"}
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Sitemap */}
          <div className="text-accents uppercase lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0" style={{ fontFamily: "var(--font-mono)" }}>
            <div className="flex flex-col gap-6 pt-10 px-2.5 lg:px-0 border-b-[0.5px] border-b-[#463C2E4D] lg:border-b-0 pb-10 lg:pb-0">
              <div className="text-[#463C2E]/40">MAPA DO SITE</div>
              {sitemap.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </div>
          </div>

          {/* Col 3: Social */}
          <div className="text-accents uppercase lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0" style={{ fontFamily: "var(--font-mono)" }}>
            <div className="flex flex-col gap-6 pt-10 px-2.5 lg:px-0 border-b-[0.5px] border-b-[#463C2E4D] lg:border-b-0 pb-10 lg:pb-0">
              <div className="text-[#463C2E]/40">REDES SOCIAIS</div>
              {social.map((link) => (
                <FooterLink key={link.href} {...link} external />
              ))}
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-10 px-5 lg:px-10 overflow-hidden">
          <p
            className="text-[clamp(4rem,12vw,10rem)] leading-[1] tracking-[-0.06em] text-[#463C2E] whitespace-nowrap select-none"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 900 }}
            aria-hidden="true"
          >
            PAX BRASILIANA
          </p>
        </div>

        {/* Legal / Copyright */}
        <div className="my-10 flex flex-col lg:flex-row gap-5 px-2.5 lg:px-0">
          <div
            className="lg:w-1/3 uppercase text-black text-accents px-2.5 lg:pl-10 lg:pr-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Todos os direitos reservados, Pax Brasiliana.
          </div>
          <div className="px-2.5 flex gap-10 lg:pl-5 lg:pr-0 flex-wrap">
            {legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="uppercase text-black text-accents transition-opacity duration-300 hover:opacity-60"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
