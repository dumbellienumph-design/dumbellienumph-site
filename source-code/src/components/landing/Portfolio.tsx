import { Car, Gamepad2, BrainCircuit } from "lucide-react";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

const works = [
  {
    title: "WW2 Battlefield Game",
    desc: "A fully functional top-down tactical shooter built with high-performance JavaScript. Features procedural terrain and complex AI behaviors.",
    href: "/ww2-game/index.html",
    tag: "Game Dev",
    icon: Gamepad2,
  },
  {
    title: "Umbilo Car Wash",
    desc: "A premium service-based business landing page with automated booking flows and high-conversion design architecture.",
    href: "/umbilo-carwash/index.html",
    tag: "Web App",
    icon: Car,
  },
  {
    title: "Text AI Dashboard",
    desc: "An intelligent management engine for cross-platform communications, centralized into a single unified control panel.",
    href: "/text-ai/dashboard.html",
    tag: "AI Engine",
    icon: BrainCircuit,
  },
];

export const Portfolio = () => {
  return (
    <section id="work" className="relative py-32 bg-secondary/20">
      <div className="container-tight">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">— Our Work</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-gradient md:text-6xl">
            Proven execution.<br />Real results.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {works.map((work, i) => {
            const Icon = work.icon;
            return (
              <Reveal key={work.title} delay={i * 0.1}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/50 p-8 transition-all duration-500 hover:border-primary/50 hover:bg-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {work.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold text-foreground">
                    {work.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {work.desc}
                  </p>

                  <div className="mt-auto pt-8">
                    <Magnetic>
                      <a
                        href={work.href}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3"
                      >
                        View Project
                        <span>→</span>
                      </a>
                    </Magnetic>
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
