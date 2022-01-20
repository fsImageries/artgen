export const view2px = (v: number, height = true) => {
  // Pixel (px) = (Viewport height unit (vh) * Viewport height) / 100
  return (v * window[height ? "innerHeight" : "innerWidth"]) / 100;
};

export const parseViewUnit = (v:string)=> {
    const num = parseFloat(v)
    const unit = v.replace(/[^a-zA-Z ]/g, '')
    return view2px(num, unit.toLowerCase() === "vh"? true : false)
}