import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * "Field" — a friendly AI mascot that follows the cursor.
 * - Body floats in the bottom-right corner
 * - Eyes track the mouse with a soft spring
 * - Blinks at random intervals
 * - Hides on mobile, respects reduced motion
 */
export const Mascot = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed body drift (tiny — just a hint of life)
  const bodyX = useSpring(useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1920], [-12, 12]), {
    stiffness: 60,
    damping: 18,
  });
  const bodyY = useSpring(useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 1080], [-8, 8]), {
    stiffness: 60,
    damping: 18,
  });

  // Eye pupils — track cursor position relative to mascot
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const pupilX = useSpring(0, { stiffness: 150, damping: 15 });
  const pupilY = useSpring(0, { stiffness: 150, damping: 15 });

  const [blink, setBlink] = useState(false);
  const [waving, setWaving] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 640px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisible(true);

    const updateOrigin = () => {
      // mascot sits ~bottom-right with offsets matching the wrapper
      setOrigin({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    };
    updateOrigin();

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const dx = e.clientX - origin.x;
      const dy = e.clientY - origin.y;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(6, Math.hypot(dx, dy) / 60);
      pupilX.set(Math.cos(angle) * dist);
      pupilY.set(Math.sin(angle) * dist);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", updateOrigin);

    const blinkTimer = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3800);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", updateOrigin);
      clearInterval(blinkTimer);
    };
  }, [mouseX, mouseY, pupilX, pupilY, origin.x, origin.y]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed bottom-8 right-8 z-40 select-none"
      style={{ x: bodyX, y: bodyY }}
    >
      <motion.button
        type="button"
        onClick={() => {
          setWaving(true);
          setTimeout(() => setWaving(false), 1200);
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-auto group relative block"
        aria-label="FieldAI mascot"
      >
        {/* glow */}
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/40 blur-2xl animate-pulse-glow" />

        <svg width="80" height="92" viewBox="0 0 80 92" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* antenna */}
          <motion.g
            animate={{ rotate: waving ? [0, -15, 15, -10, 0] : 0 }}
            style={{ transformOrigin: "40px 14px" }}
            transition={{ duration: 0.8 }}
          >
            <line x1="40" y1="14" x2="40" y2="4" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="3" r="3" fill="hsl(var(--primary))">
              <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </motion.g>

          {/* head/body */}
          <defs>
            <linearGradient id="botBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(240 16% 14%)" />
              <stop offset="100%" stopColor="hsl(240 18% 8%)" />
            </linearGradient>
            <linearGradient id="botFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(244 90% 18%)" />
              <stop offset="100%" stopColor="hsl(244 90% 8%)" />
            </linearGradient>
          </defs>

          <rect x="8" y="14" width="64" height="60" rx="22" fill="url(#botBody)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" />

          {/* face screen */}
          <rect x="16" y="26" width="48" height="34" rx="14" fill="url(#botFace)" />

          {/* eyes */}
          <g>
            <motion.g style={{ x: pupilX, y: pupilY }}>
              <motion.ellipse
                cx="30"
                cy="43"
                rx="4"
                ry={blink ? 0.4 : 4}
                fill="hsl(var(--primary-glow))"
                transition={{ duration: 0.08 }}
              />
              <motion.ellipse
                cx="50"
                cy="43"
                rx="4"
                ry={blink ? 0.4 : 4}
                fill="hsl(var(--primary-glow))"
                transition={{ duration: 0.08 }}
              />
            </motion.g>
          </g>

          {/* mouth — smile */}
          <path d="M30 53 Q40 60 50 53" stroke="hsl(var(--primary) / 0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* base */}
          <rect x="20" y="74" width="40" height="6" rx="3" fill="hsl(240 16% 12%)" stroke="hsl(var(--border))" />
          <ellipse cx="40" cy="86" rx="22" ry="3" fill="hsl(var(--primary) / 0.2)" />

          {/* arms — wave on click */}
          <motion.g
            style={{ transformOrigin: "10px 44px" }}
            animate={{ rotate: waving ? [0, -40, -10, -40, 0] : 0 }}
            transition={{ duration: 1.1 }}
          >
            <line x1="10" y1="44" x2="2" y2="38" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
            <circle cx="2" cy="38" r="2.5" fill="hsl(var(--primary))" />
          </motion.g>
          <line x1="70" y1="44" x2="78" y2="50" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
          <circle cx="78" cy="50" r="2.5" fill="hsl(var(--primary))" />
        </svg>

        {/* tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {waving ? "hi there!" : "click me"}
        </div>
      </motion.button>
    </motion.div>
  );
};
