'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating low stock alerts based on sales data and stock levels.
 *
 * - generateLowStockAlerts - A function that generates low stock alerts for products.
 * - LowStockAlertsInput - The input type for the generateLowStockAlerts function.
 * - LowStockAlertsOutput - The return type for the generateLowStockAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LowStockAlertsInputSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      color: z.string(),
      size: z.string(),
      bp: z.number(),
      sp: z.number(),
      quantity: z.number(),
      imageUrl: z.string(),
    })
  ).describe('Array of product objects with details like name, category, color, size, buying price, selling price, quantity and image URL'),
  sales: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      sp: z.number(),
      bp: z.number(),
      profit: z.number(),
      soldAt: z.string(),
    })
  ).describe('Array of sales objects with details like product ID, quantity, selling price, buying price, profit, and sold at timestamp'),
});

export type LowStockAlertsInput = z.infer<typeof LowStockAlertsInputSchema>;

const LowStockAlertsOutputSchema = z.object({
  alerts: z.array(
    z.object({
      productId: z.string(),
      message: z.string().describe('Alert message indicating low stock and potential need for restocking'),
    })
  ).describe('Array of alert objects for products needing restocking'),
});

export type LowStockAlertsOutput = z.infer<typeof LowStockAlertsOutputSchema>;

export async function generateLowStockAlerts(input: LowStockAlertsInput): Promise<LowStockAlertsOutput> {
  return lowStockAlertsFlow(input);
}

const lowStockAlertsPrompt = ai.definePrompt({
  name: 'lowStockAlertsPrompt',
  input: {schema: LowStockAlertsInputSchema},
  output: {schema: LowStockAlertsOutputSchema},
  prompt: `You are an inventory management expert for a small retail store. Analyze the provided product and sales data to identify products that are running low on stock.

A product is considered to be running low on stock if its quantity is less than 4.

Products:
{{#each products}}
- Name: {{name}}, Category: {{category}}, Color: {{color}}, Size: {{size}}, Stock: {{quantity}}
{{/each}}

Sales Data:
{{#each sales}}
- Product ID: {{productId}}, Quantity Sold: {{quantity}}, Sold At: {{soldAt}}
{{/each}}

Based on this information, generate a list of alerts for products that need restocking. The alert message should be concise and informative.

Output the alerts in JSON format:
{
  "alerts": [
    {
      "productId": "product_id",
      "message": "Alert message"
    }
  ]
}
`,
});

const lowStockAlertsFlow = ai.defineFlow(
  {
    name: 'lowStockAlertsFlow',
    inputSchema: LowStockAlertsInputSchema,
    outputSchema: LowStockAlertsOutputSchema,
  },
  async input => {
    const {output} = await lowStockAlertsPrompt(input);
    return output!;
  }
);
