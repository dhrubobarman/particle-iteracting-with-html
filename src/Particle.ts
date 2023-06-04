import { Effect } from "./Effect";

export class Particle {
  effect: Effect;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  pushX: number;
  pushY: number;
  friction: number;
  constructor(effect: Effect) {
    this.radius = Math.floor(Math.random() * 12 + 2);
    this.effect = effect;
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.pushX = 0;
    this.pushY = 0;
    this.friction = 0.95;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    if (this.effect.mouse.pressed) {
      const distance = this.effect.calculateDistance(this.effect.mouse, this);
      const force = this.effect.mouse.radius / distance;
      if (distance < this.effect.mouse.radius) {
        const dx = this.x - this.effect.mouse.x;
        const dy = this.y - this.effect.mouse.y;
        const angle = Math.atan2(dy, dx);
        this.pushX += Math.cos(angle) * force;
        this.pushY += Math.sin(angle) * force;
      }
    }
    // move the particle
    this.x += (this.pushX *= this.friction) + this.vx;
    this.y += (this.pushY *= this.friction) + this.vy;

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
