import Link from "next/link";
import { ArrowRight, BookOpen, Eye, Mail, MessageSquare, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const cards = [
    { label: "Total posts", value: stats.posts, icon: BookOpen },
    { label: "Views", value: stats.views, icon: Eye },
    { label: "Comments", value: stats.comments, icon: MessageSquare },
    { label: "Subscribers", value: stats.subscribers, icon: Mail },
    { label: "Scheduled", value: stats.scheduled, icon: Timer }
  ];

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge>Dashboard</Badge>
          <h1 className="editorial mt-3 text-5xl">Publishing command center</h1>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/posts/new">
            Create post <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-5">
              <item.icon size={20} className="text-[var(--accent)]" />
              <div className="mt-4 text-sm text-[var(--muted-foreground)]">{item.label}</div>
              <div className="editorial mt-1 text-4xl">{formatNumber(item.value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent posts</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {stats.recentPosts.map((post) => (
              <Link key={post.id} href={`/admin/posts/${post.id}`} className="rounded-md border border-[var(--border)] p-4 transition hover:bg-[var(--muted)]">
                <div className="font-semibold">{post.title}</div>
                <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {post.status} · {post.category?.name || "No category"}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent inquiries</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {stats.recentInquiries.length ? (
              stats.recentInquiries.map((item) => (
                <div key={item.id} className="rounded-md border border-[var(--border)] p-4">
                  <div className="font-semibold">{item.subject}</div>
                  <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {item.name} · {item.email}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">No inquiries yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
