export function normalize(x: f64, min: f64, max: f64): f64 {
  return (x - min) / (max - min);
}

export function clamp(val: f64, min: f64, max: f64):f64 {
  return val > max ? max : val < min ? min : val;
}

export function map(n:f64, in_min:f64, in_max:f64, out_min:f64, out_max:f64):f64 {
	let val = (n - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	// if (val < out_min) val = out_min;
	// else if (val > out_max) val = out_max;
  val = (val < out_min) ? out_min : (val > out_max) ? out_max : val
	return val;
}



// Easing functions (maybe in dataclass or namespace?)
// Expects input value from 0-1

export function easeOutQuart(x: f64): f64 {
  return 1 - Math.pow(1 - x, 4);
}

export function easeOutQuint(x: f64): f64 {
  return 1 - Math.pow(1 - x, 5);
}
