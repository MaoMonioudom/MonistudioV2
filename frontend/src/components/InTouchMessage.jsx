import { Link } from "react-router-dom"
import SmokeWisp from "./SmokeWisp"
import useInView from "../hooks/useInView"

export default function HomeContact() {
	const [ref, inView] = useInView()

	return (
		<section ref={ref} className={`relative isolate bg-[#0a0a0a] py-16 md:py-20 px-4 md:px-6 border-t border-white/10 overflow-hidden reveal ${inView ? "in-view" : ""}`}>
			<SmokeWisp rotate={6} className="absolute -z-10 top-[4%] left-1/2 -translate-x-1/2 w-[100px] h-[90%] pointer-events-none" />
			<SmokeWisp flip rotate={16} className="absolute -z-10 bottom-4 right-[10%] w-[65px] h-[150px] pointer-events-none" />
			<SmokeWisp color="#f8f8f8" rotate={-6} className="absolute -z-10 bottom-6 left-[25%] w-[55px] h-[130px] pointer-events-none" />
			<div className="relative max-w-5xl mx-auto text-center">
				<p className="text-xs md:text-sm tracking-[0.24em] uppercase text-white/60 mb-3">
					Get In Touch
				</p>

				<h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 hover:text-brand-green transition-colors duration-300 cursor-default">
					Let&apos;s Build Something Meaningful Together
				</h2>

				<p className="text-white/75 text-sm md:text-lg max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed">
					Whether you need creative visuals, a polished brand story, or a modern website,
					we are ready to help bring your ideas to life with clarity and impact.
				</p>

				<Link
					to="/contact"
					className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm md:text-base font-semibold bg-white text-black hover:bg-brand-green hover:text-white transition-colors duration-300"
				>
					Contact Us
				</Link>
			</div>
		</section>
	)
}
