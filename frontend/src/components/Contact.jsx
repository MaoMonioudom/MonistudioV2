import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa"

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 px-4 bg-[#0a0a0a] text-white"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Contact Us</h2>
        <p className="text-gray-400 mb-6">
          Have a project or idea in mind? Reach out to us and let's create something amazing together!
        </p>

        {/* Contact email */}
        <p className="text-lg mb-6">
          <span className="font-bold">Email: </span>
          <a href="mailto:monistudio@example.com" className="text-blue-400 hover:underline">
            monistudio@example.com
          </a>
        </p>

        {/* Social links */}
        <div className="flex justify-center gap-6 mb-8 text-2xl">
          <a href="#" aria-label="Instagram" className="hover:text-blue-400">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-blue-400">
            <FaFacebook />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-400">
            <FaLinkedin />
          </a>
        </div>

        {/* Optional small form */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 rounded bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none"
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            className="p-3 rounded bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}
