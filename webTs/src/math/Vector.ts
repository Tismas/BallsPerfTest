export class Vector {
  constructor(public x: number, public y: number) {}

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  normalize() {
    return this.divide(this.length);
  }

  static random(minX: number, maxX: number, minY: number, maxY: number) {
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    return new Vector(x, y);
  }
}
