import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export const CTA = () => {
  return (
    <section id="contact" className="relative py-32">
      <div className="container-tight">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 p-12 text-center md:p-20">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-[100px] animate-pulse-glow" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
            <div className="grid-bg absolute inset-0 opacity-40" />

            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">— Let's Build</p>
              <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-gradient md:text-6xl">
                Ready to put your business on autopilot?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
                Free 30-minute audit. We'll map exactly where AI will pay for itself in your business — no pitch, no pressure.
              </p>
              <a
                href="/book"
                data-portal
                data-portal-href="/book"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:-translate-y-0.5"
              >
                Book Free Audit
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
