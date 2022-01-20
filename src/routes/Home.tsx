import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// import WaveDots from "../classes/WaveDot";
import WaveDots from "../classes/WaveDotsWasm";
import { parseViewUnit } from "../helpers/utils";
import initScroller, { calcRangePercent } from "../classes/ScrollerMeasure";

const wasmscroller = await initScroller();
// console.log(wasmscroller.parseViewUnit("55vh"))
// console.log(parseViewUnit("55vh"))

import "../styles/home.scss";

type ret = [React.MutableRefObject<any>, (data: any) => void];
const useEffectState = (init: any): ret => {
  const [state, _setState] = useState(init);
  const stateRef = useRef(state);
  const setState = (data: typeof init) => {
    stateRef.current = data;
    _setState(data);
  };

  return [stateRef, setState];
};

const Home = () => {
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<WaveDots | null>(null);
  const mousePosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const [introDone, setIntroDone] = useState(false);

  const intervalWaves = () => {
    if (dotsRef.current?.engine) {
      dotsRef.current.engine.waveThrough(
        // mousePosRef.current.x,
        // mousePosRef.current.y
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }
    setTimeout(intervalWaves, 500);
  };

  useEffect(() => {
    const loadEngine = async () => {
      const cvs = cvsRef.current;
      const ctx = cvs?.getContext("2d");

      if (cvs && ctx) {
        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
        // console.log(document.documentElement.scrollHeight)
        // cvs.height = document.documentElement.scrollHeight;

        // const h = document.documentElement.scrollHeight + window.innerHeight;
        // cvs.height = h;
        // cvs.style.setProperty("height", `${h}px`);

        dotsRef.current = new WaveDots(
          ctx,
          window.innerWidth,
          window.innerHeight
          // h
        );
        await dotsRef.current.initWasm();
        dotsRef.current.engine.isDebug = 0;
        dotsRef.current.engine.pointDensity = 20;
        dotsRef.current.engine.timeM = 1000;
        dotsRef.current.engine.timeO = 100;
        dotsRef.current.engine.thickness = 500;
        // dotsRef.current._animate(0);
        dotsRef.current.start();
      }
    };
    loadEngine();

    const clickHandler = (e: MouseEvent) => {
      if (dotsRef.current) {
        // dotsRef.current.engine.waveThrough(e.x, e.y);
        dotsRef.current.engine.waveThrough(
          mousePosRef.current.x,
          mousePosRef.current.y
        );
      }
    };

    const moveHandler = (e: MouseEvent) => {
      mousePosRef.current.x = e.x;
      mousePosRef.current.y = e.y;
      if (dotsRef.current) {
        dotsRef.current.engine.circleThrough(
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

    const scrollHandler = () => {
      const base = -500;
      const setter = (ref: any, property = "--YY") => {
        return (v: number | string) =>
          ref.current.style.setProperty(
            property,
            typeof v === "number" ? `${v}px` : v
          );
      };

      setter(title1Ref)(wasmscroller.parallax(base * 5, NaN, NaN));
      setter(title2Ref)(wasmscroller.parallax(base * 2.5, NaN, NaN));
      setter(title3Ref)(wasmscroller.parallax(base * 1.5, NaN, NaN));
      setter(title4Ref)(wasmscroller.parallax(base * 1, NaN, NaN));

      const setter2 = (ref: any) => {
        return (v: number) => ref.current.style.setProperty("opacity", `${v}`);
      };

      setter2(title1Ref)(
        wasmscroller.dissolve(true, -1, parseViewUnit("5vh"), false)
      );
      setter2(title2Ref)(
        wasmscroller.dissolve(
          true,
          parseViewUnit("4vh"),
          parseViewUnit("14vh"),
          false
        )
      );
      setter2(title3Ref)(
        wasmscroller.dissolve(
          true,
          parseViewUnit("12vh"),
          parseViewUnit("22vh"),
          false
        )
      );
      setter2(title4Ref)(
        wasmscroller.dissolve(
          true,
          parseViewUnit("20vh"),
          parseViewUnit("30vh"),
          false
        )
      );

      let scrollPerc = wasmscroller.dissolve(
        false,
        0,
        parseViewUnit("25vh"),
        false
      );
      let scrollMap = wasmscroller.map(scrollPerc, 0, 1, -555, -310);
      setter(scrollIconRef, "--scrollBefore")(`${scrollMap}%`);
      setter2(scrollerRef)(
        wasmscroller.dissolve(
          true,
          parseViewUnit("20vh"),
          parseViewUnit("30vh"),
          false
        )
      );

      scrollPerc = wasmscroller.dissolve(true, parseViewUnit("5vh"), parseViewUnit("55vh"), false) 
      // console.log(scrollPerc)
      setter(galleryTitleRef, "transform")(`translateY(${scrollPerc}em)`)
      // setter(galleryTitleRef)(wasmscroller.parallax(base * 1, NaN, NaN));

      // scrollPerc = wasmscroller.dissolve(false, parseViewUnit("40vh"),parseViewUnit("60vh"), false)
      // setter(whiteBorderRef, "--border-size")(`${scrollPerc*2}vh`)

    };

    window.addEventListener("click", clickHandler);
    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("resize", resizeHandler);
    // window.addEventListener("scroll", scrollHandler);

    // scrollHandler();
    intervalWaves();

    return () => {
      window.removeEventListener("click", clickHandler);
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("resize", resizeHandler);
      // window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const footerHolderRef = useRef<HTMLDivElement>(null);
  const scrollIconRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const title3Ref = useRef<HTMLDivElement>(null);
  const title4Ref = useRef<HTMLDivElement>(null);
  const galleryTitleRef = useRef<HTMLDivElement>(null);
  const whiteBorderRef = useRef<HTMLDivElement>(null);

  return (
    <div className="home App">
      <div className="landingHolder">
        <div className="titleHolder">
          <div className="textWrapper" ref={title1Ref}>
            <div
              className="text"
              onAnimationEnd={() => {
                const engine = dotsRef.current?.engine;
                if (engine) engine.isFadeEnd = 1;
                // engine.waveThrough(window.innerWidth / 2, window.innerHeight / 2);
                setTimeout(() => setIntroDone(true), 500);
              }}
            >
              ArtGen
            </div>
          </div>
          <div className="textWrapper" ref={title2Ref}>
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
          <div className="textWrapper" ref={title3Ref}>
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
          <div className="textWrapper" ref={title4Ref}>
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
        {/* <div
          className={`footerHolder ${introDone ? "active" : ""}`}
          ref={footerHolderRef}
          // style={{transform: `translateY(${-2000 * percent.current.percent}px)`}}
          // style={style}
        >
          <div
            className="scrollIcon"
            ref={scrollIconRef}
            onClick={() => {
              const wu = document.querySelector(".galleryHolder");
              wu?.scrollIntoView({behavior:"smooth"});
            }}
          >
            <div className="scroller" ref={scrollerRef}></div>
          </div>
        </div>*/}
      </div> 

      {/* <div className="galleryHolder">
        <div className="textWrapper">
          <div className="title" ref={galleryTitleRef}>Works</div>
        </div>

        <div className="worksHolder">
          <div className="work flowfield">
            <iframe src="/#/flowField" frameBorder="0"></iframe>
          </div>
        </div>
      </div>

      <div className="whiteBorder" ref={whiteBorderRef}></div> */}

      <canvas ref={cvsRef} className="waves"></canvas>
    </div>
  );
};

export default Home;
