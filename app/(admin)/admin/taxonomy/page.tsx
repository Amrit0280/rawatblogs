import { Hash, Tags } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { saveCategoryAction, saveTagAction } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function TaxonomyPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } })
  ]);

  return (
    <div className="grid gap-6">
      <div>
        <Badge>Organization</Badge>
        <h1 className="editorial mt-3 text-5xl">Categories and tags</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="inline-flex items-center gap-2">
                <Tags size={18} /> Categories
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <form action={saveCategoryAction} className="grid gap-3 rounded-lg border border-[var(--border)] p-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input name="name" required />
              </div>
              <Textarea name="description" placeholder="Description" />
              <Input name="color" type="color" defaultValue="#2563eb" aria-label="Category color" />
              <Button type="submit" variant="gold">Add category</Button>
            </form>
            <div className="grid gap-2">
              {categories.map((category) => (
                <div key={category.id} className="rounded-md border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">
                      <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                      {category.name}
                    </span>
                    <Badge>{category._count.posts} posts</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{category.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="inline-flex items-center gap-2">
                <Hash size={18} /> Tags
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <form action={saveTagAction} className="flex gap-2 rounded-lg border border-[var(--border)] p-4">
              <Input name="name" required placeholder="Tag name" />
              <Button type="submit" variant="gold">Add tag</Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag.id}>
                  #{tag.name} · {tag._count.posts}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
