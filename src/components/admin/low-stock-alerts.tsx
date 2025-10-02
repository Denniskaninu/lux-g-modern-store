"use client";

import { useEffect, useState } from "react";
import { getProducts, getSales } from "@/lib/data";
import { generateLowStockAlerts, LowStockAlertsOutput } from "@/ai/flows/low-stock-alerts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TriangleAlert } from "lucide-react";
import { Product, Sale } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "../auth-provider";
import { Timestamp } from "firebase/firestore";

export default function LowStockAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<LowStockAlertsOutput['alerts']>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user || !isClient) {
       if (isClient) setLoading(false);
      return;
    }

    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const [productsData, salesData] = await Promise.all([getProducts(), getSales()]);
        setProducts(productsData);

        if (productsData.length > 0 && salesData.length > 0) {
            // Convert Timestamps to strings before sending to the server action
            const plainProducts = productsData.map(p => ({
              ...p,
              createdAt: p.createdAt instanceof Timestamp ? p.createdAt.toDate().toISOString() : String(p.createdAt),
              updatedAt: p.updatedAt instanceof Timestamp ? p.updatedAt.toDate().toISOString() : String(p.updatedAt),
            }));

            const plainSales = salesData.map(s => ({
              ...s,
              soldAt: s.soldAt instanceof Timestamp ? s.soldAt.toDate().toISOString() : String(s.soldAt),
            }));

            const result = await generateLowStockAlerts({ products: plainProducts, sales: plainSales });
            setAlerts(result.alerts);
        }
      } catch (error) {
        console.error("Error generating low stock alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user, isClient]);

  if (loading) {
    return (
         <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-24 w-full" />
            </CardContent>
         </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent-foreground" />
          Intelligent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const product = products.find(p => p.id === alert.productId);
              return (
                <Alert key={alert.productId} variant="destructive">
                  <TriangleAlert className="h-4 w-4" />
                  <AlertTitle>
                    {product ? `${product.name} (${product.color}, ${product.size})` : 'Low Stock Warning'}
                  </AlertTitle>
                  <AlertDescription>
                    {alert.message}
                    {product && ` Current stock: ${product.quantity}.`}
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>All stock levels are looking good!</p>
            <p className="text-sm">No restocking alerts at this time.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
