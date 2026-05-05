import { prisma } from "@/lib/prisma";
import { saveHomepageSectionAction, saveSiteSettingAction } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, sections] = await Promise.all([
    prisma.siteSetting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }),
    prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } })
  ]);

  return (
    <div className="grid gap-6">
      <div>
        <Badge>Controls</Badge>
        <h1 className="editorial mt-3 text-5xl">Site settings</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branding, about, contact, SEO controls</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <form action={saveSiteSettingAction} className="grid gap-3 rounded-lg border border-[var(--border)] p-4">
              <Input name="key" placeholder="setting-key" required />
              <Input name="label" placeholder="Label" required />
              <Input name="group" placeholder="Group" defaultValue="general" required />
              <Select name="kind" defaultValue="JSON">
                <option value="JSON">JSON</option>
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="BOOLEAN">Boolean</option>
              </Select>
              <Textarea name="value" placeholder='{"name":"KK Rawat"}' rows={6} required />
              <Button type="submit" variant="gold">Save setting</Button>
            </form>
            {settings.map((setting) => (
              <form key={setting.id} action={saveSiteSettingAction} className="grid gap-3 rounded-lg border border-[var(--border)] p-4">
                <input type="hidden" name="key" value={setting.key} />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{setting.label}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{setting.group} · {setting.key}</div>
                  </div>
                  <Badge>{setting.kind}</Badge>
                </div>
                <input type="hidden" name="label" value={setting.label} />
                <input type="hidden" name="group" value={setting.group} />
                <input type="hidden" name="kind" value={setting.kind} />
                <Textarea name="value" defaultValue={JSON.stringify(setting.value, null, 2)} rows={6} />
                <Button type="submit" variant="secondary">Update</Button>
              </form>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Homepage sections</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            {sections.map((section) => (
              <form key={section.id} action={saveHomepageSectionAction} className="grid gap-3 rounded-lg border border-[var(--border)] p-4">
                <div className="grid gap-2">
                  <Label>Key</Label>
                  <Input name="key" defaultValue={section.key} readOnly />
                </div>
                <Input name="title" defaultValue={section.title} />
                <Input name="subtitle" defaultValue={section.subtitle || ""} />
                <Input name="sortOrder" type="number" defaultValue={section.sortOrder} />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input name="enabled" type="checkbox" defaultChecked={section.enabled} />
                  Enabled
                </label>
                <Textarea name="content" defaultValue={JSON.stringify(section.content, null, 2)} rows={6} />
                <Button type="submit" variant="secondary">Update section</Button>
              </form>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
