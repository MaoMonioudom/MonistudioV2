import { useState } from "react";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";
import { FaInstagram, FaGithub } from "react-icons/fa";

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Menu items and their routes
  const menuLinks = {
    Works: "/works",
    Services: "/service",
    About: "/about",
    Contact: "/contact",
  };

  const menuItems = Object.keys(menuLinks);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Moni Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 text-white font-bold uppercase tracking-wider text-sm">
          {menuItems.map((item) => (
            <li key={item} className="hover:opacity-60 cursor-pointer">
              <Link to={menuLinks[item]}>{item}</Link>
            </li>
          ))}
        </ul>

        {/* Social Icons */}
        <div className="hidden md:flex gap-4">
          {/* <a href="https://instagram.com" target="_blank" className="text-white hover:opacity-60">
            <FaInstagram />
          </a>
          <a href="https://github.com" target="_blank" className="text-white hover:opacity-60">
            <FaGithub />
          </a> */}
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
        <div className="md:hidden bg-black px-6 pb-6">
          <ul className="flex flex-col gap-6 text-white font-bold uppercase tracking-wider text-sm">
            {menuItems.map((item) => (
              <li key={item} className="hover:opacity-60 cursor-pointer">
                <Link to={menuLinks[item]} onClick={() => setOpen(false)}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
