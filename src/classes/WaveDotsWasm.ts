import * as AsBind from "as-bind"; //! types changed in module itself, big no-no

let WaveDotsEngine: any;
class WaveDots {
  engine: typeof WaveDotsEngine;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // this.setupWasm()
  }

  async initWasm() {
    const wasm = fetch("../../wasm/build/WaveDots.wasm");

    const imports = {
      wavedots: {
        drawDot: ([x, y]: number[], opacity: number) => {
          WaveDots.drawDot(this.ctx, x, y, opacity, 1, "rgb(255, 255,255)");
        },
        consolef64: console.log,
        consoleBool: console.log,
        performanceLog: () => console.log(performance.now()),
        performance: () => performance.now(),
      },
    };

    const asBindInstance = await AsBind.instantiate(wasm, imports);
    WaveDotsEngine = asBindInstance.exports.WaveDots;
    this.engine = new WaveDotsEngine(this.width, this.height);
  }

  animate() {
    this.ctx.fillStyle = "rgb(0, 0,0)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.engine.draw();

    requestAnimationFrame(this.animate.bind(this));
  }

  static drawDot(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    opacity: number,
    radius: number,
    color: string
  ) {
    ctx.save();
    ctx.beginPath();

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;

    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
  }
}

export default WaveDots;
