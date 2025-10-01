"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { ProductActions } from "./product-actions"

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center gap-4">
           <Image
            src={product.imageUrl}
            alt={product.name}
            width={40}
            height={40}
            data-ai-hint={product.imageHint}
            className="rounded-md object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium">{product.name}</span>
            <span className="text-xs text-muted-foreground">{product.category}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "quantity",
    header: "Stock",
    cell: ({ row }) => {
      const quantity = row.original.quantity
      let variant: "default" | "destructive" | "secondary" = "secondary"
      if (quantity < 10) {
        variant = "destructive"
      } else if (quantity > 20) {
        variant = "default"
      }
      return <Badge variant={variant}>{quantity} in stock</Badge>
    },
  },
  {
    accessorKey: "sp",
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sp"))
      return <div className="text-right font-medium">{formatCurrency(amount)}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original
      return <ProductActions product={product} />
    },
  },
]
