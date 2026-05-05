import Link from "next/link";
import { Linkedin, Mail, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--primary)] text-[var(--primary-foreground)]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="editorial text-3xl">KK Rawat</div>
          <p className="mt-3 max-w-md text-sm leading-6 opacity-75">
            Independent, SEO-first publishing for durable professional authority.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] opacity-70">Navigate</div>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/blog">Blog archive</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/admin">Admin dashboard</Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] opacity-70">Connect</div>
          <div className="mt-4 flex gap-2">
            <Link className="grid h-10 w-10 place-items-center rounded-md bg-white/10" href="mailto:hello@kkrawat.com" aria-label="Email">
              <Mail size={18} />
            </Link>
            <Link className="grid h-10 w-10 place-items-center rounded-md bg-white/10" href="https://linkedin.com" aria-label="LinkedIn">
              <Linkedin size={18} />
            </Link>
            <Link className="grid h-10 w-10 place-items-center rounded-md bg-white/10" href="https://x.com" aria-label="X">
              <Twitter size={18} />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} KK Rawat. All rights reserved.
      </div>
    </footer>
  );
}
