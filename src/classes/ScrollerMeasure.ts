import { parseViewUnit } from "../helpers/utils";
import * as AsBind from "as-bind"; //! types changed in module itself, big no-no

const scrollHeight = ()=>document.documentElement.scrollHeight;

const initWasm = async () => {
  const imports = {
    scrollermeasure: {
      innerWidth: ()=>window.innerWidth,
      innerHeight: ()=>window.innerHeight,
      scrollHeight: ()=>document.documentElement.scrollHeight,
      pageYOffset: () => window.pageYOffset,
      consolef64: (v:number)=>console.log(v),
      consolestr: (v:string)=>console.log(v)
    },
  };

  const wasm = fetch("../../wasm/build/scrollermeasure.wasm");
  const asBindInstance = await AsBind.instantiate(wasm, imports);
  //   const normalize = asBindInstance.exports.normalize;
  return asBindInstance.exports;
};

const exports = await initWasm();

export const calcRangePercent = (
  start: number | string,
  end?: number | string,
  swing?: boolean
) => {
  if (typeof start === "string") {
    // only vw/vh at the moment
    start = parseViewUnit(start);
  }

  if (typeof end === "string") {
    // only vw/vh at the moment
    end = parseViewUnit(end);
  }

  return exports.calcRangePercent(start, end !== undefined ? end : NaN, swing!=undefined? swing: false);
};

export default initWasm;
