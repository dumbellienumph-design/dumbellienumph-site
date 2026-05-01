import { Bot, MessageSquare, Globe, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    icon: Bot,
    tag: "Custom Build",
    title: "AI Chatbots",
    desc: "Trained on your business data. Deployed on your website or WhatsApp. Captures leads and books calls around the clock.",
    num: "01",
  },
  {
    icon: MessageSquare,
    tag: "Flagship Product",
    title: "Text AI",
    desc: "One AI brain that replies across WhatsApp, TikTok, Instagram, Facebook, Google Business, and your website — simultaneously.",
    num: "02",
    featured: true,
  },
  {
    icon: Zap,
    tag: "Automation",
    title: "WhatsApp AI",
    desc: "Turn WhatsApp into a 24/7 sales agent. Never miss a lead. Never leave a message on read. Fully autonomous.",
    num: "03",
  },
  {
    icon: Globe,
    tag: "Engineering",
    title: "Web Engine",
    desc: "Fast, conversion-optimised websites built to embed AI natively from day one. Zero bloat. Maximum speed.",
    num: "04",
  },
];

export const Capabilities = () => {
  return (
    <section id="capabilities" className="relative py-32">
      <div className="container-tight">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">— What We Build</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-gradient md:text-6xl">
            Complete AI systems.<br />Not just chatbots.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <Reveal key={it.title} delay={i * 0.08}>
                <div
                  className={`card-glow group relative h-full overflow-hidden rounded-3xl border border-border bg-card/50 p-8 transition-all duration-500 hover:-translate-y-1 hover:bg-card ${
                    it.featured ? "md:row-span-1" : ""
                  }`}
                >
                  {it.featured && (
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
                  )}
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 text-primary transition-all group-hover:border-primary/50 group-hover:bg-primary/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        ◆ {it.tag}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground/60">{it.num}</span>
                  </div>

                  <h3 className="mt-8 font-display text-3xl font-semibold text-foreground md:text-4xl">
                    {it.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                    {it.desc}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-all duration-500 group-hover:opacity-100">
                    Learn more
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
