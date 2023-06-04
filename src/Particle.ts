import { Effect } from "./Effect";

export class Particle {
  effect: Effect;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;

  friction: number;
  gravity: number;
  constructor(effect: Effect) {
    this.radius = Math.floor(Math.random() * 7 + 3);
    this.effect = effect;
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.friction = 1 - (1 - 1 / this.radius) * this.effect.friction;
    this.gravity = this.radius * 0.001;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    // move the particle
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;

    // bounce the particle off the edges of the screen
    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx *= -1;
    } else if (this.x > this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius;
      this.vx *= -1;
    }

    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy *= -1;
    } else if (this.y > this.effect.height - this.radius) {
      this.y = this.effect.height - this.radius;
      this.vy *= -1;
    }
  }
  reset() {
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - this.radius * 2);
  }
}
