import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../header/Header";
import { AppFooter } from "./AppFooter";

export default function AppLayout() {
    const location = useLocation();
    const showHeader = location.pathname === "/";

    return (
        <div className="min-h-screen flex flex-col bg-bs-bg text-white">
            {showHeader && <Header />}
            <main
                className={"flex-1 w-full pt-0"}
                style={{ paddingBottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
            >
                <Outlet />
            </main>
            <AppFooter />
        </div>
    );
}