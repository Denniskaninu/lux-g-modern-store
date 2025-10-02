import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from './icons';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254741791259';
  const message = `Hello, I’m interested in this product:\nName: ${product.name}\nCategory: ${product.category}\nColor: ${product.color}\nSize: ${product.size}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group border-border/80">
      <CardHeader className="p-0 relative">
        <div className="overflow-hidden aspect-[4/3]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            data-ai-hint={product.imageHint}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-lg font-bold leading-tight font-headline">{product.name}</CardTitle>
        <div className="text-sm text-muted-foreground mt-1 flex-grow">
          <span>{product.category}</span>
          <span className="mx-1.5">•</span>
          <span>{product.color}</span>
          <span className="mx-1.5">•</span>
          <span>Size {product.size}</span>
        </div>
        <p className="text-xl font-bold mt-2 text-primary">{formatCurrency(product.sp)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="mr-2 h-5 w-5" />
            Order on WhatsApp
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
