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
    setTimeout(intervalWaves, 1000);
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
        dotsRef.current.engine.isDebug = 1;
        dotsRef.current.engine.pointDensity = 20;
        dotsRef.current.engine.timeM = 1000;
        dotsRef.current.engine.timeO = 100;
        dotsRef.current.engine.thickness = 500;
        dotsRef.current._animate(0);
      }
    };
    loadEngine();

    const clickHandler = (e: MouseEvent) => {
      if (dotsRef.current) {
        dotsRef.current.engine.waveThrough(e.x, e.y);
      }
    };

    const moveHandler = (e: MouseEvent) => {
      mousePosRef.current.x = e.x;
      mousePosRef.current.y = e.y;
      if (dotsRef.current) {
        dotsRef.current.engine.waveThrough(
          mousePosRef.current.x,
          mousePosRef.current.y
        );
      }
    };

    const resizeHandler = (e: Event) => {
      const cvs = cvsRef.current;
      const dots = dotsRef.current;
      if (dots && cvs) {
        const [w, h] = [window.innerWidth, window.innerHeight];
        for (let el of [cvs, dots]) {
          el.width = w;
          el.height = h;
        }
        dots.reset();
      }
    };

    window.addEventListener("click", clickHandler);
    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("resize", resizeHandler);

    // intervalWaves();

    return () => {
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("mousemove", moveHandler);
      window.addEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="home App">
      <div className="titleHolder">
        <div className="textWrapper">
          <div
            className="text"
            onAnimationEnd={() => {
              const engine = dotsRef.current?.engine;
              if (engine)
                engine.isFadeEnd = 0;
                engine.waveThrough(
                  mousePosRef.current.x,
                  mousePosRef.current.y
                );
            }}
          >
            ArtGen
          </div>
        </div>

        <div className="textWrapper">
          <div
            className="text"
            style={{
              fontWeight: 100,
              fontSize: "2vw",
              animationDelay: "100ms",
            }}
          >
            Personal{" "}
          </div>
        </div>

        <div className="textWrapper">
          <div
            className="text"
            style={{
              fontWeight: 800,
              fontSize: "2vw",
              animationDelay: "300ms",
            }}
          >
            Generative Art
          </div>
        </div>

        <div className="textWrapper">
          <div
            className="text"
            style={{
              fontWeight: 100,
              fontSize: "2vw",
              animationDelay: "500ms",
            }}
          >
            Portfolio
          </div>
        </div>
      </div>

      <canvas ref={cvsRef} className="waves"></canvas>
    </div>
  );
};

export default Home;
