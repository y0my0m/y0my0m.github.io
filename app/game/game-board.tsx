"use client";

import { useEffect, useRef, useState } from "react";

const W = 960, H = 540;
type Point = { x: number; y: number };
type Block = { x: number; y: number; w: number; h: number; kind: "ice" | "rock" | "bridge" };
type Level = { name: string; start: Point; ball: Point; goal: Point; blocks: Block[]; trees: Point[] };

const names = ["Snowfall Start", "Quiet Crossing", "The Long Drift", "Bridge Trouble", "Blue Corridor", "Cold Hands", "Pine Needle", "Icebox", "Whiteout", "Narrow Escape", "Frozen Steps", "The Last Ridge", "Flag Country", "One More Push", "Undertales"];
const levels: Level[] = names.map((name, index) => {
  const n = index + 1, reverse = n % 2 === 0;
  const blocks: Block[] = [
    { x: 230 + (n * 37) % 270, y: 115 + (n * 23) % 260, w: 90 + (n % 3) * 32, h: 24, kind: "ice" },
    { x: 485 - (n * 19) % 160, y: 350 - (n * 13) % 110, w: 72 + (n % 4) * 20, h: 26, kind: "rock" },
  ];
  if (n > 3) blocks.push({ x: reverse ? 610 : 300, y: reverse ? 175 : 300, w: 110, h: 22, kind: "bridge" });
  if (n > 7) blocks.push({ x: 130 + (n * 31) % 650, y: 250 + (n * 17) % 120, w: 58, h: 58, kind: "rock" });
  return { name, start: { x: reverse ? 760 : 150, y: reverse ? 410 : 380 }, ball: { x: reverse ? 680 : 260, y: reverse ? 365 : 330 }, goal: { x: reverse ? 170 : 800, y: reverse ? 115 : 145 }, blocks, trees: [{ x: 105, y: 100 }, { x: 830, y: 95 }, { x: 120, y: 430 }, { x: 850, y: 430 }] };
});

