
"use client";

import { useEffect, useState } from "react";
import { getSales, getProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Warehouse } from "lucide-react";
import type { Sale, Product } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "../auth-provider";

export default function AdminDashboardContent() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user || !isClient) {
      if(isClient) setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const [salesData, productsData] = await Promise.all([
            getSales(),
            getProducts()
        ]);
        setSales(salesData);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user, isClient]);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.sp * sale.quantity, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalSales = sales.length;
  const netWorthBp = products.reduce((sum, product) => sum + product.bp * product.quantity, 0);
  const netWorthSp = products.reduce((sum, product) => sum + product.sp * product.quantity, 0);

  if (loading) {
     return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
                    <CardContent><Skeleton className="h-8 w-32" /></CardContent>
                </Card>
            ))}
        </div>
     );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
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
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth (Cost)</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netWorthBp)}</div>
            <p className="text-xs text-muted-foreground">
              Total value of stock at cost
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth (Potential)</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netWorthSp)}</div>
            <p className="text-xs text-muted-foreground">
              Potential revenue from current stock
            </p>
          </CardContent>
        </Card>
      </div>
  );
}
