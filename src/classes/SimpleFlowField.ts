class SimpleFlowField {
  #lastTime: number;
  #timer: number;
  #gradient: CanvasGradient;
  #vr: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,
    public angle: number = 0,
    public interval: number = 100,
    public cellSize: number = 15,
    public radius: number = 5
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.ctx.strokeStyle = "white";
    this.angle = angle;

    this.#lastTime = 0;
    this.#timer = 0;
    this.interval = interval;

    this.cellSize = cellSize;
    this.radius = radius;
    this.#vr = 0.03;

    this.#gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.width,
      this.height
    );
    this.#createGradient();
    this.ctx.strokeStyle = this.#gradient;
  }

  #createGradient() {
    this.#gradient.addColorStop(0.1, "#ff5c33");
    this.#gradient.addColorStop(0.2, "#ff66b3");
    this.#gradient.addColorStop(0.4, "#ccccff");
    this.#gradient.addColorStop(0.6, "#b3ffff");
    this.#gradient.addColorStop(0.8, "#80ff80");
    this.#gradient.addColorStop(0.9, "#ffff33");
  }

  draw(angle: number, x: number, y: number) {
    const length = 20;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    this.ctx.stroke();
  }

  animate(timeStamp: number) {
    const delta = timeStamp - this.#lastTime;
    this.#lastTime = timeStamp;

    if (this.#timer > this.interval) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.radius += this.#vr;
      this.#vr = this.radius > 5 || this.radius < -5 ? this.#vr * -1 : this.#vr;

      for (let y = 0; y < this.height; y += this.cellSize) {
        for (let x = 0; x < this.width; x += this.cellSize) {
          const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius;
          this.draw(angle, x, y);
        }
      }
    } else {
      this.#timer += delta;
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}

export default SimpleFlowField;
