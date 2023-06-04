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
  width: number;
  height: number;

  constructor(effect: Effect) {
    this.radius = Math.floor(Math.random() * 7 + 3);
    this.effect = effect;
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = -this.radius - Math.random() * this.effect.height * 0.5;
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.friction = Number(
      (1 - (1 - 1 / this.radius) * this.effect.friction).toFixed(2)
    );
    this.gravity = this.radius * 0.001;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    if (this.effect.debug) {
      ctx.strokeRect(
        this.x - this.radius,
        this.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
    }
  }

  update() {
    // move the particle
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;

    // reset the particle if it goes outside of the canvas
    if (
      this.y >
        this.effect.height + this.radius + this.effect.connectionDistance ||
      this.x < -this.radius - this.effect.connectionDistance ||
      this.x > this.effect.width + this.radius + this.effect.connectionDistance
    ) {
      this.reset();
    }

    // Collision detection
    for (let i = 0; i < this.effect.elements.length; i++) {
      const element = this.effect.elements[i];
      this.detectCollision(element);
    }
  }
  detectCollision(element: DOMRect) {
    if (
      this.x - this.radius < element.x + element.width &&
      this.x - this.radius + this.width > element.x &&
      this.y - this.radius < element.y + element.height &&
      this.height + this.y - this.radius > element.y
    ) {
      // Collision detected!
      if (
        this.y - this.radius < element.y + element.height &&
        this.height + this.y - this.radius > element.y
      )
        this.vy *= -1;
      if (
        this.x - this.radius < element.x + element.width &&
        this.x - this.radius + this.width > element.x
      ) {
        this.vx *= -1;
      }
    } else {
      // No collision
    }
  }
  reset() {
    this.x =
      this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y =
      -this.radius -
      this.effect.connectionDistance -
      Math.random() * this.effect.height * 0.2;
    this.vy = 0;
  }
}
