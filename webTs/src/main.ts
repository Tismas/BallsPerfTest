import { Board } from "./Board";
import { clear } from "./utils/canvas";

const TPS = 60;
const board = new Board();
let lastUpdate = Date.now();
let lastRender = Date.now();
const lastRenderFrameTime: number[] = [];
const lastUpdateFrameTime: number[] = [];

const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const now = Date.now();
  const delta = (now - lastUpdate) / 1000;
  lastRender = now;

  clear(ctx);

  board.draw(ctx);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, 200, 100);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Balls: ${board.balls.length}`, 10, 50);

  requestAnimationFrame(() => draw(canvas, ctx));

  lastRenderFrameTime.push(delta);
};

const update = () => {
  const now = Date.now();
  const delta = (now - lastUpdate) / 1000;
  lastUpdate = now;

  board.update(delta);

  lastUpdateFrameTime.push(delta);
};

const resize = (canvas: HTMLCanvasElement) => {
  const { innerWidth, innerHeight } = window;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};

const setup = () => {
  const canvas = document.getElementById("game") as HTMLCanvasElement | null;
  if (!canvas) throw new Error("Canvas not found");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not found");

  resize(canvas);

  board.setup(canvas);

  setInterval(update, 1000 / TPS);
  requestAnimationFrame(() => draw(canvas, ctx));

  setInterval(() => {
    const avgUpdateTime =
      lastUpdateFrameTime.reduce((a, b) => a + b) / lastUpdateFrameTime.length;
    const avgRenderTime =
      lastRenderFrameTime.reduce((a, b) => a + b) / lastRenderFrameTime.length;
    if (avgUpdateTime < 1 / TPS && avgRenderTime < 1 / TPS) {
      board.addBalls(canvas, 100);
    } else {
      console.warn("FPS: ", 1 / avgRenderTime, "TPS: ", 1 / avgUpdateTime);
    }

    if (lastUpdateFrameTime.length > 10) {
      lastUpdateFrameTime.shift();
    }
    if (lastRenderFrameTime.length > 10) {
      lastRenderFrameTime.shift();
    }
  }, 1000 / 30);

  window.addEventListener("resize", () => resize(canvas));
};

setup();
