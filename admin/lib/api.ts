const BASE = "http://localhost:3000/api";

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

// Products
export const getProducts = (params?: Record<string, string>) => {
  const q = params ? "?" + new URLSearchParams(params).toString() : "";
  return req<import("./types").Product[]>(`/products${q}`);
};
export const getProduct = (id: string) => req<import("./types").Product>(`/products/${id}`);
export const createProduct = (data: Partial<import("./types").Product>) =>
  req<import("./types").Product>("/products", { method: "POST", body: JSON.stringify(data) });
export const updateProduct = (id: string, data: Partial<import("./types").Product>) =>
  req<import("./types").Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProduct = (id: string) =>
  req<{ ok: boolean }>(`/products/${id}`, { method: "DELETE" });

// Orders
export const getOrders = () => req<import("./types").Order[]>("/orders");
export const getOrder = (id: string) => req<import("./types").Order>(`/orders/${id}`);
export const updateOrder = (id: string, data: Partial<import("./types").Order>) =>
  req<import("./types").Order>(`/orders/${id}`, { method: "PUT", body: JSON.stringify(data) });

// Customers
export const getCustomers = () => req<import("./types").Customer[]>("/customers");

// Discounts
export const getDiscounts = () => req<import("./types").Discount[]>("/discounts");
export const createDiscount = (data: Partial<import("./types").Discount>) =>
  req<import("./types").Discount>("/discounts", { method: "POST", body: JSON.stringify(data) });
export const updateDiscount = (id: string, data: Partial<import("./types").Discount>) =>
  req<import("./types").Discount>(`/discounts/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteDiscount = (id: string) =>
  req<{ ok: boolean }>(`/discounts/${id}`, { method: "DELETE" });

// Settings
export const getSettings = () => req<import("./types").Settings>("/settings");
export const updateSettings = (data: Partial<import("./types").Settings>) =>
  req<import("./types").Settings>("/settings", { method: "PUT", body: JSON.stringify(data) });

// Hero
export const getHero = () => req<import("./types").HeroPanel[]>("/hero");
export const updateHero = (panels: import("./types").HeroPanel[]) =>
  req<import("./types").HeroPanel[]>("/hero", { method: "PUT", body: JSON.stringify(panels) });
