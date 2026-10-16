"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { buttonClass } from "@/components/ui/button";
import { Chat, Chevron, Code, Phone, Terminal } from "@/components/ui/icons";
import { PLAN_EXTRAS, PRODUCT_CARDS, ProductMenu, RESOURCES, ResourcesMenu } from "@/components/layout/mega-menu";
import { useLenis } from "@/components/smooth-scroll";
import { isFocusRoute } from "@/lib/routes";

const Laptop = ({ className }: { className?: string }) => (
  <svg className={className} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M2 20h20" />
  </svg>
);
/** Every product, for the mobile menu (desktop uses the mega menu in ./mega-menu). */
const PRODUCTS = [
  { href: "/editor", icon: Code, title: "Puku Editor" },
  { href: "/download", icon: Laptop, title: "Puku Desktop" },
  { href: "/cli", icon: Terminal, title: "Puku CLI" },
  { href: "/chat", icon: Chat, title: "Puku Chat" },
  { href: "/app", icon: Phone, title: "Puku App" },
  ...PLAN_EXTRAS.filter((x) => x.title !== "Puku App").map((x) => ({ href: x.href, icon: x.icon, title: x.title })),
];
const LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "https://docs.puku.sh", label: "Docs" },
];
const LINKS_END = [{ href: "/contact", label: "Contact" }];

const ease = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<null | "product" | "resources">(null);
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
    setMenu(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    if (mobile) lenis?.stop();
    else lenis?.start();
  }, [mobile, lenis]);

  const openMenu = (which: "product" | "resources") => {
    window.clearTimeout(closeTimer.current);
    setMenu(which);
  };
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setMenu(null), 120);
  };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const productActive = PRODUCT_CARDS.some((p) => isActive(p.href)) || pathname === "/app";
  const resourcesActive = RESOURCES.some((r) => isActive(r.href));

  if (isFocusRoute(pathname)) return null;

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
              <li onMouseEnter={() => openMenu("product")} onMouseLeave={closeMenu} className="relative">
                <MenuTrigger label="Product" open={menu === "product"} active={productActive || scrolled} onClick={() => setMenu((m) => (m === "product" ? null : "product"))} />
              </li>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <NavLink href={l.href} active={isActive(l.href)}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li onMouseEnter={() => openMenu("resources")} onMouseLeave={closeMenu} className="relative">
                <MenuTrigger label="Resources" open={menu === "resources"} active={resourcesActive} onClick={() => setMenu((m) => (m === "resources" ? null : "resources"))} />
              </li>
              {LINKS_END.map((l) => (
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

          {/* Mega menus: span the navbar's own width (inset to its padding when unscrolled) */}
          <AnimatePresence>
            {menu && (
              <motion.div
                key="mega"
                onMouseEnter={() => openMenu(menu)}
                onMouseLeave={closeMenu}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute top-full hidden pt-2 md:block"
                style={{ left: scrolled ? 0 : 28, right: scrolled ? 0 : 28 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={menu} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                    {menu === "product" ? <ProductMenu isActive={isActive} /> : <ResourcesMenu isActive={isActive} />}
                  </motion.div>
                </AnimatePresence>
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
              {[...LINKS, ...RESOURCES.filter((r) => !r.href.startsWith("http")).map((r) => ({ href: r.href, label: r.title })), ...LINKS_END, { href: "/download", label: "Download" }, { href: "/about", label: "About" }].map((l, i) => (
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

function MenuTrigger({ label, open, active, onClick }: { label: string; open: boolean; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-haspopup="menu"
      className={`flex items-center gap-1 text-[14px] leading-[18px] transition-colors duration-200 hover:text-fg ${active || open ? "text-fg" : "text-muted"}`}
    >
      {label}
      <Chevron size={12} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
    </button>
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
