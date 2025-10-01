"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addProduct, updateProduct, uploadImage } from "@/lib/data";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  color: z.string().min(2, "Color is required."),
  size: z.string().min(1, "Size is required."),
  bp: z.coerce.number().min(0, "Buying price must be a positive number."),
  sp: z.coerce.number().min(0, "Selling price must be a positive number."),
  quantity: z.coerce.number().int().min(0, "Quantity must be a positive integer."),
  image: z.any(),
});

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
}

export function ProductForm({
  isOpen,
  onOpenChange,
  product,
}: ProductFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(product?.imageUrl || null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      color: "",
      size: "",
      bp: 0,
      sp: 0,
      quantity: 0,
      image: null,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        category: product.category,
        color: product.color,
        size: product.size,
        bp: product.bp,
        sp: product.sp,
        quantity: product.quantity,
        image: null,
      });
      setPreview(product.imageUrl);
    } else {
      form.reset({
        name: "",
        category: "",
        color: "",
        size: "",
        bp: 0,
        sp: 0,
        quantity: 0,
        image: null,
      });
      setPreview(null);
    }
  }, [product, form, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let imageUrl = product?.imageUrl || "";
      let imageHint = product?.imageHint || `${values.color} ${values.category}`;
      
      if (values.image) {
        const uploadResult = await uploadImage(values.image);
        imageUrl = uploadResult.secure_url;
      }
      
      const productData = {
        name: values.name,
        category: values.category,
        color: values.color,
        size: values.size,
        bp: values.bp,
        sp: values.sp,
        quantity: values.quantity,
        imageUrl,
        imageHint,
      };
      
      if (product) {
        await updateProduct(product.id, productData);
        toast({ title: "Success", description: "Product updated successfully." });
      } else {
        await addProduct(productData);
        toast({ title: "Success", description: "Product added successfully." });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "Update Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            Fill out the form below to {product ? "update the" : "add a new"} product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-md border border-dashed flex items-center justify-center bg-muted/40 relative">
                        {preview ? (
                          <Image src={preview} alt="preview" fill className="object-cover rounded-md" />
                        ) : (
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <Input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Nike Air Max" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input placeholder="e.g., Shoes" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="color" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl><Input placeholder="e.g., Black" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="size" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl><Input placeholder="e.g., 42" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4.  ">
              <FormField control={form.control} name="bp" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buying Price (BP)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 3500" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="sp" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price (SP)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 5500" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField control={form.control} name="quantity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl><Input type="number" placeholder="e.g., 20" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {product ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
