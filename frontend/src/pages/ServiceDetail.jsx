import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, featuresRes] = await Promise.all([
          axios.get(`${API_URL}/services/${id}`),
          axios.get(`${API_URL}/features`)
        ]);
        setService(serviceRes.data);
        // Filter features that belong to this service
        const relatedFeatures = featuresRes.data.filter(
          (f) => f.serviceId?._id === id || f.serviceId === id
        );
        setFeatures(relatedFeatures);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <p className="text-xl text-gray-400 mb-4">Service not found.</p>
        <Link to="/service" className="text-blue-500 hover:underline">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <Link
          to="/service"
          className="text-gray-400 hover:text-white mb-6 inline-block transition"
        >
          &larr; Back to Services
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mt-6">
          {/* Main Image */}
          <div>
            {service.imageUrl ? (
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-auto rounded-xl shadow-lg object-cover"
              />
            ) : (
              <div className="w-full h-80 bg-gray-800 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {service.title}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* Related Features */}
        {features.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              Related Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Link
                  key={feature._id}
                  to={`/feature/${feature._id}`}
                  className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition"
                >
                  {feature.imageUrl && (
                    <div className="overflow-hidden">
                      <img
                        src={feature.imageUrl}
                        alt={feature.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
