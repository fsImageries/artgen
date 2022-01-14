import * as AsBind from "as-bind"; //! types changed in module itself, big no-no
import DeltaTimer from "./DeltaTimer";

let WaveDotsEngine: any;
class WaveDots extends DeltaTimer {
  engine: typeof WaveDotsEngine;

  private gradient: CanvasGradient;

  constructor(
    public ctx: CanvasRenderingContext2D,
    private _width: number,
    private _height: number
  ) {
    super();
    this.ctx = ctx;
    this._width = _width;
    this._height = _height;

    this.initGradient();
  }

  async initWasm() {
    const wasm = fetch("../../wasm/build/WaveDots.wasm");

    const imports = {
      wavedots: {
        drawDot: ([x, y]: number[], opacity: number) => {
          WaveDots.drawDot(this.ctx, x, y, opacity, 1, "rgb(255, 255, 255)");
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

  initGradient() {
    this.gradient = this.ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      0,
      this.width / 2,
      this.height / 2,
      Math.max(this.width, this.height) / 2
    );

    this.gradient.addColorStop(0, "rgba(255,255,255,1)");
    this.gradient.addColorStop(1, "rgba(127,127,127,.5)");

    this.ctx.strokeStyle = this.gradient;
  }

  animate() {
    this.ctx.fillStyle = "rgb(0, 0,0)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.engine.draw();
  }

  reset() {
    cancelAnimationFrame(this.animationID);
    this.engine.setupParticles();
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

    ctx.fillStyle = ctx.strokeStyle;
    ctx.globalAlpha = opacity;

    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
  }

  // Properties

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  set width(value: number) {
    this._width = value;
    this.engine.width = value;
  }

  set height(value: number) {
    this._height = value;
    this.engine.height = value;
  }
}

export default WaveDots;
