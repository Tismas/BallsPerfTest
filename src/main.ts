import { Board } from "./Board";
import { clear } from "./utils/canvas";

const TPS = 60;
const board = new Board();
let lastUpdate = Date.now();

const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  clear(ctx);

  board.draw(ctx);

  requestAnimationFrame(() => draw(canvas, ctx));
};

const update = () => {
  const now = Date.now();
  const delta = (now - lastUpdate) / 1000;

  board.update(delta);

  lastUpdate = now;
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
