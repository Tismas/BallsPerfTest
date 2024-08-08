import { Ball } from "./entities/Ball";

const initialBalls = 100;

export class Board {
  public balls: Ball[] = [];

  constructor() {}

  update(delta: number) {
    this.balls.forEach((ball) => {
      ball.update(delta);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.balls.forEach((ball) => {
      ball.draw(ctx);
    });
  }

  setup(canvas: HTMLCanvasElement) {
    this.addBalls(canvas, initialBalls);
  }

  addBalls(canvas: HTMLCanvasElement, count: number) {
    for (let i = 0; i < count; i++) {
      this.balls.push(Ball.createBall(canvas));
    }
  }
}
