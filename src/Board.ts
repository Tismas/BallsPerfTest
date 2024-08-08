import { Ball } from "./entities/Ball";

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
    for (let i = 0; i < 100; i++) {
      this.balls.push(Ball.createBall(canvas));
    }
  }
}
