import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Free Audit",
    desc: "We analyse your business and channels to find the highest-ROI opportunities. No fluff.",
  },
  {
    n: "02",
    title: "We Build It",
    desc: "Custom trained on your data, integrated into your channels, and tested before launch.",
  },
  {
    n: "03",
    title: "Go Live",
    desc: "Your AI starts replying, qualifying, and booking — within 72 hours of approval.",
  },
];

export const Process = () => {
  return (
    <section id="process" className="relative border-t border-border/60 py-32">
      <div className="container-tight">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">— Zero To Automated</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-gradient md:text-6xl">
            72 hours. No coding.<br />We handle everything.
          </h2>
        </Reveal>

        <div className="relative mt-20 grid gap-12 md:grid-cols-3">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-background font-mono text-sm font-semibold text-primary shadow-[var(--shadow-glow)]">
                  {s.n}
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
