declare function consolef64(v: f64): void;
declare function consoleBool(v: boolean): void;
declare function drawDot(xy: Array<f64>, o: f64): void;
declare function performanceLog(): void;
declare function performance(): f64;

class Dot {
  x: f64;
  y: f64;
  inTimes: Array<f64>;
  outTimes: Array<f64>;

  constructor(x: f64, y: f64) {
    this.x = x;
    this.y = y;
    this.inTimes = [];
    this.outTimes = [];
  }
}

export class WaveDots {
  width: f64;
  height: f64;

  iterW: f64;
  iterH: f64;

  distance: f64;
  private _pointDensity: f64;

  particles: Array<Dot>;

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

        const particle = new Dot(
          x * this._pointDensity + this._pointDensity / 2,
          y * this._pointDensity + this._pointDensity / 2
        );

        this.particles[idx as i32] = particle;
      }
    }
  }

  draw(): void {
    const timestamp = performance();
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      drawDot(
        [particle.x, particle.y],
        this.determineOpacity(particle, timestamp)
      );
    }
  }

  cleanTimes(): void {
    const timestamp = performance();
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      const toDelete: Array<i32> = [];

      const outTimes:Array<f64> = []
      for (let idx = 0; idx < particle.outTimes.length; idx++) {
        const time = particle.outTimes[idx]
        const isGone = time < timestamp;
        if (isGone) toDelete.push(idx);
        else outTimes.push(time)
      }

      const inTimes:Array<f64> = []
      for (let idx = 0; idx < particle.inTimes.length; idx++){
        if (!toDelete.includes(idx)) inTimes.push(particle.inTimes[idx])
      }

      particle.outTimes = outTimes
      particle.inTimes = inTimes

      this.particles[i] = particle;
    }
  }

  determineOpacity(particle: Dot, timestamp: f64): f64 {
    if (!particle.inTimes.length) return 0;

    let ret: f64 = 0;
    for (let i = 0; i < particle.inTimes.length; i++) {
      const targetIn = particle.inTimes[i];
      const targetOut = particle.outTimes[i];

      const active = targetIn < timestamp;
      const deactive = targetOut < timestamp;

      if (active) ret = 1;
      if (deactive) ret = 0;

      if (ret) return ret;
    }

    return ret;
  }

  waveThrough(x: f64, y: f64): void {
    this.cleanTimes();

    const timestamp = performance();
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const dx = x - particle.x;
      const dy = y - particle.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      const time = dist / 500;

      const targetIn = timestamp + time * 500;
      const targetOut = targetIn + 50;

      particle.inTimes.push(targetIn);
      particle.outTimes.push(targetOut);
    }

    // consolef64(this.particles[0].inTimes.length);
    // consolef64(this.particles[0].outTimes.length);
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
