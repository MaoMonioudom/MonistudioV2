import SmokeWisp from "./SmokeWisp"
import TestimonialCard from "./TestimonialCard"
import useInView from "../hooks/useInView"

const testimonials = [
  {
    name: "Ms. Noah Sy",
    role: "Place Holder",
    quote:
      "What an amazing studio, with amazing sweet talented team, professional photographer and very convenient location. Very highly recommended for any occasion.",
  },
  {
    name: "Mr. Sovannaroth Ing",
    role: "Place Holder",
    quote:
      "I used to on my Facebook page seeking for a freelance to take photos of my birdnest products. Then I got to know him. Have worked with him twice. Love his work.",
  },
  {
    name: "Alex Entertainment",
    role: "Place Holder",
    quote:
      " Love working with Moni Image Studio! They understand the vision, bring great creativity, and make every project look amazing. Happy to have the team on most of the wedding project with us. We are now long term partner.",
  },
]

export default function Testimonials() {
  const [ref, inView] = useInView()

  return (
    <section ref={ref} className={`relative isolate overflow-hidden py-20 px-6 bg-[#0a0a0a] reveal ${inView ? "in-view" : ""}`}>
      <SmokeWisp rotate={-6} className="absolute -z-10 top-[3%] left-[42%] w-[100px] h-[92%] pointer-events-none" />
      <SmokeWisp flip rotate={12} className="absolute -z-10 bottom-8 right-[10%] w-[70px] h-[160px] pointer-events-none" />
      <SmokeWisp color="#f8f8f8" flip rotate={7} className="absolute -z-10 top-10 right-[30%] w-[60px] h-[150px] pointer-events-none" />
      <div className="text-center mb-16">
        <div className="w-12 h-1 bg-brand-green rounded-full mx-auto mb-4"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-white hover:text-brand-green transition-colors duration-300 inline-block cursor-default">
          What Our Clients Say
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Real feedback from clients we&apos;ve had the pleasure of working with.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} delay={index * 0.12} />
        ))}
      </div>
    </section>
  )
}
