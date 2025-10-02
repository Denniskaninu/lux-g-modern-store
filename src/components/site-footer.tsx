"use client";

import { useEffect, useState } from 'react';
import { Facebook, Instagram, Twitter, Gem, MapPin, Mail, Phone } from 'lucide-react';
import Logo from './logo';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const [locationImageUrl, setLocationImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "store");
        const docSnap = await getDoc(settingsRef);
        if (docSnap.exists() && docSnap.data().locationImageUrl) {
          setLocationImageUrl(docSnap.data().locationImageUrl);
        }
      } catch (error) {
        console.error("Error fetching location image:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-baseline gap-2">
                <Logo />
                <span className="font-headline text-lg font-bold uppercase tracking-wider text-foreground">
                    MODERN COLLECTION
                </span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Dealer in: Trendy men fashion ie designer jeans, jackets, shirts, t-shirts, shoes, sandals, inner wears, watches, caps, beanies, belts etc.
            </p>
            <div className="mt-4">
                <h4 className="font-headline font-semibold mb-4 text-primary">Follow Us</h4>
                <div className="flex space-x-2">
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Facebook">
                    <Facebook />
                    </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Instagram">
                    <Instagram />
                    </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Twitter">
                    <Twitter />
                    </a>
                </Button>
                </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-headline font-semibold text-primary">Find Us</h4>
            <address className="not-italic text-muted-foreground space-y-3">
                <div className='flex items-start gap-3'>
                    <MapPin className="h-5 w-5 mt-1 text-primary shrink-0" />
                    <span>Karatina University, Overfourty Business Centre, Karatina</span>
                </div>
                <div className='flex items-center gap-3'>
                    <Mail className="h-5 w-5 text-primary shrink-0" />
                    <a href="mailto:support@luxg.co.ke" className="hover:text-primary transition-colors">support@luxg.co.ke</a>
                </div>
                <div className='flex items-center gap-3'>
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <a href="tel:+254741791259" className="hover:text-primary transition-colors">+254 741 791 259</a>
                </div>
            </address>
          </div>

          <div>
            <h4 className="font-headline font-semibold mb-4 text-primary">Our Location</h4>
            {loading ? (
                <Skeleton className="w-full aspect-square rounded-lg" />
            ) : locationImageUrl ? (
                <div className="overflow-hidden rounded-lg border">
                    <Image 
                        src={locationImageUrl} 
                        alt="Store location map" 
                        width={300} 
                        height={300}
                        className="object-cover w-full aspect-square"
                    />
                </div>
            ) : (
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-center p-4 text-sm text-muted-foreground">
                    Location image not available.
                </div>
            )}
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground flex justify-between items-center">
          <p>&copy; {currentYear} LUX G MODERN COLLECTION. All rights reserved.</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/login" aria-label="Admin Login">
                    <Gem className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Admin Login</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
}
