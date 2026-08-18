import { useState, useEffect } from "react"
import axios from "axios"
import SmokeWisp from "./SmokeWisp"
import MarqueeRow from "./MarqueeRow"
import LazyImg from "./LazyImg"
import useInView from "../hooks/useInView"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function TrustedBy() {
  const [ref, inView] = useInView()
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!inView) return
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_URL}/partners`)
        setPartners(response.data)
      } catch (error) {
        console.error("Error fetching partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [inView])

  if (inView && !loading && partners.length === 0) {
    return null
  }

  const topRowPartners = partners.filter((_, index) => index % 2 === 0)
  const bottomRowPartners = partners.filter((_, index) => index % 2 === 1)

  const firstRowSource = topRowPartners.length > 0 ? topRowPartners : partners
  const secondRowSource =
    bottomRowPartners.length > 0
      ? bottomRowPartners
      : partners.length > 1
        ? [...partners.slice(1), partners[0]]
        : partners

  const firstMarqueePartners = [...firstRowSource, ...firstRowSource]
  const secondMarqueePartners = [...secondRowSource, ...secondRowSource]

  return (
    <section
      ref={ref}
      className={`trusted-by-section relative isolate overflow-hidden py-10 md:py-12 bg-transparent reveal ${inView ? "in-view" : ""}`}
    >
      <SmokeWisp rotate={8} className="absolute -z-10 top-[4%] right-[18%] w-[90px] h-[92%] pointer-events-none" />
      <SmokeWisp flip rotate={-14} className="absolute -z-10 bottom-1 left-[12%] w-[55px] h-[90px] pointer-events-none" />
      <SmokeWisp color="#f8f8f8" rotate={5} className="absolute -z-10 top-2 left-[45%] w-[50px] h-[85px] pointer-events-none" />

      {!inView || loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/80"></div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-7 md:mb-9">
              <p className="text-[11px] md:text-xs tracking-[0.32em] font-semibold uppercase text-white/60 mb-2">
                Partnerships
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-white hover:text-brand-green transition-colors duration-300 cursor-default">
              Trusted By
              </h2>
            </div>
          </div>

          <div className="space-y-4 md:space-y-5">
            <div className="relative trusted-by-fade-edges">
              <MarqueeRow
                items={firstMarqueePartners}
                speed={45}
                direction={1}
                renderItem={(partner, index, containerRef) => (
                  <a
                    key={`row1-${partner._id}-${index}`}
                    href={partner.website || '#'}
                    target={partner.website ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className={`group h-20 md:h-24 min-w-[170px] md:min-w-[220px] px-5 md:px-6 rounded-2xl bg-[#0a0a0a] flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      partner.website ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'
                    }`}
                    onClick={(e) => !partner.website && e.preventDefault()}
                    aria-label={partner.name}
                  >
                    <LazyImg
                      src={partner.logoUrl}
                      alt={partner.name}
                      containerRef={containerRef}
                      className="max-h-10 md:max-h-12 w-auto object-contain opacity-100"
                    />
                  </a>
                )}
              />
            </div>

            <div className="relative trusted-by-fade-edges">
              <MarqueeRow
                items={secondMarqueePartners}
                speed={38}
                direction={-1}
                renderItem={(partner, index, containerRef) => (
                  <a
                    key={`row2-${partner._id}-${index}`}
                    href={partner.website || '#'}
                    target={partner.website ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className={`group h-20 md:h-24 min-w-[170px] md:min-w-[220px] px-5 md:px-6 rounded-2xl bg-[#0a0a0a] flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      partner.website ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'
                    }`}
                    onClick={(e) => !partner.website && e.preventDefault()}
                    aria-label={partner.name}
                  >
                    <LazyImg
                      src={partner.logoUrl}
                      alt={partner.name}
                      containerRef={containerRef}
                      className="max-h-10 md:max-h-12 w-auto object-contain opacity-100"
                    />
                  </a>
                )}
              />
            </div>
          </div>
        </>
      )}
    </section>
  )
}
