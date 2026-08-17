export default function SmokeWisp({ className = "", flip = false, rotate = 0, depth = 12, color = "#3ea108" }) {
  const innerTransforms = [flip ? "scaleX(-1)" : null, rotate ? `rotate(${rotate}deg)` : null].filter(Boolean);
  const swayDelay = `${(Math.abs(rotate) % 5)}s`;
  const swayDuration = `${7 + (Math.abs(rotate) % 4)}s`;

  return (
    <div
      className={`${className} smoke-wisp-parallax`}
      style={{ transform: `translate(calc(var(--mx, 0) * ${depth}px), calc(var(--my, 0) * ${depth}px))` }}
    >
      <svg
        viewBox="0 0 200 320"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={innerTransforms.length ? { transform: innerTransforms.join(" ") } : undefined}
        aria-hidden="true"
      >
        <g
          className="smoke-wisp-sway"
          style={{ animationDelay: swayDelay, animationDuration: swayDuration }}
        >
          <path
            d="M30,0 C70,50 10,90 55,140 C90,180 20,220 60,260 C85,290 50,300 70,320"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M50,5 C90,55 30,95 75,145 C110,185 40,225 80,265 C105,295 70,305 90,320"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M70,10 C110,60 50,100 95,150 C130,190 60,230 100,270 C125,300 90,308 108,320"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
          />
        </g>
      </svg>
    </div>
  );
}
