import type { Category, Post, PostTag, Tag } from "@prisma/client";
import { Save } from "lucide-react";
import { savePostAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

type EditorPost = Post & { tags: (PostTag & { tag: Tag })[] };

export function PostEditor({
  post,
  categories,
  tags
}: {
  post?: EditorPost | null;
  categories: Category[];
  tags: Tag[];
}) {
  const selectedTags = new Set(post?.tags.map((item) => item.tagId) || []);

  return (
    <form action={savePostAction} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <input type="hidden" name="id" value={post?.id || ""} />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Editorial content</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={post?.title} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} required rows={4} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Rich content</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={post?.content}
                required
                rows={20}
                placeholder="Use paragraphs separated by blank lines. Start a heading with ## for the table of contents."
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>SEO controls</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input name="metaTitle" defaultValue={post?.metaTitle || ""} placeholder="Meta title" maxLength={70} />
            <Textarea name="metaDescription" defaultValue={post?.metaDescription || ""} placeholder="Meta description" maxLength={170} rows={3} />
            <Input name="canonicalUrl" defaultValue={post?.canonicalUrl || ""} placeholder="Canonical URL" />
            <Input name="ogImage" defaultValue={post?.ogImage || ""} placeholder="Open Graph image URL" />
          </CardContent>
        </Card>
      </div>
      <aside className="grid content-start gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Publish</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Select name="status" defaultValue={post?.status || "DRAFT"}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
            <Input name="scheduledAt" type="datetime-local" defaultValue={post?.scheduledAt ? post.scheduledAt.toISOString().slice(0, 16) : ""} />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input name="featured" type="checkbox" defaultChecked={post?.featured} />
              Featured post
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input name="trending" type="checkbox" defaultChecked={post?.trending} />
              Trending post
            </label>
            <Button type="submit" variant="gold">
              <Save size={16} />
              Save post
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Select name="categoryId" defaultValue={post?.categoryId || ""}>
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <div className="grid gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 text-sm">
                  <input name="tagIds" value={tag.id} type="checkbox" defaultChecked={selectedTags.has(tag.id)} />
                  {tag.name}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input name="coverImage" defaultValue={post?.coverImage || ""} placeholder="Featured image URL" />
            <Input name="coverAlt" defaultValue={post?.coverAlt || ""} placeholder="Image alt text" />
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}
