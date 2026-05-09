import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

/**
 * MascotPortal — a global mascot that actively follows the cursor and,
 * when any element with [data-portal] is clicked, performs a sequence:
 *   1. flies to the clicked element
 *   2. "infuses" into it with a glowing burst
 *   3. expands a circular reveal from the button covering the screen
 *   4. navigates to the target route (data-portal-href)
 */
export const MascotPortal = () => {
  const navigate = useNavigate();

  // Cursor tracking
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 90, damping: 16, mass: 0.6 });
  const y = useSpring(targetY, { stiffness: 90, damping: 16, mass: 0.6 });

  // Eye pupils
  const pupilX = useSpring(0, { stiffness: 200, damping: 18 });
  const pupilY = useSpring(0, { stiffness: 200, damping: 18 });

  const [visible, setVisible] = useState(false);
  const [blink, setBlink] = useState(false);
  const [phase, setPhase] = useState<"idle" | "fly" | "infuse" | "reveal">("idle");
  const [parked, setParked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const parkedRef = useRef(false);
  const hoveringRef = useRef(false);
  const phaseRef = useRef(phase);
  useEffect(() => {
    parkedRef.current = parked;
  }, [parked]);
  useEffect(() => {
    hoveringRef.current = hovering;
  }, [hovering]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  const [target, setTarget] = useState<{ x: number; y: number; href: string } | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const lastMouse = useRef({ x: 0, y: 0 });
  const idleOffset = useRef({ x: 80, y: 80 });
  const posRef = useRef({ x: 0, y: 0 });

  // Position + interaction setup
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisible(true);

    // Initial position bottom-right
    const ix = window.innerWidth - idleOffset.current.x;
    const iy = window.innerHeight - idleOffset.current.y;
    targetX.set(ix);
    targetY.set(iy);
    posRef.current = { x: ix, y: iy };
    lastMouse.current = { x: ix, y: iy };

    const onMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onResize = () => {
      if (phase !== "idle") return;
      if (parkedRef.current) {
        targetX.set(window.innerWidth - idleOffset.current.x);
        targetY.set(window.innerHeight - idleOffset.current.y);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    const blinkTimer = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 130);
    }, 3800);

    // Smart pursuit loop — adjusts target position with distance-aware speed
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (phaseRef.current !== "idle" || parkedRef.current || hoveringRef.current) {
        return;
      }
      const mx = lastMouse.current.x;
      const my = lastMouse.current.y;
      // Desired resting position is offset from cursor (down-right)
      const desiredX = Math.min(window.innerWidth - 50, mx + 60);
      const desiredY = Math.min(window.innerHeight - 50, my + 60);

      const px = posRef.current.x;
      const py = posRef.current.y;
      const dx = desiredX - px;
      const dy = desiredY - py;
      const dist = Math.hypot(dx, dy);

      // Distance from mascot to cursor itself (for slowdown logic)
      const cdx = mx - px;
      const cdy = my - py;
      const cursorDist = Math.hypot(cdx, cdy);

      // Speed factor: slow when cursor is near, fast when far
      // 0 at <80px, ramps up to 1 around 600px
      const NEAR = 100;
      const FAR = 600;
      const t = Math.max(0, Math.min(1, (cursorDist - NEAR) / (FAR - NEAR)));
      // ease-in-out for smoother feel
      const eased = t * t * (3 - 2 * t);
      const speed = 0.02 + eased * 0.18; // 0.02 (creep) → 0.20 (chase)

      const nx = px + dx * speed;
      const ny = py + dy * speed;
      posRef.current = { x: nx, y: ny };
      targetX.set(nx);
      targetY.set(ny);

      // Pupil tracking
      const angle = Math.atan2(my - ny, mx - nx);
      const pdist = Math.min(5, cursorDist / 80);
      pupilX.set(Math.cos(angle) * pdist);
      pupilY.set(Math.sin(angle) * pdist);

      // Suppress jitter
      if (dist < 0.5) {
        posRef.current = { x: desiredX, y: desiredY };
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      clearInterval(blinkTimer);
      cancelAnimationFrame(raf);
    };
  }, [targetX, targetY, pupilX, pupilY]);

  // When parked toggles on, snap toward the core (bottom-right)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (parked) {
      const cx = window.innerWidth - idleOffset.current.x;
      const cy = window.innerHeight - idleOffset.current.y;
      targetX.set(cx);
      targetY.set(cy);
      posRef.current = { x: cx, y: cy };
      pupilX.set(0);
      pupilY.set(0);
    }
  }, [parked, targetX, targetY, pupilX, pupilY]);

  // Global click handler for [data-portal] elements
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onClick = (e: MouseEvent) => {
      if (phase !== "idle") return;
      const el = (e.target as HTMLElement)?.closest("[data-portal]") as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const href = el.getAttribute("data-portal-href") || el.getAttribute("href") || "/";
      setTarget({ x: cx, y: cy, href });
      setOrigin({ x: cx, y: cy });

      // Phase 1: fly to the button
      setPhase("fly");
      targetX.set(cx);
      targetY.set(cy);

      // Phase 2: infuse
      window.setTimeout(() => setPhase("infuse"), 700);

      // Phase 3: reveal expansion
      window.setTimeout(() => setPhase("reveal"), 1200);

      // Phase 4: navigate after reveal mostly covers screen
      window.setTimeout(() => {
        if (href.startsWith("#")) {
          const targetEl = document.querySelector(href);
          targetEl?.scrollIntoView({ behavior: "smooth" });
        } else if (href.startsWith("mailto:") || href.startsWith("http")) {
          window.location.href = href;
        } else {
          navigate(href);
        }
      }, 1700);

      // Phase 5: reset
      window.setTimeout(() => {
        setPhase("idle");
        setTarget(null);
        setOrigin(null);
        // snap mascot back near current cursor
        targetX.set(Math.min(window.innerWidth - 50, lastMouse.current.x + 60));
        targetY.set(Math.min(window.innerHeight - 50, lastMouse.current.y + 60));
      }, 2400);
    };

    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [phase, navigate, targetX, targetY]);

  const scale = useTransform(
    [x, y] as never,
    () => (phase === "infuse" ? 0.2 : phase === "fly" ? 0.7 : 1)
  );

  if (!visible) return null;

  return (
    <>
      {/* Mascot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[55] -translate-x-1/2 -translate-y-1/2 select-none"
        style={{ x, y, scale }}
        animate={{ opacity: phase === "infuse" || phase === "reveal" ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setParked((p) => !p);
            setHovering(false);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setChatOpen(true);
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          aria-label={parked ? "Wake mascot" : "Park mascot"}
          animate={phase === "idle" && !hovering ? { y: [0, -6, 0] } : { y: 0 }}
          transition={{ duration: 3.5, repeat: phase === "idle" && !hovering ? Infinity : 0, ease: "easeInOut" }}
          className="group pointer-events-auto relative cursor-pointer bg-transparent p-0"
        >
          <div className={`absolute inset-0 -z-10 rounded-full blur-2xl transition-all duration-500 ${hovering ? "bg-primary/70 scale-125" : "bg-primary/40 animate-pulse-glow"}`} />
          <svg width="68" height="78" viewBox="0 0 80 92" fill="none">
            <defs>
              <linearGradient id="mp-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(240 16% 14%)" />
                <stop offset="100%" stopColor="hsl(240 18% 8%)" />
              </linearGradient>
              <linearGradient id="mp-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(244 90% 18%)" />
                <stop offset="100%" stopColor="hsl(244 90% 8%)" />
              </linearGradient>
            </defs>
            <line x1="40" y1="14" x2="40" y2="4" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
            <circle cx="40" cy="3" r="3" fill="hsl(var(--primary))">
              <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <rect x="8" y="14" width="64" height="60" rx="22" fill="url(#mp-body)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" />
            <rect x="16" y="26" width="48" height="34" rx="14" fill="url(#mp-face)" />
            <motion.g style={{ x: pupilX, y: pupilY }}>
              <motion.ellipse cx="30" cy="43" rx="4" ry={blink ? 0.4 : 4} fill="hsl(var(--primary-glow))" transition={{ duration: 0.08 }} />
              <motion.ellipse cx="50" cy="43" rx="4" ry={blink ? 0.4 : 4} fill="hsl(var(--primary-glow))" transition={{ duration: 0.08 }} />
            </motion.g>
            <path d="M30 53 Q40 60 50 53" stroke="hsl(var(--primary) / 0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <rect x="20" y="74" width="40" height="6" rx="3" fill="hsl(240 16% 12%)" stroke="hsl(var(--border))" />
            <ellipse cx="40" cy="86" rx="22" ry="3" fill="hsl(var(--primary) / 0.2)" />
            <line x1="10" y1="44" x2="2" y2="38" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
            <circle cx="2" cy="38" r="2.5" fill="hsl(var(--primary))" />
            <line x1="70" y1="44" x2="78" y2="50" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
            <circle cx="78" cy="50" r="2.5" fill="hsl(var(--primary))" />
          </svg>
          <AnimatePresence>
            {hovering && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl glass px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-foreground text-center"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span>Tap to chat</span>
                  </div>
                  <div className="text-[8px] opacity-70">Double click to ask AI</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Bot Overlay */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-4 right-4 z-[60] h-[680px] w-[420px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            <button
              onClick={() => setChatOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-foreground/10 p-2 text-foreground/50 transition-colors hover:bg-foreground/20 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <iframe
              src="https://dumbellienumph-design.github.io/fieldai-bot/?embed=true"
              className="h-full w-full border-none"
              allow="microphone"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Infuse burst at the button */}
      <AnimatePresence>
        {phase === "infuse" && origin && (
          <motion.div
            key="burst"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 0.8], scale: [0.2, 1.4, 1.8] }}
            exit={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ left: origin.x, top: origin.y }}
            className="pointer-events-none fixed z-[58] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="h-32 w-32 rounded-full bg-primary/60 blur-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular reveal expanding from the button */}
      <AnimatePresence>
        {phase === "reveal" && origin && (
          <motion.div
            key="reveal"
            initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            animate={{
              clipPath: `circle(${Math.hypot(window.innerWidth, window.innerHeight) * 1.1}px at ${origin.x}px ${origin.y}px)`,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="pointer-events-none fixed inset-0 z-[57] bg-gradient-to-br from-primary via-primary to-[hsl(265_90%_55%)]"
          >
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="flex h-full w-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="font-mono text-xs uppercase tracking-[0.4em] text-primary-foreground/80"
              >
                ↳ opening
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
