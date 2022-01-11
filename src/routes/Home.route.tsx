import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// import WaveDots from "../classes/WaveDot";
import WaveDots from "../classes/WaveDotsWasm";

import "../styles/home.scss";

const Home = () => {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<WaveDots | null>(null);

  // useEffect(() => {
  //   const cvs = cvsRef.current
  //   const ctx = cvs?.getContext("2d");

  //   if (cvs && ctx){
  //     cvs.width = window.innerWidth
  //     cvs.height = window.innerHeight
  //     dotsRef.current = new WaveDots(ctx, window.innerWidth, window.innerHeight);
  //     dotsRef.current.animate()
  //   }

  //   const clickHandler = (e:MouseEvent) => {
  //     if (dotsRef.current) {
  //       dotsRef.current.waveThrough(e.x, e.y)
  //     }
  //   }
  //   window.addEventListener("click", clickHandler)

  //   return ()=>window.removeEventListener("click", clickHandler)
  // }, []);

  useEffect(() => {
    const cvs = cvsRef.current;
    const ctx = cvs?.getContext("2d");

    if (cvs && ctx) {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
      dotsRef.current = new WaveDots(ctx, window.innerWidth, window.innerHeight);
      // wavedots.animate()
    }

    const clickHandler = (e: MouseEvent) => {
      if (dotsRef.current) {
        dotsRef.current.engine.waveThrough(e.x, e.y);
      }
    };
    window.addEventListener("click", clickHandler);

    return () => window.removeEventListener("click", clickHandler);
  }, []);

  return (
    <div className="home App">
      <canvas ref={cvsRef} className="waves"></canvas>

      <div className="titleHolder">
        <div className="text">ARTGEN</div>
        {/* <Link to="/flowField">Flow Field</Link> */}
      </div>
    </div>
  );
};

export default Home;
