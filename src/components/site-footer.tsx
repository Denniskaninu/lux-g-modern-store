import { Facebook, Instagram, Twitter, Gem } from 'lucide-react';
import Logo from './logo';
import { Button } from './ui/button';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-baseline gap-2">
                <Logo />
                <span className="font-headline text-lg font-bold uppercase tracking-wider text-foreground">
                    MODERN COLLECTION
                </span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Dealer in:Trendy men fashion ie designer jeans, jackets, shirts, tshirts shoes, sandals, inner wears, watches, caps, beanies, belts etc.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-semibold mb-4 text-primary">Find Us</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Email: support@luxg.co.ke</li>
              <li>Phone: +254 741 791 259</li>
              <li>Karatina University, Overfourty Business Centre</li>
            </ul>
          </div>
          <div>
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
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground flex justify-between items-center">
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
