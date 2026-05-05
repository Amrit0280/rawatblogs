import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { deletePostAction } from "@/lib/actions";
import { getAdminContent } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const { posts } = await getAdminContent();

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Badge>Content</Badge>
          <h1 className="editorial mt-3 text-5xl">Posts</h1>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/posts/new">
            <Plus size={16} /> New post
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="pt-5">
          <div className="grid gap-3">
            {posts.map((post) => (
              <div key={post.id} className="grid gap-4 rounded-lg border border-[var(--border)] p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{post.status}</Badge>
                    {post.category ? <Badge>{post.category.name}</Badge> : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold">{post.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">{post.excerpt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/admin/posts/${post.id}`}>
                      <Edit3 size={16} /> Edit
                    </Link>
                  </Button>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <Button type="submit" variant="danger" size="sm" aria-label={`Delete ${post.title}`}>
                      <Trash2 size={16} />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
