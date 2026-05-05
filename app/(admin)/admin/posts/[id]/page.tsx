import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/post-editor";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { tags: { include: { tag: true } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!post) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <Badge>Editor</Badge>
        <h1 className="editorial mt-3 text-5xl">Edit post</h1>
      </div>
      <PostEditor post={post} categories={categories} tags={tags} />
    </div>
  );
}
