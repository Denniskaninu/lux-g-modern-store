"use client";

import { useEffect, useState, useMemo } from "react";
import { getSalesWithProductDetails } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "../auth-provider";
import type { SaleWithProduct } from "@/lib/types";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, toDate } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type TimePeriod = 'today' | 'week' | 'month' | 'year';

export default function SalesAnalysis() {
  const { user } = useAuth();
  const [sales, setSales] = useState<SaleWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const salesData = await getSalesWithProductDetails();
        setSales(salesData);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);
  
  const filteredSales = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (timePeriod) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }
    
    return sales.filter(sale => {
      // The 'soldAt' could be a Firestore Timestamp object or a JS Date.
      // toDate() handles both cases gracefully.
      if (!sale.soldAt) return false;
      const saleDate = toDate(sale.soldAt.seconds * 1000 + sale.soldAt.nanoseconds / 1000000);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }, [sales, timePeriod]);


  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.sp * sale.quantity, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);

  const downloadPdf = () => {
    const doc = new jsPDF();
    const tableColumn = ["Product Name", "Qty", "Revenue", "Profit"];
    const tableRows: (string | number)[][] = [];

    filteredSales.forEach(sale => {
        const saleData = [
            `${sale.productName} (${sale.productColor}, ${sale.productSize})`,
            sale.quantity,
            formatCurrency(sale.sp * sale.quantity, 'USD'),
            formatCurrency(sale.profit, 'USD'),
        ];
        tableRows.push(saleData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        didDrawPage: function (data) {
          doc.setFontSize(20);
          doc.text("Sales Analysis Report", data.settings.margin.left, 15);
        }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text(`Total Revenue: ${formatCurrency(totalRevenue, 'USD')}`, 14, finalY + 15);
    doc.text(`Total Profit: ${formatCurrency(totalProfit, 'USD')}`, 14, finalY + 22);

    doc.save(`sales_report_${timePeriod}_${new Date().toISOString().split('T')[0]}.pdf`);
  };


  if (loading) {
     return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
     );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <CardTitle>Sales Analysis</CardTitle>
                <CardDescription>An overview of your sales performance.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                </Select>
                 <Button onClick={downloadPdf} variant="outline" size="icon" disabled={filteredSales.length === 0}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download PDF</span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length > 0 ? (
                filteredSales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="font-medium">{sale.productName}</div>
                    <div className="text-sm text-muted-foreground">{sale.productColor}, {sale.productSize}</div>
                  </TableCell>
                  <TableCell className="text-center">{sale.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.sp * sale.quantity)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.profit)}</TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No sales found for this period.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
          {filteredSales.length > 0 && (
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2} className="font-bold text-right">Totals</TableCell>
                    <TableCell className="font-bold text-right">{formatCurrency(totalRevenue)}</TableCell>
                    <TableCell className="font-bold text-right">{formatCurrency(totalProfit)}</TableCell>
                </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}
