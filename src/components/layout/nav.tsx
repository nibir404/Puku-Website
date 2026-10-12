"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { buttonClass } from "@/components/ui/button";
import { Chat, Chevron, Cloud, Code, Palette, Phone, Terminal, Wand } from "@/components/ui/icons";
import { useLenis } from "@/components/smooth-scroll";

const PRODUCTS = [
  { href: "/editor", icon: Code, title: "Puku Editor", body: "The Puku Editor desktop app" },
  { href: "/cli", icon: Terminal, title: "Puku CLI", body: "Automation from your terminal" },
  { href: "/chat", icon: Chat, title: "Puku Chat", body: "Chat and research in your browser" },
  { href: "/app", icon: Phone, title: "Puku App", body: "Mobile chat, installation coming soon", tag: "PREVIEW" },
];
const SOON = [
  { icon: Wand, title: "Puku Co-Work" },
  { icon: Palette, title: "Puku Design" },
  { icon: Cloud, title: "Puku Cloud" },
];
const LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "https://docs.puku.sh", label: "Docs" },
  { href: "/blog", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setMenu(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    if (mobile) lenis?.stop();
    else lenis?.start();
  }, [mobile, lenis]);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setMenu(false), 120);
  };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const productActive = PRODUCTS.some((p) => isActive(p.href));

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            marginTop: scrolled ? 12 : 0,
            maxWidth: scrolled ? 1040 : 1440,
            height: scrolled ? 52 : 64,
            borderRadius: scrolled ? 14 : 0,
            paddingLeft: scrolled ? 20 : 28,
            paddingRight: scrolled ? 10 : 28,
          }}
          transition={{ duration: 0.24, ease: "easeOut", y: { duration: 0.7, ease }, opacity: { duration: 0.5 } }}
          className={`pointer-events-auto relative flex w-[calc(100%-24px)] items-center justify-between border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:w-[calc(100%-32px)] ${
            scrolled
              ? "border-line bg-[var(--nav-scrolled)] shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_12px_32px_rgb(40_44_34/0.12)] backdrop-blur-[16px] backdrop-saturate-150"
              : "w-full! border-transparent bg-transparent"
          }`}
          aria-label="Main"
        >
          <div className="flex items-center gap-6 lg:gap-7">
            <Link href="/" aria-label="Puku home" className="group/logo flex items-center gap-2.5">
              <motion.span animate={{ scale: scrolled ? 0.875 : 1 }} className="inline-flex origin-left transition-transform duration-500 group-hover/logo:rotate-[-8deg]">
                <Logo size={16} />
              </motion.span>
            </Link>
            <ul className="hidden items-center gap-5 md:flex lg:gap-[22px]">
              <li onMouseEnter={openMenu} onMouseLeave={closeMenu} className="relative">
                <button
                  type="button"
                  onClick={() => setMenu((m) => !m)}
                  aria-expanded={menu}
                  className={`flex items-center gap-1 text-[14px] leading-[18px] transition-colors duration-200 hover:text-fg ${
                    productActive || menu || scrolled ? "text-fg" : "text-muted"
                  }`}
                >
                  Product
                  <Chevron size={12} className={`transition-transform duration-300 ${menu ? "rotate-180" : ""}`} />
                </button>
              </li>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <NavLink href={l.href} active={isActive(l.href)}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle className={scrolled ? "border-transparent bg-hover" : ""} />
            <AnimatePresence initial={false}>
              {!scrolled && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.24 }}
                  className="hidden overflow-hidden md:block"
                >
                  <NavLink href="/contact" active={false}>
                    Sign in
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
            <Link href="/download" className={buttonClass("primary", "sm", "hidden sm:inline-flex")}>
              Download
            </Link>
            <button
              type="button"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              onClick={() => setMobile((m) => !m)}
              className="relative grid size-8 place-items-center rounded-control border border-line md:hidden"
            >
              <span className={`absolute h-px w-3.5 bg-fg transition-transform duration-300 ${mobile ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-px w-3.5 bg-fg transition-transform duration-300 ${mobile ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>

          {/* Product mega menu */}
          <AnimatePresence>
            {menu && (
              <motion.div
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
                initial={{ opacity: 0, y: -4, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.985 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute top-full left-0 hidden origin-top-left pt-2 md:block"
                style={{ left: scrolled ? 8 : 32 }}
              >
                <div className="flex w-[760px] max-w-[calc(100vw-48px)] rounded-panel border border-line bg-panel p-2 shadow-[0_2px_4px_rgb(40_44_34/0.06),0_12px_32px_rgb(40_44_34/0.1)]">
                  <div className="flex flex-1 flex-col gap-0.5 border-r border-line pr-2">
                    {PRODUCTS.map((p, i) => (
                      <motion.div
                        key={p.href}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * i, duration: 0.22 }}
                      >
                        <Link
                          href={p.href}
                          className={`group/item flex gap-3 rounded-[8px] p-3 transition-colors duration-150 hover:bg-hover ${isActive(p.href) ? "bg-hover" : ""}`}
                        >
                          <p.icon className="mt-px text-fg transition-transform duration-300 group-hover/item:scale-110 group-hover/item:text-accent" />
                          <span className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-2 text-[14px] leading-[18px] font-[570] text-fg">
                              {p.title}
                              {p.tag && <span className="font-mono text-[11px] leading-[14px] font-normal text-accent">{p.tag}</span>}
                            </span>
                            <span className="text-[13px] leading-4 text-muted">{p.body}</span>
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex w-[300px] shrink-0 flex-col gap-0.5 pl-2">
                    <div className="px-3 pt-3 pb-1.5 font-mono text-[11px] leading-[14px] tracking-[0.08em] text-muted">COMING SOON</div>
                    {SOON.map((s) => (
                      <div key={s.title} className="flex items-center gap-3 px-3 py-2.5 text-muted">
                        <s.icon />
                        <span className="flex-1 text-[14px] leading-[18px]">{s.title}</span>
                        <span className="rounded-control bg-hover px-2 py-[3px] text-[12px] leading-4">Soon</span>
                      </div>
                    ))}
                    <Link href="/coming-soon" className="group/wl mt-auto flex flex-col gap-1 border-t border-line p-3">
                      <span className="text-[13px] leading-4 text-fg">Get early access</span>
                      <span className="text-[12px] leading-4 text-muted transition-colors group-hover/wl:text-accent">Join the waitlist →</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-main px-4 pt-24 pb-8 md:hidden"
            data-lenis-prevent
          >
            <div className="font-mono text-[11px] tracking-[0.1em] text-muted">PRODUCT</div>
            <div className="mt-3 grid grid-cols-1 gap-1 xs:grid-cols-2">
              {PRODUCTS.map((p, i) => (
                <motion.div key={p.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05, ease }}>
                  <Link href={p.href} className="flex items-center gap-3 rounded-[10px] border border-line bg-panel p-3.5">
                    <p.icon className="text-accent" />
                    <span className="text-[15px] text-fg">{p.title}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-col">
              {[...LINKS, { href: "/download", label: "Download" }, { href: "/about", label: "About" }].map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05, ease }}>
                  <Link href={l.href} className="flex items-center justify-between border-b border-line py-4 text-[28px] leading-9 tracking-[-0.02em] text-fg">
                    {l.label}
                    <span className="text-[18px] text-muted">→</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link href="/download" className={buttonClass("primary", "lg", "mt-8 w-full")}>
              Download for Mac
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`group/nl relative text-[14px] leading-[18px] transition-colors duration-200 hover:text-fg ${active ? "text-fg" : "text-muted"}`}
    >
      {children}
      <span
        className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ease-out ${
          active ? "scale-x-100" : "scale-x-0 group-hover/nl:scale-x-100"
        }`}
      />
    </Link>
  );
}
