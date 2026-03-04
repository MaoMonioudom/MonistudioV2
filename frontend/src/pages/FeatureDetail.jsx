import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const FeatureDetail = () => {
    const { id } = useParams();
    const [feature, setFeature] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeature = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/features/${id}`);
                setFeature(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching feature details:", error);
                setLoading(false);
            }
        };

        fetchFeature();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <p className="text-xl text-gray-400">Loading details...</p>
            </div>
        );
    }

    if (!feature) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
                <p className="text-xl text-gray-400 mb-4">Feature not found.</p>
                <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Nav />
            <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
                <Link to="/" className="text-gray-400 hover:text-white mb-6 inline-block transition">&larr; Back to Home</Link>
                
                <div className="grid md:grid-cols-2 gap-10 mt-6">
                    {/* Main Image */}
                    <div>
                        {feature.imageUrl ? (
                            <img 
                                src={feature.imageUrl} 
                                alt={feature.title} 
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
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{feature.title}</h1>
                        {feature.serviceId && (
                            <Link 
                                to={`/service/${feature.serviceId._id}`}
                                className="inline-block bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full mb-4 hover:bg-blue-600/30 transition"
                            >
                                {feature.serviceId.title || "Service"}
                            </Link>
                        )}
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {feature.description}
                        </p>
                        
                        {feature.detailDescription && (
                            <div className="text-gray-400">
                                <h3 className="text-xl font-semibold text-white mb-2">More Details</h3>
                                <p className="whitespace-pre-line leading-relaxed">{feature.detailDescription}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Images Gallery */}
                {feature.moreImages && feature.moreImages.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {feature.moreImages.map((img, index) => (
                                <div key={index} className="rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition">
                                    <img 
                                        src={img} 
                                        alt={`${feature.title} gallery ${index + 1}`} 
                                        className="w-full h-64 object-cover hover:scale-105 transition duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default FeatureDetail;
