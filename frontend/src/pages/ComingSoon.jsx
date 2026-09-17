import { Link } from "react-router-dom"
import Seo from "../components/Seo.jsx"
import Nav from "../components/Nav.jsx"
import Footer from "../components/Footer.jsx"
import SmokeWisp from "../components/SmokeWisp.jsx"

export default function ComingSoon() {
  return (
    <>
      <Seo
        title="Coming Soon | Moni Image Studio"
        description="This page is coming soon."
        path="/coming-soon"
      />
      <Nav />

      <section className="relative isolate overflow-hidden min-h-screen bg-[#0a0a0a] pt-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="absolute -z-10 -top-24 -right-24 w-[45%] h-[400px] bg-brand-green/15 blur-[150px] rounded-full pointer-events-none"></div>
        <SmokeWisp flip rotate={-12} className="absolute -z-10 top-[10%] left-[12%] w-[90px] h-[85%] pointer-events-none" />
        <SmokeWisp rotate={14} className="absolute -z-10 bottom-10 right-[12%] w-[65px] h-[150px] pointer-events-none" />
        <SmokeWisp color="#f8f8f8" rotate={-8} className="absolute -z-10 top-20 right-[35%] w-[55px] h-[130px] pointer-events-none" />

        {/* Cute camera illustration */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 200 200"
          className="mb-8 drop-shadow-[0_0_30px_rgba(62,161,8,0.25)]"
          aria-hidden="true"
        >
          {/* strap */}
          <path d="M55 55 L75 30 M145 55 L125 30" stroke="#3ea108" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* body */}
          <rect x="30" y="55" width="140" height="100" rx="20" fill="#3ea108" />
          {/* viewfinder bump */}
          <rect x="75" y="35" width="50" height="24" rx="8" fill="#3ea108" />
          {/* lens outer */}
          <circle cx="100" cy="108" r="38" fill="#0a0a0a" />
          <circle cx="100" cy="108" r="30" fill="#3ea108" opacity="0.35" />
          <circle cx="100" cy="108" r="22" fill="#0a0a0a" />
          {/* eyes in the lens, for the "cute" factor */}
          <circle cx="90" cy="104" r="4" fill="#f8f8f8" />
          <circle cx="110" cy="104" r="4" fill="#f8f8f8" />
          {/* smile */}
          <path d="M91 116 Q100 123 109 116" stroke="#f8f8f8" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* flash */}
          <rect x="140" y="68" width="16" height="12" rx="3" fill="#f8f8f8" opacity="0.85" />
          {/* sparkles */}
          <path d="M30 40 L33 47 L40 50 L33 53 L30 60 L27 53 L20 50 L27 47 Z" fill="#f8f8f8" opacity="0.8" />
          <path d="M165 130 L167 135 L172 137 L167 139 L165 144 L163 139 L158 137 L163 135 Z" fill="#f8f8f8" opacity="0.7" />
        </svg>

        <div className="w-12 h-1 bg-brand-green rounded-full mx-auto mb-4"></div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Coming Soon
        </h1>
        <p className="text-brand-white max-w-xl mx-auto mb-10">
          We&apos;re putting the finishing touches on this page. Check back soon!
        </p>

        <Link
          to="/"
          className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-brand-green hover:text-white transition-colors duration-300"
        >
          Back to Home
        </Link>
      </section>

      <Footer />
    </>
  )
}
