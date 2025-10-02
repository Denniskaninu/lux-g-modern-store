
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ProductCard from './product-card';
import { Search, X, ArrowDown } from 'lucide-react';

const marketingWords = ["Bei Poa", "Nguo Fiti", "Original", "Mali Safi"];

interface StorefrontProps {
  products: Product[];
  categories: string[];
  colors: string[];
  sizes: string[];
}

export default function Storefront({ products, categories, colors, sizes }: StorefrontProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    size: '',
  });
  const [currentWord, setCurrentWord] = useState(marketingWords[0]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setCurrentWord(prevWord => {
        const currentIndex = marketingWords.indexOf(prevWord);
        const nextIndex = (currentIndex + 1) % marketingWords.length;
        return marketingWords[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (filterType: 'category' | 'color' | 'size') => (value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value === 'all' ? '' : value }));
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ category: '', color: '', size: '' });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filters.category ? product.category === filters.category : true;
      const matchColor = filters.color ? product.color === filters.color : true;
      const matchSize = filters.size ? product.size === filters.size : true;
      return matchSearch && matchCategory && matchColor && matchSize;
    });
  }, [products, searchTerm, filters]);
  
  const hasActiveFilters = searchTerm || filters.category || filters.color || filters.size;

  return (
    <div className="space-y-8">
       <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-background/50 z-0" />
        <div className="container relative z-20">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">Chomoka na Nguo Fiti!</h1>
          {isClient && (
            <div className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto h-16 md:h-8 flex flex-col md:flex-row items-center justify-center gap-2">
                <p>Get the best deals on</p>
                <div className="relative h-8 w-32 font-bold text-foreground">
                    {marketingWords.map(word => (
                        <span key={word} className={`absolute inset-0 transition-all duration-500 ease-in-out ${word === currentWord ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                            {word}.
                        </span>
                    ))}
                </div>
            </div>
          )}

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Hapa ni quality na style tu! We have the latest trends in men's fashion at prices that make sense.
          </p>

          <div className="mt-8">
            <Button size="lg" variant="outline" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
                View Our Products
                <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </section>
      
      <div id="collection" className="sticky top-[65px] z-40 bg-background/95 backdrop-blur-sm py-4 border-b border-t">
        <div className="container space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.category} onValueChange={handleFilterChange('category')}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.color} onValueChange={handleFilterChange('color')}>
              <SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.size} onValueChange={handleFilterChange('size')}>
              <SelectTrigger><SelectValue placeholder="Size" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {sizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           {hasActiveFilters && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-medium">No products found</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
