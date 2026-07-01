"use client";
import { useCart } from "./CartContext";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CartDrawer() {
  const { open, closeCart, items, itemCount, subtotal, updateQty, removeItem } = useCart();
  const [discountOpen, setDiscountOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40" onClick={closeCart} />}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0B3D33] border-l border-white/15 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/15">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-lg">Cart</h2>
            <span className="bg-[#C9A96E] text-[#0B3D33] text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>
          <button onClick={closeCart} className="text-white hover:text-[#C9A96E] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-12">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex gap-4 pb-5 border-b border-white/10">
                <div className="w-20 h-20 rounded-xl bg-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                  {item.imageUrl && !imgErrors[`${item.productId}-${item.variantId ?? ""}`] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={() => setImgErrors(prev => ({ ...prev, [`${item.productId}-${item.variantId ?? ""}`]: true }))}
                    />
                  ) : (
                    <span className="text-white/20 text-xl">✦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate mb-1">{item.title}</p>
                  {item.variantId && <p className="text-white/40 text-xs mb-1">{item.variantId}</p>}
                  <p className="text-[#C9A96E] text-sm font-semibold mb-3">
                    KES {item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-white/20 rounded-md">
                      <button onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                        className="px-2 py-1 text-white hover:text-[#C9A96E] transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-white text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                        className="px-2 py-1 text-white hover:text-[#C9A96E] transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-white/50 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-8 pt-4 border-t border-white/15 space-y-4">
          <button onClick={() => setDiscountOpen(!discountOpen)}
            className="w-full flex items-center justify-between text-white/70 hover:text-white text-sm transition-colors">
            <span>Discount</span>
            <span className="text-lg leading-none">{discountOpen ? "−" : "+"}</span>
          </button>
          {discountOpen && (
            <div className="flex gap-2">
              <input type="text" placeholder="Enter discount code"
                className="flex-1 bg-transparent border border-white/20 rounded-md px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#C9A96E]" />
              <button className="px-4 py-2 border border-[#C9A96E] text-[#C9A96E] rounded-md text-sm hover:bg-[#C9A96E]/10 transition-colors">
                Apply
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-medium">Estimated total</span>
            <span className="text-[#C9A96E] font-semibold">KES {subtotal.toLocaleString()}</span>
          </div>
          <p className="text-white/40 text-xs">Taxes and shipping calculated at checkout.</p>

          <a href="/checkout"
            className="block w-full py-3.5 text-center text-[#C9A96E] border border-[#C9A96E] rounded-xl text-sm font-semibold hover:bg-[#C9A96E]/10 transition-colors tracking-wider uppercase">
            Check out
          </a>
        </div>
      </div>
    </>
  );
}
