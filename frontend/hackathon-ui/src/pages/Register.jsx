import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import axios from 'axios';
import moroccoCoatOfArms from '../assets/morocco-coat-of-arms.webp';
import logoBleu from '../assets/logo_bleu.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'PARTICIPANT'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Le mot de passe doit comporter au moins 6 caractères.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:8080/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            setSuccess(true);
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription. L'email est peut-être déjà utilisé.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

            <nav className="bg-white px-6 md:px-12 py-4 shadow-sm flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                        <img 
                            src={moroccoCoatOfArms} 
                            alt="Armoiries du Royaume du Maroc" 
                            className="w-full h-full object-contain drop-shadow-sm" 
                        />
                    </div>
                    <div className="text-[10px] md:text-[11px] font-bold text-gray-800 leading-tight uppercase border-l pl-4 border-gray-200">
                        Royaume du Maroc<br/>
                        Ministère de la Transition Numérique<br/>
                        et de la Réforme de l'Administration
                    </div>
                </div>

                <div 
                    onClick={() => navigate('/')} 
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition-opacity"
                >
                    <img 
                        src={logoBleu} 
                        alt="PlaThon Logo" 
                        className="w-9 h-9 object-contain drop-shadow-sm" 
                    />
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">Pla<span className="text-blue-600">Thon</span></span>
                </div>
            </nav>

            <div className="flex-grow flex items-center justify-center p-6 relative">
                <button
                    onClick={() => navigate('/login')}
                    className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm cursor-pointer"
                >
                    <Icons.ChevronLeft size={20} />
                    <span>Retour à la connexion</span>
                </button>

                <div className="bg-white w-full max-w-[520px] p-8 md:p-10 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-gray-100 mt-8 md:mt-0 my-8">

                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Créer un compte
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Rejoignez la plateforme et participez aux hackathons nationaux
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                            <Icons.AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-3.5 bg-green-50 text-green-700 text-sm rounded-xl border border-green-200 flex items-center gap-2">
                            <Icons.CheckCircle2 size={18} className="shrink-0 text-green-600" />
                            <span>Compte créé avec succès ! Redirection vers la connexion...</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                Nom complet
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Prénom et Nom"
                                    className="w-full bg-slate-50 border border-gray-200 p-3.5 pr-12 text-gray-800 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                                <Icons.User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                Adresse e-mail
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="exemple@domaine.ma"
                                    className="w-full bg-slate-50 border border-gray-200 p-3.5 pr-12 text-gray-800 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                                <Icons.Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Au moins 6 caractères"
                                    className="w-full bg-slate-50 border border-gray-200 p-3.5 pr-12 text-gray-800 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Répétez votre mot de passe"
                                    className="w-full bg-slate-50 border border-gray-200 p-3.5 pr-12 text-gray-800 text-sm rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    required
                                />
                                <Icons.ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 font-bold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] mt-6 tracking-wide text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Création en cours..." : "Créer mon compte"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full bg-white hover:bg-blue-50 border border-blue-600 text-blue-600 py-3.5 font-bold rounded-xl shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] tracking-wide text-sm cursor-pointer"
                        >
                            Déjà un compte ? Se connecter
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
