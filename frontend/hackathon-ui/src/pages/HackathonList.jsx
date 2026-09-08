import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HackathonList = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleApply = (hackathonId) => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(`/apply/${hackathonId}`);
        } else {
            navigate('/login', { state: { from: `/apply/${hackathonId}` } });
        }
    };

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const response = await axios.get('http://localhost:8080/hackathons');
                setHackathons(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des hackathons");
            } finally {
                setLoading(false);
            }
        };
        fetchHackathons();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Hackathons Disponibles</h1>
                        <p className="text-gray-500">Découvrez les défis technologiques du Ministère</p>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md font-medium text-sm">Tous</button>
                        <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-md text-sm">En cours</button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Icons.Loader2 className="animate-spin text-blue-600" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hackathons.map((hack) => (
                            <div key={hack.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="h-32 bg-plathon-blue relative">
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/30">
                                        {hack.theme}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{hack.title}</h3>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">{hack.description}</p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Icons.Calendar size={16} className="text-blue-500" />
                                            <span>{hack.startDate} au {hack.endDate}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Icons.MapPin size={16} className="text-blue-500" />
                                            <span>{hack.location}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleApply(hack.id)}
                                        className="w-full py-3 bg-gray-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold rounded-lg transition-colors border border-blue-100 hover:border-transparent flex items-center justify-center gap-2"
                                    >
                                        Postuler <Icons.ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default HackathonList;