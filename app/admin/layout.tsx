import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
