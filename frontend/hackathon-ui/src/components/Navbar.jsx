import React from 'react';
import { User } from 'lucide-react';
import moroccoCoatOfArms from '../assets/morocco-coat-of-arms.webp';
import logoBleu from '../assets/logo_bleu.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="flex items-center justify-between px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="flex items-center space-x-4">
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
                <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1 font-semibold">Accueil</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Hackathons</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Actualités</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Ressources</a>
                <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                    <img
                        src={logoBleu}
                        alt="PlaThon Logo"
                        className="w-10 h-10 object-contain drop-shadow-sm"
                    />
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">Pla<span className="text-blue-600">Thon</span></span>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer">
                    <User size={18} />
                    <span>Se connecter</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;