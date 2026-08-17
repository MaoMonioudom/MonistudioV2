import { Link } from "react-router-dom"
import useInView from "../hooks/useInView"

export default function ServiceCard({ service, delay = 0, extraClassName = "" }) {
  const [ref, inView] = useInView({ threshold: 0, rootMargin: "0px 0px -10% 0px" })

  return (
    <Link
      ref={ref}
      to={`/service/${service._id}`}
      className={`group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-brand-green/50 transition cursor-pointer card-reveal ${extraClassName} ${inView ? "in-view" : ""}`}
      style={{ transitionDelay: inView ? `${delay}s` : "0s" }}
    >
      {/* Image */}
      {service.imageUrl && (
        <div className="overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white font-bold text-xl mb-3">
          {service.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
    </Link>
  )
}
