
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ProductCard from './product-card';
import { Search, X, Sparkles, MapPin } from 'lucide-react';
import { WhatsAppIcon } from './icons';
import Image from 'next/image';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  const [locationImageUrl, setLocationImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setCurrentWord(prevWord => {
        const currentIndex = marketingWords.indexOf(prevWord);
        const nextIndex = (currentIndex + 1) % marketingWords.length;
        return marketingWords[nextIndex];
      });
    }, 2500);

    const fetchLocationImage = async () => {
        try {
            const settingsRef = doc(db, "settings", "store");
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists() && docSnap.data().locationImageUrl) {
                setLocationImageUrl(docSnap.data().locationImageUrl);
            }
        } catch (error) {
            console.error("Error fetching location image:", error);
            setLocationImageUrl("https://picsum.photos/seed/locationmap/600/400");
        }
    }
    fetchLocationImage();

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (filterType: 'category' | 'color' | 'size') => (value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value === 'all' ? '' : value }));
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const galleryImages = useMemo(() => {
    if (!products || products.length === 0) {
      return Array.from({ length: 4 }).map((_, i) => ({
        imageUrl: `https://picsum.photos/seed/ig${i + 1}/400/400`,
        imageHint: 'comrade fashion',
        name: `Placeholder Image ${i + 1}`
      }));
    }
    const uniqueProducts = Array.from(new Map(products.map(p => [p.name, p])).values());
    const shuffled = [...uniqueProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [products]);


  return (
    <div className="space-y-16 md:space-y-24">
       <section className="relative text-center py-20 md:py-32 overflow-hidden rounded-b-3xl bg-card">
          <div className="absolute inset-0 z-0">
              <Image
                  src="https://picsum.photos/seed/fashionkenya/1200/800"
                  alt="Stylish models wearing modern fashion"
                  data-ai-hint="stylish comrades kenyan fashion"
                  fill
                  className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="container relative z-10 flex flex-col items-center">
              <div className="bg-primary/10 text-primary font-bold py-1 px-4 rounded-full mb-4 animate-bounce">
                  Comrade Discounts – Up to 20% Off!
              </div>

              <h1 className="font-headline text-4xl md:text-7xl font-bold tracking-tight text-foreground">
                  Chomoka na Nguo Fiti Kutoka lux G modern Collections!
              </h1>
              
              <div className="mt-4 text-lg md:text-xl text-muted-foreground h-8 flex items-center justify-center gap-2 font-semibold">
                <span key={currentWord} className="transition-all duration-300 animate-in fade-in">
                    {currentWord}
                </span>
              </div>

               <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
                  Dealer in: Trendy men fashion ie designer jeans, jackets, shirts, tshirts shoes, sandals,inner wears,watches,caps,beanies,belts etc
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
                      Shop Now
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}>
                      Visit Our Store in Karatina Over 40
                  </Button>
              </div>
          </div>
      </section>
      
      <div id="collection" className="scroll-mt-20">
        <div className="border-y bg-background/80 backdrop-blur-sm">
            <div className="container py-4">
              <div className="flex flex-col gap-2 md:gap-4 md:flex-row items-center">
                  <div className="relative w-full md:flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                          placeholder="Search by name or category..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full"
                      />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 w-full md:w-auto">
                    <Select value={filters.category} onValueChange={handleFilterChange('category')}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="All Categories" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filters.color} onValueChange={handleFilterChange('color')}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="All Colors" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Colors</SelectItem>
                            {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filters.size} onValueChange={handleFilterChange('size')}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="All Sizes" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sizes</SelectItem>
                            {sizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
              </div>
              {hasActiveFilters && (
                  <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="mr-2 h-4 w-4" /> Clear Filters
                      </Button>
                  </div>
              )}
            </div>
        </div>

        <div className="container py-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-headline font-bold flex items-center justify-center gap-2">
                  <Sparkles className="h-8 w-8 text-primary" /> Our Collection
              </h2>
              <p className="text-muted-foreground mt-2">Find your perfect fit. New arrivals weekly.</p>
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
                <p className="text-muted-foreground mt-2">Huku hakuna kitu! Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
      </div>
      
       <section className="bg-card py-16">
            <div className="container text-center">
                <h2 className="text-3xl font-headline font-bold">Join The Movement</h2>
                <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Show off your style! Tag us on Instagram with <span className="font-bold text-primary">#LuxGFiti</span> to get featured.</p>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((product, i) => (
                        <div key={i} className="aspect-square relative rounded-lg overflow-hidden group">
                             <Image
                                src={product.imageUrl}
                                alt={product.name}
                                data-ai-hint={product.imageHint || 'comrade fashion'}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
      </section>

       <section id="location" className="scroll-mt-20 container">
           <div className="grid md:grid-cols-2 gap-12 items-center bg-card rounded-lg p-8 md:p-12">
                <div>
                  <h2 className="text-3xl font-headline font-bold">Visit Us Mon – Sun</h2>
                  <p className="text-muted-foreground mt-2">Tupo Karatina University, Overfourty Business Centre. <span className="font-semibold text-primary">Kuona na kuguza ni bure!</span></p>
                  <div className="mt-8 space-y-4">
                      <div className='flex items-center gap-3'>
                          <MapPin className="h-5 w-5 text-primary shrink-0" />
                          <span>Karatina University, Overfourty Business Centre</span>
                      </div>
                      <div className='flex items-center gap-3'>
                          <WhatsAppIcon className="h-5 w-5 text-primary shrink-0" />
                          <a href="https://wa.me/254741791259" target='_blank' rel="noopener noreferrer" className="hover:text-primary transition-colors">+254 741 791 259</a>
                      </div>
                  </div>
                   <Button asChild className="mt-6">
                      <a href="https://wa.me/254741791259?text=Hello%2C%20I%E2%80%99m%20interested%20in%20your%20products." target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="mr-2 h-5 w-5" />
                        WhatsApp Us
                      </a>
                    </Button>
                </div>
                 <div className="aspect-video relative rounded-lg overflow-hidden border">
                     <Image 
                          src={locationImageUrl || "https://picsum.photos/seed/locationmap/600/400"}
                          alt="Store location map"
                          data-ai-hint="store location map" 
                          fill
                          className="object-cover"
                      />
                  </div>
           </div>
       </section>

        <section className="container text-center py-12">
            <h2 className="text-2xl md:text-3xl font-headline font-bold">Don’t Just Blend In. Stand Out.</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Chomoka na nguo fiti kutoka hapa Lux G Modern Collection!</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
                    Shop The Collection
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}>
                    Visit The Store
                </Button>
            </div>
        </section>
    </div>
  );
}
