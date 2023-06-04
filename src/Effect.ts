import { Particle } from "./Particle";

export class Effect {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  particles: Particle[];
  numberofParticles: number;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number; pressed: boolean; radius: number };
  constructor({
    canvas,
    ctx,
    mouseRadius = 150,
    numberOfParticles = 300,
  }: {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    mouseRadius?: number;
    numberOfParticles?: number;
  }) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberofParticles = numberOfParticles;
    this.ctx = ctx;
    this.createParticles();
    this.applyGradient();
    this.mouse = {
      x: 0,
      y: 0,
      pressed: false,
      radius: mouseRadius,
    };

    window.addEventListener("resize", () => {
      this.resize(window.innerWidth, window.innerHeight);
    });
    window.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      }
    });
    window.addEventListener("mousedown", () => {
      this.mouse.pressed = true;
    });
    window.addEventListener("mouseup", () => {
      this.mouse.pressed = false;
    });
  }
  createParticles() {
    for (let i = 0; i < this.numberofParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }
  handleParticle(ctx: CanvasRenderingContext2D) {
    this.connectParticles(ctx);
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.draw(ctx);
      particle.update();
    }
  }
  connectParticles(ctx: CanvasRenderingContext2D) {
    const maxDistance = 100;
    for (let a = 0; a < this.particles.length; a++) {
      const particleA = this.particles[a];
      for (let b = a; b < this.particles.length; b++) {
        const particleB = this.particles[b];
        const distance = this.calculateDistance(particleA, particleB);
        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.moveTo(particleA.x, particleA.y);
          ctx.lineTo(particleB.x, particleB.y);
          ctx.stroke();
          ctx.closePath();
          ctx.restore();
        }
      }
    }
  }
  applyGradient() {
    const gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.5, "gold");
    gradient.addColorStop(1, "orangered");
    this.ctx.fillStyle = gradient;
  }
  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.applyGradient();
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].reset();
    }
  }
  calculateDistance(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.hypot(dx, dy);
    return distance;
  }
}
