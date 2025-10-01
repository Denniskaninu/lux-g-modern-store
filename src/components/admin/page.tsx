
"use client";

import { useEffect, useState, Suspense } from "react";
import { getSales } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import LowStockAlerts from "@/components/admin/low-stock-alerts";
import { Skeleton } from "@/components/ui/skeleton";
import type { Sale } from "@/lib/types";

export default function AdminDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const salesData = await getSales();
        setSales(salesData);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.sp * sale.quantity, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalSales = sales.length;

  if (loading) {
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
    )
  }

  return (
    <div className="flex flex-col gap-8">
       <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
            <p className="text-muted-foreground">Here's an overview of your store's performance.</p>
        </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Total revenue from all sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              Total profit after costs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Total number of sales transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>}>
        <LowStockAlerts />
      </Suspense>

    </div>
  );
}
