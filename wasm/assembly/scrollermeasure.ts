declare function innerWidth(): f64;
declare function innerHeight(): f64;
declare function scrollHeight(): f64;
declare function pageYOffset(): f64;

declare function consolef64(v: f64): void;
declare function consolestr(v: string): void;

import { normalize, clamp } from "./utils";

export { map } from "./utils";


export function view2px(v: number, height: bool): f64 {
  // Pixel (px) = (Viewport unit (vh/vw) * Viewport height/width) / 100
  // return (v * window[height ? "innerHeight" : "innerWidth"]) / 100;
  const win = height ? innerHeight() : innerWidth();
  return (v * win) / 100;
}

export function parseViewUnit(v: string): f64 {
  const num = parseFloat(v);
  return view2px(num, v.toLowerCase().includes("vh") ? true : false);
}

export function calcScrollMax(): f64 {
  return scrollHeight() - innerHeight();
}

export function calcScrollPercent(start: f64 = NaN, end: f64 = NaN): f64 {
  return normalize(
    pageYOffset(),
    !isNaN(start) ? start : 0,
    !isNaN(end) ? end : calcScrollMax()
  );
}

export function calcRangePercent(
  start: f64,
  end: f64 = NaN,
  swing: bool = false
): f64 {
  const perc = calcScrollPercent(start, end ? end : NaN);

  if (swing && !isNaN(end)) {
    const swingEnd = end - start + end;
    const swingPercent = calcScrollPercent(end, swingEnd);

    const clamped = clamp(perc, 0, 1);
    if (clamped >= 1) return 1 - clamp(swingPercent, 0, 1);
    else return clamped;
  }

  return clamp(perc, 0, 1);
}

export function parallax(
  //   setter: (v: f64) => void,
  magnitude: f64 = 100,
  start: f64 = NaN,
  end: f64 = NaN
): f64 {
  return magnitude * calcScrollPercent(start, end);
}

export function dissolve(
  rev: bool = false,
  start: f64 = NaN,
  end: f64 = NaN,
  swing: bool = false
): f64 {
  let percent: f64;
  if (!isNaN(start)) {
    percent = calcRangePercent(start, end, swing);
  } else {
    percent = calcScrollPercent(start, end);
  }

  return rev ? 1 - percent : percent;
}
