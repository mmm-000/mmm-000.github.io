"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ColorMode = "cycle" | "mono";
type ScreenRatio = "4:3" | "16:9";
type UiLanguage = "ja" | "en";

type Position = {
  x: number;
  y: number;
};

const COLLISION_COLORS = [
  "#ff4d4d",
  "#ffae00",
  "#ffe23f",
  "#6dff70",
  "#4dceff",
  "#8c7bff",
  "#ff6ad5"
];

const DEFAULT_SPEED = 280;
const DEFAULT_SIZE = 170;

const UI_TEXT = {
  ja: {
    controlsTitle: "DVD スリープ設定",
    showControls: "設定を表示",
    hideControls: "設定を隠す",
    language: "表示言語",
    speed: "速度",
    logoWidth: "ロゴ幅",
    colorMode: "カラーモード",
    cycleOnCollision: "衝突時に切替",
    monochrome: "単色",
    tvRatio: "TV 比率",
    ratio43: "4:3（CRT時代）",
    ratio169: "16:9（ワイド）",
    customLogoUrl: "カスタムロゴURL（任意）",
    customLogoPlaceholder: "https://example.com/logo.png",
    customLogoAlt: "カスタムDVDロゴ",
    pause: "一時停止",
    resume: "再開"
  },
  en: {
    controlsTitle: "DVD Sleep Controls",
    showControls: "Show controls",
    hideControls: "Hide controls",
    language: "Language",
    speed: "Speed",
    logoWidth: "Logo width",
    colorMode: "Color mode",
    cycleOnCollision: "Cycle on collision",
    monochrome: "Monochrome",
    tvRatio: "TV ratio",
    ratio43: "4:3 (CRT era)",
    ratio169: "16:9 (Widescreen)",
    customLogoUrl: "Custom logo URL (optional)",
    customLogoPlaceholder: "https://example.com/logo.png",
    customLogoAlt: "Custom DVD logo",
    pause: "Pause",
    resume: "Resume"
  }
} as const;

