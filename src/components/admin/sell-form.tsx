"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sellProduct } from "@/lib/data";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  sp: z.coerce.number().min(0, "Selling price must be a positive number."),
});

interface SellFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function SellForm({ isOpen, onOpenChange, product }: SellFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      sp: product.sp,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        quantity: 1,
        sp: product.sp,
      });
    }
  }, [isOpen, product, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    if (values.quantity > product.quantity) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Cannot sell more items than are in stock.",
        });
        setLoading(false);
        return;
    }
    try {
      await sellProduct(product.id, values.quantity, values.sp);
      toast({ title: "Success", description: "Sale recorded successfully." });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while recording the sale.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell Product</DialogTitle>
          <DialogDescription>
            Record a sale for: {product.name} ({product.color}, {product.size})
            <br />
            Currently in stock: {product.quantity}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Sold</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price (per item)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Sale
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
