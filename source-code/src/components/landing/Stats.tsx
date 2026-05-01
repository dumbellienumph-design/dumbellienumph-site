import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Leads Captured" },
  { value: 6, suffix: "", label: "Channels Automated" },
  { value: 3, suffix: "×", label: "Faster Than Human" },
  { value: 24, suffix: "/7", label: "Always-On Uptime" },
];

const Counter = ({ to, suffix }: { to: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [inView, to, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

export const Stats = () => {
  return (
    <section className="border-y border-border/60 bg-background/40 py-20">
      <div className="container-tight">
        <div className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">— The Numbers</p>
          <h2 className="mt-3 font-display text-3xl text-gradient md:text-4xl">Results that compound.</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl border border-border bg-card/40 p-6 text-center transition-all hover:border-primary/40 hover:bg-card/80"
            >
              <div className="font-display text-5xl font-bold text-gradient-primary md:text-6xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
