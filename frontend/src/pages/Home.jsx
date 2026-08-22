import Seo from "../components/Seo"
import Nav from "../components/Nav"
import Hero from "../components/Hero"
import AboutTeaser from "../components/AboutTeaser"
import Gallery from "../components/Gallery"
import Service from "../components/Service"
import TrustedBy from "../components/TrustedBy"
import Testimonials from "../components/Testimonials"
import InTouchMessage from "../components/InTouchMessage"
// import Contact from "../components/Contact"
import Footer from "../components/Footer"
import CustomCursor from "../components/CustomCursor"
import useMouseParallax from "../hooks/useMouseParallax"

const Home = () => {
  useMouseParallax({ customCursor: true })

  return (
    <div
      className="min-h-screen bg-[#0a0a0a]"
      style={{
        backgroundImage: "url('/bgelement.jpg')",
        backgroundSize: "100% auto",
        backgroundPosition: "top center",
        backgroundRepeat: "repeat-y",
      }}
    >
        <Seo
          title="Moni Image Studio | Professional Photography & Imaging Services"
          description="Moni Image Studio offers professional portrait, event, product, and commercial photography services. View our portfolio and book a session today."
          path="/"
        />
        <CustomCursor />
        <Nav />
        <Hero />
        <TrustedBy />
        <Gallery />
        <Service />
        <Testimonials />
        <InTouchMessage />
        <Footer />
        <AboutTeaser />
    </div>
  )
}

export default Home
