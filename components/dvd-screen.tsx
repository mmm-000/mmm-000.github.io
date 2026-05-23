"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteFooter } from "./site-footer";

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

const DEFAULT_SPEED = 50;
const DEFAULT_SIZE = 100;

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
    customLogo: "カスタムロゴ",
    uploadLogo: "画像を選択",
    resetLogo: "デフォルトに戻す",
    customLogoAlt: "カスタムDVDロゴ",
    pause: "一時停止",
    resume: "再開",
    supportMessage: "☕ 開発者を応援する",
    about: "このサイトについて",
    privacy: "プライバシーポリシー",
    homeTitle: "DVD スリープ画面シミュレーター",
    homeLead:
      "平成のテレビや DVD プレーヤーにあった「DVD ロゴが画面内を跳ね返る」スリープ画面を、ブラウザで再現したサイトです。速度やロゴサイズの調整、カスタム画像の利用ができます。",
    homeNote:
      "本ページは鑑賞・操作を主目的としたコンテンツです。設定パネルは操作補助であり、サイトの説明はこのテキストおよび About ページに記載しています。"
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
    customLogo: "Custom logo",
    uploadLogo: "Choose image",
    resetLogo: "Reset to default",
    customLogoAlt: "Custom DVD logo",
    pause: "Pause",
    resume: "Resume",
    supportMessage: "☕ Support the developer",
    about: "About",
    privacy: "Privacy Policy",
    homeTitle: "DVD Sleep Screen Simulator",
    homeLead:
      "This site recreates the classic DVD logo screensaver that bounced around CRT TVs and DVD players. You can adjust speed, logo size, and upload your own image.",
    homeNote:
      "This page is primarily for viewing and interaction. Settings are controls only; site information is provided in this text and on the About page."
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
  const [logoAspectRatio, setLogoAspectRatio] = useState<number>(0.44);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [stageSize, setStageSize] = useState<Position>({ x: 0, y: 0 });

  const logoHeight = useMemo<number>(() => Math.round(logoWidth * logoAspectRatio), [logoWidth, logoAspectRatio]);
  const ratioValue = useMemo<number>(() => (screenRatio === "4:3" ? 4 / 3 : 16 / 9), [screenRatio]);
  const t = UI_TEXT[language];

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const defaultLogoSrc = `${basePath}/dvd-logo.png`;
  const resolvedLogoSrc = logoSrc || defaultLogoSrc;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setLogoAspectRatio(img.naturalHeight / img.naturalWidth);
      }
    };
    img.src = resolvedLogoSrc;
  }, [resolvedLogoSrc]);

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
      } else {
        previousTimeRef.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <main className="screen-root">
      <div ref={stageAreaRef} className="stage-area">
        <header className="home-intro">
          <h1>{t.homeTitle}</h1>
          <p>{t.homeLead}</p>
          <p className="home-intro-note">{t.homeNote}</p>
        </header>

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
            <img
              src={resolvedLogoSrc}
              alt={logoSrc ? t.customLogoAlt : "DVD logo"}
              className="dvd-image"
              style={{
                filter:
                  colorMode === "cycle"
                    ? `hue-rotate(${colorIndexRef.current * 45}deg) saturate(1.3)`
                    : "none"
              }}
            />
          </div>
        </section>

        <nav className="home-site-bar" aria-label="Site pages">
          <Link href="/about/" className="home-site-bar-link">
            {t.about}
          </Link>
          <Link href="/privacy/" className="home-site-bar-link">
            {t.privacy}
          </Link>
        </nav>
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

          <div className="logo-upload-group">
            <span>{t.customLogo}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="file-input-hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target?.result;
                  if (typeof result === "string") setLogoSrc(result);
                };
                reader.readAsDataURL(file);
              }}
            />
            <button
              type="button"
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
            >
              {t.uploadLogo}
            </button>
            {logoSrc && (
              <button
                type="button"
                className="reset-button"
                onClick={() => {
                  setLogoSrc("");
                  setLogoAspectRatio(0.44);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                {t.resetLogo}
              </button>
            )}
          </div>

          <button className="pause-button" onClick={() => setIsPaused((current) => !current)} type="button">
            {isPaused ? t.resume : t.pause}
          </button>

          <a
            href="https://ofuse.me/04b98ddd"
            target="_blank"
            rel="noopener noreferrer"
            className="support-link"
          >
            {t.supportMessage}
          </a>

          <SiteFooter aboutLabel={t.about} privacyLabel={t.privacy} />
        </div>
      </aside>
    </main>
  );
}
