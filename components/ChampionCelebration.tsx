"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Full-screen champion takeover shown when you land on the site: confetti,
// fireworks, a waving Spanish flag and Robert L. crowned world champion.
// Shows once per browser session (dismiss to enter the site). Self-contained —
// the confetti/fireworks run on a single <canvas>, no external libraries.
export default function ChampionCelebration() {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Decide on mount (client only) whether to show — once per session.
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("champ-seen-2026")) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem("champ-seen-2026", "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return; // show the card, skip the particle animation

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Spain-forward, festive palette (red / gold / white + a few accents).
    const COLORS = [
      "#c60b1e", "#ffc400", "#ffffff", "#ff5a6e", "#14a44d", "#2f6bff",
    ];
    const pick = () => COLORS[(Math.random() * COLORS.length) | 0];

    type Conf = {
      x: number; y: number; vx: number; vy: number;
      rot: number; vr: number; size: number; color: string; round: boolean;
    };
    const confetti: Conf[] = [];
    const spawnConfetti = (n: number) => {
      for (let i = 0; i < n; i++) {
        confetti.push({
          x: Math.random() * w,
          y: -20 - Math.random() * h * 0.5,
          vx: (Math.random() - 0.5) * 1.6,
          vy: 2 + Math.random() * 3,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.24,
          size: 6 + Math.random() * 8,
          color: pick(),
          round: Math.random() < 0.35,
        });
      }
    };
    spawnConfetti(240);

    type Spark = {
      x: number; y: number; vx: number; vy: number;
      life: number; max: number; color: string;
    };
    const sparks: Spark[] = [];
    const burst = (x: number, y: number) => {
      const color = pick();
      const count = 46 + ((Math.random() * 34) | 0);
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count;
        const sp = 2 + Math.random() * 4.2;
        sparks.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          max: 55 + Math.random() * 35,
          color,
        });
      }
    };

    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      if (frame % 40 === 0) spawnConfetti(40); // keep it raining
      if (frame % 42 === 0)
        burst(w * (0.12 + Math.random() * 0.76), h * (0.12 + Math.random() * 0.34));

      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.02;
        c.rot += c.vr;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        if (c.round) {
          ctx.beginPath();
          ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
        }
        ctx.restore();
        if (c.y > h + 40) confetti.splice(i, 1);
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.vx *= 0.99;
        p.vy *= 0.99;
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);
        ctx.fill();
        if (p.life >= p.max) sparks.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Let Escape dismiss.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="champ-overlay"
      role="dialog"
      aria-label="World champion celebration"
      onClick={dismiss}
    >
      <canvas ref={canvasRef} className="champ-canvas" aria-hidden="true" />
      <div className="champ-card" onClick={(e) => e.stopPropagation()}>
        <div className="champ-oles" aria-hidden="true">
          <span>¡Olé!</span>
          <span>💃</span>
          <span>🐂</span>
          <span>🎸</span>
          <span>¡Olé!</span>
        </div>
        {/* Inline Spain flag (rojigualda) — renders even offline, no network dep. */}
        <svg
          className="champ-flag"
          viewBox="0 0 3 2"
          width={240}
          height={160}
          role="img"
          aria-label="Flag of Spain"
        >
          <rect width="3" height="2" fill="#c60b1e" />
          <rect y="0.5" width="3" height="1" fill="#ffc400" />
        </svg>
        <p className="champ-kicker">🏆 Campeones del Mundo 🏆</p>
        <h1 className="champ-name">Robert L.</h1>
        <p className="champ-sub">World Champion 2026 · ¡Viva España! 🇪🇸</p>
        <button className="champ-close" onClick={dismiss}>
          ¡Vamos! Enter the pool →
        </button>
      </div>
    </div>
  );
}
