import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1] as const;

const Book = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="container-tight relative z-10 pt-16"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
      </motion.div>

      <section className="container-tight relative z-10 py-20 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
          className="font-mono text-xs uppercase tracking-widest text-primary"
        >
          — Book a Free Audit
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease }}
          className="mt-4 font-display text-5xl font-bold leading-[0.95] text-gradient md:text-7xl"
        >
          Let's map your<br />AI system.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease }}
          className="mt-6 max-w-xl text-muted-foreground md:text-lg"
        >
          A 30-minute, no-pressure call. We'll identify the highest-leverage automations for your business and what it takes to deploy them.
        </motion.p>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { icon: Calendar, label: "Pick a slot", value: "30 min · Zoom", href: "mailto:hello@fieldai.co.za?subject=Book%20a%20call" },
            { icon: Mail, label: "Email us", value: "hello@fieldai.co.za", href: "mailto:hello@fieldai.co.za" },
            { icon: MessageSquare, label: "WhatsApp", value: "Chat instantly", href: "#" },
          ].map((card, i) => (
            <motion.a
              key={card.label}
              href={card.href}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.7, ease }}
              whileHover={{ y: -4 }}
              className="group relative block overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-primary/50"
            >
              <card.icon className="h-5 w-5 text-primary" />
              <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-1 font-display text-lg">{card.value}</p>
              <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.a>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease }}
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "mailto:hello@fieldai.co.za?subject=Free%20Audit%20Request";
          }}
          className="mt-16 grid gap-4 rounded-3xl border border-border bg-card/40 p-8 md:p-12"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              placeholder="Your name"
              className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <input
            placeholder="Business / website"
            className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
          <textarea
            rows={4}
            placeholder="What would you like to automate?"
            className="resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
          >
            Send request →
          </button>
        </motion.form>
      </section>
    </main>
  );
};

export default Book;
