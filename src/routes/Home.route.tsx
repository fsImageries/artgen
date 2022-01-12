import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// import WaveDots from "../classes/WaveDot";
import WaveDots from "../classes/WaveDotsWasm";

import "../styles/home.scss";

const Home = () => {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<WaveDots | null>(null);
  const mousePosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const intervalWaves = () => {
    if (dotsRef.current?.engine) {
      dotsRef.current.engine.waveThrough(
        mousePosRef.current.x,
        mousePosRef.current.y
      );
    }
    setTimeout(intervalWaves, 750);
  };

  useEffect(() => {
    const loadEngine = async () => {
      const cvs = cvsRef.current;
      const ctx = cvs?.getContext("2d");

      if (cvs && ctx) {
        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
        dotsRef.current = new WaveDots(
          ctx,
          window.innerWidth,
          window.innerHeight
        );
        await dotsRef.current.initWasm();
        dotsRef.current.animate()
      }
    };
    loadEngine()

    const clickHandler = (e: MouseEvent) => {
      if (dotsRef.current) {
        dotsRef.current.engine.waveThrough(e.x, e.y);
      }
    };

    const moveHandler = (e: MouseEvent) => {
      mousePosRef.current.x = e.x;
      mousePosRef.current.y = e.y;
    };

    intervalWaves();

    window.addEventListener("click", clickHandler);
    window.addEventListener("mousemove", moveHandler);

    return () => {
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("mousemove", moveHandler);
    };
  }, []);

  return (
    <div className="home App">
      <div className="titleHolder">
        <div className="text">ARTGEN</div>
        {/* <Link to="/flowField">Flow Field</Link> */}
      </div>

      <canvas ref={cvsRef} className="waves"></canvas>
    </div>
  );
};

export default Home;
