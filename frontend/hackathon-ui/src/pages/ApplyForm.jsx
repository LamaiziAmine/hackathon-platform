import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Icons from 'lucide-react';
import Navbar from '../components/Navbar';

const ApplyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [motivation, setMotivation] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: `/apply/${id}` } });
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Vous devez être connecté pour postuler");
            navigate('/login');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('userId', 1); // À remplacer plus tard par l'ID réel extrait du Token
        formData.append('hackathonId', id);
        formData.append('motivation', motivation);
        formData.append('file', file);

        try {
            await axios.post('http://localhost:8080/applications/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Candidature envoyée avec succès !");
            navigate('/');
        } catch (err) {
            alert("Erreur lors de l'envoi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-16">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 mb-8 transition-colors">
                    <Icons.ChevronLeft size={20} /> Retour
                </button>

                <h1 className="text-4xl font-bold text-gray-800 mb-2">Déposer ma candidature</h1>
                <p className="text-gray-500 mb-10 border-b pb-6">Complétez les informations ci-dessous pour participer au Hackathon.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Pourquoi voulez-vous participer ?</label>
                        <textarea
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-40 transition-all"
                            placeholder="Décrivez votre motivation et vos compétences..."
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-blue-400 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <Icons.UploadCloud size={32} />
                            </div>
                            <p className="font-bold text-gray-700">{file ? file.name : "Cliquez pour uploader votre CV ou Portfolio"}</p>
                            <p className="text-sm text-gray-400 mt-1">PDF, ZIP ou DOCX (Max 10Mo)</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2a9d8f] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#21867a] transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? "Envoi en cours..." : "Soumettre mon dossier"}
                        <Icons.Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyForm;