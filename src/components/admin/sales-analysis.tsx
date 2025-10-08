
"use client";

import { useEffect, useState, useMemo } from "react";
import { getSalesWithProductDetails } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Trophy } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "../auth-provider";
import type { SaleWithProduct } from "@/lib/types";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, toDate, format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type TimePeriod = 'today' | 'week' | 'month' | 'year';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}


export default function SalesAnalysis() {
  const { user } = useAuth();
  const [sales, setSales] = useState<SaleWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user || !isClient) {
      if (isClient) setLoading(false);
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
  }, [user, isClient]);
  
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
      if (!sale.soldAt) return false;
      const saleDate = toDate(sale.soldAt.seconds * 1000 + sale.soldAt.nanoseconds / 1000000);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }, [sales, timePeriod]);


  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.sp * sale.quantity, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);

  const bestSellingProduct = useMemo(() => {
    if (filteredSales.length === 0) return null;

    const productSales = new Map<string, { name: string; quantity: number }>();

    filteredSales.forEach(sale => {
      const productName = `${sale.productName} (${sale.productColor}, ${sale.productSize})`;
      const existing = productSales.get(productName);
      if (existing) {
        existing.quantity += sale.quantity;
      } else {
        productSales.set(productName, { name: productName, quantity: sale.quantity });
      }
    });

    let bestSeller = { name: '', quantity: 0 };
    productSales.forEach(product => {
      if (product.quantity > bestSeller.quantity) {
        bestSeller = product;
      }
    });

    return bestSeller;
  }, [filteredSales]);

  const downloadPdf = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const tableColumn = ["Product Name", "Qty", "Revenue", "Profit"];
    const tableRows: (string | number)[][] = [];

    filteredSales.forEach(sale => {
        const saleData = [
            `${sale.productName} (${sale.productColor}, ${sale.productSize})`,
            sale.quantity,
            formatCurrency(sale.sp * sale.quantity, 'KES'),
            formatCurrency(sale.profit, 'KES'),
        ];
        tableRows.push(saleData);
    });

    const capFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(38, 92, 50); // Primary color
    doc.text("LUX G MODERN COLLECTION", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Sales Analysis Report", doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Period: ${capFirst(timePeriod)}`, 14, 40);
    doc.text(`Date Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, doc.internal.pageSize.getWidth() - 14, 40, { align: 'right' });


    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'striped',
        headStyles: { fillColor: [38, 92, 50] },
        didDrawPage: (data) => {
            // Footer on each page
            const pageCount = doc.internal.pages.length;
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Page ${data.pageNumber} of ${pageCount-1}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 60;
    
    // Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Summary", 14, finalY + 15);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const summaryY = finalY + 25;
    
    doc.autoTable({
      body: [
        ['Total Revenue', formatCurrency(totalRevenue, 'KES')],
        ['Total Profit', formatCurrency(totalProfit, 'KES')],
        ['Total Sales Items', filteredSales.reduce((acc, s) => acc + s.quantity, 0)],
        ['Best Selling Product', bestSellingProduct ? `${bestSellingProduct.name} (${bestSellingProduct.quantity} units)` : 'N/A'],
      ],
      startY: summaryY,
      theme: 'grid',
      columnStyles: { 0: { fontStyle: 'bold' } },
    });


    doc.save(`LUX-G_Sales_Report_${timePeriod}_${new Date().toISOString().split('T')[0]}.pdf`);
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
        {bestSellingProduct && (
          <div className="mb-6 p-4 bg-accent/50 rounded-lg border border-dashed flex items-center gap-4">
            <Trophy className="h-8 w-8 text-amber-500" />
            <div>
              <h4 className="font-semibold text-accent-foreground">Best Selling Product</h4>
              <p className="text-muted-foreground">{bestSellingProduct.name} - <span className="font-bold">{bestSellingProduct.quantity} units sold</span></p>
            </div>
          </div>
        )}
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
