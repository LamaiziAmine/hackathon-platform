import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { getAuthHeaders, handleAuthError } from '../../utils/auth';

const AdminApplications = () => {
    const [hackathons, setHackathons] = useState([]);
    const [selectedHackathon, setSelectedHackathon] = useState('');
    const [applications, setApplications] = useState([]);

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
            axios.get(`http://localhost:8080/applications/hackathon/${selectedHackathon}`, {
                headers: getAuthHeaders()
            }).then(res => {
                setApplications(res.data || []);
            }).catch(err => {
                if (!handleAuthError(err)) {
                    setApplications([]);
                }
            });
        }
    }, [selectedHackathon]);

    const updateStatus = async (appId, newStatus) => {
        try {
            await axios.patch(`http://localhost:8080/applications/${appId}/status?status=${newStatus}`, {}, {
                headers: getAuthHeaders()
            });
            setApplications(applications.map(a => a.id === appId ? {...a, status: newStatus} : a));
        } catch(err) { 
            console.error(err);
            if (!handleAuthError(err)) {
                alert("Erreur lors de la mise à jour"); 
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-950 tracking-tight">Validation des Candidatures</h1>
                    <p className="text-gray-500 mt-1">Examinez les dossiers et gérez l'accès des participants.</p>
                </div>
                {/* Sélecteur de Hackathon pour le filtrage */}
                <select
                    className="bg-white border border-gray-200 px-4 py-3 rounded-xl font-semibold text-gray-700 shadow-2xs outline-none"
                    value={selectedHackathon}
                    onChange={e => setSelectedHackathon(e.target.value)}
                >
                    {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="p-5">ID Candidat</th>
                        <th className="p-5">Motivation</th>
                        <th className="p-5">Date de Soumission</th>
                        <th className="p-5">Statut Actuel</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {applications.length === 0 ? (
                        <tr><td colSpan="5" className="p-10 text-center text-gray-400">Aucune candidature pour cet événement.</td></tr>
                    ) : applications.map(app => (
                        <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-5 font-bold text-gray-900">#{app.userId}</td>
                            <td className="p-5 text-gray-600 max-w-xs truncate">{app.motivation}</td>
                            <td className="p-5 text-gray-500">{new Date(app.submissionDate).toLocaleDateString()}</td>
                            <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' :
                          app.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                            </td>
                            <td className="p-5 text-right space-x-2">
                                <button onClick={() => updateStatus(app.id, 'ACCEPTED')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-2xs">Accepter</button>
                                <button onClick={() => updateStatus(app.id, 'REJECTED')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-2xs">Refuser</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminApplications;