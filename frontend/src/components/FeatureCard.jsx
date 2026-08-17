import { Link } from "react-router-dom"
import useInView from "../hooks/useInView"

export default function FeatureCard({ project, delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0, rootMargin: "0px 0px -10% 0px" })

  return (
    <Link
      ref={ref}
      to={`/feature/${project._id}`}
      className={`group cursor-pointer block card-reveal ${inView ? "in-view" : ""}`}
      style={{ transitionDelay: inView ? `${delay}s` : "0s" }}
    >
      {/* Image */}
      <div className="overflow-hidden rounded-lg relative">
        <img
          src={project.imageUrl}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
        />
        {/* Category Badge */}
        {project.serviceId && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {project.serviceId.title}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-white text-xl font-bold group-hover:text-brand-green transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-400 mt-1 line-clamp-2">
          {project.description}
        </p>
      </div>
    </Link>
  )
}
