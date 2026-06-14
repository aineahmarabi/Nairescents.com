"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

export default function CartFlyOverlay() {
  const { flyState, onFlyComplete } = useCart();
  const [toPos, setToPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!flyState) return;
    const btn = document.getElementById("navbar-cart-btn");
    if (btn) {
      const r = btn.getBoundingClientRect();
      setToPos({ x: r.left + r.width / 2 - 12, y: r.top + r.height / 2 - 12 });
    }
  }, [flyState]);

  return (
    <AnimatePresence>
      {flyState && (
        <motion.div
          key="cart-fly"
          initial={{
            x: flyState.fromRect.left,
            y: flyState.fromRect.top,
            width: flyState.fromRect.width,
            height: flyState.fromRect.height,
            opacity: 1,
            borderRadius: 12,
          }}
          animate={{
            x: toPos.x,
            y: toPos.y,
            width: 24,
            height: 24,
            opacity: 0,
            borderRadius: 24,
          }}
          transition={{ duration: 0.55, ease: [0.2, 0, 0.2, 1] }}
          onAnimationComplete={onFlyComplete}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {flyState.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={flyState.imageUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#C9A96E" }} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
