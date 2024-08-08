import { Vector } from "../math/Vector";

export class Ball {
  constructor(
    public position: Vector,
    public velocity: Vector,
    public radius: number,
    public color: string
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update(delta: number) {
    this.position = this.position.add(this.velocity.multiply(delta));

    if (
      this.position.x - this.radius < 0 ||
      this.position.x + this.radius > window.innerWidth
    ) {
      this.velocity.x *= -1;
    }
    if (
      this.position.y - this.radius < 0 ||
      this.position.y + this.radius > window.innerHeight
    ) {
      this.velocity.y *= -1;
    }
  }

  static createBall = (canvas: HTMLCanvasElement) => {
    const radius = 2;
    const position = Vector.random(
      radius * 2,
      canvas.width - radius * 2,
      radius * 2,
      canvas.height - radius * 2
    );
    const velocity = Vector.random(-1, 1, -1, 1).normalize().multiply(50);

    return new Ball(position, velocity, radius, "white");
  };
}
