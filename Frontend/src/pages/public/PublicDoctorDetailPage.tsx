import { useParams, Link } from "react-router-dom";
import { Star, Award, Phone, Mail, Stethoscope, ArrowLeft, ShieldCheck, Clock, CalendarDays, LogIn } from "lucide-react";
import { usePublicDoctor } from "../../hooks/usePublicDoctors";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Avatar } from "../../components/ui/Avatar";

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                />
            ))}
            <span className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-300">{rating.toFixed(1)} / 5</span>
        </div>
    );
}

export default function PublicDoctorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();
    const { data: doctor, isLoading, isError } = usePublicDoctor(id);

    const apiBase = import.meta.env.VITE_API_BASE_URL || "https://localhost:7118/api";
    const hostBase = apiBase.replace(/\/api$/, "");

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto !px-6 !py-12 animate-pulse space-y-6">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200 dark:border-slate-800 !p-8">
                    <div className="flex gap-6">
                        <div className="h-28 w-28 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                        <div className="flex-1 space-y-3">
                            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !doctor) {
        return (
            <div className="max-w-5xl mx-auto !px-6 !py-20 text-center">
                <Stethoscope className="h-14 w-14 text-slate-300 dark:text-slate-600 mx-auto !mb-4" />
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Doctor not found</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 !mt-2">This doctor profile may not exist or is unavailable.</p>
                <Link to="/doctors" className="inline-flex items-center gap-2 !mt-6 !px-5 !py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold">
                    <ArrowLeft className="h-4 w-4" /> Back to Doctors
                </Link>
            </div>
        );
    }

    const imgSrc = doctor.profileImageUrl && doctor.profileImageUrl !== "default.png"
        ? doctor.profileImageUrl.startsWith("http")
            ? doctor.profileImageUrl
            : `${hostBase}/images/profiles/${doctor.profileImageUrl}`
        : null;

    const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

    return (
        <div className="min-h-screen bg-slate-50/60 dark:bg-transparent">
            {/* Back + breadcrumb */}
            <div className="max-w-5xl mx-auto !px-6 !pt-8 !pb-4">
                <Link
                    to="/doctors"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Doctors
                </Link>
            </div>

            <div className="max-w-5xl mx-auto !px-6 !pb-16 space-y-6">
                {/* Profile card */}
                <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Top accent */}
                    <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />

                    <div className="!p-8">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <div className="relative shrink-0">
                                <Avatar src={imgSrc} name={fullName} size="xl" className="!h-28 !w-28 !ring-4 !ring-cyan-100 dark:!ring-cyan-900/30" />
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full !p-1">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{fullName}</h1>
                                <div className="flex items-center gap-2 !mt-1">
                                    <Stethoscope className="h-4 w-4 text-cyan-500" />
                                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{doctor.specialization}</span>
                                </div>

                                <div className="!mt-3">
                                    <StarRating rating={doctor.averageRating} />
                                </div>

                                <div className="flex flex-wrap gap-3 !mt-4">
                                    <span className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        <Award className="h-3.5 w-3.5 text-amber-500" /> {doctor.yearsOfExperience} Years Experience
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                        <Clock className="h-3.5 w-3.5" /> Available Now
                                    </span>
                                </div>
                            </div>

                            {/* Book button */}
                            {isAuthenticated ? (
                                <button className="shrink-0 !px-6 !py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-md hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all cursor-pointer">
                                    Book Appointment
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="shrink-0 flex items-center gap-2 !px-6 !py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-md hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
                                >
                                    <LogIn className="h-4 w-4" /> Login to Book
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* License */}
                        <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm !p-6">
                            <h2 className="font-bold text-slate-900 dark:text-slate-100 !mb-4 text-base border-b border-slate-100 dark:border-slate-800 !pb-3">Professional Information</h2>
                            <dl className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Specialization</dt>
                                    <dd className="text-sm font-semibold text-slate-900 dark:text-slate-100">{doctor.specialization}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">License Number</dt>
                                    <dd className="text-sm font-mono text-slate-700 dark:text-slate-300">{doctor.licenseNumber}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Experience</dt>
                                    <dd className="text-sm font-semibold text-slate-900 dark:text-slate-100">{doctor.yearsOfExperience} years</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Average Rating</dt>
                                    <dd><StarRating rating={doctor.averageRating} /></dd>
                                </div>
                            </dl>
                        </div>

                        {/* Contact */}
                        {(doctor.email || (doctor.phoneNumbers && doctor.phoneNumbers.length > 0)) && (
                            <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm !p-6">
                                <h2 className="font-bold text-slate-900 dark:text-slate-100 !mb-4 text-base border-b border-slate-100 dark:border-slate-800 !pb-3">Contact Information</h2>
                                <div className="space-y-3">
                                    {doctor.email && (
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                                                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{doctor.email}</span>
                                        </div>
                                    )}
                                    {doctor.phoneNumbers?.map((p, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                                                <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Availability + Book */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm !p-6">
                            <h2 className="font-bold text-slate-900 dark:text-slate-100 !mb-4 text-base border-b border-slate-100 dark:border-slate-800 !pb-3">
                                <CalendarDays className="inline h-4 w-4 !mr-1.5 text-cyan-500" />
                                Availability
                            </h2>
                            <div className="space-y-2">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"].map((day) => (
                                    <div key={day} className="flex items-center justify-between !py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">{day}</span>
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">9:00 – 17:00</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl !p-6 text-white text-center space-y-3">
                            <CalendarDays className="h-8 w-8 mx-auto text-cyan-200" />
                            <h3 className="font-bold text-base">Ready to Book?</h3>
                            <p className="text-xs text-cyan-100 leading-relaxed">Choose a convenient time and book your appointment instantly.</p>
                            {isAuthenticated ? (
                                <button className="w-full !py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-cyan-50 transition-all cursor-pointer">
                                    Book Appointment
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block w-full !py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-cyan-50 transition-all"
                                >
                                    Login to Book
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
