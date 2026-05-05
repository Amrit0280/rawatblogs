"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        subject: form.get("subject"),
        message: form.get("message")
      })
    });
    setLoading(false);
    if (response.ok) {
      toast.success("Message sent.");
      event.currentTarget.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error || "Could not send message.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email address" required />
      <Input name="subject" placeholder="Subject" required />
      <Textarea name="message" placeholder="Message" required rows={8} />
      <Button type="submit" variant="gold" disabled={loading}>
        <Send size={16} />
        Send inquiry
      </Button>
    </form>
  );
}
