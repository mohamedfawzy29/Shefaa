import { useState, useMemo } from "react";
import {
    Search, Stethoscope, Star, Clock, Users,
    CalendarPlus, ChevronRight, Award, Filter, X,
} from "lucide-react";
import { usePatientDoctors } from "../../patient-appointments/hooks/usePatientDoctors";
import { BookAppointmentModal } from "../../patient-appointments/components/BookAppointmentModal";
import type { PublicDoctorResponse } from "../../doctors/types/doctor";

// ─── Star rating display ───────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
    const safeRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    className={`h-3.5 w-3.5 ${n <= Math.round(safeRating) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"}`}
                />
            ))}
            <span className="ml-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {safeRating.toFixed(1)}
            </span>
        </div>
    );
}

// ─── Doctor Card ───────────────────────────────────────────────────────────────
function DoctorCard({
    doctor,
    onBook,
}: {
    doctor: PublicDoctorResponse;
    onBook: (doctor: PublicDoctorResponse) => void;
}) {
    const firstName = doctor?.firstName || "Doctor";
    const lastName = doctor?.lastName || "";
    const fullName = `Dr. ${firstName} ${lastName}`.trim();
    const rating = typeof doctor?.averageRating === "number" ? doctor.averageRating : 0;
    const experience = typeof doctor?.yearsOfExperience === "number" ? doctor.yearsOfExperience : 0;
    const specialization = doctor?.specialization || "General Medicine";

    const daysAvailable = [...new Set(
        (doctor?.doctorSchedules ?? [])
            .filter((s) => s && s.isActive)
            .map((s) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][s.dayOfWeek])
            .filter(Boolean)
    )];

    const initials = `${firstName[0] || "D"}${lastName[0] || ""}`;

    return (
        <div className="group bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-cyan-300 dark:hover:border-cyan-800 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 transition-all" />

            <div className="!p-5 flex-1 flex flex-col gap-4">
                {/* Doctor avatar + name */}
                <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                        {doctor?.profileImageUrl && !doctor.profileImageUrl.endsWith("/images/profiles/default.png") ? (
                            <img
                                src={doctor.profileImageUrl}
                                alt={fullName}
                                className="h-16 w-16 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-extrabold shadow-md">
                                {initials}
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#12141c]" title="Approved" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base truncate">
                            {fullName}
                        </h3>
                        <span className="inline-flex items-center gap-1 !mt-1 !px-2.5 !py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-[11px] font-bold border border-cyan-200 dark:border-cyan-800">
                            <Stethoscope className="h-3 w-3" /> {specialization}
                        </span>
                    </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold">{experience} yrs exp</span>
                    </div>
                    <StarRating rating={rating} />
                </div>

                {/* Bio */}
                {doctor.bio && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {doctor.bio}
                    </p>
                )}

                {/* Available days */}
                {daysAvailable.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                        {daysAvailable.map((d) => (
                            <span key={d} className="text-[11px] font-bold !px-2 !py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {d}
                            </span>
                        ))}
                    </div>
                )}

                {/* Book button */}
                <button
                    onClick={() => onBook(doctor)}
                    className="!mt-auto w-full !py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                    <CalendarPlus className="h-4 w-4" />
                    Book Appointment
                    <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PatientDoctorsPage() {
    const [search, setSearch] = useState("");
    const [specFilter, setSpecFilter] = useState("");
    const [bookingDoctor, setBookingDoctor] = useState<PublicDoctorResponse | null>(null);

    // Fetch all doctors; frontend-level search since list is typically small
    const { data: doctors = [], isLoading, isError, refetch } = usePatientDoctors();

    // Derive unique specializations for filter dropdown
    const specializations = useMemo(() => {
        const set = new Set(doctors.map((d) => d.specialization));
        return [...set].sort();
    }, [doctors]);

    // Frontend filtering
    const filtered = useMemo(() => {
        return doctors.filter((d) => {
            const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
            const matchSearch = !search || fullName.includes(search.toLowerCase());
            const matchSpec = !specFilter || d.specialization === specFilter;
            return matchSearch && matchSpec;
        });
    }, [doctors, search, specFilter]);

    const hasFilters = !!search || !!specFilter;

    return (
        <div className="!p-6 space-y-8 max-w-7xl mx-auto">
            {/* Booking Modal */}
            <BookAppointmentModal
                doctor={bookingDoctor}
                onClose={() => setBookingDoctor(null)}
            />

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl !p-8 text-white shadow-xl">
                <div className="inline-flex items-center gap-2 !px-3 !py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-200 !mb-4">
                    <Stethoscope className="h-3.5 w-3.5" />
                    Patient Portal
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Find a Doctor</h1>
                <p className="text-blue-100 text-sm max-w-xl leading-relaxed mt-2">
                    Browse our team of certified physicians and specialists. Select a doctor and book your appointment in minutes.
                </p>
                <div className="flex items-center gap-4 mt-5 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-white/10 !px-4 !py-2 rounded-2xl text-sm font-semibold">
                        <Users className="h-4 w-4 text-cyan-200" />
                        {doctors.length} Active Physicians
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 !px-4 !py-2 rounded-2xl text-sm font-semibold">
                        <Award className="h-4 w-4 text-cyan-200" />
                        {specializations.length} Specializations
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by doctor name…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full !pl-10 !pr-4 !py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#12141c] text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    />
                </div>

                {/* Specialization filter */}
                <div className="relative sm:w-56">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                        value={specFilter}
                        onChange={(e) => setSpecFilter(e.target.value)}
                        className="w-full !pl-10 !pr-4 !py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#12141c] text-sm font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">All Specializations</option>
                        {specializations.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Clear filters */}
                {hasFilters && (
                    <button
                        onClick={() => { setSearch(""); setSpecFilter(""); }}
                        className="!px-4 !py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 shrink-0"
                    >
                        <X className="h-4 w-4" /> Clear
                    </button>
                )}
            </div>

            {/* Results count */}
            {!isLoading && !isError && (
                <p className="text-xs font-semibold text-slate-400">
                    {filtered.length === doctors.length
                        ? `Showing all ${doctors.length} doctors`
                        : `${filtered.length} of ${doctors.length} doctors match your search`}
                </p>
            )}

            {/* Doctor Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : isError ? (
                <div className="!py-16 text-center space-y-3 bg-white dark:bg-[#12141c] rounded-3xl border border-rose-200 dark:border-rose-900/30">
                    <p className="text-base font-bold text-rose-700 dark:text-rose-300">Failed to load doctors</p>
                    <p className="text-xs text-slate-400">Please check your connection and try again.</p>
                    <button
                        onClick={() => refetch()}
                        className="!px-5 !py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="!py-16 text-center space-y-3 bg-white dark:bg-[#12141c] rounded-3xl border border-slate-200/80 dark:border-slate-800">
                    <Stethoscope className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">No Doctors Found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {hasFilters ? "Try adjusting your search or filters." : "No approved doctors are available at this time."}
                    </p>
                    {hasFilters && (
                        <button
                            onClick={() => { setSearch(""); setSpecFilter(""); }}
                            className="!px-5 !py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((doctor) => (
                        <DoctorCard
                            key={doctor.doctorId}
                            doctor={doctor}
                            onBook={setBookingDoctor}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
