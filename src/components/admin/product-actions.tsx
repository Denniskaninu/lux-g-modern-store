"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/lib/types";
import { ProductForm } from "./product-form";
import { SellForm } from "./sell-form";
import { DeleteProductDialog } from "./delete-product-dialog";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setSellModalOpen(true)}>
            Sell
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUpdateModalOpen(true)}>
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ProductForm 
        isOpen={isUpdateModalOpen}
        onOpenChange={setUpdateModalOpen}
        product={product}
      />
      
      <SellForm
        isOpen={isSellModalOpen}
        onOpenChange={setSellModalOpen}
        product={product}
      />
      
      <DeleteProductDialog
        productId={product.id}
        isOpen={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
    </div>
  );
}