export function DvdScreen() {
  const stageAreaRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const positionRef = useRef<Position>({ x: 40, y: 20 });
  const velocityRef = useRef<Position>({ x: 1, y: 1 });
  const colorIndexRef = useRef<number>(0);

  const [speed, setSpeed] = useState<number>(DEFAULT_SPEED);
  const [logoWidth, setLogoWidth] = useState<number>(DEFAULT_SIZE);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [colorMode, setColorMode] = useState<ColorMode>("cycle");
  const [screenRatio, setScreenRatio] = useState<ScreenRatio>("4:3");
  const [language, setLanguage] = useState<UiLanguage>("ja");
  const [color, setColor] = useState<string>(COLLISION_COLORS[0]);
  const [logoSrc, setLogoSrc] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [stageSize, setStageSize] = useState<Position>({ x: 0, y: 0 });

  const logoHeight = useMemo<number>(() => Math.round(logoWidth * 0.44), [logoWidth]);
  const ratioValue = useMemo<number>(() => (screenRatio === "4:3" ? 4 / 3 : 16 / 9), [screenRatio]);
  const t = UI_TEXT[language];

  useEffect(() => {
    if (!stageAreaRef.current) {
      return;
    }

    const updateStageSize = () => {
      const areaRect = stageAreaRef.current?.getBoundingClientRect();
      if (!areaRect) {
        return;
      }

      let nextWidth = areaRect.width;
      let nextHeight = nextWidth / ratioValue;

      if (nextHeight > areaRect.height) {
        nextHeight = areaRect.height;
        nextWidth = nextHeight * ratioValue;
      }

      setStageSize({
        x: Math.max(Math.floor(nextWidth), 0),
        y: Math.max(Math.floor(nextHeight), 0)
      });
    };

    updateStageSize();
    const observer = new ResizeObserver(updateStageSize);
    observer.observe(stageAreaRef.current);
    return () => observer.disconnect();
  }, [ratioValue]);

  useEffect(() => {
    if (!stageRef.current) {
      return;
    }

    const stageRect = stageRef.current.getBoundingClientRect();
    const maxX = Math.max(stageRect.width - logoWidth, 0);
    const maxY = Math.max(stageRect.height - logoHeight, 0);

    positionRef.current = {
      x: Math.min(positionRef.current.x, maxX),
      y: Math.min(positionRef.current.y, maxY)
    };
  }, [logoHeight, logoWidth, stageSize.x, stageSize.y]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = timestamp;
      }
      const delta = (timestamp - previousTimeRef.current) / 1000;
      previousTimeRef.current = timestamp;

      const stageElement = stageRef.current;
      const logoElement = logoRef.current;
      if (!stageElement || !logoElement || isPaused) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const stageRect = stageElement.getBoundingClientRect();
      const maxX = Math.max(stageRect.width - logoWidth, 0);
      const maxY = Math.max(stageRect.height - logoHeight, 0);
      const distance = speed * delta;

      let nextX = positionRef.current.x + velocityRef.current.x * distance;
      let nextY = positionRef.current.y + velocityRef.current.y * distance;
      let collided = false;

      if (nextX <= 0) {
        nextX = 0;
        velocityRef.current.x = 1;
        collided = true;
      } else if (nextX >= maxX) {
        nextX = maxX;
        velocityRef.current.x = -1;
        collided = true;
      }

      if (nextY <= 0) {
        nextY = 0;
        velocityRef.current.y = 1;
        collided = true;
      } else if (nextY >= maxY) {
        nextY = maxY;
        velocityRef.current.y = -1;
        collided = true;
      }

      if (collided && colorMode === "cycle") {
        const nextColorIndex = (colorIndexRef.current + 1) % COLLISION_COLORS.length;
        colorIndexRef.current = nextColorIndex;
        setColor(COLLISION_COLORS[nextColorIndex]);
      } else if (colorMode === "mono") {
        setColor("#f5f5f5");
      }

      positionRef.current = { x: nextX, y: nextY };
      logoElement.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      previousTimeRef.current = null;
    };
  }, [colorMode, isPaused, logoHeight, logoWidth, speed]);

  useEffect(() => {
    if (colorMode === "mono") {
      setColor("#f5f5f5");
    } else {
      setColor(COLLISION_COLORS[colorIndexRef.current]);
    }
  }, [colorMode]);

  return (
    <main className="screen-root">
      <div ref={stageAreaRef} className="stage-area">
        <section
          ref={stageRef}
          className="dvd-stage"
          aria-label="DVD animation stage"
          style={{
            width: `${stageSize.x}px`,
            height: `${stageSize.y}px`
          }}
        >
          <div
            ref={logoRef}
            className="dvd-logo"
            style={{
              width: `${logoWidth}px`,
              height: `${logoHeight}px`,
              color
            }}
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={t.customLogoAlt}
                className="dvd-image"
                style={{
                  filter:
                    colorMode === "cycle"
                      ? `hue-rotate(${colorIndexRef.current * 45}deg) saturate(1.3)`
                      : "none"
                }}
              />
            ) : (
              <>
                <span className="dvd-wordmark">DVD</span>
                <span className="dvd-submark">VIDEO</span>
              </>
            )}
          </div>
        </section>
      </div>

      <aside className={`control-panel ${isPanelOpen ? "open" : "closed"}`}>
        <button
          className="mobile-panel-toggle"
          onClick={() => setIsPanelOpen((current) => !current)}
          type="button"
        >
          {isPanelOpen ? t.hideControls : t.showControls}
        </button>

        <div className="panel-body">
          <h1>{t.controlsTitle}</h1>

          <label>
            <span>{t.language}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as UiLanguage)}>
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </label>

          <label>
            <span>
              {t.speed}: {Math.round(speed)} px/s
            </span>
            <input
              type="range"
              min={40}
              max={650}
              step={10}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </label>

          <label>
            <span>
              {t.logoWidth}: {Math.round(logoWidth)} px
            </span>
            <input
              type="range"
              min={80}
              max={320}
              step={5}
              value={logoWidth}
              onChange={(event) => setLogoWidth(Number(event.target.value))}
            />
          </label>

          <label>
            <span>{t.colorMode}</span>
            <select value={colorMode} onChange={(event) => setColorMode(event.target.value as ColorMode)}>
              <option value="cycle">{t.cycleOnCollision}</option>
              <option value="mono">{t.monochrome}</option>
            </select>
          </label>

          <label>
            <span>{t.tvRatio}</span>
            <select
              value={screenRatio}
              onChange={(event) => setScreenRatio(event.target.value as ScreenRatio)}
            >
              <option value="4:3">{t.ratio43}</option>
              <option value="16:9">{t.ratio169}</option>
            </select>
          </label>

          <label>
            <span>{t.customLogoUrl}</span>
            <input
              type="url"
              placeholder={t.customLogoPlaceholder}
              value={logoSrc}
              onChange={(event) => setLogoSrc(event.target.value.trim())}
            />
          </label>

          <button className="pause-button" onClick={() => setIsPaused((current) => !current)} type="button">
            {isPaused ? t.resume : t.pause}
          </button>
        </div>
      </aside>
    </main>
  );
}
