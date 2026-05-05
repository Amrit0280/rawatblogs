import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/post-editor";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="grid gap-6">
      <div>
        <Badge>Editor</Badge>
        <h1 className="editorial mt-3 text-5xl">New post</h1>
      </div>
      <PostEditor categories={categories} tags={tags} />
    </div>
  );
}
