export default function GlowBackdrop({
  className = "",
  width = 700,
  height = 500,
  rotate = -20,
  color = "#3ea108",
  opacity = 0.5,
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 blur-[70px] ${className}`}
      style={{
        width,
        height,
        opacity,
        transform: `rotate(${rotate}deg)`,
        background: `
          radial-gradient(ellipse 45% 85% at 30% 15%, ${color} 0%, ${color}00 70%),
          radial-gradient(ellipse 40% 80% at 55% 48%, ${color} 0%, ${color}00 70%),
          radial-gradient(ellipse 35% 75% at 78% 82%, ${color} 0%, ${color}00 70%)
        `,
        mixBlendMode: "screen",
      }}
    />
  )
}

export function GrainOverlay({ opacity = 0.05, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      style={{
        opacity,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}
