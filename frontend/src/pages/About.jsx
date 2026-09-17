import { useState, useEffect } from "react";
import axios from "axios";
import Seo from "../components/Seo.jsx";
import Nav from "../components/Nav.jsx";
import SmokeWisp from "../components/SmokeWisp.jsx";
import Footer from "../components/Footer.jsx";
import studioImage from "../assets/logo.png";
import InTouchMessage from "../components/InTouchMessage.jsx";
import teamImage from "../assets/temp.webp";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function About() {
  const [activeCard, setActiveCard] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

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
      <Seo
        title="About Us | Moni Image Studio"
        description="Learn about Moni Image Studio, our team, and our approach to professional photography and imaging."
        path="/about"
      />
      <Nav />

      <section className="relative isolate overflow-hidden bg-[#0a0a0a] pt-32 px-6">
        <div className="absolute -z-10 -top-24 -right-24 w-[45%] h-[400px] bg-brand-green/15 blur-[150px] rounded-full pointer-events-none"></div>
        <SmokeWisp flip rotate={14} className="absolute -z-10 top-[4%] left-[12%] w-[95px] h-[92%] pointer-events-none" />
        <SmokeWisp rotate={-10} className="absolute -z-10 bottom-10 right-[14%] w-[65px] h-[150px] pointer-events-none" />
        <SmokeWisp color="#f8f8f8" rotate={6} className="absolute -z-10 top-14 right-[38%] w-[55px] h-[130px] pointer-events-none" />
        {/* Page Title */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            About Us
          </h1>
          <p className="text-brand-white mt-4 max-w-2xl mx-auto">
            A creative studio driven by passion, storytelling, and visual excellence.
          </p>
        </div>

        {/* Studio Story */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="overflow-hidden rounded-xl">
            <img
              src={studioImage}
              alt="Studio"
              loading="lazy"
              decoding="async"
              draggable="false"
              className="w-full h-auto md:h-96 object-contain md:object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-brand-white leading-relaxed mb-4">
              Moni Image Studio was founded with a simple belief, every image
              should tell a story. From intimate portraits to large-scale
              productions, we focus on emotion, detail, and authenticity.
            </p>
            <p className="text-brand-white leading-relaxed">
              We collaborate closely with our clients to transform ideas into
              visuals that feel timeless and meaningful.
            </p>
          </div>
        </div>
      </section>

      {/* Meet The Team */}
      <section className="bg-[#0a0a0a] py-20 px-6">
        <div className="text-center mb-16">
          <div className="w-12 h-1 bg-brand-green rounded-full mx-auto mb-4"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white hover:text-brand-green transition-colors duration-300 inline-block cursor-default">
            Meet The Team
          </h2>
          <p className="text-brand-white mt-4 max-w-2xl mx-auto">
            The people behind every shoot, story, and creative decision.
          </p>
        </div>

        {loadingTeam ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : team.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brand-white">No team members to display yet.</p>
          </div>
        ) : (
          <div className="max-w-[1360px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => {
              const isActive = activeCard === index
              return (
                <div
                  key={member._id || index}
                  onClick={() => setActiveCard(isActive ? null : index)}
                  className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer"
                >
                  <img
                    src={member.imageUrl || teamImage}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Name + role caption, always visible */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <h3 className="text-white font-bold text-lg leading-tight">{member.name}</h3>
                    <p className="text-brand-white text-sm">{member.role}</p>
                  </div>

                  {/* Bio overlay, revealed on hover (desktop) or tap (mobile) */}
                  <div
                    className={`absolute inset-0 bg-black/85 p-4 flex flex-col justify-center transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <h3 className="text-white font-bold text-lg mb-2">{member.name}</h3>
                    <p className="text-brand-green text-sm mb-3">{member.role}</p>
                    <p className="text-brand-white text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Team Activities */}
<section className="bg-[#0a0a0a] py-20 px-6">
  {/* Section Title */}
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-white">Team Activities</h2>
    <p className="text-brand-white mt-4 max-w-2xl mx-auto">
      Behind the scenes: our team in action at events, shoots, and travels.
    </p>
  </div>

  {/* Activities Grid */}
  <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {loadingActivities ? (
      <div className="col-span-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    ) : activities.length === 0 ? (
      <div className="col-span-full text-center py-12">
        <p className="text-brand-white">No activities to display yet.</p>
      </div>
    ) : (
      activities.map((activity) => (
        <div key={activity._id} className="overflow-hidden rounded-lg bg-[#111] group cursor-pointer">
          <div className="relative aspect-[4/3]">
            <img
              src={activity.imageUrl || teamImage}
              alt={activity.title}
              loading="lazy"
              decoding="async"
              draggable="false"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div className="p-4">
            <h3 className="text-white font-bold text-lg">{activity.title}</h3>
            <p className="text-brand-white text-sm mt-1">
              {activity.description}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
</section>
        <InTouchMessage />
      <Footer />
    </>
  );
}
