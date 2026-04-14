import Nav from "../components/Nav"
import Hero from "../components/Hero"
import Gallery from "../components/Gallery"
import Service from "../components/Service"
import TrustedBy from "../components/TrustedBy"
import HomeContact from "../components/HomeContact"
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
        <HomeContact />
        <Footer />
    </div>
  )
}

export default Home