"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        name: form.get("name")
      })
    });
    setLoading(false);
    if (response.ok) {
      toast.success("You are subscribed.");
      event.currentTarget.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error || "Could not subscribe.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <Input name="name" placeholder="Name" aria-label="Name" />
      <Input name="email" type="email" placeholder="Email address" aria-label="Email address" required />
      <Button type="submit" variant="gold" disabled={loading}>
        <Send size={16} />
        Subscribe
      </Button>
    </form>
  );
}
