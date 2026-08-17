export default function CustomCursor() {
  return (
    <div
      className="custom-cursor-dot fixed top-0 left-0 z-[100] w-5 h-5 rounded-full bg-brand-green pointer-events-none mix-blend-screen"
      style={{
        transform: "translate3d(calc(var(--cursor-x, -100px) - 10px), calc(var(--cursor-y, -100px) - 10px), 0)",
      }}
    >
      <div className="w-full h-full rounded-full bg-brand-green blur-[6px] opacity-80"></div>
    </div>
  )
}
