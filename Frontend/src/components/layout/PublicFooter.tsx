import { Link } from "react-router-dom";
import { Activity, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, } from "react-icons/fa6";

interface FooterLinkItem {
    label: string;
    to: string;
}

const footerLinks: Record<string, FooterLinkItem[]> = {
    Services: [
        { label: "Find Doctors", to: "/doctors" },
        { label: "Book Appointment", to: "/doctors" },
        { label: "About Us", to: "/about" },
        { label: "Contact", to: "/contact" },
    ],
    Support: [
        { label: "Help Center", to: "/contact" },
        { label: "Privacy Policy", to: "/about" },
        { label: "Terms of Service", to: "/about" },
    ],
};

export default function PublicFooter() {
    return (
        <footer className="bg-[#0F172A] dark:bg-[#060810] text-slate-400 mt-auto">
            <div className="max-w-7xl mx-auto !px-6 !pt-16 !pb-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-extrabold text-xl text-white tracking-tight">Shefaa</span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Your trusted platform connecting patients with qualified medical professionals across Egypt.
                        </p>
                        <div className="flex gap-3 !pt-2">
                            {[FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-800 hover:bg-cyan-600 text-slate-400 hover:text-white transition-all duration-200"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h4 className="text-white font-semibold text-sm !mb-4 uppercase tracking-wider">{section}</h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            className="text-sm hover:text-cyan-400 transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-sm !mb-4 uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2.5">
                                <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                                <a href="mailto:support@shefaa.eg" className="hover:text-white transition-colors">support@shefaa.eg</a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                                <a href="tel:+201000000000" className="hover:text-white transition-colors">+20 100 000 0000</a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin className="h-4 w-4 text-cyan-400 shrink-0 !mt-0.5" />
                                <span>Cairo, Egypt</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="!mt-12 !pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p>© {new Date().getFullYear()} Shefaa. All rights reserved.</p>
                    <p>Made with ❤️ for better healthcare.</p>
                </div>
            </div>
        </footer>
    );
}
