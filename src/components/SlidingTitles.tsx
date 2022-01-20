import React, { useRef } from "react";

import styles from "../styles/slidingTitles.module.scss";

interface props {
  children: string;
  duration?: number;
  delay?: number;
  onFirstAnimEnd?: () => void;
  onLastAnimEnd?: () => void;
}

const SlidingTitles = ({
  children,
  duration,
  delay,
  onFirstAnimEnd,
  onLastAnimEnd,
}: props) => {
  const titles = children.split(" ");
  const titleHolderRef = useRef<HTMLDivElement>(null);

  const dur = duration !== undefined ? duration : 3;
  const dly = delay !== undefined ? delay : dur / 1.8;

  if (duration !== undefined) {
    const el = titleHolderRef.current;
    if (el) el.style.setProperty("--duration", `${duration}s`);
  }

  return (
    <div className={styles.titleHolder} ref={titleHolderRef}>
      {titles.map((t: string, i: number) => {
        let cb: any;
        if (i === 0) cb = onFirstAnimEnd;
        else if (i === titles.length - 1) cb = onLastAnimEnd;
        else cb = () => null;
        return (
          <div key={i} className={styles.textWrapper}>
            <div
              className={styles.text}
              style={{ animationDelay: `${dly * i}s` }}
              onAnimationEnd={cb}
            >
              {t}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SlidingTitles;
