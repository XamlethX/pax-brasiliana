"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Sobre", href: "/about" },
  { label: "Projetos", href: "/projetos" },
  { label: "Ensaios", href: "/ensaios" },
  { label: "Loja", href: "/store" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(!isHome);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      if (y > lastY.current && y > 10) setHidden(true);
      else setHidden(false);
      setScrolled(y > 10);
      if (isHome) setActive(y > window.innerHeight / 2);
      lastY.current = y;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => {
    setDrawerClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setDrawerClosing(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <>
      <header
        className={`
          group fixed top-0 left-0 right-0 z-50
          flex w-full py-5 lg:py-7 justify-between
          grid-lines
          ${active ? "header-active" : ""}
          ${scrolled && !hidden ? "header-shadow" : ""}
        `}
        style={{
          transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), background-color 300ms cubic-bezier(0.4,0,0.2,1)",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          backgroundColor: active ? "var(--mist)" : "transparent",
        }}
      >
        {/* Left 1/3: Logo */}
        <div className="lg:w-1/3 flex items-start pl-5 lg:pl-10">
          <Link href="/" className="relative block w-[65px] h-[54px] shrink-0">
            <img
              src="/images/logo-light-navbar.svg"
              alt="Pax Brasiliana"
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
              style={{ opacity: active ? 0 : 1 }}
            />
            <img
              src="/images/logo-dark-navbar.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
              style={{ opacity: active ? 1 : 0 }}
            />
          </Link>
        </div>

        {/* Center 1/3: Nav links (desktop) */}
        <nav className="lg:w-1/3 justify-around hidden lg:flex font-mono">
          {navLinks.map((item) => {
            const isCurrent = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  nav-underline
                  py-[10.5px] px-6 text-nowrap text-accents uppercase
                  transition-colors duration-300
                  ${isCurrent ? "is-current" : "hover:opacity-60"}
                  ${active ? "text-bark" : "text-mist"}
                `}
              >
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        {/* Right 1/3: CTA + hamburger */}
        <div className="lg:w-1/3 flex items-start gap-2.5 justify-end pr-5 lg:pr-10 ml-auto lg:ml-0">
          <Link
            href="/get-involved"
            className="hidden lg:inline-flex items-center h-[38px] px-4 bg-bark text-mist text-accents font-mono uppercase transition-opacity duration-300 hover:opacity-80"
          >
            PARTICIPE
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            className={`lg:hidden h-[38px] w-[38px] transition-colors duration-300 ${active ? "text-bark" : "text-mist"}`}
            aria-label="Abrir menu"
          >
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
              <path d="M10.79 19H27.21M10.79 13.52H27.21M10.79 24.47H27.21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer — fullscreen, slides from right */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className={`fixed inset-0 z-[60] bg-sand outline-none ${drawerClosing ? "drawer-closing" : "drawer-open"}`}
        >
          <div className="h-full px-5 py-5 flex flex-col">
            {/* Top: logo + CTA + close */}
            <div className="flex items-center justify-between">
              <img
                src="/images/logo-dark-navbar.svg"
                alt=""
                className="w-14 h-auto object-contain"
              />
              <div className="flex gap-2.5">
                <Link
                  href="/get-involved"
                  onClick={closeDrawer}
                  className="bg-bark text-mist font-mono py-3.5 px-4 text-accents uppercase hover:opacity-80 transition-opacity duration-300 h-fit"
                >
                  Participe
                </Link>
                <button
                  onClick={closeDrawer}
                  className="text-bark h-[38px] w-[38px]"
                  aria-label="Fechar menu"
                >
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
                    <path d="M12 12L26 26M12 26L26 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Center: nav links */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-10">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  className="text-bark text-paragraphs hover:opacity-70 transition-opacity duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Bottom: CTA with arrow */}
            <Link
              href="/get-involved"
              onClick={closeDrawer}
              className="bg-bark text-mist font-mono py-3.5 px-4 uppercase text-accents flex items-center justify-between hover:opacity-80 transition-opacity duration-300"
            >
              <span>Participe</span>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5h10M7 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
