import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiX } from "react-icons/fi";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FeatureDetail = () => {
    const { id } = useParams();
    const [feature, setFeature] = useState(null);
    const [relatedWorks, setRelatedWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchFeature = async () => {
            try {
                const response = await axios.get(`${API_URL}/features/${id}`);
                setFeature(response.data);
                
                // Fetch all features to find related works
                const allFeaturesResponse = await axios.get(`${API_URL}/features`);
                const allFeatures = allFeaturesResponse.data;
                
                // Filter related works by same service (excluding current feature)
                // Sort by title alphabetically for consistent ordering
                const related = allFeatures
                    .filter(f => f.serviceId?._id === response.data.serviceId?._id && f._id !== id)
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .slice(0, 3); // Show only 3 related works
                
                setRelatedWorks(related);
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
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                className="w-full h-auto rounded-xl shadow-lg object-cover cursor-pointer hover:opacity-90 transition"
                                onClick={() => setSelectedImage(feature.imageUrl)}
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
                        <h2 className="text-2xl font-bold text-white mb-8">Gallery</h2>
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                            {feature.moreImages.map((img, index) => (
                                <div 
                                    key={index} 
                                    className="mb-6 break-inside-avoid rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition cursor-pointer group"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${feature.title} gallery ${index + 1}`} 
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-auto object-contain group-hover:scale-105 transition duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Works Section */}
                {relatedWorks.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold text-white mb-8">Related Works</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                            {relatedWorks.slice(0, 3).map((work) => (
                                <Link 
                                    to={`/feature/${work._id}`} 
                                    key={work._id} 
                                    className="group cursor-pointer block"
                                >
                                    {/* Image */}
                                    <div className="overflow-hidden rounded-lg relative">
                                        <img
                                            src={work.imageUrl}
                                            alt={work.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        {/* Category Badge */}
                                        {work.serviceId && (
                                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                                {work.serviceId.title}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="mt-4">
                                        <h3 className="text-white text-xl font-bold group-hover:text-gray-300 transition">
                                            {work.title}
                                        </h3>
                                        <p className="text-gray-400 mt-1 line-clamp-2">
                                            {work.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center">
                            <Link 
                                to="/portfolio"
                                className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                            >
                                View All Works
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={selectedImage} 
                            alt="Full view" 
                            loading="eager"
                            decoding="async"
                            className="w-auto h-full max-h-[90vh] object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
                            aria-label="Close"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default FeatureDetail;
