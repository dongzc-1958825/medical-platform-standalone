import { Outlet } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";

export default function MobileLayout() {
  return (
    <div className="mobile-layout min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
        <h1 className="text-lg font-bold text-center">众创医案</h1>
      </header>
      
      <main className="pb-16 px-4 py-4 min-h-[calc(100vh-8rem)]">
        <Outlet />
      </main>
      
      <MobileBottomNav />
    </div>
  );
}