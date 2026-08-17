import useInView from "../hooks/useInView"

export default function TestimonialCard({ testimonial, delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0, rootMargin: "0px 0px -10% 0px" })

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-black/40 border border-white/10 rounded-xl p-8 hover:border-brand-green/50 transition-colors duration-300 card-reveal ${inView ? "in-view" : ""}`}
      style={{ transitionDelay: inView ? `${delay}s` : "0s" }}
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-green via-brand-white/40 to-transparent"></div>
      <p className="text-brand-green text-3xl font-serif leading-none mb-3">&ldquo;</p>
      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        {testimonial.quote}
      </p>
      <div>
        <p className="text-white font-bold">{testimonial.name}</p>
        <p className="text-gray-500 text-sm">{testimonial.role}</p>
      </div>
    </div>
  )
}
