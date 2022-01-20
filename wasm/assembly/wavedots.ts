declare function consolef64(v: f64): void;
declare function consoleBool(v: boolean): void;
declare function drawDot(xy: Array<f64>, o: f64): void;
declare function performanceLog(): void;
declare function performance(): f64;

import {normalize} from "./utils";

const enum CircleOps {
  IN,
  OUT,
  ON,
}

class Dot {
  x: f64;
  y: f64;

  opacity: f64;
  fadeEnd: bool;
  forceOpacity: i32;

  inTimes: Array<f64>;
  outTimes: Array<f64>;

  constructor(x: f64, y: f64) {
    this.x = x;
    this.y = y;

    this.opacity = 0;
    this.fadeEnd = 1;
    this.forceOpacity = -1;

    this.inTimes = [];
    this.outTimes = [];
  }

  determineOpacity(timestamp: f64): f64 {
    if (this.forceOpacity != -1) {
      return this.forceOpacity;
    }

    if (!this.inTimes.length) return 0;

    let ret: f64 = 0;
    for (let i = 0; i < this.inTimes.length; i++) {
      const targetIn = this.inTimes[i];
      const targetOut = this.outTimes[i];

      const active = targetIn < timestamp;
      const deactive = this.fadeEnd ? targetOut < timestamp : false;

      const normalized = normalize(timestamp, targetIn, targetOut)
      const normalized2 = normalize(timestamp, targetOut, timestamp)

      // if (active) ret = 1;
      if (active) ret = this.easeOutQuart(normalized);
      if (deactive) ret = this.easeOutQuart(1 - normalized2);

      if (ret != 0) return ret;
    }
    return ret;
  }

  easeOutQuart(x:f64):f64{
    return 1 - Math.pow(1 - x, 4);
  }
}

export class WaveDots {
  width: f64;
  height: f64;
  iterW: f64;
  iterH: f64;

  timeM: f64;
  timeO: f64;
  thickness: f64;

  radiusDist: f64;

  fadeEnd: bool;
  isDebug: bool;

  particles: Array<Dot>;

  private _pointDensity: f64;

  constructor(width: f64, height: f64) {
    this.width = width;
    this.height = height;
    this.timeM = 500.0;
    this.timeO = 50.0;
    this.thickness = 500.0;

    this.radiusDist = 100.0;

    this._pointDensity = 30.0;

    this.particles = new Array(0);
    this.setupParticles();
  }

  // Initializers

  setupParticles(): void {
    this.iterW = Math.floor(this.width / this._pointDensity);
    this.iterH = Math.floor(this.height / this._pointDensity);
    this.particles = new Array((this.iterW * this.iterH) as i32);
    this.initParticles();
  }

  initParticles(): void {
    for (let x = 0.0; x < this.iterW; x++) {
      for (let y = 0.0; y < this.iterH; y++) {
        const idx = x * this.iterH + y;

        const particle = new Dot(
          x * this._pointDensity + this._pointDensity / 2,
          y * this._pointDensity + this._pointDensity / 2
        );
        if (this.isDebug) particle.fadeEnd = true
        this.particles[idx as i32] = particle;
      }
    }
  }

  // Drawing

  draw(): void {
    const timestamp = performance();
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      drawDot([particle.x, particle.y], particle.determineOpacity(timestamp));
    }
  }

  // Effects

  waveThrough(x: f64, y: f64): void {
    this.cleanTimes();
    const timestamp = performance();

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const dx = x - particle.x;
      const dy = y - particle.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      const time = dist / this.thickness;

      const targetIn = timestamp + time * this.timeM;
      const targetOut = targetIn + this.timeO;

      particle.inTimes.push(targetIn);
      particle.outTimes.push(targetOut);
    }

    if (this.isDebug) {
      consolef64(this.particles[0].inTimes.length);
      consolef64(this.particles[0].outTimes.length);
    }
  }

  circleThrough(x: f64, y: f64): void {
    this.cleanTimes();
    const timestamp = performance();

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      const inCircle = this.checkCirclePoint(
        CircleOps.IN,
        [x, y],
        [particle.x, particle.y]
      );

      if (inCircle) {
        const dx = x - particle.x;
        const dy = y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const time = dist / this.thickness;
        const targetIn = timestamp + time * this.timeM;
        const targetOut = targetIn + this.timeO;
        particle.inTimes.push(targetIn);
        particle.outTimes.push(targetOut);

        // particle.forceOpacity = 1
      } else {
        // particle.forceOpacity = 0
      }
    }
  }

  // Helpers

  cleanTimes(): void {
    const timestamp = performance();
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      const toDelete: Array<i32> = [];

      const outTimes: Array<f64> = [];
      for (let idx = 0; idx < particle.outTimes.length; idx++) {
        const time = particle.outTimes[idx];
        const isGone = time < timestamp;
        if (isGone) toDelete.push(idx);
        else outTimes.push(time);
      }

      const inTimes: Array<f64> = [];
      for (let idx = 0; idx < particle.inTimes.length; idx++) {
        if (!toDelete.includes(idx)) inTimes.push(particle.inTimes[idx]);
      }

      particle.outTimes = outTimes;
      particle.inTimes = inTimes;

      this.particles[i] = particle;
    }
  }

  checkCirclePoint(
    op: CircleOps,
    xyCenter: Array<f64>,
    xyParticle: Array<f64>
  ): bool {
    // const isInRadius = (px: number, py: number) => {
    //   const sx = Math.pow(x - px, 2);
    //   const sy = Math.pow(y - py, 2);
    //   return sx + sy < Math.pow(this.distance, 2);
    // };
    if (op == CircleOps.IN) {
      const sx = Math.pow(xyCenter[0] - xyParticle[0], 2);
      const sy = Math.pow(xyCenter[1] - xyParticle[1], 2);

      return sx + sy < Math.pow(this.radiusDist, 2);
    }

    if (op == CircleOps.OUT) {
      const sx = Math.pow(xyCenter[0] - xyParticle[0], 2);
      const sy = Math.pow(xyCenter[1] - xyParticle[1], 2);

      return sx + sy > Math.pow(this.radiusDist, 2);
    }

    return 0;
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
