
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/data";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2, Camera } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const settingsSchema = z.object({
  locationImage: z.any().optional(),
});

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      try {
        const settingsRef = doc(db, "settings", "store");
        const docSnap = await getDoc(settingsRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.locationImageUrl) {
            setPreview(data.locationImageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("locationImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    setLoading(true);
    try {
      let imageUrl = preview;

      if (values.locationImage && values.locationImage instanceof File) {
        const uploadResult = await uploadImage(values.locationImage, 'store-location');
        imageUrl = uploadResult.secure_url;
      }
      
      const settingsRef = doc(db, "settings", "store");
      await setDoc(settingsRef, { locationImageUrl: imageUrl }, { merge: true });

      toast({
        title: "Success!",
        description: "Store settings have been updated.",
      });
      router.push("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error.message || "Could not update settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-32" />
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
        <CardDescription>
          Manage general store settings, like the location image displayed in the footer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="locationImage"
              render={() => (
                <FormItem>
                  <FormLabel>Store Location Image</FormLabel>
                  <FormControl>
                    <div>
                      <div className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center bg-muted/40 relative mb-4">
                        {preview ? (
                          <Image
                            src={preview}
                            alt="Store Location Preview"
                            fill
                            className="object-contain rounded-md"
                          />
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <Camera className="w-12 h-12 mx-auto" />
                            <p>Upload an image for your store's location</p>
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
