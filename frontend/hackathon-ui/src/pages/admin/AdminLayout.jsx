import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import moroccoCoatOfArms from '../../assets/morocco-coat-of-arms.webp';
import logoBleu from '../../assets/logo_bleu.png';
import { getUserFromToken, isAdminUser } from '../../utils/auth';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        const currentUser = getUserFromToken();
        if (currentUser && !isAdminUser(currentUser)) {
            navigate('/');
        }
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { name: 'Accueil', path: '/admin' },
        { name: 'Hackathons', path: '/admin/hackathons' },
        { name: 'Candidats', path: '/admin/applications' },
        { name: 'Équipes', path: '/admin/teams' },
        { name: 'Les Livrables', path: '/admin/deliverables' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Top Navbar Admin calquée sur la navbar principale */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4">

                    {/* Armoiries & Ministère */}
                    <div 
                        className="flex items-center space-x-4 cursor-pointer"
                        onClick={() => navigate('/admin')}
                    >
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img
                                src={moroccoCoatOfArms}
                                alt="Armoiries du Royaume du Maroc"
                                className="w-full h-full object-contain drop-shadow-sm"
                            />
                        </div>
                        <div className="text-[11px] font-bold text-gray-800 leading-tight uppercase tracking-tight hidden sm:block">
                            Royaume du Maroc<br />
                            Ministère de la Transition Numérique<br />
                            et de la Réforme de l'Administration
                        </div>
                    </div>

                    {/* Navigation Links Desktop (même typographie, espacements et hover que la navbar principale) */}
                    <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`transition-colors cursor-pointer py-1 ${
                                        isActive
                                            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                            : 'hover:text-blue-600 text-gray-600'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Droite : Logo PlaThon + Bouton Déconnexion */}
                    <div className="flex items-center space-x-5">
                        {/* Logo officiel de la plateforme PlaThon */}
                        <div 
                            className="flex items-center space-x-1.5 cursor-pointer"
                            onClick={() => navigate('/admin')}
                            title="Plateforme PlaThon"
                        >
                            <img
                                src={logoBleu}
                                alt="PlaThon Logo"
                                className="w-10 h-10 object-contain drop-shadow-sm"
                            />
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">
                                Pla<span className="text-blue-600">Thon</span>
                            </span>
                        </div>

                        {/* Bouton de Déconnexion */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                            title="Déconnexion"
                        >
                            <Icons.LogOut size={16} />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <Icons.X size={22} /> : <Icons.Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2 shadow-lg">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-600 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </header>

            {/* Contenu dynamique de la page active */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;