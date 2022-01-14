export default class DeltaTimer {
  public animationID: number;
  private timer: number;
  private lastTime: number;
  private interval: number;

  constructor() {
    this.timer = 0;
    this.lastTime = 0;
    this.interval = 1000 / 60;
  }

  animate(){
      throw new Error("Not implemented, is not used to be called by itself.")
  }

  _animate(timestamp: number) {
    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.timer > this.interval) {
        this.animate()
    } else {
      this.timer += delta;
    }

    this.animationID = requestAnimationFrame(this._animate.bind(this));
  }
}