function tree(ctx: CanvasRenderingContext2D, p: Point) {
  ctx.fillStyle = "#553a34"; ctx.fillRect(p.x - 5, p.y + 27, 10, 34);
  for (const [y, width] of [[0, 38], [19, 49], [40, 60]]) { ctx.fillStyle = "#24444b"; ctx.beginPath(); ctx.moveTo(p.x, p.y + y); ctx.lineTo(p.x - width / 2, p.y + y + 43); ctx.lineTo(p.x + width / 2, p.y + y + 43); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#162d38"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#d7e7f8"; ctx.beginPath(); ctx.moveTo(p.x, p.y + y - 3); ctx.lineTo(p.x - width / 3, p.y + y + 17); ctx.lineTo(p.x + width / 3, p.y + y + 17); ctx.closePath(); ctx.fill(); }
}

export default function GameBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null); const keys = useRef(new Set<string>()); const [level, setLevel] = useState(1); const [status, setStatus] = useState("Push the ball to the flag");
  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext("2d"); if (!canvas || !ctx) return;
    const current = levels[level - 1]; const player = { ...current.start }; const ball = { ...current.ball, vx: 0, vy: 0 }; let won = false, raf = 0, last = performance.now();
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const reset = () => { Object.assign(player, current.start); Object.assign(ball, current.ball, { vx: 0, vy: 0 }); won = false; setStatus("Push the ball to the flag"); };
    const blocked = (x: number, y: number) => current.blocks.some((b) => x > b.x - 16 && x < b.x + b.w + 16 && y > b.y - 16 && y < b.y + b.h + 16);
    const down = (e: KeyboardEvent) => { keys.current.add(e.key.toLowerCase()); if (e.key.toLowerCase() === "r") reset(); if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) e.preventDefault(); }; const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase()); const nudge = (key: string) => { keys.current.add(key); window.setTimeout(() => keys.current.delete(key), 150); };
    const draw = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2); last = now; const k = keys.current;
      if (!won) { const dx = (k.has("arrowright") || k.has("d") ? 1 : 0) - (k.has("arrowleft") || k.has("a") ? 1 : 0), dy = (k.has("arrowdown") || k.has("s") ? 1 : 0) - (k.has("arrowup") || k.has("w") ? 1 : 0), len = Math.hypot(dx, dy) || 1; const px = player.x + dx / len * 3.2 * dt, py = player.y + dy / len * 3.2 * dt; if (!blocked(px, player.y)) player.x = Math.max(42, Math.min(W - 42, px)); if (!blocked(player.x, py)) player.y = Math.max(42, Math.min(H - 42, py)); if (Math.hypot(player.x - ball.x, player.y - ball.y) < 48 && (dx || dy)) { ball.vx += dx * .13 * dt; ball.vy += dy * .13 * dt; } ball.x += ball.vx * dt; ball.y += ball.vy * dt; ball.vx *= Math.pow(.94, dt); ball.vy *= Math.pow(.94, dt); ball.x = Math.max(34, Math.min(W - 34, ball.x)); ball.y = Math.max(34, Math.min(H - 34, ball.y)); for (const b of current.blocks) if (ball.x > b.x - 18 && ball.x < b.x + b.w + 18 && ball.y > b.y - 18 && ball.y < b.y + b.h + 18) { ball.vx *= -.8; ball.vy *= -.8; ball.x -= ball.vx * 2; ball.y -= ball.vy * 2; } if (Math.hypot(ball.x - current.goal.x, ball.y - current.goal.y) < 38) { won = true; setStatus(level === 15 ? "All 15 levels cleared" : "Flag reached — next course ready"); } }
      ctx.fillStyle = "#090c16"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#91add8"; ctx.fillRect(24, 24, W - 48, H - 48); ctx.fillStyle = "#879dca"; ctx.fillRect(40, 40, W - 80, H - 80); ctx.strokeStyle = "#3d526f"; ctx.lineWidth = 4; ctx.strokeRect(40, 40, W - 80, H - 80); ctx.fillStyle = "rgba(232,244,255,.18)"; for (let x = 60; x < W - 40; x += 54) for (let y = 70; y < H - 40; y += 47) { ctx.fillRect(x + ((y / 47) % 2) * 9, y, 3, 2); ctx.fillRect(x + 16, y + 9, 2, 2); } ctx.fillStyle = "#7185aa"; ctx.fillRect(45, 455, W - 90, 46); ctx.fillStyle = "#526786"; for (let x = 45; x < W - 45; x += 22) ctx.fillRect(x, 455 + (x % 3) * 7, 13, 4); current.trees.forEach((p) => tree(ctx, p));
      current.blocks.forEach((b) => { ctx.fillStyle = b.kind === "rock" ? "#44526d" : b.kind === "bridge" ? "#a87231" : "#7187b1"; ctx.fillRect(b.x, b.y, b.w, b.h); ctx.strokeStyle = b.kind === "bridge" ? "#593d25" : "#344763"; ctx.lineWidth = 3; ctx.strokeRect(b.x, b.y, b.w, b.h); if (b.kind === "bridge") { ctx.strokeStyle = "#d59a4d"; for (let x = b.x + 14; x < b.x + b.w; x += 22) ctx.strokeRect(x, b.y + 4, 12, b.h - 8); } });
      ctx.fillStyle = "#16121b"; ctx.beginPath(); ctx.ellipse(current.goal.x, current.goal.y + 27, 34, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#f05b52"; ctx.fillRect(current.goal.x - 3, current.goal.y - 30, 5, 57); ctx.beginPath(); ctx.moveTo(current.goal.x, current.goal.y - 30); ctx.lineTo(current.goal.x - 34, current.goal.y - 17); ctx.lineTo(current.goal.x, current.goal.y - 5); ctx.fill(); ctx.fillStyle = "#fffdf3"; ctx.beginPath(); ctx.arc(ball.x, ball.y, 18, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#1a1722"; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = "#63392d"; ctx.fillRect(player.x - 13, player.y - 22, 26, 22); ctx.fillStyle = "#ffd34e"; ctx.fillRect(player.x - 10, player.y - 4, 20, 17); ctx.fillStyle = "#d34bb5"; ctx.fillRect(player.x - 11, player.y + 2, 22, 5); ctx.fillStyle = "#332747"; ctx.fillRect(player.x - 10, player.y + 14, 8, 9); ctx.fillRect(player.x + 2, player.y + 14, 8, 9); raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); window.addEventListener("keydown", down); window.addEventListener("keyup", up); const resetButton = canvas.parentElement?.querySelector<HTMLButtonElement>("[data-game-reset]"); resetButton?.addEventListener("click", reset); const controls = canvas.parentElement?.querySelectorAll<HTMLButtonElement>("[data-game-control]"); controls?.forEach((button) => button.addEventListener("pointerdown", () => nudge(button.dataset.gameControl || ""))); raf = requestAnimationFrame(draw); return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); resetButton?.removeEventListener("click", reset); controls?.forEach((button) => button.replaceWith(button.cloneNode(true))); };
  }, [level]);
  const advance = () => setLevel((current) => current >= 15 ? 1 : current + 1);
  return <div className="game-board" data-build="scale"><div className="game-hud"><span>SNOWBALL RUN / {String(level).padStart(2, "0")} — {levels[level - 1].name}</span><strong>{status}</strong><button data-game-reset type="button">RESET</button></div><canvas ref={canvasRef} width={W} height={H} tabIndex={0} aria-label="Snowball Run pixel game" /><div className="game-controls" aria-label="Touch controls"><button data-game-control="arrowup" type="button">▲</button><span><button data-game-control="arrowleft" type="button">◀</button><button data-game-control="arrowdown" type="button">▼</button><button data-game-control="arrowright" type="button">▶</button></span></div><div className="game-bottom"><p>{status === "All 15 levels cleared" ? "The whole mountain is yours." : "WASD / arrows to move · get close to push · R resets"}</p>{status.includes("Flag reached") || status === "All 15 levels cleared" ? <button type="button" onClick={advance}>{level === 15 ? "PLAY AGAIN" : "NEXT LEVEL"} <b>→</b></button> : null}</div></div>;
}
