"use client";
import {
  createContext, useContext, useState, useEffect, useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTrackEvent } from "@/lib/analytics";

export interface CartItem {
  productId: string;
  variantId?: string;
  title: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export interface FlyState {
  imageUrl: string;
  fromRect: DOMRect;
}

interface CartContextType {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clearCart: () => void;
  // fly animation
  flyState: FlyState | null;
  triggerFly: (imageUrl: string, fromRect: DOMRect) => void;
  onFlyComplete: () => void;
  badgeBump: boolean;
}

const CartContext = createContext<CartContextType>({
  open: false, openCart: () => {}, closeCart: () => {},
  items: [], itemCount: 0, subtotal: 0,
  addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {},
  flyState: null, triggerFly: () => {}, onFlyComplete: () => {}, badgeBump: false,
});

const SESSION_KEY = "naire_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, id); }
  return id;
}

function readLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("naire_cart") ?? "[]"); } catch { return []; }
}

function writeLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("naire_cart", JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id;
  const sessionId = typeof window !== "undefined" ? getSessionId() : "";

  const [open, setOpen] = useState(false);
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [flyState, setFlyState] = useState<FlyState | null>(null);
  const [badgeBump, setBadgeBump] = useState(false);

  const userCart = useQuery(api.carts.getByUser, userId ? { userId } : "skip");
  const sessionCart = useQuery(api.carts.getBySession, !userId && sessionId ? { sessionId } : "skip");
  const convexCart = userId ? userCart : sessionCart;
  const setCart = useMutation(api.carts.setCart);
  const mergeGuest = useMutation(api.carts.mergeGuestCart);
  const track = useTrackEvent();

  // Hydrate local items once on mount
  useEffect(() => {
    setLocalItems(readLocalCart());
    setHydrated(true);
  }, []);

  // When user logs in: merge guest cart into their Convex cart, clear local
  useEffect(() => {
    if (!userId || !sessionId) return;
    mergeGuest({ userId, sessionId })
      .then(() => { localStorage.removeItem("naire_cart"); setLocalItems([]); })
      .catch(() => {});
  }, [userId]);

  // Derive the authoritative items list
  const items: CartItem[] = userId
    ? (convexCart?.items ?? []) as CartItem[]
    : hydrated ? localItems : [];

  function persist(next: CartItem[]) {
    if (userId) {
      setCart({ userId, items: next }).catch(() => {});
    } else {
      writeLocalCart(next);
      setLocalItems(next);
      if (sessionId) setCart({ sessionId, items: next }).catch(() => {});
    }
  }

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const qty = item.quantity ?? 1;
    const next = [...items];
    const idx = next.findIndex((c) => c.productId === item.productId && c.variantId === item.variantId);
    if (idx >= 0) next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
    else next.push({ ...item, quantity: qty });
    persist(next);
    track("add_to_cart", { productId: item.productId, productTitle: item.title, value: item.price * qty });
  }, [items, userId, track]);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    persist(items.filter((c) => !(c.productId === productId && c.variantId === variantId)));
  }, [items, userId]);

  const updateQty = useCallback((productId: string, variantId: string | undefined, qty: number) => {
    if (qty <= 0) { removeItem(productId, variantId); return; }
    persist(items.map((c) => c.productId === productId && c.variantId === variantId ? { ...c, quantity: qty } : c));
  }, [items, userId]);

  const clearCart = useCallback(() => persist([]), [userId]);

  const triggerFly = useCallback((imageUrl: string, fromRect: DOMRect) => {
    setFlyState({ imageUrl, fromRect });
  }, []);

  const onFlyComplete = useCallback(() => {
    setFlyState(null);
    setBadgeBump(true);
    setTimeout(() => setBadgeBump(false), 400);
  }, []);

  const itemCount = items.reduce((s, c) => s + c.quantity, 0);
  const subtotal = items.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <CartContext.Provider value={{
      open, openCart: () => setOpen(true), closeCart: () => setOpen(false),
      items, itemCount, subtotal,
      addItem, removeItem, updateQty, clearCart,
      flyState, triggerFly, onFlyComplete, badgeBump,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
