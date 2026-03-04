import studioImage from "../assets/logo.jpg" // optional portrait or studio photo

export default function About() {
  return (
    <section className="py-20 px-4 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left: Image */}
        <div className="md:w-1/2">
          <img
            src={studioImage}
            alt="Studio"
            className="rounded-lg object-cover w-full h-80 md:h-full"
          />
        </div>

        {/* Right: Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About Moni Studio
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Moni Studio is a creative studio specializing in photography, design, and web solutions. 
            We focus on cinematic visuals and high-quality work to bring every project to life. 
            Our passion is telling stories through images and design, capturing the essence of each project.
          </p>
        </div>
      </div>
    </section>
  )
}
