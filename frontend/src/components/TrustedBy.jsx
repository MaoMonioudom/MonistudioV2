import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function TrustedBy() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [])

  if (loading) {
    return (
      <section className="trusted-by-section  py-10 md:py-12 px-4 md:px-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/80"></div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) {
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
    <section className="trusted-by-section relative overflow-hidden py-10 md:py-12 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-7 md:mb-9">
          <p className="text-[11px] md:text-xs tracking-[0.32em] font-semibold uppercase text-white/60 mb-2">
            Partnerships
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white">
          Trusted By
          </h2>
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        <div className="relative trusted-by-fade-edges">
          <div className="trusted-by-track trusted-by-track-row-1 flex items-center gap-5 md:gap-8 w-max px-4 md:px-6">
            {firstMarqueePartners.map((partner, index) => (
              <a
                key={`row1-${partner._id}-${index}`}
                href={partner.website || '#'}
                target={partner.website ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`group h-20 md:h-24 min-w-[170px] md:min-w-[220px] px-5 md:px-6 rounded-2xl bg-white/5 border border-white/15 shadow-[0_10px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                  partner.website ? 'cursor-pointer hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_14px_30px_rgba(0,0,0,0.45)]' : 'cursor-default'
                }`}
                onClick={(e) => !partner.website && e.preventDefault()}
                aria-label={partner.name}
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-10 md:max-h-12 w-auto object-contain opacity-85 group-hover:opacity-100 transition duration-300"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="relative trusted-by-fade-edges">
          <div className="trusted-by-track trusted-by-track-row-2 flex items-center gap-5 md:gap-8 w-max px-4 md:px-6">
            {secondMarqueePartners.map((partner, index) => (
              <a
                key={`row2-${partner._id}-${index}`}
                href={partner.website || '#'}
                target={partner.website ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`group h-20 md:h-24 min-w-[170px] md:min-w-[220px] px-5 md:px-6 rounded-2xl bg-white/5 border border-white/15 shadow-[0_10px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                  partner.website ? 'cursor-pointer hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_14px_30px_rgba(0,0,0,0.45)]' : 'cursor-default'
                }`}
                onClick={(e) => !partner.website && e.preventDefault()}
                aria-label={partner.name}
              >
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-10 md:max-h-12 w-auto object-contain opacity-85 group-hover:opacity-100 transition duration-300"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
