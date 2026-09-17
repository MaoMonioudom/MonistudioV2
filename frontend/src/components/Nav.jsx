import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi";

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Center nav links
  const menuLinks = {
    Home: "/",
    Portfolio: "/portfolio",
    Services: "/service",
    About: "/about",
  };

  const menuItems = Object.keys(menuLinks);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Moni Logo" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 text-white font-bold uppercase tracking-wider text-sm">
          {menuItems.map((item) => (
            <li key={item} className="hover:text-brand-green transition-colors duration-300 cursor-pointer">
              <Link to={menuLinks[item]}>{item}</Link>
            </li>
          ))}
        </ul>

        {/* Right-side actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/contact"
            className="text-white font-bold uppercase tracking-wider text-sm hover:text-brand-green transition-colors duration-300"
          >
            Contact
          </Link>
          <a
            href="/portfolio.pdf"
            download
            className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-colors duration-300"
          >
            <FiDownload size={16} />
            Download Portfolio
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0a0a0a] px-6 pb-6">
          <ul className="flex flex-col gap-6 text-white font-bold uppercase tracking-wider text-sm">
            {menuItems.map((item) => (
              <li key={item} className="hover:text-brand-green transition-colors duration-300 cursor-pointer">
                <Link to={menuLinks[item]} onClick={() => setOpen(false)}>
                  {item}
                </Link>
              </li>
            ))}
            <li className="hover:text-brand-green transition-colors duration-300 cursor-pointer">
              <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            </li>
          </ul>
          <a
            href="/portfolio.pdf"
            download
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-brand-green text-white px-4 py-3 rounded-full text-sm font-bold hover:bg-white hover:text-black transition-colors duration-300"
          >
            <FiDownload size={16} />
            Download Portfolio
          </a>
        </div>
      )}
    </header>
  );
}
