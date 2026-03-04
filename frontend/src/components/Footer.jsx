import { FaInstagram, FaFacebook, FaLinkedin, FaTiktok } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] py-8 text-center">
      {/* Studio Name / Copyright */}
      <p className="text-gray-400 mb-4">
        Moni Studio © 2026
      </p>

      {/* Social media icons */}
      <div className="flex justify-center gap-6 text-2xl">
        <a href="https://www.facebook.com/profile.php?id=61572323304102" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
          <FaFacebook />
        </a>
        <a href="https://www.instagram.com/moni.img/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
          <FaInstagram />
        </a>
        <a href="https://www.tiktok.com/@moniimagestudio" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
          <FaTiktok />
        </a>
        <a href="https://www.linkedin.com/company/moni-image-studio/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
          <FaLinkedin />
        </a>
      </div>

      {/* Optional Email */}
      <p className="text-gray-400 mt-4">
        <a href="mailto:monistudio@example.com" className="hover:underline text-gray-400">
          monirathnakmao@gmail.com
        </a>
      </p>
    </footer>
  )
}
