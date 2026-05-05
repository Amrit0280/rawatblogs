import Link from "next/link";
import { BarChart3, BookOpen, FolderTree, Home, ImageIcon, MessageSquare, Settings, Sparkles } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const adminNav = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/posts", label: "Posts", icon: BookOpen },
  { href: "/admin/taxonomy", label: "Taxonomy", icon: FolderTree },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children, userName }: { children: React.ReactNode; userName?: string | null }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-[var(--border)] bg-[var(--card)] p-5 lg:block">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Sparkles size={18} />
          </span>
          <span>
            <span className="editorial block text-2xl">KK Rawat</span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              CMS
            </span>
          </span>
        </Link>
        <nav className="mt-8 grid gap-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 grid gap-2">
          <Button asChild variant="secondary">
            <Link href="/">
              <Home size={16} /> View site
            </Link>
          </Button>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-8">
            <div>
              <div className="text-sm font-semibold text-[var(--muted-foreground)]">Welcome back</div>
              <div className="font-semibold">{userName || "Admin"}</div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button asChild variant="gold" size="sm">
                <Link href="/admin/posts/new">New post</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
