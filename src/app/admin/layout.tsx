import AdminGuard from "../../components/AdminGuard";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen w-full flex-row-reverse bg-[#f6f7f8] dark:bg-[#101922]">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full lg:w-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
