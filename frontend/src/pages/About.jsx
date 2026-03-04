import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import studioImage from "../assets/heroImg.jpg";
import teamImage from "../assets/temp.webp";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function About() {
  const [current, setCurrent] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  const member = team[current] || {};

  const prev = () => setCurrent((current - 1 + team.length) % team.length);
  const next = () => setCurrent((current + 1) % team.length);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${API_URL}/team-activities`);
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching team activities:', error);
      } finally {
        setLoadingActivities(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/team-members`);
        setTeam(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoadingTeam(false);
      }
    };
    fetchTeamMembers();
  }, []);

  return (
    <>
      <Nav />

      <section className="bg-[#0a0a0a] pt-32 px-6">
        {/* Page Title */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            About Us
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            A creative studio driven by passion, storytelling, and visual excellence.
          </p>
        </div>

        {/* Studio Story */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="overflow-hidden rounded-xl">
            <img
              src={studioImage}
              alt="Studio"
              className="w-full h-96 object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Moni Image Studio was founded with a simple belief, every image
              should tell a story. From intimate portraits to large-scale
              productions, we focus on emotion, detail, and authenticity.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We collaborate closely with our clients to transform ideas into
              visuals that feel timeless and meaningful.
            </p>
          </div>
        </div>

        {/* Team Slider */}
        {loadingTeam ? (
          <div className="max-w-6xl mx-auto flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : team.length === 0 ? (
          <div className="max-w-6xl mx-auto text-center py-12">
            <p className="text-gray-400">No team members to display yet.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto bg-[#0a0a0a] rounded-xl overflow-hidden relative flex flex-col md:flex-row">
            {/* Left Arrow Button */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition duration-300"
              aria-label="Previous team member"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition duration-300"
              aria-label="Next team member"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {team.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition duration-300 ${
                    index === current ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to team member ${index + 1}`}
                />
              ))}
            </div>

            {/* Image */}
            <div className="md:w-1/2 w-full overflow-hidden">
              <img
                src={member.imageUrl || teamImage}
                alt={member.name}
                className="w-full h-full object-cover transition duration-500"
              />
            </div>

            {/* Text */}
            <div className="md:w-1/2 w-full p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-4">{member.name}</h2>
              <p className="text-gray-400 mb-4">{member.role}</p>
              <p className="text-gray-400 leading-relaxed">{member.bio}</p>
            </div>
          </div>
        )}
      </section>
      {/* Team Activities */}
<section className="bg-[#0a0a0a] py-20 px-6">
  {/* Section Title */}
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-white">Team Activities</h2>
    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
      Behind the scenes: our team in action at events, shoots, and travels.
    </p>
  </div>

  {/* Activities Grid */}
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {loadingActivities ? (
      <div className="col-span-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    ) : activities.length === 0 ? (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-400">No activities to display yet.</p>
      </div>
    ) : (
      activities.map((activity) => (
        <div key={activity._id} className="overflow-hidden rounded-lg bg-[#111] group cursor-pointer">
          <img
            src={activity.imageUrl || teamImage}
            alt={activity.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="p-4">
            <h3 className="text-white font-bold text-lg">{activity.title}</h3>
            <p className="text-gray-400 text-sm mt-1">
              {activity.description}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
</section>

      <Footer />
    </>
  );
}
