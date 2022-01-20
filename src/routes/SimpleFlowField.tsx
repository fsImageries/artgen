import { useLayoutEffect, useEffect, useRef, useState } from "react";
import SimpleFlowField from "../classes/SimpleFlowField";
import SimpleFlowFieldWasm from "../classes/SimpleFlowFieldWasm";

import Slider from "../components/Slider";
import Checkbox from "../components/Checkbox";
import SettingsMenu from "../components/SettingsMenu";

import "../styles/simpleFlowField.scss";

let resizeId: number;

const SimpleFlowFieldRoute = () => {
  const [shouldCompare, setCompare] = useState(false);

  const set1Ref = useRef<HTMLCanvasElement>(null);
  const flowFieldRef = useRef<SimpleFlowFieldWasm | null>(null);
  const set2Ref = useRef<HTMLCanvasElement>(null);
  const flowField2Ref = useRef<SimpleFlowFieldWasm | null>(null);

  const [fieldValues, setFieldValues] = useState({
    scale: 0.01,
    cellSize: 15,
    radius: 5,
    length: 20,
  });

  const assignFlowField = (canvas2 = false) => {
    // const canvas = set1Ref.current;
    const curCanvas = canvas2 === true ? set2Ref.current : set1Ref.current;
    const curField = canvas2 === true ? flowField2Ref : flowFieldRef;

    const ctx = curCanvas?.getContext("2d");
    if (curCanvas && ctx) {
      const h = window.innerHeight;
      curCanvas.width = window.innerWidth;
      curCanvas.height = shouldCompare ? h * 0.5 : h;

      if (!curField.current) {
        curField.current = new SimpleFlowFieldWasm(
          ctx,
          curCanvas.width,
          curCanvas.height,
          0,
          1000 / 60,
          15,
          5,
          10,
          0.001
        );
        curField.current.animate(0);
      } else {
        assignFieldValues();
        curField.current.width = curCanvas.width;
        curField.current.height = curCanvas.height;
        curField.current.ctx = ctx;
        curField.current.animate(0);
        curField.current.reset();
      }
    }
  };

  const assignFieldValues = () => {
    const fields = shouldCompare
      ? [flowFieldRef, flowField2Ref]
      : [flowFieldRef];

    for (let curField of fields) {
      if (curField.current) {
        curField.current.scale = fieldValues.scale;
        curField.current.cellSize = fieldValues.cellSize;
        curField.current.multLen = fieldValues.length;
        curField.current.radius = fieldValues.radius;
        curField.current.baseRadius = fieldValues.radius;
      }
    }
  };

  useEffect(() => {
    const resizeHandler = () => {
      clearTimeout(resizeId);
      resizeId = setTimeout(assignFlowField, 100);
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    assignFlowField();
    if (shouldCompare) assignFlowField(true);

    console.log("shouldCompare: ", shouldCompare);
  }, [shouldCompare]);

  useEffect(() => {
    assignFieldValues();
  }, [fieldValues]);

  return (
    <div className="simpleFlowField App">
      <canvas ref={set1Ref} className="set1"></canvas>

      {shouldCompare && <canvas ref={set2Ref} className="set1"></canvas>}

      <SettingsMenu>
        <Slider
          label="Scale"
          min={0.0}
          max={1.0}
          step={0.01}
          value={0.01}
          setController={(v) =>
            setFieldValues((s) => {
              return { ...s, scale: v };
            })
          }
        />

        <Slider
          label="Cell Size"
          min={1}
          max={100}
          step={1}
          value={16}
          setController={(v) =>
            setFieldValues((s) => {
              return { ...s, cellSize: v };
            })
          }
        />

        <Slider
          label="Radius"
          min={1}
          max={100}
          step={1}
          value={5}
          setController={(v) =>
            setFieldValues((s) => {
              return { ...s, radius: v };
            })
          }
        />

        <Slider
          label="Length"
          min={1}
          max={100}
          step={1}
          value={10}
          setController={(v) =>
            setFieldValues((s) => {
              return { ...s, length: v };
            })
          }
        />

        <Checkbox
          label="Compare JS"
          defaultV={shouldCompare}
          setController={(v) => setCompare(v)}
        />
      </SettingsMenu>
    </div>
  );
};

export default SimpleFlowFieldRoute;
