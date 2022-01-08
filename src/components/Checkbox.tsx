import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface props {
  label: string;
  defaultV?: boolean;
  setController?: (v: boolean) => void;
}

const Checkbox = ({ label, defaultV, setController }: props) => {
  const [checkVal, setCheckVal] = useState(defaultV ? defaultV : false);
  const componentID = uuidv4();

  useEffect(() => {
    if (setController) setController(checkVal);
  }, [checkVal]);

  return (
    <div className="inputHolder">
      <label className="inputLabel" htmlFor={componentID}>
        {label}
      </label>
      <div className="inputWrapper">
        <input
          className="checkbox"
          type="checkbox"
          id={componentID}
          checked={checkVal}
          onChange={(e) => setCheckVal(e.currentTarget.checked)}
        />
        {/* <input
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
        /> */}
      </div>
    </div>
  );
};

export default Checkbox;
