
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
import { WhatsAppIcon } from './icons';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const [locationImageUrl, setLocationImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationImage = async () => {
        try {
            const settingsRef = doc(db, "settings", "store");
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists() && docSnap.data().locationImageUrl) {
                setLocationImageUrl(docSnap.data().locationImageUrl);
            }
        } catch (error) {
            console.error("Error fetching location image for footer:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchLocationImage();
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">Quality is our priority. Trendy men's fashion including designer jeans, jackets, shirts, shoes, and more.</p>
            <div className="flex space-x-2">
              <Button asChild variant="ghost" size="icon">
                <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold font-headline">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Karatina University, Overfourty Business Centre</span>
              </li>
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="h-5 w-5 text-primary shrink-0" />
                <a href="https://wa.me/254741791259" target='_blank' rel="noopener noreferrer" className="hover:text-primary transition-colors">+254 741 791 259</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:symonmacharia399@gmail.com" className="hover:text-primary transition-colors">symonmacharia399@gmail.com</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold font-headline">Our Location</h3>
            <div className="aspect-video relative rounded-lg overflow-hidden border">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <Image 
                  src={locationImageUrl || "https://picsum.photos/seed/locationmap/600/400"}
                  alt="Store location map"
                  data-ai-hint="store location map" 
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
          <p className="text-sm text-muted-foreground">&copy; {currentYear} LUX G MODERN COLLECTION. All rights reserved.</p>
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
