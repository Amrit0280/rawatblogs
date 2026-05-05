import { CheckCircle2, ShieldAlert, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { moderateCommentAction } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true, slug: true } } }
  });

  return (
    <div className="grid gap-6">
      <div>
        <Badge>Moderation</Badge>
        <h1 className="editorial mt-3 text-5xl">Comments</h1>
      </div>
      <Card>
        <CardContent className="grid gap-3 pt-5">
          {comments.length ? (
            comments.map((comment) => (
              <div key={comment.id} className="grid gap-4 rounded-lg border border-[var(--border)] p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{comment.status}</Badge>
                    <Badge>{comment.post.title}</Badge>
                  </div>
                  <div className="mt-3 font-semibold">{comment.name} · {comment.email}</div>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{comment.body}</p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={moderateCommentAction}>
                    <input type="hidden" name="id" value={comment.id} />
                    <input type="hidden" name="status" value="APPROVED" />
                    <Button type="submit" size="sm" variant="secondary">
                      <CheckCircle2 size={16} /> Approve
                    </Button>
                  </form>
                  <form action={moderateCommentAction}>
                    <input type="hidden" name="id" value={comment.id} />
                    <input type="hidden" name="status" value="SPAM" />
                    <Button type="submit" size="sm" variant="secondary">
                      <ShieldAlert size={16} /> Spam
                    </Button>
                  </form>
                  <form action={moderateCommentAction}>
                    <input type="hidden" name="id" value={comment.id} />
                    <input type="hidden" name="status" value="DELETED" />
                    <Button type="submit" size="sm" variant="danger" aria-label="Delete comment">
                      <Trash2 size={16} />
                    </Button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">No comments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
