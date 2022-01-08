import * as AsBind from "as-bind"; //! types changed in module itself, big no-no
const wasm = fetch("../../wasm/build/optimized.wasm");


const asBindInstance = await AsBind.instantiate(wasm);
const __pin = asBindInstance.exports.__pin;
const __getArray = asBindInstance.exports.__getArray;
const SimpleFlowField = asBindInstance.exports.SimpleFlowField;
const SimpleFlowFieldFunc = asBindInstance.exports.create_SimpleFlowField;

class SimpleFlowFieldWasm {
  #lastTime: number;
  #timer: number;
  #gradient: CanvasGradient;
  #vr: number;

  #animationID:number;

  baseRadius: number;

  __field: typeof SimpleFlowField;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,
    public angle: number = 0,
    public interval: number = 100,
    public cellSize: number = 15,
    public radius: number = 5,
    public multLen: number = 20,
    public scale: number = 0.01
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.angle = angle;

    this.#lastTime = 0;
    this.#timer = 0;
    this.interval = interval;
    this.scale = scale

    this.cellSize = cellSize;
    this.radius = radius;
    this.baseRadius = radius;
    this.#vr = 0.03;

    this.ctx.strokeStyle = "white";
    this.#gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.width,
      this.height
    );
    this.#createGradient();
    this.ctx.strokeStyle = this.#gradient;

    this.#animationID = 0

    // this.__field = new SimpleFlowField(this.width, this.height);
    // this.__field.radius = this.radius;
    // this.__field.cellSize = this.cellSize;
    // this.__field.multLen = multLen;
    // this.__field.scale = scale;
  }

  #createGradient() {
    this.#gradient.addColorStop(0.1, "#ff5c33");
    this.#gradient.addColorStop(0.2, "#ff66b3");
    this.#gradient.addColorStop(0.4, "#ccccff");
    this.#gradient.addColorStop(0.6, "#b3ffff");
    this.#gradient.addColorStop(0.8, "#80ff80");
    this.#gradient.addColorStop(0.9, "#ffff33");
  }

  draw(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  batchdraw(lines: [number, number, number, number][]) {
    this.ctx.beginPath();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const [x1, y1] = line.slice(0, 2);
      const [x2, y2] = line.slice(2, 4);
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
    }
    this.ctx.stroke();
  }

  __fieldUpdate(): [number, number, number, number][] {
    const stepPtr = __pin(this.__field.update());
    const stepArr = __getArray(stepPtr);
    //   const stepArr =__getArray(stepPtr).map((ptr:number)=>{
    //     return __getArray(ptr)
    //   })

    let stepArrFull = [];
    for (let i = 0; i < stepArr.length; i++) {
      // if (i === 0) console.log(stepArr[i])

      const ptr = stepArr[i];
      if (ptr !== 0) stepArrFull[i] = __getArray(ptr);
      // console.log(ptr)
    }

    // console.log(__getArray(stepArr[0]))
    return stepArrFull;
  }

  __fieldUpdate2(): [number, number, number, number][] {
    this.radius += this.#vr;
    this.#vr = this.radius > this.baseRadius || this.radius < (this.baseRadius*-1) ? this.#vr * -1 : this.#vr;

    const field = SimpleFlowFieldFunc(
      this.width,
      this.height,
      this.cellSize,
      this.radius,
      this.multLen,
      this.scale
    );

    return field
  }

  reset(){
    cancelAnimationFrame(this.#animationID)
    this.ctx.strokeStyle = "white";
    this.#gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.width,
      this.height
    );
    this.#createGradient();
    this.ctx.strokeStyle = this.#gradient;
  }

  animate(timeStamp: number) {
    const delta = timeStamp - this.#lastTime;
    this.#lastTime = timeStamp;

    if (this.#timer > this.interval) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // const lines = this.__fieldUpdate();
      const lines = this.__fieldUpdate2()

      // for (let i = 0; i < lines.length; i++) {
      //   // console.log("Gefeuert")
      //   this.draw(...lines[i]);
      // }

      this.batchdraw(lines);

      // this.radius += this.#vr;
      // this.#vr = this.radius > 5 || this.radius < -5 ? this.#vr * -1 : this.#vr;

      // for (let y = 0; y < this.height; y += this.cellSize) {
      //   for (let x = 0; x < this.width; x += this.cellSize) {
      //     const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius;
      //     this.draw(angle, x, y);
      //   }
      // }
    } else {
      this.#timer += delta;
    }

    this.#animationID = requestAnimationFrame(this.animate.bind(this));
  }
}

export default SimpleFlowFieldWasm;
