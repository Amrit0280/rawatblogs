import type { Metadata } from "next";
import { Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getSiteSetting } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact KK Rawat for inquiries, collaborations, and professional conversations."
};

export default async function ContactPage() {
  const contact = await getSiteSetting("contact", {
    email: "hello@kkrawat.com",
    location: "India",
    linkedin: "https://linkedin.com",
    x: "https://x.com"
  });

  return (
    <>
      <SiteHeader />
      <main className="container-shell grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Badge>Contact</Badge>
          <h1 className="editorial mt-4 text-5xl leading-tight md:text-7xl">Start a conversation</h1>
          <p className="mt-5 max-w-lg text-[var(--muted-foreground)]">
            Use the secure inquiry form for collaborations, speaking requests, partnerships, and reader notes.
          </p>
          <div className="mt-8 grid gap-3">
            <a className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4" href={`mailto:${contact.email}`}>
              <Mail className="text-[var(--accent)]" size={18} /> {contact.email}
            </a>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
              <MapPin className="text-[var(--accent)]" size={18} /> {contact.location}
            </div>
            <a className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4" href={contact.linkedin}>
              <Linkedin className="text-[var(--accent)]" size={18} /> LinkedIn
            </a>
            <a className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4" href={contact.x}>
              <Twitter className="text-[var(--accent)]" size={18} /> X
            </a>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
