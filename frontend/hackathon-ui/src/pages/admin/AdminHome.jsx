import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import logoBleu from '../../assets/logo_bleu.png';

const AdminHome = () => {
    const navigate = useNavigate();
    const [hackathons, setHackathons] = useState([]);
    const [hackathonStats, setHackathonStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                // 1. Récupération de tous les hackathons
                const hRes = await axios.get('http://localhost:8080/hackathons', { headers });
                const list = hRes.data || [];
                setHackathons(list);

                // 2. Récupération des statistiques spécifiques pour chaque hackathon
                const statsMap = {};
                await Promise.allSettled(
                    list.map(async (h) => {
                        try {
                            const [appsRes, teamsRes, delivRes] = await Promise.allSettled([
                                axios.get(`http://localhost:8080/applications/hackathon/${h.id}`, { headers }),
                                axios.get(`http://localhost:8080/teams/hackathon/${h.id}`, { headers }),
                                axios.get(`http://localhost:8080/deliverables/requirements/hackathon/${h.id}`, { headers })
                            ]);

                            const apps = appsRes.status === 'fulfilled' && Array.isArray(appsRes.value.data) ? appsRes.value.data : [];
                            const teams = teamsRes.status === 'fulfilled' && Array.isArray(teamsRes.value.data) ? teamsRes.value.data : [];
                            const deliverables = delivRes.status === 'fulfilled' && Array.isArray(delivRes.value.data) ? delivRes.value.data : [];

                            const acceptedApps = apps.filter(a => a.status === 'ACCEPTED').length;
                            const uniqueMentors = new Set(teams.filter(t => t.mentorId).map(t => t.mentorId)).size;

                            statsMap[h.id] = {
                                applications: apps.length,
                                acceptedParticipants: acceptedApps > 0 ? acceptedApps : apps.length,
                                teams: teams.length,
                                mentors: uniqueMentors > 0 ? uniqueMentors : (teams.length > 0 ? 1 : 0),
                                deliverables: deliverables.length
                            };
                        } catch {
                            statsMap[h.id] = {
                                applications: 0,
                                acceptedParticipants: 0,
                                teams: 0,
                                mentors: 0,
                                deliverables: 0
                            };
                        }
                    })
                );

                setHackathonStats(statsMap);
            } catch (err) {
                console.error("Erreur lors du chargement des données d'administration :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const filteredHackathons = hackathons.filter(h => 
        h.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Entête du tableau de bord */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200/60">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tableau de Bord des Hackathons</h1>
                    <p className="text-gray-500 mt-1">
                        Suivi détaillé et statistiques individualisées par événement sur la plateforme PlaThon.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/hackathons')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
                    >
                        <Icons.Plus size={18} />
                        <span>Nouveau Hackathon</span>
                    </button>
                </div>
            </div>

            {/* Barre de recherche et filtre */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
                <div className="relative w-full sm:w-80">
                    <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un hackathon, thème, ville..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                </div>
                <div className="text-xs font-semibold text-gray-500">
                    <span className="text-blue-600 font-bold">{filteredHackathons.length}</span> {filteredHackathons.length > 1 ? 'hackathons enregistrés' : 'hackathon enregistré'}
                </div>
            </div>

            {/* Grille des statistiques organisée par Hackathon */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <div className="h-16 bg-gray-100 rounded-xl"></div>
                                <div className="h-16 bg-gray-100 rounded-xl"></div>
                                <div className="h-16 bg-gray-100 rounded-xl"></div>
                                <div className="h-16 bg-gray-100 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredHackathons.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                        <Icons.CalendarRange size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Aucun hackathon trouvé</h3>
                    <p className="text-sm text-gray-500">
                        {searchTerm ? "Aucun hackathon ne correspond à votre recherche." : "Commencez par ajouter votre premier hackathon pour visualiser ses statistiques."}
                    </p>
                    <button
                        onClick={() => navigate('/admin/hackathons')}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
                    >
                        <Icons.Plus size={18} />
                        <span>Créer un hackathon</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHackathons.map((hackathon) => {
                        const stats = hackathonStats[hackathon.id] || {
                            applications: 0,
                            acceptedParticipants: 0,
                            teams: 0,
                            mentors: 0,
                            deliverables: 0
                        };

                        return (
                            <div
                                key={hackathon.id}
                                className="bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
                            >
                                {/* Entête de la Card Hackathon avec Logo & Titre */}
                                <div className="p-6 pb-4 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {/* Logo / Image représentative */}
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shrink-0 p-2">
                                                <img
                                                    src={logoBleu}
                                                    alt="Logo"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                                                    {hackathon.title}
                                                </h2>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                                                        {hackathon.theme || 'Général'}
                                                    </span>
                                                    {hackathon.location && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                                                            <Icons.MapPin size={12} className="text-gray-400" />
                                                            {hackathon.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0">
                                            {hackathon.status || 'PUBLIÉ'}
                                        </span>
                                    </div>

                                    {/* Dates de déroulement */}
                                    {(hackathon.startDate || hackathon.endDate) && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-100">
                                            <Icons.Calendar size={14} className="text-blue-600 shrink-0" />
                                            <span>
                                                Du <strong className="text-gray-700">{hackathon.startDate || 'N/A'}</strong> au <strong className="text-gray-700">{hackathon.endDate || 'N/A'}</strong>
                                            </span>
                                        </div>
                                    )}

                                    {/* Description concise */}
                                    {hackathon.description && (
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {hackathon.description}
                                        </p>
                                    )}
                                </div>

                                {/* Section des Statistiques Propres au Hackathon */}
                                <div className="px-6 py-4 bg-slate-50/50 border-t border-b border-gray-100">
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Stat 1 : Candidatures */}
                                        <div className="bg-white p-3 rounded-2xl border border-gray-200/70 shadow-2xs">
                                            <div className="flex items-center justify-between text-gray-400">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Candidatures</span>
                                                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <Icons.FileText size={14} />
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-xl font-black text-gray-900">{stats.applications}</span>
                                                <span className="text-[10px] text-gray-400">dossiers</span>
                                            </div>
                                        </div>

                                        {/* Stat 2 : Participants validés */}
                                        <div className="bg-white p-3 rounded-2xl border border-gray-200/70 shadow-2xs">
                                            <div className="flex items-center justify-between text-gray-400">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Participants</span>
                                                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    <Icons.Users size={14} />
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-xl font-black text-gray-900">{stats.acceptedParticipants}</span>
                                                <span className="text-[10px] text-gray-400">candidats</span>
                                            </div>
                                        </div>

                                        {/* Stat 3 : Équipes & Projets */}
                                        <div className="bg-white p-3 rounded-2xl border border-gray-200/70 shadow-2xs">
                                            <div className="flex items-center justify-between text-gray-400">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Projets / Équipes</span>
                                                <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                    <Icons.Layers size={14} />
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-xl font-black text-gray-900">{stats.teams}</span>
                                                <span className="text-[10px] text-gray-400">équipes</span>
                                            </div>
                                        </div>

                                        {/* Stat 4 : Mentors mobilisés */}
                                        <div className="bg-white p-3 rounded-2xl border border-gray-200/70 shadow-2xs">
                                            <div className="flex items-center justify-between text-gray-400">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Mentors</span>
                                                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                                    <Icons.Award size={14} />
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-xl font-black text-gray-900">{stats.mentors}</span>
                                                <span className="text-[10px] text-gray-400">experts</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions rapides pour l'administration de ce hackathon */}
                                <div className="p-4 bg-white flex items-center justify-between gap-2 text-xs">
                                    <button
                                        onClick={() => navigate('/admin/applications')}
                                        className="flex-1 text-center py-2 px-2.5 rounded-xl font-semibold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        Candidats
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/teams')}
                                        className="flex-1 text-center py-2 px-2.5 rounded-xl font-semibold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        Équipes
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/deliverables')}
                                        className="flex-1 text-center py-2 px-2.5 rounded-xl font-semibold text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        Livrables
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminHome;