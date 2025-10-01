"use client";

import { useState, useEffect } from "react";
import AdminDashboardContent from "@/components/admin/admin-dashboard-content";
import LowStockAlerts from "@/components/admin/low-stock-alerts";
import { useAuth } from "@/components/auth-provider";

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !user) {
    return null; // Render nothing on the server or until authenticated on the client
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Here's an overview of your store's performance.</p>
      </div>
      
      <AdminDashboardContent />
      <LowStockAlerts />
    </div>
  );
}
