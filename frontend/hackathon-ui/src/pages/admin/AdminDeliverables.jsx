import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { getAuthHeaders, handleAuthError } from '../../utils/auth';

const AdminDeliverables = () => {
    const [hackathons, setHackathons] = useState([]);
    const [selectedHackathon, setSelectedHackathon] = useState('');
    const [requirements, setRequirements] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', deadline: '' });

    useEffect(() => {
        axios.get('http://localhost:8080/hackathons', { headers: getAuthHeaders() }).then(res => {
            setHackathons(res.data || []);
            if(res.data && res.data.length > 0) setSelectedHackathon(res.data[0].id);
        }).catch(err => {
            handleAuthError(err);
        });
    }, []);

    useEffect(() => {
        if(selectedHackathon) {
            axios.get(`http://localhost:8080/deliverables/requirements/hackathon/${selectedHackathon}`, {
                headers: getAuthHeaders()
            }).then(async res => {
                setRequirements(res.data || []);
                // Charger les soumissions pour chaque requirement
                const subsMap = {};
                for(let req of (res.data || [])) {
                    try {
                        const subRes = await axios.get(`http://localhost:8080/deliverables/submissions/requirement/${req.id}`, {
                            headers: getAuthHeaders()
                        });
                        subsMap[req.id] = subRes.data;
                    } catch(e) { subsMap[req.id] = []; }
                }
                setSubmissions(subsMap);
            }).catch(err => {
                if (!handleAuthError(err)) {
                    setRequirements([]);
                }
            });
        }
    }, [selectedHackathon]);

    const handleCreateReq = async (e) => {
        e.preventDefault();
        try {
            const formattedDeadline = form.deadline 
                ? (form.deadline.includes('T') && form.deadline.length === 16 ? form.deadline + ':00' : form.deadline) 
                : null;

            await axios.post('http://localhost:8080/deliverables/requirements', {
                title: form.title,
                description: form.description,
                hackathonId: selectedHackathon,
                deadline: formattedDeadline
            }, { headers: getAuthHeaders() });

            setShowModal(false);
            setForm({ title: '', description: '', deadline: '' });
            // Recharger
            const res = await axios.get(`http://localhost:8080/deliverables/requirements/hackathon/${selectedHackathon}`, {
                headers: getAuthHeaders()
            });
            setRequirements(res.data || []);
        } catch(err) { 
            console.error("Erreur création livrable:", err);
            if (!handleAuthError(err)) {
                alert("Erreur lors de la création du livrable : " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleDeleteReq = async (reqId) => {
        if(!window.confirm("Êtes-vous sûr de vouloir supprimer cette demande de livrable ?")) return;
        try {
            await axios.delete(`http://localhost:8080/deliverables/requirements/${reqId}`, {
                headers: getAuthHeaders()
            });
            setRequirements(requirements.filter(r => r.id !== reqId));
        } catch(err) {
            console.error("Erreur suppression livrable:", err);
            if (!handleAuthError(err)) {
                alert("Erreur lors de la suppression du livrable");
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Suivi des Livrables & Soumissions</h1>
                    <p className="text-gray-500 mt-1">Définissez les attentes et téléchargez les travaux des équipes.</p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="bg-white border border-gray-200 px-4 py-3 rounded-xl font-semibold text-gray-700 shadow-2xs outline-none"
                        value={selectedHackathon}
                        onChange={e => setSelectedHackathon(e.target.value)}
                    >
                        {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                    </select>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all">
                        <Icons.Plus size={20} /><span>Demander un livrable</span>
                    </button>
                </div>
            </div>

            {/* Liste des exigences et de leurs soumissions */}
            <div className="space-y-6">
                {requirements.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-400">Aucun livrable demandé pour cet événement.</div>
                ) : requirements.map(req => (
                    <div key={req.id} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{req.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Icons.Clock size={12} /> Deadline : {req.deadline ? new Date(req.deadline).toLocaleString() : 'Non définie'}
                                </span>
                                <button
                                    onClick={() => handleDeleteReq(req.id)}
                                    title="Supprimer la demande"
                                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Icons.Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Tableau des soumissions pour ce livrable */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Soumissions des équipes ({submissions[req.id]?.length || 0})</h4>
                            <div className="space-y-2">
                                {submissions[req.id]?.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">Aucune équipe n'a encore soumis ce livrable.</p>
                                ) : submissions[req.id]?.map(sub => (
                                    <div key={sub.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl text-sm">
                                        <span className="font-semibold text-gray-700">Équipe ID : #{sub.teamId}</span>
                                        <a
                                            href={`http://localhost:8080/deliverables/download/${sub.filePath}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                                        >
                                            <Icons.Download size={14} /> Télécharger le fichier
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Création de livrable */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Demander un nouveau livrable</h2>
                        <form onSubmit={handleCreateReq} className="space-y-4">
                            <input type="text" placeholder="Titre (ex: Code Source GitHub / Archive)" className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                            <textarea placeholder="Instructions pour les équipes" className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 outline-none h-24" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date et heure limite (Deadline)</label>
                                <input type="datetime-local" className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 outline-none" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} required />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-100">Annuler</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-sm">Publier</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDeliverables;