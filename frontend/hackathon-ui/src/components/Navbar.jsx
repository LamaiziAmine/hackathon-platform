import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, LogOut } from 'lucide-react';
import moroccoCoatOfArms from '../assets/morocco-coat-of-arms.webp';
import logoBleu from '../assets/logo_bleu.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getUserFromToken, isAdminUser } from '../utils/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getUserFromToken());
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const isHome = location.pathname === '/';
    const isHackathons = location.pathname === '/hackathons';

    return (
        <nav className="flex items-center justify-between px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-12 h-12 flex items-center justify-center">
                    <img
                        src={moroccoCoatOfArms}
                        alt="Armoiries du Royaume du Maroc"
                        className="w-full h-full object-contain drop-shadow-sm"
                    />
                </div>
                <div className="text-[11px] font-bold text-gray-800 leading-tight uppercase tracking-tight">
                    Royaume du Maroc<br/>
                    Ministère de la Transition Numérique<br/>
                    et de la Réforme de l'Administration
                </div>
            </div>

            <div className="hidden lg:flex space-x-8 text-sm font-medium text-gray-600">
                <Link
                    to="/"
                    className={isHome ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold" : "hover:text-blue-600 transition-colors"}
                >
                    Accueil
                </Link>
                <Link
                    to="/hackathons"
                    className={isHackathons ? "text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold" : "hover:text-blue-600 transition-colors"}
                >
                    Hackathons
                </Link>
                <a href="#" className="hover:text-blue-600 transition-colors">Actualités</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Ressources</a>
                <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 cursor-pointer mr-2" onClick={() => navigate('/')}>
                    <img
                        src={logoBleu}
                        alt="PlaThon Logo"
                        className="w-10 h-10 object-contain drop-shadow-sm"
                    />
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">Pla<span className="text-blue-600">Thon</span></span>
                </div>

                {user ? (
                    <div className="flex items-center space-x-3">
                        {isAdminUser(user) && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                            >
                                <ShieldCheck size={16} />
                                <span>Administration</span>
                            </button>
                        )}
                        <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                            {user.name || user.sub}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                            title="Déconnexion"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer">
                        <User size={18} />
                        <span>Se connecter</span>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;