"use client";

import Link from "next/link";
import { Menu, PenLine, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_90%,transparent)] backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-semibold" aria-label="KK Rawat home">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--primary)] text-sm text-[var(--primary-foreground)]">
            KK
          </span>
          <span className="leading-tight">
            <span className="block text-sm tracking-[0.14em] text-[var(--muted-foreground)]">
              RAWAT
            </span>
            <span className="block editorial text-xl">Journal</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
            <Link href="/admin">
              <ShieldCheck size={16} />
              Admin
            </Link>
          </Button>
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link href="/blog">
              <PenLine size={16} />
              Essays
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            title={open ? "Close menu" : "Menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>
      {open ? (
        <div id="mobile-navigation" className="border-t border-[var(--border)] bg-[var(--background)] md:hidden">
          <nav className="container-shell grid gap-1 py-3" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md px-3 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-3">
              <Button asChild variant="secondary" size="sm">
                <Link href="/admin" onClick={() => setOpen(false)}>
                  <ShieldCheck size={16} />
                  Admin
                </Link>
              </Button>
              <Button asChild variant="gold" size="sm">
                <Link href="/blog" onClick={() => setOpen(false)}>
                  <PenLine size={16} />
                  Essays
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
