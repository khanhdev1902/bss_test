import httpClient from "./httpClient";

export interface Product {
  id: number;
  name: string;
  stock: number;
  imageUrl: string;
  price: number;
}

export interface FlashSaleItem {
  id: number;
  productId: number;
  startDate: string;
  endDate: string;
  discount: number;
  product: Product;
}

export const getFlashSales = async (): Promise<FlashSaleItem[]> => {
  const res = await httpClient.get("/flash-sale");
  return res.data;
};


export const buyFlashSale = async (phone: string, productId: number) => {
  const res = await httpClient.post("/flash-sale/buy", {
    phone,
    productId,
  });
  return res.data;
};