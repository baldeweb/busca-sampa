import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../header/Header";
import { AppFooter } from "./AppFooter";

export default function AppLayout() {
    const location = useLocation();
    const showHeader = location.pathname === "/";

    return (
        <div className="min-h-screen bg-bs-bg text-white">
            {showHeader && <Header />}
            <main className={"mx-auto max-w-5xl px-4 pb-20 pt-0"}>
                <Outlet />
            </main>
            <AppFooter />
        </div>
    );
}