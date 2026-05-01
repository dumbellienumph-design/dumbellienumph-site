import { useEffect, useRef } from "react";

/**
 * NeuralField — fixed canvas, but nodes live in document space.
 * The constellation is anchored to the page, not the viewport: scrolling
 * down reveals fresh nodes below while the ones above stay put.
 * Pulses stream from on-screen nodes toward a viewport-anchored "core"
 * (where the mascot docks).
 */
export const NeuralField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    let scrollY = window.scrollY;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    // Nodes per viewport-height of document. Generated lazily per chunk.
    const NODES_PER_CHUNK = isMobile ? 14 : 28;
    const LINK_DIST = isMobile ? 130 : 170;
    const CHUNK_H = () => h; // one chunk = one viewport tall

    type Node = { x: number; y: number; vx: number; vy: number; r: number; chunk: number };
    type Pulse = { x: number; y: number; tx: number; ty: number; t: number; speed: number };

    const nodes: Node[] = [];
    const generatedChunks = new Set<number>();

    const ensureChunk = (chunk: number) => {
      if (chunk < 0 || generatedChunks.has(chunk)) return;
      generatedChunks.add(chunk);
      const chunkH = CHUNK_H();
      const yBase = chunk * chunkH;
      for (let i = 0; i < NODES_PER_CHUNK; i++) {
        nodes.push({
          x: Math.random() * w,
          y: yBase + Math.random() * chunkH,
          // velocities stay in a fixed band — never damped, never deformed
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.4 + 0.6,
          chunk,
        });
      }
    };

    const ensureChunksAround = () => {
      // Generate the chunk we're in plus the next two below
      const current = Math.floor(scrollY / CHUNK_H());
      for (let c = Math.max(0, current - 1); c <= current + 2; c++) {
        ensureChunk(c);
      }
    };

    const pulses: Pulse[] = [];
    // core sits at the bottom-right of the viewport (mascot dock)
    const core = { x: w - 80, y: h - 80 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      core.x = w - 80;
      core.y = h - 80;
      ensureChunksAround();
    };
    resize();
    ensureChunksAround();

    const onScroll = () => {
      scrollY = window.scrollY;
      ensureChunksAround();
    };
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Periodically launch a pulse from a visible node toward the core
    const pulseTimer = setInterval(() => {
      if (pulses.length > 24) return;
      // pick from nodes currently in viewport
      const visible = nodes.filter((n) => {
        const sy = n.y - scrollY;
        return sy > -50 && sy < h + 50;
      });
      if (!visible.length) return;
      const n = visible[Math.floor(Math.random() * visible.length)];
      pulses.push({
        x: n.x,
        y: n.y, // document-space origin
        tx: core.x, // viewport-space target — converted on draw
        ty: core.y + scrollY, // store in document space too
        t: 0,
        speed: 0.004 + Math.random() * 0.004,
      });
    }, 380);

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const sy = scrollY;
      // viewport bounds in document space, with a small margin
      const top = sy - 80;
      const bottom = sy + h + 80;

      // update nodes (constant drift — no mouse attraction, no damping → no deformation)
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        // bounce horizontally inside viewport width
        if (n.x < 0 || n.x > w) n.vx *= -1;
        // bounce vertically inside the node's chunk so it stays "where it belongs"
        const chunkTop = n.chunk * CHUNK_H();
        const chunkBot = chunkTop + CHUNK_H();
        if (n.y < chunkTop || n.y > chunkBot) n.vy *= -1;
      }

      // Only consider nodes in or near the viewport for links + drawing
      const visible: Node[] = [];
      for (const n of nodes) {
        if (n.y >= top && n.y <= bottom) visible.push(n);
      }

      // links
      for (let i = 0; i < visible.length; i++) {
        const a = visible[i];
        for (let j = i + 1; j < visible.length; j++) {
          const b = visible[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.18;
            ctx.strokeStyle = `hsla(244, 90%, 70%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y - sy);
            ctx.lineTo(b.x, b.y - sy);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of visible) {
        ctx.fillStyle = "hsla(250, 95%, 78%, 0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y - sy, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // pulses streaming to core
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        // refresh pulse target each frame so it tracks the (viewport-anchored) core as user scrolls
        p.tx = core.x;
        p.ty = core.y + sy;

        // ease-in-out cubic
        const e = p.t < 0.5 ? 4 * p.t * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 3) / 2;
        const px = p.x + (p.tx - p.x) * e;
        const py = p.y + (p.ty - p.y) * e;
        const a = Math.sin(p.t * Math.PI) * 0.9;

        const sxp = px;
        const syp = py - sy;
        // trail
        const grd = ctx.createRadialGradient(sxp, syp, 0, sxp, syp, 14);
        grd.addColorStop(0, `hsla(250, 95%, 80%, ${a})`);
        grd.addColorStop(1, "hsla(250, 95%, 80%, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(sxp, syp, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(250, 100%, 92%, ${a})`;
        ctx.beginPath();
        ctx.arc(sxp, syp, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // core glow at viewport bottom-right (always visible)
      const coreGrd = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, 90);
      coreGrd.addColorStop(0, "hsla(244, 90%, 66%, 0.18)");
      coreGrd.addColorStop(1, "hsla(244, 90%, 66%, 0)");
      ctx.fillStyle = coreGrd;
      ctx.beginPath();
      ctx.arc(core.x, core.y, 90, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(pulseTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-70 mix-blend-screen"
    />
  );
};
