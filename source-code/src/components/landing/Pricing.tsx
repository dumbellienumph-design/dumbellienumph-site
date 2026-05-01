import { Check } from "lucide-react";
import { Reveal } from "./Reveal";

const tiers = [
  {
    name: "Starter",
    price: "R 4,990",
    period: "/mo",
    desc: "For solo operators ready to stop missing leads.",
    features: ["1 AI channel (Web or WhatsApp)", "Custom training on your data", "Lead capture + booking", "Email support"],
    cta: "Start Free Audit",
  },
  {
    name: "Growth",
    price: "R 12,490",
    period: "/mo",
    desc: "For teams scaling across multiple channels.",
    features: ["Up to 4 channels unified", "CRM + calendar integrations", "Advanced lead routing", "Priority support", "Monthly optimisation"],
    cta: "Book a Call",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Bespoke systems with dedicated engineering.",
    features: ["Unlimited channels", "Custom workflows & APIs", "Dedicated AI engineer", "SLA + 24/7 support", "Quarterly strategy reviews"],
    cta: "Contact Sales",
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative border-t border-border/60 py-32">
      <div className="container-tight">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">— Pricing</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-gradient md:text-6xl">
            Simple plans.<br />No lock-in.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div
                className={`relative h-full rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-1 ${
                  t.featured
                    ? "border-primary/60 bg-gradient-to-b from-primary/10 to-card shadow-[var(--shadow-elegant)]"
                    : "border-border bg-card/50 hover:border-primary/30"
                }`}
              >
                {t.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-gradient">{t.price}</span>
                  <span className="text-sm text-muted-foreground">{t.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/book"
                  data-portal
                  data-portal-href="/book"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all ${
                    t.featured
                      ? "bg-primary text-primary-foreground hover:shadow-[var(--shadow-glow)]"
                      : "border border-border bg-secondary/40 hover:border-primary/40 hover:bg-secondary"
                  }`}
                >
                  {t.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
