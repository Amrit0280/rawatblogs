import Image from "next/image";
import { Upload } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { saveMediaAction } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="grid gap-6">
      <div>
        <Badge>Library</Badge>
        <h1 className="editorial mt-3 text-5xl">Media metadata</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add asset</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveMediaAction} className="grid gap-3">
              <div className="grid gap-2">
                <Label>Asset URL</Label>
                <Input name="url" type="url" required />
              </div>
              <Input name="title" placeholder="Title" />
              <Input name="alt" placeholder="Alt text" />
              <Input name="folder" placeholder="Folder" defaultValue="general" />
              <Input name="mimeType" placeholder="MIME type" defaultValue="image/jpeg" />
              <div className="grid grid-cols-3 gap-2">
                <Input name="width" type="number" placeholder="Width" />
                <Input name="height" type="number" placeholder="Height" />
                <Input name="size" type="number" placeholder="Size" />
              </div>
              <Button type="submit" variant="gold">
                <Upload size={16} /> Save asset
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <Card key={item.id}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg bg-[var(--muted)]">
                {item.mimeType.startsWith("image") ? (
                  <Image src={item.url} alt={item.alt || item.title || "Media asset"} fill sizes="30vw" className="object-cover" />
                ) : null}
              </div>
              <CardContent className="pt-5">
                <div className="font-semibold">{item.title || "Untitled asset"}</div>
                <div className="mt-1 text-xs text-[var(--muted-foreground)]">{item.folder} · {item.mimeType}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
