import { Sidebar } from "@/components/layout/sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      {/* Sidebar - Desktop Only for now */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppNavbar />
        
        <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-8">
          <div className="max-w-[1440px] mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
