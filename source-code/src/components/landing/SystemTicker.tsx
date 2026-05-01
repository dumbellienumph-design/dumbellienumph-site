import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const events = [
  "lead.captured → instagram_dm",
  "intent.classified → high_value",
  "reply.generated → 0.42s",
  "calendar.slot_booked → tue 14:30",
  "follow_up.queued → 24h",
  "channel.sync → whatsapp ✓",
  "sentiment → positive",
  "deal.routed → sales_owner",
  "model.inference → ok",
  "pipeline.flush → core ↻",
];

export const SystemTicker = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % events.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden md:block">
      <div className="glass flex items-center gap-3 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        <span className="text-foreground/60">system</span>
        <div className="relative h-3 w-[210px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 whitespace-nowrap text-primary-glow/80"
            >
              {events[i]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
