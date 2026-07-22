import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Star, Award, Clock, Stethoscope, Filter, X } from "lucide-react";
import { usePublicDoctors } from "../../hooks/usePublicDoctors";
import { useSpecializations } from "../../features/specializations/hooks/useSpecializations";
import { Avatar } from "../../components/ui/Avatar";
import type { DoctorResponse } from "../../features/doctors/types/doctor";

// ─── Doctor Card ──────────────────────────────────────────────────────────────

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
                        <div className="flex items-center gap-1 !mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${i < Math.round(doctor.averageRating) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                                />
                            ))}
                            <span className="ml-1 text-xs font-semibold text-slate-600 dark:text-slate-400">{doctor.averageRating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div className="!mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 !pt-3">
                    <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" /> {doctor.yearsOfExperience} yrs exp.
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Available
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

const PAGE_SIZE = 12;

export default function PublicDoctorsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") ?? "");
    const [selectedSpec, setSelectedSpec] = useState(searchParams.get("specialization") ?? "");
    const [page, setPage] = useState(1);

    const { data: doctors = [], isLoading } = usePublicDoctors();
    const { data: specializations = [] } = useSpecializations();

    // Sync URL → state on mount
    useEffect(() => {
        setSearch(searchParams.get("q") ?? "");
        setSelectedSpec(searchParams.get("specialization") ?? "");
    }, []);

    const filtered = useMemo(() => {
        let result = doctors;
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (d) =>
                    `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
                    d.specialization.toLowerCase().includes(q)
            );
        }
        if (selectedSpec) {
            result = result.filter((d) => d.specialization.toLowerCase() === selectedSpec.toLowerCase());
        }
        return result;
    }, [doctors, search, selectedSpec]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        const params: Record<string, string> = {};
        if (search) params.q = search;
        if (selectedSpec) params.specialization = selectedSpec;
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedSpec("");
        setPage(1);
        setSearchParams({});
    };

    const hasFilters = !!search || !!selectedSpec;

    return (
        <div className="min-h-screen">
            {/* Header banner */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#1e2d48] to-[#0F172A] !pt-16 !pb-12">
                <div className="max-w-7xl mx-auto !px-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white !mb-2">Find a Doctor</h1>
                    <p className="text-slate-400 !mb-8">Browse our verified medical professionals and book an appointment.</p>

                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or specialization…"
                                className="w-full !pl-11 !pr-4 !py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                        </div>
                        <select
                            value={selectedSpec}
                            onChange={(e) => setSelectedSpec(e.target.value)}
                            className="!px-4 !py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
                        >
                            <option value="" className="text-slate-900">All Specializations</option>
                            {specializations.map((s) => (
                                <option key={s.id} value={s.name} className="text-slate-900">{s.name}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="!px-6 !py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 justify-center cursor-pointer"
                        >
                            <Filter className="h-4 w-4" /> Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto !px-6 !py-10">
                {/* Info bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 !mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{filtered.length}</span> doctors found
                    </p>
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" /> Clear filters
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#12141c] rounded-2xl border border-slate-200 dark:border-slate-800 !p-5 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                                    <div className="flex-1 space-y-2 !pt-1">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="flex flex-col items-center justify-center !py-24 text-center">
                        <Stethoscope className="h-14 w-14 text-slate-300 dark:text-slate-600 !mb-4" />
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No doctors found</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 !mt-1">Try adjusting your search or filters.</p>
                        {hasFilters && (
                            <button onClick={clearFilters} className="!mt-4 text-sm text-cyan-600 dark:text-cyan-400 underline cursor-pointer">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginated.map((doc) => (
                                <DoctorCard key={doc.doctorId} doctor={doc} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 !mt-10">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="!px-4 !py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={[
                                            "h-9 w-9 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                                            page === i + 1
                                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                                                : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                                        ].join(" ")}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="!px-4 !py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
