import Nav from "../components/Nav"
import Hero from "../components/Hero"
import Gallery from "../components/Gallery"
import Service from "../components/Service"
import TrustedBy from "../components/TrustedBy"
import InTouchMessage from "../components/InTouchMessage"
// import Contact from "../components/Contact"
import Footer from "../components/Footer"
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
        <Nav />
        <Hero />
        <TrustedBy />
        <Gallery />
        <Service />
        <InTouchMessage />
        <Footer />
    </div>
  )
}

export default Home