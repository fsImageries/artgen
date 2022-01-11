import * as AsBind from "as-bind"; //! types changed in module itself, big no-no

let WaveDotsEngine: any;

const loadWaveDots = async (drawDot: any, anim: any, instance: WaveDots) => {
  const wasm = fetch("../../wasm/build/WaveDots.wasm");

  const asBindInstance = await AsBind.instantiate(wasm, {
    // ...es.wasmImports,
    wavedots: {
      drawDot: (x: number, y: number) => {
        drawDot(x, y);
      },
      // setTimeout: anim,
      consolef64: console.log,
      consoleBool: console.log,
      performanceLog: () => console.log(performance.now()),
      performance: () => performance.now(),
    },
  });

  // console.log(asBindInstance)
  //   const WaveDotsEngine = asBindInstance.exports.WaveDots;
  WaveDotsEngine = asBindInstance.exports.WaveDots;

  // console.log(asBindInstance.exports);

  instance.engine = new WaveDotsEngine(instance.width, instance.height);
  instance.animate();
};

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

    // this.engine = new WaveDotsEngine(width, height);
    // this.engine.init();
    // this.engine.waveThrough(1, 2);

    loadWaveDots(
      // (x: number, y: number, opacity: number) => {
      ([x, y]: number[], opacity: number) => {
        WaveDots.drawDot(ctx, x, y, opacity, 1, "rgb(255, 255,255)");
      },
      (func: any, time: number) => {
        setTimeout(() => func(), time);
      },
      this
    );
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
    color: string,
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
