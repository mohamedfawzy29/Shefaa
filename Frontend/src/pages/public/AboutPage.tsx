import { Activity, Users, ShieldCheck, Star, Heart, Target } from "lucide-react";

const VALUES = [
    { icon: Heart, title: "Patient-Centered Care", desc: "Every decision we make puts patients first.", color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30" },
    { icon: ShieldCheck, title: "Trust & Safety", desc: "All doctors are licensed and thoroughly verified.", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" },
    { icon: Star, title: "Quality First", desc: "We maintain the highest standards in medical care.", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30" },
    { icon: Target, title: "Innovation", desc: "Leveraging technology to improve healthcare access.", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
];

const TEAM = [
    { name: "Dr. Sarah Hassan", role: "Chief Medical Officer", initials: "SH", color: "from-violet-400 to-violet-600" },
    { name: "Ahmed Mostafa", role: "Head of Technology", initials: "AM", color: "from-cyan-400 to-cyan-600" },
    { name: "Nour El-Din", role: "Patient Success Lead", initials: "NE", color: "from-emerald-400 to-emerald-600" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0F172A] via-[#1e2d48] to-[#0F172A] !pt-20 !pb-16 text-center">
                <div className="max-w-3xl mx-auto !px-6">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 !mb-6 mx-auto">
                        <Activity className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white !mb-4 tracking-tight">About Shefaa</h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Shefaa is Egypt's leading digital healthcare platform, connecting patients with qualified, verified medical professionals — making quality healthcare accessible to everyone.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-5xl mx-auto !px-6 !py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 !mb-2">Our Mission</p>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 !mb-4">
                            Making Healthcare Accessible for Everyone
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm !mb-4">
                            We believe that access to quality healthcare is a fundamental right, not a privilege. Shefaa bridges the gap between patients and doctors through technology, transparency, and trust.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            Founded in Cairo, we serve thousands of patients across Egypt by providing a seamless platform to discover, connect with, and book appointments with top medical specialists.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: "500+", label: "Verified Doctors" },
                            { value: "50k+", label: "Patients Served" },
                            { value: "30+", label: "Specializations" },
                            { value: "4.9★", label: "Average Rating" },
                        ].map((s) => (
                            <div key={s.label} className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-6 text-center shadow-sm">
                                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{s.value}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 !mt-1 font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-slate-50/80 dark:bg-slate-900/30 !py-16">
                <div className="max-w-5xl mx-auto !px-6">
                    <div className="text-center !mb-12">
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 !mb-2">Core Values</p>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">What We Stand For</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-6 hover:shadow-md transition-all">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center !mb-4 ${color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 !mb-2 text-sm">{title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="max-w-5xl mx-auto !px-6 !py-16">
                <div className="text-center !mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 !mb-2">Leadership</p>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Meet Our Team</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center">
                    {TEAM.map((member) => (
                        <div key={member.name} className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto !mb-4 text-white font-bold text-lg ring-4 ring-white dark:ring-slate-900`}>
                                {member.initials}
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{member.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 !mt-1">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="!py-16 bg-gradient-to-r from-cyan-600 to-blue-700">
                <div className="max-w-3xl mx-auto !px-6 text-center text-white">
                    <Users className="h-10 w-10 mx-auto !mb-4 text-cyan-200" />
                    <h2 className="text-2xl md:text-3xl font-extrabold !mb-3">Join Our Healthcare Community</h2>
                    <p className="text-cyan-100 !mb-8">Be part of a growing network of patients and doctors transforming Egyptian healthcare.</p>
                    <a
                        href="/register"
                        className="inline-block !px-8 !py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:shadow-xl hover:scale-105 transition-all"
                    >
                        Get Started Free
                    </a>
                </div>
            </section>
        </div>
    );
}
