import React from 'react';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import logoBleu from '../assets/logo_bleu.png';

const FacebookIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

const InstagramIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
    </svg>
);

const TwitterIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
);

const Footer = () => {
    const socialLinks = [
        { icon: <FacebookIcon size={18} />, url: "https://www.facebook.com/MTNRA.Maroc", color: "hover:text-blue-500", label: "Facebook" },
        { icon: <InstagramIcon size={18} />, url: "https://www.instagram.com/mtnra.maroc/", color: "hover:text-pink-500", label: "Instagram" },
        { icon: <LinkedinIcon size={18} />, url: "https://www.linkedin.com/company/mtnra-maroc/", color: "hover:text-blue-700", label: "LinkedIn" },
        { icon: <TwitterIcon size={18} />, url: "https://x.com/MTNRA_Maroc", color: "hover:text-sky-400", label: "Twitter / X" },
    ];

    return (
        <footer id="contact" className="bg-white border-t border-gray-100 pt-16 pb-8 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12">

                    <div className="flex flex-col space-y-5">
                        <div className="flex items-center space-x-1">
                            <img
                                src={logoBleu}
                                alt="PlaThon Logo"
                                className="w-9 h-9 object-contain"
                            />
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">Pla<span className="text-blue-600">Thon</span></span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            La plateforme officielle du Ministère pour la promotion de l'innovation numérique et l'organisation d'événements technologiques et hackathons nationaux.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Ministère</h4>
                        <ul className="text-gray-500 text-sm space-y-3">
                            <li>
                                <a 
                                    href="https://www.maroc.ma" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                                >
                                    Portail National Maroc.ma <ExternalLink size={14}/>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://www.mmsp.gov.ma" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                                >
                                    Site officiel du Ministère <ExternalLink size={14}/>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://transition-numerique.gov.ma" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                                >
                                    Portail Transition Numérique <ExternalLink size={14}/>
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://www.service-public.ma" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                                >
                                    Réforme & Services Publics <ExternalLink size={14}/>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div id="reseaux-sociaux" className="scroll-mt-24">
                        <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">Contact & Réseaux</h4>
                        <div className="flex space-x-3 mb-6">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className={`w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 transition-all duration-300 hover:shadow-md ${social.color} hover:border-transparent bg-gray-50/50`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                        <div className="text-xs text-gray-400 space-y-2">
                            <a href="mailto:contact@transition-numerique.gov.ma" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                <Mail size={14} className="shrink-0 text-gray-500" /> contact@transition-numerique.gov.ma
                            </a>
                            <p className="flex items-start gap-2">
                                <MapPin size={14} className="shrink-0 text-gray-500 mt-0.5" /> 
                                <span>Avenue Ahmed Cherkaoui, Quartier Administratif, Agdal, B.P. 1076, Rabat, Maroc</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-50 pt-8">
                    <p className="text-gray-400 text-xs text-center font-light">
                        © 2026 Ministère de la Transition Numérique et de la Réforme de l'Administration. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;