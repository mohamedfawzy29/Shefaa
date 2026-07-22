import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#ebf0ed] dark:bg-[#090b0e] !p-4 md:p-6 gap-4 md:gap-6 transition-colors duration-300 w-full">
            {/* Sidebar component */}
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main content viewport */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar
                    onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
                />

                <main className="flex-1 min-w-0 !mt-2 overflow-y-auto overflow-x-visible">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;