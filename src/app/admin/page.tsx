"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LowStockAlerts from "@/components/admin/low-stock-alerts";
import { Skeleton } from "@/components/ui/skeleton";
import AdminDashboardContent from "@/components/admin/admin-dashboard-content";

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Return null on the server to avoid any rendering issues
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
