import DashboardGuard
from "@/components/dashboard/DashboardGuard";

import AppNavbar
from "@/components/navbar/AppNavbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <DashboardGuard>

      <AppNavbar />

      <main
        className="
          pt-24
          pb-10
        "
      >
        {children}
      </main>

    </DashboardGuard>
  );
}