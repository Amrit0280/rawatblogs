import Link from "next/link";
import { Menu, PenLine, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
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
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" title="Menu">
            <Menu size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
