class Dot {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public radius: number,
    public opacity: number,
    public color: string
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.opacity = opacity;
    this.color = color;
  }

  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.restore();
  }
}

class WaveDots {
  public particles: Dot[];

  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,

    public distance: number = 100,
    public pointDensity: number = 30,
    public color: string = "rgb(255, 255,255)"
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.distance = distance;
    this.pointDensity = pointDensity;
    this.color = color;

    this.particles = [];
    this.init();
  }

  init() {
    for (let x = 0; x < this.width / this.pointDensity; x++) {
      for (let y = 0; y < this.height / this.pointDensity; y++) {
        this.particles.push(
          new Dot(
            this.ctx,
            x * this.pointDensity,
            y * this.pointDensity,
            1,
            0,
            this.color
          )
        );
      }
    }
  }

  draw() {
    for (const particle of this.particles) {
      particle.draw();
    }
  }

  animate() {
    this.ctx.fillStyle = "rgb(0, 0,0)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.draw();

    requestAnimationFrame(this.animate.bind(this));
  }

  waveThrough(x: number, y: number) {
    const isInRadius = (px: number, py: number) => {
      const sx = Math.pow(x - px, 2);
      const sy = Math.pow(y - py, 2);

      return sx + sy < Math.pow(this.distance, 2);
    };

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const dx = x - particle.x;
      const dy = y - particle.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      const inRadius = isInRadius(particle.x, particle.y);

      const time = dist / 500;
      setTimeout(() => (particle.opacity = 1), time * 1000);
      setTimeout(() => (particle.opacity = 0), (time * 1000) + time * 1000);

    }
  }
}

export default WaveDots;
