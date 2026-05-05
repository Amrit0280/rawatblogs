import type { Metadata } from "next";
import { Award, Compass, Lightbulb, Target } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteSetting } from "@/lib/data";

export const dynamic = "force-dynamic";

const expertiseCards = [
  { icon: Compass, title: "Vision", body: "Build an owned knowledge platform with durable search equity." },
  { icon: Target, title: "Expertise", body: "Strategy, authority building, growth systems, and practical execution." },
  { icon: Lightbulb, title: "Voice", body: "Clear, useful, grounded ideas for ambitious readers." },
  { icon: Award, title: "Credibility", body: "Professional-grade publishing without WordPress dependence." }
];

export const metadata: Metadata = {
  title: "About",
  description: "Learn about KK Rawat's vision, expertise, achievements, and professional story."
};

export default async function AboutPage() {
  const about = await getSiteSetting("about", {
    headline: "A clear voice for strategy, growth, and professional credibility.",
    body: "KK Rawat publishes thoughtful, practical writing for readers who value clarity, execution, and long-term brand trust.",
    achievements: ["Editorial clarity", "SEO-first publishing", "Independent ownership"]
  });

  return (
    <>
      <SiteHeader />
      <main>
        <section className="container-shell grid gap-12 py-16 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Badge>About</Badge>
            <h1 className="editorial mt-4 text-5xl leading-tight md:text-7xl">KK Rawat</h1>
          </div>
          <div>
            <h2 className="editorial text-4xl leading-tight">{about.headline}</h2>
            <p className="mt-6 text-lg leading-8 text-[var(--muted-foreground)]">{about.body}</p>
          </div>
        </section>
        <section className="border-y border-[var(--border)] bg-[var(--card)] py-14">
          <div className="container-shell grid gap-5 md:grid-cols-4">
            {expertiseCards.map(({ icon: Icon, title, body }) => (
              <Card key={title}>
                <CardContent className="pt-5">
                  <Icon className="text-[var(--accent)]" size={24} />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="container-shell py-16">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <h2 className="editorial text-4xl">Achievements</h2>
            <div className="grid gap-3">
              {about.achievements.map((item: string) => (
                <div key={item} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
