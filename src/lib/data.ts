
import type { Product, Sale } from './types';
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
  serverTimestamp,
  deleteDoc,
  runTransaction,
} from 'firebase/firestore';

export async function getProducts(options?: { limit?: number }): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const q = options?.limit
        ? query(productsRef, orderBy('createdAt', 'desc'), limit(options.limit))
        : query(productsRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
}

export async function getSales(): Promise<Sale[]> {
    const salesRef = collection(db, 'sales');
    const q = query(salesRef, orderBy('soldAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const sales: Sale[] = [];
    querySnapshot.forEach((doc) => {
        sales.push({ id: doc.id, ...doc.data() } as Sale);
    });
    return sales;
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(productId: string, product: Partial<Product>): Promise<void> {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, {
    ...product,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);
}

export async function sellProduct(
    productId: string,
    quantitySold: number,
    sellingPrice: number
): Promise<string> {
    const productRef = doc(db, 'products', productId);
    const salesRef = collection(db, 'sales');

    return runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
            throw "Document does not exist!";
        }

        const productData = productDoc.data() as Product;
        const newQuantity = productData.quantity - quantitySold;
        
        if (newQuantity < 0) {
            throw "Not enough stock available.";
        }

        transaction.update(productRef, { quantity: newQuantity });

        const profit = (sellingPrice - productData.bp) * quantitySold;

        const saleData = {
            productId: productId,
            quantity: quantitySold,
            sp: sellingPrice,
            bp: productData.bp,
            profit: profit,
            soldAt: serverTimestamp(),
        };

        const saleDocRef = doc(collection(db, "sales"));
        transaction.set(saleDocRef, saleData);
        
        return saleDocRef.id;
    });
}

export function getUniqueFilterOptions(products: Product[]) {
    const categories = [...new Set(products.map(p => p.category))];
    const colors = [...new Set(products.map(p => p.color))];
    const sizes = [...new Set(products.map(p => p.size))];
    return { categories, colors, sizes };
}

function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File): Promise<{secure_url: string, public_id: string}> {
  const fileDataUrl = await fileToDataURI(file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: fileDataUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Image upload failed');
  }

  return response.json();
}
