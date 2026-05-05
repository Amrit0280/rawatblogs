"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function CommentForm({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        name: form.get("name"),
        email: form.get("email"),
        website: form.get("website"),
        body: form.get("body")
      })
    });
    setLoading(false);
    if (response.ok) {
      toast.success("Comment submitted for approval.");
      event.currentTarget.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error || "Could not submit comment.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="name" placeholder="Name" required />
        <Input name="email" type="email" placeholder="Email address" required />
      </div>
      <Input name="website" type="url" placeholder="Website" />
      <Textarea name="body" placeholder="Comment" required rows={5} />
      <Button type="submit" disabled={loading}>
        <MessageCircle size={16} />
        Submit for moderation
      </Button>
    </form>
  );
}
