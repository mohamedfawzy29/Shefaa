import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, Stethoscope, ShieldCheck, Clock, Users, Award, ArrowRight, ChevronRight } from "lucide-react";
import { usePublicDoctors } from "../../hooks/usePublicDoctors";
import { useSpecializations } from "../../features/specializations/hooks/useSpecializations";
import { Avatar } from "../../components/ui/Avatar";
import type { DoctorResponse } from "../../features/doctors/types/doctor";

// ─── Helper ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                />
            ))}
            <span className="!ml-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{rating.toFixed(1)}</span>
        </div>
    );
}

function DoctorCard({ doctor }: { doctor: DoctorResponse }) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "https://localhost:7118/api";
    const hostBase = apiBase.replace(/\/api$/, "");
    const imgSrc = doctor.profileImageUrl && doctor.profileImageUrl !== "default.png"
        ? doctor.profileImageUrl.startsWith("http")
            ? doctor.profileImageUrl
            : `${hostBase}/images/profiles/${doctor.profileImageUrl}`
        : null;

    const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

    return (
        <div className="group bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600" />

            <div className="!p-5">
                <div className="flex items-start gap-4">
                    <Avatar src={imgSrc} name={fullName} size="xl" className="!ring-4 !ring-cyan-100 dark:!ring-cyan-900/30 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">{fullName}</h3>
                        <div className="flex items-center gap-1.5 !mt-1">
                            <Stethoscope className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold truncate">{doctor.specialization}</p>
                        </div>
                        <div className="!mt-2">
                            <StarRating rating={doctor.averageRating} />
                        </div>
                    </div>
                </div>

                <div className="!mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 !pt-3">
                    <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        {doctor.yearsOfExperience} yrs exp.
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Available
                    </span>
                </div>

                <div className="!mt-4 flex gap-2">
                    <Link
                        to={`/doctors/${doctor.doctorId}`}
                        className="flex-1 text-center !py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        View Profile
                    </Link>
                    <Link
                        to={`/doctors/${doctor.doctorId}`}
                        className="flex-1 text-center !py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-md hover:shadow-cyan-500/30 transition-all"
                    >
                        Book
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const WHY_ITEMS = [
    { icon: ShieldCheck, title: "Verified Doctors", desc: "Every doctor is licensed and credential-verified before joining Shefaa.", color: "text-emerald-500" },
    { icon: Clock, title: "24/7 Availability", desc: "Book appointments at your convenience, any time of day.", color: "text-blue-500" },
    { icon: Star, title: "Highest Rated", desc: "Patient reviews ensure you always get the best care available.", color: "text-amber-500" },
    { icon: Users, title: "Patient First", desc: "Your health outcomes are our top priority — no compromises.", color: "text-violet-500" },
];

const STATS = [
    { value: "500+", label: "Verified Doctors" },
    { value: "50k+", label: "Happy Patients" },
    { value: "30+", label: "Specializations" },
    { value: "4.9★", label: "Average Rating" },
];

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { data: doctors = [], isLoading: doctorsLoading } = usePublicDoctors();
    const { data: specializations = [] } = useSpecializations();

    const topDoctors = [...doctors]
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 6);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/doctors?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className="w-full">
            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1e2d48] to-[#0F172A] !pt-24 !pb-28">
                {/* Decorative blobs */}
                <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-20 h-[400px] w-[400px] rounded-full bg-blue-700/20 blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto !px-6 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 !px-4 !py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold !mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Trusted Healthcare Platform
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
                        Find the Right Doctor{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            for You
                        </span>
                    </h1>

                    <p className="!mt-5 text-lg text-slate-400 max-w-2xl leading-relaxed">
                        Book appointments with Egypt's top-rated, verified doctors. Fast, easy, and secure — all in one place.
                    </p>

                    {/* Search box */}
                    <form
                        onSubmit={handleSearch}
                        className="!mt-10 w-full max-w-2xl flex gap-3 bg-white/10 backdrop-blur-md rounded-2xl !p-2 border border-white/20"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search doctors by name or specialization…"
                                className="w-full bg-transparent !pl-11 !pr-4 !py-3 text-sm text-white placeholder:text-slate-400 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="!px-6 !py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all whitespace-nowrap cursor-pointer"
                        >
                            Search
                        </button>
                    </form>

                    <div className="!mt-8 flex flex-wrap items-center justify-center gap-6">
                        {STATS.map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                                <p className="text-xs text-slate-400 !mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Specializations ── */}
            <section className="max-w-7xl mx-auto !px-6 !py-20">
                <div className="flex items-center justify-between !mb-10">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 !mb-1">Explore</p>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Featured Specializations</h2>
                    </div>
                    <Link to="/doctors" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                        View all <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {specializations.slice(0, 12).map((spec) => (
                        <Link
                            key={spec.id}
                            to={`/doctors?specialization=${encodeURIComponent(spec.name)}`}
                            className="group flex flex-col items-center gap-3 bg-white dark:bg-[#12141c] rounded-2xl !p-5 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center"
                        >
                            {spec.iconImg ? (
                                <img src={spec.iconImg} alt={spec.name} className="h-10 w-10 object-contain" />
                            ) : (
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-950/40 dark:to-blue-950/40 flex items-center justify-center">
                                    <Stethoscope className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                </div>
                            )}
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">
                                {spec.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Top Rated Doctors ── */}
            <section className="bg-slate-50/80 dark:bg-slate-900/30 !py-20">
                <div className="max-w-7xl mx-auto !px-6">
                    <div className="flex items-center justify-between !mb-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 !mb-1">Experts</p>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Top Rated Doctors</h2>
                        </div>
                        <Link to="/doctors" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                            All Doctors <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {doctorsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200 dark:border-slate-800 !p-5 animate-pulse">
                                    <div className="flex gap-4">
                                        <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topDoctors.map((doc) => (
                                <DoctorCard key={doc.doctorId} doctor={doc} />
                            ))}
                        </div>
                    )}

                    <div className="!mt-10 text-center sm:hidden">
                        <Link
                            to="/doctors"
                            className="inline-flex items-center gap-2 !px-6 !py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold"
                        >
                            See All Doctors <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Why Choose Shefaa ── */}
            <section className="max-w-7xl mx-auto !px-6 !py-20">
                <div className="text-center !mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 !mb-2">Why Us</p>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">Why Choose Shefaa</h2>
                    <p className="!mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
                        We combine technology and care to make your healthcare journey seamless.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {WHY_ITEMS.map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} className="group bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 !p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 bg-slate-50 dark:bg-slate-800 ${color}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 !mb-2">{title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="!py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
                <div className="max-w-4xl mx-auto !px-6 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-extrabold !mb-4">Ready to Book Your Appointment?</h2>
                    <p className="text-cyan-100 !mb-8 text-lg">Join thousands of patients who trust Shefaa for their healthcare needs.</p>
                    <Link
                        to="/doctors"
                        className="inline-flex items-center gap-2 !px-8 !py-4 rounded-2xl bg-white text-slate-900 font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                        Browse Doctors <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
