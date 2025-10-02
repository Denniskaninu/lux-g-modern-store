
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
  
  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
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
