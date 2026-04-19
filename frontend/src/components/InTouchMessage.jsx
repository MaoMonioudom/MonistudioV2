import { Link } from "react-router-dom"

export default function HomeContact() {
	return (
		<section className="bg-black py-16 md:py-20 px-4 md:px-6 border-t border-white/10">
			<div className="max-w-5xl mx-auto text-center">
				<p className="text-xs md:text-sm tracking-[0.24em] uppercase text-white/60 mb-3">
					Get In Touch
				</p>

				<h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">
					Let&apos;s Build Something Meaningful Together
				</h2>

				<p className="text-white/75 text-sm md:text-lg max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed">
					Whether you need creative visuals, a polished brand story, or a modern website,
					we are ready to help bring your ideas to life with clarity and impact.
				</p>

				<Link
					to="/contact"
					className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm md:text-base font-semibold bg-white text-black hover:bg-white/90 transition duration-300"
				>
					Contact Us
				</Link>
			</div>
		</section>
	)
}
