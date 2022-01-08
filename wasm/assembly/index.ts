// The entry file of your WebAssembly module.

export class SimpleFlowField {
  width: f64;
  height: f64;
  angle: f64;
  interval: f64;
  cellSize: f64;
  radius: f64;

  multLen: f64;
  scale: f64;

  private vr: f64;

  constructor(
    width: f64,
    height: f64
    // angle: f64 = 0,
    // interval: f64 = 1000/60,
    // cellSize: f64 = 2.0
  ) {
    this.width = width;
    this.height = height;

    this.vr = 0.03;

    this.angle = 0;
    this.interval = 1000 / 60;
    this.cellSize = 2.0;
    this.radius = 5.0;
    // this.angle = angle;
    // this.interval = interval;
    // this.cellSize = cellSize;

    this.multLen = 20.0;
    this.scale = 0.01;
  }

  get length(): i32 {
    return ((this.width * this.height) / this.cellSize) as i32;
  }

  // update(): Array<f64> {
  update(): Array<Float64Array> {
    // const field = new Array<f64>(this.length * 4);
    const field = new Array<Float64Array>(this.length);

    this.radius += this.vr;
    this.vr = this.radius > 5 || this.radius < -5 ? this.vr * -1 : this.vr;

    let i = 0;
    for (let x: f64 = 0; x < this.width; x += this.cellSize) {
      for (let y: f64 = 0; y < this.height; y += this.cellSize) {
        const angle =
          (Math.cos(x * this.scale) + Math.sin(y * this.scale)) * this.radius;
        const drawn = this.draw(angle, x, y);
        // const idx = i + this.width + j
        // const idx = y * this.width + x;

        // field[idx as i32] = 66;
        field[i] = drawn;
        // field[i] = [x, y, this.radius];

        // for (let j = 0; j < drawn.length; j++) {
        //   field[i] = drawn[j];
        //   i++;
        // }

        // j++;
        i++;
      }
    }
    return field;
  }

  draw(angle: f64, x: f64, y: f64): Float64Array {
    const arr = new Float64Array(4);
    arr[0] = x;
    arr[1] = y;
    arr[2] = x + Math.cos(angle) * this.multLen;
    arr[3] = y + Math.sin(angle) * this.multLen;

    return arr;
  }
}

const getLength = (width: f64, height: f64, cellSize: f64): i32 => {
  return ((width * height) / cellSize) as i32;
};

export function create_SimpleFlowField(
  width: f64,
  height: f64,
  cellSize: f64,
  radius: f64,
  multLen: f64,
  scale: f64
): Array<Float64Array> {
  const field = new Array<Float64Array>(getLength(width, height, cellSize));

  let i = 0;
  for (let x: f64 = 0; x < width; x += cellSize) {
    for (let y: f64 = 0; y < height; y += cellSize) {
      const angle = (Math.cos(x * scale) + Math.sin(y * scale)) * radius;
      
      const drawn = new Float64Array(4);
      drawn[0] = x;
      drawn[1] = y;
      drawn[2] = x + Math.cos(angle) * multLen;
      drawn[3] = y + Math.sin(angle) * multLen;

      field[i] = drawn;
      i++;
    }
  }
  return field;
}
