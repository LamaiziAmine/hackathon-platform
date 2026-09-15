import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { getAuthHeaders, handleAuthError } from '../../utils/auth';

const AdminTeams = () => {
    const [hackathons, setHackathons] = useState([]);
    const [selectedHackathon, setSelectedHackathon] = useState('all');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamHackathonId, setTeamHackathonId] = useState('');
    const [mentorInputs, setMentorInputs] = useState({}); // Pour stocker l'ID du mentor par équipe

    const fetchTeams = async (hackathonId = selectedHackathon) => {
        setLoading(true);
        try {
            let url = 'http://localhost:8080/teams';
            if (hackathonId && hackathonId !== 'all') {
                url = `http://localhost:8080/teams/hackathon/${hackathonId}`;
            }
            const res = await axios.get(url, { headers: getAuthHeaders() });
            setTeams(res.data || []);
        } catch (err) {
            console.error("Erreur chargement équipes:", err);
            // Si erreur spécifique sur le chemin hackathon, tentative de fallback sur /teams
            try {
                const fallbackRes = await axios.get('http://localhost:8080/teams', { headers: getAuthHeaders() });
                if (hackathonId && hackathonId !== 'all') {
                    setTeams((fallbackRes.data || []).filter(t => String(t.hackathonId) === String(hackathonId)));
                } else {
                    setTeams(fallbackRes.data || []);
                }
            } catch (fallbackErr) {
                if (!handleAuthError(fallbackErr)) {
                    setTeams([]);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        axios.get('http://localhost:8080/hackathons', { headers: getAuthHeaders() })
            .then(res => {
                const list = res.data || [];
                setHackathons(list);
                if (list.length > 0) {
                    setTeamHackathonId(list[0].id);
                }
            })
            .catch(err => {
                handleAuthError(err);
            });
    }, []);

    useEffect(() => {
        fetchTeams(selectedHackathon);
    }, [selectedHackathon]);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: teamName.trim(),
                hackathonId: teamHackathonId ? Number(teamHackathonId) : (selectedHackathon && selectedHackathon !== 'all' ? Number(selectedHackathon) : null)
            };

            await axios.post('http://localhost:8080/teams', payload, { headers: getAuthHeaders() });

            setShowModal(false);
            setTeamName('');
            await fetchTeams(selectedHackathon);
        } catch(err) { 
            console.error("Erreur création équipe:", err);
            if (!handleAuthError(err)) {
                alert("Erreur lors de la création de l'équipe : " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleAssignMentor = async (teamId) => {
        const mentorId = mentorInputs[teamId];
        if(!mentorId) return alert("Veuillez entrer un ID de mentor valide.");

        try {
            await axios.patch(`http://localhost:8080/teams/${teamId}/assign-mentor/${mentorId}`, {}, {
                headers: getAuthHeaders()
            });
            alert("Mentor affecté avec succès !");
            // Mettre à jour l'état local
            setTeams(teams.map(t => t.id === teamId ? {...t, mentorId: Number(mentorId)} : t));
            setMentorInputs({...mentorInputs, [teamId]: ''});
        } catch(err) { 
            console.error(err);
            if (!handleAuthError(err)) {
                alert("Erreur lors de l'affectation du mentor");
            }
        }
    };

    const handleRemoveMentor = async (teamId) => {
        if(!window.confirm("Êtes-vous sûr de vouloir retirer le mentor de cette équipe ?")) return;
        try {
            await axios.patch(`http://localhost:8080/teams/${teamId}/remove-mentor`, {}, {
                headers: getAuthHeaders()
            });
            setTeams(teams.map(t => t.id === teamId ? {...t, mentorId: null} : t));
        } catch(err) {
            console.error(err);
            if (!handleAuthError(err)) {
                alert("Erreur lors du retrait du mentor");
            }
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if(!window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe ?")) return;
        try {
            await axios.delete(`http://localhost:8080/teams/${teamId}`, {
                headers: getAuthHeaders()
            });
            setTeams(teams.filter(t => t.id !== teamId));
        } catch(err) {
            console.error(err);
            if (!handleAuthError(err)) {
                alert("Erreur lors de la suppression de l'équipe");
            }
        }
    };

    const getHackathonName = (hId) => {
        if (!hId) return 'Non associé';
        const h = hackathons.find(item => String(item.id) === String(hId));
        return h ? h.title : `Hackathon #${hId}`;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestion des Équipes & Mentors</h1>
                    <p className="text-gray-500 mt-1">Constituez les équipes et affectez les experts-mentors.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <select
                        className="bg-white border border-gray-200 px-4 py-3 rounded-xl font-semibold text-gray-700 shadow-2xs outline-none"
                        value={selectedHackathon}
                        onChange={e => setSelectedHackathon(e.target.value)}
                    >
                        <option value="all">Tous les hackathons</option>
                        {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                    </select>
                    <button 
                        onClick={() => {
                            if (selectedHackathon && selectedHackathon !== 'all') {
                                setTeamHackathonId(selectedHackathon);
                            } else if (hackathons.length > 0) {
                                setTeamHackathonId(hackathons[0].id);
                            }
                            setShowModal(true);
                        }} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                        <Icons.Plus size={20} /><span>Créer une équipe</span>
                    </button>
                </div>
            </div>

            {/* Grille des équipes */}
            {loading ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-400">
                    Chargement des équipes...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teams.length === 0 ? (
                        <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-400">
                            Aucune équipe enregistrée pour cet événement.
                        </div>
                    ) : teams.map(team => (
                        <div key={team.id} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                                        <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                            {getHackathonName(team.hackathonId)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Équipe #{team.id}</span>
                                        <button 
                                            onClick={() => handleDeleteTeam(team.id)} 
                                            title="Supprimer l'équipe"
                                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            <Icons.Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Icons.UserCheck size={16} className={team.mentorId ? "text-emerald-600" : "text-gray-400"} />
                                        <span>ID du Mentor : <strong className="text-gray-800">{team.mentorId ? team.mentorId : 'Aucun mentor'}</strong></span>
                                    </div>
                                    {team.mentorId && (
                                        <button
                                            onClick={() => handleRemoveMentor(team.id)}
                                            className="text-xs text-red-500 hover:text-red-700 font-semibold underline ml-2 cursor-pointer"
                                        >
                                            Détacher
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Zone d'affectation rapide du mentor */}
                            <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="ID du Mentor"
                                    className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm w-36 outline-none focus:border-blue-500"
                                    value={mentorInputs[team.id] || ''}
                                    onChange={e => setMentorInputs({...mentorInputs, [team.id]: e.target.value})}
                                />
                                <button
                                    onClick={() => handleAssignMentor(team.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                    <Icons.Check size={14} /> Affecter Mentor
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Création d'équipe */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Nouvelle Équipe</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icons.X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de l'équipe *</label>
                                <input 
                                    type="text" 
                                    placeholder="ex: Alpha Code" 
                                    className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" 
                                    value={teamName} 
                                    onChange={e => setTeamName(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Hackathon associé</label>
                                <select
                                    className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                                    value={teamHackathonId}
                                    onChange={e => setTeamHackathonId(e.target.value)}
                                >
                                    <option value="">Aucun / Général</option>
                                    {hackathons.map(h => (
                                        <option key={h.id} value={h.id}>{h.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">Annuler</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-sm cursor-pointer">Créer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeams;