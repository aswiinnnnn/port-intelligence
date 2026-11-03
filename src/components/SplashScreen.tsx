import React, { useEffect, useRef, useState } from 'react';
import { t } from '../i18n';
import { activePort } from '../ports';
import { BARCELONA_MARK_BAR, BARCELONA_MARK_TRANSFORM, BARCELONA_MARK_WAVE } from './BarcelonaLogo';

// Each port's mark, drawn in the outline-then-fill sequence: [light shape, blue shape]
const MARK = activePort.id === 'barcelona'
  ? { viewBox: '-4 -4 40 40', transform: BARCELONA_MARK_TRANSFORM, a: BARCELONA_MARK_BAR, b: BARCELONA_MARK_WAVE }
  : { viewBox: '88 24 40 40', transform: undefined, a: 'M106.5,29L106.5,51L93.5,51ZM109.5,35L109.5,51L120,51Z', b: 'M92,54L124,54L118.5,61L97.5,61Z' };

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * One-time entrance sequence, shown once per session on first load.
 * Frequency: rare (once) — a full expressive treatment is appropriate here,
 * unlike anything in the day-to-day dashboard which stays fast/restrained.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reducedMotion.current) {
      // Skip the show entirely — respect the user's preference, don't just speed it up.
      const t = setTimeout(onFinish, 200);
      return () => clearTimeout(t);
    }

    const exitTimer = setTimeout(() => setPhase('out'), 3500);
    const finishTimer = setTimeout(onFinish, 4150);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  if (reducedMotion.current) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          backgroundColor: '#f4f7f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span style={{ color: '#1e293b', fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 600 }}>
          {t("Port of Oman")}</span>
      </div>
    );
  }

  return (
    <div className={`splash-root splash-${phase}`}>
      <style>{`
        @keyframes splash-wave-sweep {
          0% { transform: translateX(0%) translateY(0); }
          100% { transform: translateX(-25%) translateY(0); }
        }
        @keyframes splash-mark-draw {
          0% { stroke-dashoffset: 340; opacity: 0; }
          8% { opacity: 1; }
          65% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes splash-mark-fill {
          0%, 60% { fill-opacity: 0; }
          100% { fill-opacity: 1; }
        }
        @keyframes splash-word-up {
          0% { opacity: 0; transform: translateY(14px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes splash-rule-grow {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes splash-glow-pulse {
          0% { opacity: 0.15; transform: scale(0.85); }
          100% { opacity: 0.35; transform: scale(1); }
        }
        @keyframes splash-dot-fade {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }

        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(120% 120% at 50% 20%, #ffffff 0%, #eef3f4 45%, #e4ebec 100%);
        }

        .splash-glow {
          position: absolute;
          width: 60vmax;
          height: 60vmax;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.14) 0%, rgba(37, 99, 235, 0) 70%);
          animation: splash-glow-pulse 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          filter: blur(10px);
        }

        .splash-waves {
          position: absolute;
          inset: 0;
          opacity: 0.5;
        }

        .splash-wave-layer {
          position: absolute;
          left: -25%;
          right: -25%;
          bottom: 0;
          width: 150%;
          height: 42%;
        }

        .splash-wave-layer svg {
          width: 100%;
          height: 100%;
        }

        .splash-wave-1 {
          animation: splash-wave-sweep 14s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
          opacity: 0.16;
        }
        .splash-wave-2 {
          animation: splash-wave-sweep 18s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate-reverse;
          opacity: 0.1;
          bottom: -4%;
        }

        .splash-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }

        .splash-mark {
          width: 72px;
          height: 74px;
          overflow: visible;
        }

        .splash-mark path.stroke {
          fill: none;
          stroke: #2563eb;
          stroke-width: 2.4;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 340;
          animation: splash-mark-draw 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .splash-mark path.fill-a {
          fill: #ffffff;
          fill-opacity: 0;
          animation: splash-mark-fill 0.6s ease-out 1.15s forwards;
        }
        .splash-mark path.fill-b {
          fill: #2563eb;
          fill-opacity: 0;
          animation: splash-mark-fill 0.6s ease-out 1.3s forwards;
        }

        .splash-wordmark {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .splash-title {
          font-family: var(--font-sans);
          font-size: 26px;
          font-weight: 600;
          color: #1e293b;
          letter-spacing: -0.3px;
          opacity: 0;
          animation: splash-word-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.35s forwards;
          animation-fill-mode: backwards;
        }

        .splash-rule {
          width: 46px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #2563eb, transparent);
          transform-origin: center;
          opacity: 0;
          animation: splash-rule-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.6s forwards;
          animation-fill-mode: backwards;
        }

        .splash-subtitle {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(30, 41, 59, 0.5);
          opacity: 0;
          animation: splash-word-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.75s forwards;
          animation-fill-mode: backwards;
        }

        .splash-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          opacity: 0;
          animation: splash-word-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2s forwards;
          animation-fill-mode: backwards;
        }

        .splash-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #2563eb;
        }
        .splash-dot:nth-child(1) { animation: splash-dot-fade 1.1s ease-in-out infinite; animation-delay: -0.6s; }
        .splash-dot:nth-child(2) { animation: splash-dot-fade 1.1s ease-in-out infinite; animation-delay: -0.3s; }
        .splash-dot:nth-child(3) { animation: splash-dot-fade 1.1s ease-in-out infinite; animation-delay: 0s; }

        .splash-status-text {
          font-family: var(--font-sans);
          font-size: 10px;
          color: rgba(30, 41, 59, 0.45);
          letter-spacing: 0.4px;
        }

        /* Clean opacity fade-out exit transition (no blur filter) */
        .splash-out {
          animation: splash-exit 0.65s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes splash-exit {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      <div className="splash-glow" />



      <div className="splash-content">
        <svg className="splash-mark" viewBox={MARK.viewBox} xmlns="http://www.w3.org/2000/svg">
          <g transform={MARK.transform}>
            <path className="stroke" d={MARK.a} />
            <path className="stroke" d={MARK.b} />
            <path className="fill-a" d={MARK.a} />
            <path className="fill-b" d={MARK.b} />
          </g>
        </svg>

        <div className="splash-wordmark">
          <div className="splash-title">{t("Port of Oman")}</div>
          <div className="splash-rule" />
          <div className="splash-subtitle">{t("Operations Platform")}</div>
        </div>

        <div className="splash-status">
          <span className="splash-dot" />
          <span className="splash-dot" />
          <span className="splash-dot" />
          <span className="splash-status-text">{t("Initializing harbor systems")}</span>
        </div>
      </div>
    </div>
  );
};
