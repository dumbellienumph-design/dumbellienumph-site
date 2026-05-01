import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Magnetic } from "./Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

export const Hero = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stagger = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.1 + i * 0.08, ease },
  });

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-40 pb-32 md:pt-48 md:pb-44">
      <motion.div style={{ y: y2 }} className="absolute inset-0 grid-bg" />

      {/* floating orbs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] animate-pulse-glow"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute right-[10%] top-[20%] h-40 w-40 rounded-full bg-primary/30 blur-3xl animate-float"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute left-[8%] bottom-[20%] h-32 w-32 rounded-full bg-[hsl(265_90%_60%/0.3)] blur-3xl animate-float"
      />

      {/* corner brackets */}
      <div className="pointer-events-none absolute inset-8 hidden md:block">
        <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-primary/40" />
        <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-primary/40" />
        <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-primary/40" />
        <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-primary/40" />
      </div>

      <div className="noise" />

      <motion.div style={{ opacity }} className="container-tight relative">
        <motion.div {...stagger(0)} className="mx-auto mb-8 inline-flex w-full justify-center">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            AI-Powered Automation
          </span>
        </motion.div>

        <h1 className="font-display text-center text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9]">
          <motion.span {...stagger(1)} className="block text-gradient">
            Your business.
          </motion.span>
          <motion.span {...stagger(2)} className="block text-gradient-primary">
            Running itself.
          </motion.span>
        </h1>

        <motion.p
          {...stagger(3)}
          className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          We build AI systems that reply to leads, book calls, and close customers —
          across every channel. Deployed in <span className="text-foreground">72 hours</span>. No staff needed.
        </motion.p>

        <motion.div
          {...stagger(4)}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Magnetic>
            <a
              href="#contact"
              data-portal
              data-portal-href="/book"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] transition-all hover:shadow-[var(--shadow-glow)]"
            >
              Book Free Audit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-secondary"
            >
              See Our Work
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          {...stagger(5)}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          {["60-Second Response", "No Lock-In", "Built To Convert"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              {t}
            </span>
          ))}
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-6 justify-center rounded-full border border-border pt-1.5"
          >
            <span className="h-1.5 w-px bg-primary" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
