import { Outlet } from "react-router-dom"
import CustomCursor from "./CustomCursor"
import useMouseParallax from "../hooks/useMouseParallax"

export default function PublicLayout() {
  useMouseParallax({ customCursor: true })

  return (
    <div
      className="min-h-screen bg-[#0a0a0a]"
      style={{
        backgroundImage: "url('/bgelement.jpg')",
        backgroundSize: "100% auto",
        backgroundPosition: "top center",
        backgroundRepeat: "repeat-y",
      }}
    >
      <CustomCursor />
      <Outlet />
    </div>
  )
}
