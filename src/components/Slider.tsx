import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

import { FlowFieldValues } from "../types";

interface props {
  label: string;
  min?: number;
  max?: number;
  step?: number | string;
  value?: number;
  // controller?: React.RefObject<FlowFieldValues>
  setController?: (v: number) => void;
}

const Slider = ({label, min, max, step, value, setController }: props) => {
  const [numVal, _setNumVal] = useState(value? value : 0);
  const componentID = uuidv4()

  useEffect(() => {
    if (setController) setController(numVal);
  }, [numVal]);

  const setNumVal = (val: number | undefined) => {
    val = val ? val : 0;
    _setNumVal(val);
  };

  return (
    <div className="inputHolder">
      <label className="inputLabel" htmlFor={componentID}>{label}</label>
      <div className="inputWrapper">
        <input
          type="number"
          className="sliderNumber"
          id={componentID}
          step={step}
          value={numVal}
          onChange={(e) => setNumVal(e.currentTarget.valueAsNumber)}
        />
        <input
          type="range"
          className="slider"
          min={min}
          max={max}
          step={step}
          value={numVal}
          onChange={(e) => setNumVal(e.currentTarget.valueAsNumber)}
        />
      </div>
    </div>
  );
};

export default Slider;
