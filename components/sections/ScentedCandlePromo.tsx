"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/layout/CartContext";
import { ShoppingBag, ArrowRight, X, Sparkles } from "lucide-react";

export default function ScentedCandlePromo() {
  const router = useRouter();
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 3D Parallax & Drag State
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Expiration logic: 30 days from launch (approx Oct 8, 2026)
  useEffect(() => {
    const expirationDate = new Date("2026-10-08T00:00:00Z");
    if (new Date() < expirationDate) {
      // Show every time on visit/refresh
      const t = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setShowBanner(true); // Show the persistent banner when dismissed
  };

  const rawProduct = useQuery(api.products.getByHandle, { handle: "scented-candles" });

  useEffect(() => {
    if (rawProduct?.hasVariants && rawProduct.variants?.length > 0 && !selectedVariantId) {
      setSelectedVariantId(rawProduct.variants[0].id);
    }
  }, [rawProduct, selectedVariantId]);

  const currentVariant = useMemo(() => {
    if (!rawProduct?.hasVariants || !rawProduct?.variants?.length || !selectedVariantId) return null;
    return rawProduct.variants.find((v: any) => v.id === selectedVariantId) || rawProduct.variants[0];
  }, [rawProduct, selectedVariantId]);

  const allImages = rawProduct?.images || [];

  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % allImages.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [allImages.length]);

  if (rawProduct === undefined || rawProduct === null) return null;

  const displayPrice = currentVariant ? currentVariant.price : (rawProduct?.price || 0);
  const displayTitle = currentVariant ? `${rawProduct?.title} - ${currentVariant.title}` : rawProduct?.title;
  
  const img = allImages[activeImageIndex]?.url || allImages[0]?.url;

  const handleBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!rawProduct) return;
    addItem({
      productId: rawProduct._id,
      variantId: currentVariant?.id,
      title: displayTitle || "",
      price: displayPrice,
      imageUrl: img,
      quantity: 1
    });
    setIsVisible(false);
    setShowBanner(false);
    router.push("/checkout");
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && rawProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop - Starts completely black and transitions to a deep cinematic blur */}
            <motion.div
              initial={{ opacity: 1, backgroundColor: "#000000" }}
              animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              onClick={handleClose}
              className="absolute inset-0"
            />

            {/* Modal Content - Grand Scale Reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1, y: 50, filter: "brightness(2)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "brightness(1)" }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl bg-[#030a08] rounded-[2rem] overflow-hidden border border-[#C9A96E]/30 shadow-[0_0_100px_rgba(201,169,110,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              {/* Abstract Background Effects inside Modal */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-[50%] -left-[20%] w-[100%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A96E]/15 via-[#0B3D33]/10 to-transparent blur-3xl"
                />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-12 gap-8 md:gap-12">
                
                {/* Product Showcase Image - Cinematic Zoom Reveal & Smooth Crossfade */}
                <motion.div 
                  initial={{ opacity: 0, scale: 1.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="flex-1 w-full max-w-[350px] md:max-w-none aspect-square relative perspective-[1200px]"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {img && (
                    <motion.div 
                      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.15}
                      whileTap={{ scale: 0.95, cursor: "grabbing" }}
                      className="relative w-full h-full group cursor-grab"
                    >
                      <div className="absolute inset-0 bg-[#C9A96E]/30 blur-[100px] rounded-full mix-blend-screen group-hover:bg-[#C9A96E]/50 transition-colors duration-700 -z-10" style={{ transform: "translateZ(50px)" }} />
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={img} 
                          initial={{ opacity: 0, filter: "blur(8px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(8px)" }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                          className="absolute inset-0 w-full h-full"
                          style={{ transform: "translateZ(100px)" }} 
                        >
                          <Image 
                            src={img} 
                            alt={rawProduct.title} 
                            fill 
                            className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] animate-[float_6s_ease-in-out_infinite]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                            draggable={false} 
                          />
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}
                </motion.div>

                {/* Text Content - Staggered Elegant Fade In */}
                <div className="flex-1 space-y-8 text-center md:text-left z-10 relative">
                  <motion.div
                    initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                  >
                    <h4 className="text-[#C9A96E] text-xs md:text-sm tracking-[0.3em] uppercase font-bold mb-3">
                      The Ultimate Ambient Experience
                    </h4>
                    <h2 className="text-white text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight drop-shadow-2xl">
                      Scented <br className="hidden md:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A96E] to-[#fff3d4]">Candles.</span>
                    </h2>
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-white/60 text-lg max-w-md mx-auto md:mx-0 leading-relaxed font-light"
                  >
                    Discover the captivating essence of Naire Scents' newest arrival. Exquisitely crafted in your choice of Metallic Black or premium Glass.
                  </motion.p>

                  {/* Interactive Variant Selection */}
                  {rawProduct.hasVariants && rawProduct.variants && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="space-y-5 pt-4"
                    >
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {rawProduct.variants.map((v: any) => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariantId(v.id)}
                            className={`relative overflow-hidden px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all duration-500 ${
                              selectedVariantId === v.id
                                ? "border-[#C9A96E] text-[#0B3D33] bg-[#C9A96E] shadow-[0_0_20px_rgba(201,169,110,0.3)] scale-105"
                                : "border-white/20 text-white hover:border-[#C9A96E]/50 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            {v.title}
                          </button>
                        ))}
                      </div>
                      <div className="text-2xl font-bold text-white pt-2 overflow-hidden h-10">
                        <AnimatePresence mode="popLayout">
                          <motion.div
                            key={displayPrice}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            KES {displayPrice.toLocaleString()}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.4 }}
                    className="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                  >
                    <button
                      onClick={handleBuy}
                      className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C9A96E] to-[#e8cf9c] text-[#0B3D33] rounded-2xl font-black uppercase tracking-[0.2em] overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(201,169,110,0.4)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <ShoppingBag size={18} /> Buy Now
                      </span>
                      <div className="absolute inset-0 bg-white/40 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>
                    
                    <button
                      onClick={() => {
                        handleClose();
                        router.push(`/products/${rawProduct.handle}`);
                      }}
                      className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/10 text-white font-bold uppercase tracking-widest hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                    >
                      Explore <ArrowRight size={18} />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Banner when dismissed */}
      <AnimatePresence>
        {showBanner && !isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: [0, -8, 0],
              scale: 1
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ 
              opacity: { duration: 0.6 },
              scale: { duration: 0.6, type: "spring", bounce: 0.4 },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" } // Floating effect
            }}
            className="fixed bottom-6 right-6 z-40 w-[320px] max-w-[calc(100%-3rem)] group cursor-pointer"
            onClick={() => {
              setShowBanner(false);
              setIsVisible(true);
            }}
          >
            {/* Animated Gradient Border & Glassmorphic Body */}
            <div className="relative overflow-hidden bg-[#051611]/80 backdrop-blur-xl border border-[#C9A96E]/20 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-[#C9A96E]/50 group-hover:shadow-[0_20px_50px_rgba(201,169,110,0.2)] group-hover:-translate-y-1">
              
              {/* Subtle sweep animation on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

              <div className="relative z-10 flex items-center gap-4">
                {/* Image Container with Pulse */}
                <div className="flex-shrink-0 w-14 h-14 bg-white/5 rounded-xl overflow-hidden relative border border-white/10 group-hover:border-[#C9A96E]/50 transition-colors">
                  {img ? (
                    <Image src={img} alt="Scented Candles" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="56px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#C9A96E]">
                      <Sparkles size={20} />
                    </div>
                  )}
                  {/* Live pulsating dot */}
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C9A96E] rounded-full shadow-[0_0_10px_#C9A96E]">
                    <div className="absolute inset-0 bg-[#C9A96E] rounded-full animate-ping opacity-75" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h5 className="text-[#C9A96E] font-extrabold text-sm tracking-wide truncate flex items-center gap-2">
                    Launch Active 
                    <Sparkles size={12} className="animate-pulse" />
                  </h5>
                  <p className="text-white/70 text-xs mt-1 leading-tight group-hover:text-white transition-colors">
                    Click to return to the grand showcase.
                  </p>
                </div>

                {/* Close Button - Only appears on hover */}
                <div 
                  className="absolute top-2 right-2 p-1.5 rounded-full text-white/0 group-hover:text-white/40 hover:!text-white hover:bg-white/10 transition-all duration-300"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowBanner(false); 
                  }}
                >
                  <X size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
