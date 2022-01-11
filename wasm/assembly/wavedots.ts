// declare function drawDot(x: f64, y: f64, o: f64): void;
// declare function setTimeout(func: () => void, time: f64): void;
declare function consolef64(v: f64): void;
declare function consoleBool(v: boolean): void;
declare function drawDot(xy: Array<f64>, o: f64): void;
declare function performanceLog(): void;
declare function performance(): f64;

class Dot{
  x: f64;
  y: f64;
  times:Array<f64>;

  constructor(x: f64, y: f64){
    this.x = x;
    this.y = y;
    this.times = []
  }
}

export class WaveDots {
  width: f64;
  height: f64;

  iterW: f64;
  iterH: f64;

  distance: f64;
  private _pointDensity: f64;

  particles: Array<Array<f64>>;

  constructor(width: f64, height: f64) {
    this.width = width;
    this.height = height;
    this.distance = 100.0;
    this._pointDensity = 30.0;

    this.particles = new Array(0);
    this.setupParticles();
  }

  setupParticles(): void {
    this.iterW = Math.floor(this.width / this._pointDensity);
    this.iterH = Math.floor(this.height / this._pointDensity);
    this.particles = new Array((this.iterW * this.iterH) as i32);
    this.initParticles();
  }

  initParticles(): void {
    const iterW = Math.floor(this.width / this._pointDensity);
    const iterH = Math.floor(this.height / this._pointDensity);

    for (let x = 0.0; x < iterW; x++) {
      for (let y = 0.0; y < iterH; y++) {
        const idx = x * iterH + y;

        // x, y, opacity, toTurnVisibleTime
        this.particles[idx as i32] = [
          x * this._pointDensity + this._pointDensity / 2,
          y * this._pointDensity + this._pointDensity / 2,
          -1.0, // target time fade-in
          -1.0, // target time fade-out
        ];
      }
    }
  }

  draw(): void {
    const timestamp = performance();
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      drawDot(
        [particle[0], particle[1]],
        this.determineOpacity(particle, timestamp)
      );
    }
  }

  determineOpacity(particle: Array<f64>, timestamp: f64): f64 {
    const targetIn = particle[2];
    const targetOut = particle[3];

    if (targetIn === -1) return 0;

    const active = targetIn < timestamp;
    const deactive = targetOut < timestamp;

    let ret: f64 = 0;
    if (active) ret = 1;
    if (deactive) ret = 0;

    return ret;
  }

  waveThrough(x: f64, y: f64): void {
    const timestamp = performance();
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const dx = x - particle[0];
      const dy = y - particle[1];

      const dist = Math.sqrt(dx * dx + dy * dy);

      const time = dist / 500;

      const targetIn = timestamp + time * 500;
      const targetOut = timestamp + (time * 500) + 50;

      this.particles[i][2] = targetIn;
      this.particles[i][3] = targetOut;
    }
  }

  assignOpacity(idx: i32, opacity: f64): void {
    const particle = this.particles[idx];
    this.particles[idx] = [particle[0], particle[1], opacity];
  }

  // Properties

  get pointDensity(): f64 {
    return this._pointDensity;
  }

  set pointDensity(value: f64) {
    this._pointDensity = value;
    this.setupParticles();
  }
}
