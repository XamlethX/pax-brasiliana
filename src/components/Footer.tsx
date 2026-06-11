"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const sitemap = [
  { label: "Sobre", href: "/about" },
  { label: "Projetos", href: "/projetos" },
  { label: "Ensaios", href: "/ensaios" },
  { label: "Loja", href: "/store" },
  { label: "Contato", href: "/contact" },
  { label: "Contribua", href: "/contribute" },
  { label: "Doar", href: "/doar" },
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
      className="w-fit text-bark relative
                 before:absolute before:bottom-0 before:left-0 before:right-0
                 before:h-[1px] before:bg-current before:origin-left
                 before:scale-x-0 hover:before:scale-x-100
                 before:transition-transform before:duration-300 before:ease-out"
    >
      {label}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="relative" style={{ backgroundColor: "var(--iron)" }}>
      <div className="mx-auto grid-lines">
        {/* 3 columns */}
        <div className="flex flex-col lg:flex-row lg:border-b-[0.5px] border-b-bark/20 lg:pb-10">
          {/* Col 1: Logo + Newsletter */}
          <div className="lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0">
            <div className="mt-auto text-paragraphs flex flex-col gap-10 px-2.5 lg:px-5 border-b-[0.5px] border-b-bark/20 lg:border-b-0 pb-10 lg:pb-0 pt-10 lg:pt-20">
              <Logo
                className="text-bark w-[73px] h-auto border-l-[3px] border-l-bark/30"
                aria-label="Pax Brasiliana"
              />
              <form className="flex flex-col gap-5 font-mono" onSubmit={handleSubmit}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  aria-label="Email para newsletter"
                  disabled={status === "loading"}
                  className="text-accents text-bark uppercase outline-none py-5 border-b border-dashed border-bark/40 w-full bg-transparent placeholder:text-bark/40 disabled:opacity-50"
                />
                {/* Honeypot — hidden from users, catches bots */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="hidden"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="uppercase text-accents bg-bark text-mist px-4 py-3.5 hover:opacity-80 transition-opacity duration-300 ease-out self-start disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading"
                    ? "Enviando…"
                    : status === "success"
                    ? "Inscrito ✓"
                    : "Inscrever-se"}
                </button>
                {status === "error" && (
                  <p role="alert" className="text-accents text-clay">
                    Erro ao inscrever. Tente novamente.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Col 2: Sitemap */}
          <div className="text-accents uppercase lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0 font-mono">
            <div className="flex flex-col gap-6 pt-10 px-2.5 lg:px-0 border-b-[0.5px] border-b-bark/20 lg:border-b-0 pb-10 lg:pb-0">
              <div className="text-bark/40">MAPA DO SITE</div>
              {sitemap.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </div>
          </div>

          {/* Col 3: Social */}
          <div className="text-accents uppercase lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0 font-mono">
            <div className="flex flex-col gap-6 pt-10 px-2.5 lg:px-0 border-b-[0.5px] border-b-bark/20 lg:border-b-0 pb-10 lg:pb-0">
              <div className="text-bark/40">REDES SOCIAIS</div>
              {social.map((link) => (
                <FooterLink key={link.href} {...link} external />
              ))}
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-10 px-5 lg:px-10 overflow-hidden">
          <p
            className="text-[clamp(4rem,12vw,10rem)] leading-[1] tracking-[-0.06em] text-bark whitespace-nowrap select-none font-heading font-black"
            aria-hidden="true"
          >
            PAX BRASILIANA
          </p>
        </div>

        {/* Legal / Copyright */}
        <div className="my-10 flex flex-col lg:flex-row gap-5 px-2.5 lg:px-0">
          <div className="lg:w-1/3 uppercase text-bark/50 text-accents px-2.5 lg:pl-10 lg:pr-5 font-mono">
            Todos os direitos reservados, Pax Brasiliana.
          </div>
          <div className="px-2.5 flex gap-10 lg:pl-5 lg:pr-0 flex-wrap">
            {legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="uppercase text-bark/50 text-accents font-mono transition-opacity duration-300 ease-out hover:opacity-100"
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
