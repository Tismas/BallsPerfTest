import { Board } from "./Board";
import { clear } from "./utils/canvas";

const TPS = 60;
const board = new Board();
let lastUpdate = Date.now();
let lastRender = Date.now();
const lastFrameTime: number[] = [];

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

  lastFrameTime.push(delta);
  if (lastFrameTime.length > 10) {
    lastFrameTime.shift();

    const avg = lastFrameTime.reduce((a, b) => a + b) / lastFrameTime.length;
    if (avg < 1 / TPS) {
      board.addBalls(canvas, 100);
    }
  }
};

const update = () => {
  const now = Date.now();
  const delta = (now - lastUpdate) / 1000;
  lastUpdate = now;

  board.update(delta);
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

  window.addEventListener("resize", () => resize(canvas));
};

setup();
