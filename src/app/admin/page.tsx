"use client";

import { Suspense } from "react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import LowStockAlerts from "@/components/admin/low-stock-alerts";
import { Skeleton } from "@/components/ui/skeleton";
import AdminDashboardContent from "@/components/admin/admin-dashboard-content";

export default function AdminDashboard() {

  return (
    <div className="flex flex-col gap-8">
       <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
            <p className="text-muted-foreground">Here's an overview of your store's performance.</p>
        </div>
      
      <Suspense fallback={
         <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
        </div>
      }>
        <AdminDashboardContent />
      </Suspense>


      <Suspense fallback={<Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>}>
        <LowStockAlerts />
      </Suspense>

    </div>
  );
}
