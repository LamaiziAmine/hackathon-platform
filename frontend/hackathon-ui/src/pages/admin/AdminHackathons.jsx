import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';

const AdminHackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', theme: '', startDate: '', endDate: '', location: '', status: 'PUBLISHED' });
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchHackathons = async () => {
        try {
            const res = await axios.get('http://localhost:8080/hackathons');
            setHackathons(res.data);
        } catch (err) { console.error("Erreur chargement hackathons", err); }
    };

    useEffect(() => { fetchHackathons(); }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setForm({ title: '', description: '', theme: '', startDate: '', endDate: '', location: '', status: 'PUBLISHED' });
        setShowModal(true);
    };

    const handleOpenEdit = (hackathon) => {
        setEditingId(hackathon.id);
        setForm({
            title: hackathon.title || '',
            description: hackathon.description || '',
            theme: hackathon.theme || '',
            startDate: hackathon.startDate || '',
            endDate: hackathon.endDate || '',
            location: hackathon.location || '',
            status: hackathon.status || 'PUBLISHED'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (editingId) {
                await axios.put(`http://localhost:8080/hackathons/${editingId}`, form, { headers });
            } else {
                await axios.post('http://localhost:8080/hackathons', form, { headers });
            }

            setShowModal(false);
            fetchHackathons();
        } catch (err) {
            alert("Erreur lors de l'enregistrement de l'événement.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce hackathon ?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/hackathons/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHackathons();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestion des Hackathons</h1>
                    <p className="text-gray-500 mt-1">Créez, modifiez et supprimez les événements de la plateforme.</p>
                </div>
                <button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer">
                    <Icons.Plus size={20} /><span>Nouveau Hackathon</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="p-5">Titre</th>
                        <th className="p-5">Thème</th>
                        <th className="p-5">Dates</th>
                        <th className="p-5">Lieu</th>
                        <th className="p-5">Statut</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {hackathons.length === 0 ? (
                        <tr><td colSpan="6" className="p-10 text-center text-gray-400">Aucun hackathon disponible.</td></tr>
                    ) : hackathons.map(h => (
                        <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-5 font-bold text-gray-900">{h.title}</td>
                            <td className="p-5 text-gray-600"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{h.theme}</span></td>
                            <td className="p-5 text-gray-500">{h.startDate} au {h.endDate}</td>
                            <td className="p-5 text-gray-500">{h.location}</td>
                            <td className="p-5"><span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{h.status}</span></td>
                            <td className="p-5 text-right space-x-2">
                                <button onClick={() => handleOpenEdit(h)} title="Modifier" className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer inline-block">
                                    <Icons.Pencil size={16} />
                                </button>
                                <button onClick={() => handleDelete(h.id)} title="Supprimer" className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer inline-block">
                                    <Icons.Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL ÉLARGI ET COMPACT (2 Colonnes) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingId ? "Modifier le Hackathon" : "Créer un nouveau Hackathon"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <Icons.X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Titre</label>
                                    <input type="text" placeholder="Titre de l'événement" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thème</label>
                                    <input type="text" placeholder="Thème (ex: IA & Social)" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm" value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} required />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date de début</label>
                                    <input type="date" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none text-sm" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date de fin</label>
                                    <input type="date" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none text-sm" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lieu</label>
                                    <input type="text" placeholder="Lieu (Rabat / Distanciel)" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Statut</label>
                                    <select className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none text-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                                        <option value="PUBLISHED">Publié</option>
                                        <option value="DRAFT">Brouillon</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea placeholder="Description détaillée..." className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none h-20 focus:border-blue-500 text-sm" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer text-sm">Annuler</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-sm cursor-pointer text-sm">
                                    {editingId ? "Mettre à jour" : "Enregistrer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHackathons;