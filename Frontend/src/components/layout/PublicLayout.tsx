import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090b0e] transition-colors duration-300">
            <PublicNavbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <PublicFooter />
        </div>
    );
}
