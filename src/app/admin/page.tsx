"use client";

import { useState, useEffect, Suspense } from "react";
import AdminDashboardContent from "@/components/admin/admin-dashboard-content";
import LowStockAlerts from "@/components/admin/low-stock-alerts";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !user) {
    // Render a skeleton or null on the server and until authentication is confirmed.
    return (
      <div className="flex flex-col gap-8">
        <div>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-5 w-1/2 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
        </div>
        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Here's an overview of your store's performance.</p>
      </div>
      
      <Suspense fallback={<p>Loading dashboard...</p>}>
        <AdminDashboardContent />
      </Suspense>
      <Suspense fallback={<p>Loading alerts...</p>}>
        <LowStockAlerts />
      </Suspense>
    </div>
  );
}
