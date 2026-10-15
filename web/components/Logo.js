'use client';

export default function Logo({ size = 44, showText = true }) {
  return (
    <div className="logo-wrap">
      <svg
        className="logo-mark"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lgTile" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#C7000B" />
            <stop offset="0.5" stopColor="#E63946" />
            <stop offset="1" stopColor="#ED6D00" />
          </linearGradient>
          <linearGradient id="lgShine" x1="24" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 实心渐变底板 */}
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#lgTile)" />
        {/* 顶部高光，增强立体质感 */}
        <rect x="2" y="2" width="44" height="24" rx="12" fill="url(#lgShine)" />
        {/* 主星芒：AI 智能符号 */}
        <path
          d="M22 11 Q24.2 21 33 24 Q24.2 27 22 37 Q19.8 27 11 24 Q19.8 21 22 11 Z"
          fill="#ffffff"
        />
        {/* 副星芒 */}
        <path
          d="M34.5 9 Q35.5 13 39.5 14 Q35.5 15 34.5 19 Q33.5 15 29.5 14 Q33.5 13 34.5 9 Z"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* 数据节点 */}
        <circle cx="35" cy="33" r="2.5" fill="#ffffff" opacity="0.85" />
      </svg>
      {showText && (
        <div className="logo-text">
          <span className="logo-title">数智咨询实验室</span>
          <span className="logo-sub">DigIntel Lab</span>
        </div>
      )}
    </div>
  );
}
