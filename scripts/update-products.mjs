// Run: node scripts/update-products.mjs
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const client = new ConvexHttpClient("https://unique-eel-965.eu-west-1.convex.cloud");

// All product updates — keyed by partial title match
const UPDATES = [
  {
    match: "Yara Moi EDP 100ml by Lattafa",
    patch: {
      price: 2400, costPerItem: 1800, sku: "6290360591421",
      gender: "Women", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Yara Moi by Lattafa Perfumes is a fragrance for women, launched in 2022. A warm, sweet oriental that opens with bright <strong>Jasmine</strong> and <strong>Peach</strong>, blooms into a heart of <strong>Caramel</strong> and <strong>Amber</strong>, and settles into a soft base of <strong>Musk</strong> and <strong>Vanilla</strong>.</p>",
      seoTitle: "Yara Moi EDP 100ml by Lattafa | Naire Scents",
      seoDescription: "Yara Moi by Lattafa — women's oriental EDP. Top: Jasmine & Peach. Heart: Caramel & Amber. Base: Musk & Vanilla. 100ml. KES 2,400.",
    }
  },
  {
    match: "Tharwah Gold",
    patch: {
      price: 3200, costPerItem: 2350, sku: "6291108738177",
      gender: "Women", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Tharwah Gold by Lattafa Perfumes is an Oriental Floral fragrance for women, launched in 2022. A golden, feminine scent that opens with fresh <strong>Lavender</strong> and <strong>Bergamot</strong>, blooms into rich floral middle notes, and settles into a warm base of <strong>Amber</strong> and <strong>Musk</strong>.</p>",
      seoTitle: "Tharwah Gold EDP 100ml by Lattafa | Naire Scents",
      seoDescription: "Tharwah Gold by Lattafa — Oriental Floral EDP for women. Lavender, Bergamot, Amber & Musk. 100ml. KES 3,200.",
    }
  },
  {
    match: "John Gustav Homme Classic",
    patch: {
      price: 1800, costPerItem: 1100, sku: "6291108325636",
      gender: "Unisex", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>John Gustav Homme Classic by Fragrance World is a unisex fragrance launched in the 2020s. A bold, aromatic scent that opens with sharp <strong>Artemisia</strong>, evolving through a rich, complex heart into a deep, lasting base — a signature scent for those who command attention.</p>",
      seoTitle: "John Gustav Homme Classic EDP 100ml by Fragrance World | Naire Scents",
      seoDescription: "John Gustav Homme Classic by Fragrance World — unisex EDP with Artemisia top notes. 100ml. KES 1,800.",
    }
  },
  {
    match: "Now Women 100ml EDP",
    patch: {
      price: 2100, costPerItem: 1450, sku: "6290360593685",
      gender: "Women", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Now Women by RAVE (Lattafa) is a playful, fruity-floral fragrance for women, launched in 2023. It opens with vibrant <strong>Red Fruits</strong> and <strong>Orange</strong>, blooms into a soft heart of <strong>Marshmallow</strong>, <strong>Jasmine</strong> and <strong>Lily of the Valley</strong>, finishing with a sweet, lingering base.</p>",
      seoTitle: "Now Women EDP 100ml by RAVE Lattafa | Naire Scents",
      seoDescription: "Now Women by RAVE Lattafa — fruity floral EDP for women. Red Fruits, Orange, Marshmallow, Jasmine & Lily of the Valley. 100ml. KES 2,100.",
    }
  },
  {
    match: "Asad Zanzibar",
    patch: {
      price: 2400, costPerItem: 1800, sku: "6290360598666",
      gender: "Men", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Asad Zanzibar by Lattafa Perfumes is a men's fragrance launched in 2024, crafted by perfumer Fanny Bal. An exotic, spicy-fresh composition that opens with <strong>Lavender</strong>, evolves into a rich spiced heart, and finishes with a deep, woody base — inspired by the lush, tropical spirit of Zanzibar.</p>",
      seoTitle: "Asad Zanzibar 100ml Spray by Lattafa | Naire Scents",
      seoDescription: "Asad Zanzibar by Lattafa — men's EDP with Lavender top notes. Inspired by Zanzibar. 100ml. KES 2,400.",
    }
  },
  {
    match: "Night Club Silky",
    patch: {
      price: 2400, costPerItem: 1750, sku: "6290360378480",
      gender: "Women", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Night Club Silky by Fragrance World is a Floral Woody Musk fragrance for women, launched in 2025. A seductive, after-dark scent that opens with luminous <strong>Magnolia</strong> top notes, blooms into a silky floral heart, and trails off into a warm, sensual musk base.</p>",
      seoTitle: "Night Club Silky EDP 100ml by French Avenue | Naire Scents",
      seoDescription: "Night Club Silky by Fragrance World — Floral Woody Musk EDP for women. 2025 launch. 100ml. KES 2,400.",
    }
  },
  {
    match: "Mashrabya by Lattafa",
    patch: {
      price: 2500, costPerItem: 1800, sku: "6290360598321",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women", "Best Seller", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 2, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Mashrabya by Lattafa Perfumes is an Oriental Vanilla fragrance for women and men, launched in 2024. Inspired by the ornate wooden lattice screens of Arabian architecture, this fragrance opens with crisp <strong>Apple</strong> top notes, weaving into a warm, spiced oriental heart and a rich vanilla base — intricate, timeless and deeply evocative.</p>",
      seoTitle: "Mashrabya by Lattafa 100ml | Naire Scents",
      seoDescription: "Mashrabya by Lattafa — unisex Oriental Vanilla EDP 2024. Apple top notes. 100ml. KES 2,500.",
    }
  },
  {
    match: "Eclaire Lattafa Perfume",
    patch: {
      price: 3200, costPerItem: 2100, sku: "6290362340638",
      gender: "Women", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Women", "Best Seller", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 2, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Eclaire by Lattafa Perfumes is a Floral Fruity Gourmand fragrance for women, launched in 2024. A deliciously sweet, dessert-inspired scent that opens with <strong>Caramel</strong>, <strong>Milk</strong> and <strong>Sugar</strong>, melting into a soft floral-fruity heart — indulgent, warm and utterly irresistible.</p>",
      seoTitle: "Eclaire Lattafa Perfume for Women | Naire Scents",
      seoDescription: "Eclaire by Lattafa — women's Floral Fruity Gourmand EDP 2024. Caramel, Milk & Sugar top notes. 100ml. KES 3,200.",
    }
  },
  {
    match: "Berries Weekend Pink Edition",
    patch: {
      price: 1900, costPerItem: 1150, sku: "6291108320198",
      gender: "Women", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Women", "Best Seller"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 2, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Berries Weekend Pink Edition by Fragrance World is a Floral Fruity fragrance for women, launched in 2020. A fun, vibrant weekend scent that bursts with juicy <strong>Tangerine</strong> and fresh berries up top, blooming into a light floral heart and a soft, feminine dry-down — effortlessly fresh and playful.</p>",
      seoTitle: "Berries Weekend Pink Edition EDP 100ml by Fragrance World | Naire Scents",
      seoDescription: "Berries Weekend Pink Edition by Fragrance World — women's Floral Fruity EDP. Tangerine & berry top notes. 100ml. KES 1,900.",
    }
  },
  {
    match: "Sh'mallow Fluff",
    patch: {
      price: 3500, costPerItem: 2600, sku: "6298042000322",
      gender: "Women", brand: "French Avenue", vendor: "Naire Scents",
      tags: ["Women", "Best Seller", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 2, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>SH'MALLOW Fluff by French Avenue is a Floral Fruity Gourmand fragrance for women, launched in 2025. A dreamy, whimsical new scent as soft and sweet as a marshmallow cloud — light top notes of <strong>Sugar</strong> and fresh fruits dissolve into a pillowy floral heart and a warm, cosy gourmand base.</p>",
      seoTitle: "Sh'mallow Fluff EDP 100ml by French Avenue | Naire Scents",
      seoDescription: "SH'MALLOW Fluff by French Avenue — women's Floral Fruity Gourmand EDP 2025. Sweet & soft. 100ml. KES 3,500.",
    }
  },
  {
    match: "Éclair Affair",
    patch: {
      price: 3500, costPerItem: 2600, sku: "6290360378114",
      gender: "Unisex", brand: "French Avenue", vendor: "Naire Scents",
      tags: ["Men", "Women", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Éclair Affair by French Avenue is a Floral Fruity Gourmand fragrance for women and men, launched in 2025. A deliciously indulgent new release inspired by the classic French pastry — sweet, creamy and irresistibly tempting from first spray to last.</p>",
      seoTitle: "Éclair Affair 100ml by French Avenue | Naire Scents",
      seoDescription: "Éclair Affair by French Avenue — unisex Floral Fruity Gourmand EDP 2025. 100ml. KES 3,500.",
    }
  },
  {
    match: "Azzure Oud",
    patch: {
      price: 3800, costPerItem: 2800, sku: "6290360375687",
      gender: "Men", brand: "French Avenue", vendor: "Naire Scents",
      tags: ["Men", "Best Seller", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 1, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Azzure Oud by French Avenue is an Oriental fragrance for men, launched in 2024. A luxurious, fruit-forward oud that opens with exotic <strong>Passionfruit</strong>, <strong>Rose</strong> and <strong>Saffron</strong>, descending into a rich Oud heart and a deep, smoky base — bold, opulent and commanding.</p>",
      seoTitle: "Azzure Oud 100ml by Fragrance World | Naire Scents",
      seoDescription: "Azzure Oud by French Avenue — men's Oriental EDP 2024. Passionfruit, Rose, Saffron & Oud. 100ml. KES 3,800.",
    }
  },
  {
    match: "Khamrah by Lattafa",
    patch: {
      price: 3200, costPerItem: 2400, sku: "6291108737194",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women", "Best Seller"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 2, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Khamrah by Lattafa Perfumes is an Oriental Spicy fragrance for women and men, launched in 2022. A warm, intoxicating oriental that opens with spiced <strong>Cinnamon</strong>, <strong>Nutmeg</strong> and <strong>Bergamot</strong>, deepening into a rich heart of Oud and Amber — heady, opulent and irresistibly long-lasting.</p>",
      seoTitle: "Khamrah EDP by Lattafa | Naire Scents",
      seoDescription: "Khamrah by Lattafa — unisex Oriental Spicy EDP. Cinnamon, Nutmeg & Bergamot top notes. 100ml. KES 3,200.",
    }
  },
  {
    match: "Atheeri EDP",
    patch: {
      price: 3500, costPerItem: 2600, sku: "6290360598918",
      gender: "Women", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Women", "Best Seller", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 1, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Atheeri by Lattafa Perfumes is an Oriental Floral fragrance for women, launched in 2025. A stunning new release that blooms with <strong>Passion Flower</strong> up top, unfolding into a rich, warm floral-oriental heart and a deep, feminine base — ethereal yet powerful.</p>",
      seoTitle: "Atheeri EDP 100ml by Lattafa | Naire Scents",
      seoDescription: "Atheeri by Lattafa — women's Oriental Floral EDP 2025. Passion Flower top notes. 100ml. KES 3,500.",
    }
  },
  {
    match: "Ramz Lattafa Silver",
    patch: {
      price: 2000, costPerItem: 1200, sku: "6291106066722",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women", "Best Seller"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 2, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Ramz Lattafa Silver by Lattafa Perfumes is an Oriental Vanilla fragrance for women and men, launched in 2021. A soft, dreamy oriental that opens with fresh <strong>Pear</strong> and <strong>Lavender</strong>, flowing into a creamy vanilla heart and a warm, silvery base — elegant, smooth and long-lasting.</p>",
      seoTitle: "Ramz Lattafa Silver 100ml by Lattafa | Naire Scents",
      seoDescription: "Ramz Lattafa Silver by Lattafa — unisex Oriental Vanilla EDP. Pear & Lavender top notes. 100ml. KES 2,000.",
    }
  },
  {
    match: "Asad 100ml EDP",
    patch: {
      price: 2400, costPerItem: 1800, sku: "6291108735411",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Asad by Lattafa Perfumes is an Oriental fragrance for men, launched in 2021. A bold, animalistic oriental that roars with <strong>Black Pepper</strong>, <strong>Tobacco</strong> and <strong>Pineapple</strong> up top, softening into a heart of <strong>Patchouli</strong> before settling into a deep, smoky base — powerful and untamed.</p>",
      seoTitle: "Asad 100ml EDP by Lattafa | Naire Scents",
      seoDescription: "Asad by Lattafa — Oriental EDP for men. Black Pepper, Tobacco & Pineapple top notes. 100ml. KES 2,400.",
    }
  },
  {
    match: "Sweet Paradise",
    patch: {
      price: 3900, costPerItem: 2900, sku: "6290360375793",
      gender: "Women", brand: "French Avenue", vendor: "Naire Scents",
      tags: ["Women", "Best Seller", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 1, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Sweet Paradise by French Avenue is a Floral Fruity fragrance for women, launched in 2024. Created by perfumer Carole Calmettes, this is a lush, sun-drenched escape — a blend of fresh fruits and soft florals that evokes pure paradise in every spray.</p>",
      seoTitle: "Sweet Paradise EDP 100ml by French Avenue | Naire Scents",
      seoDescription: "Sweet Paradise by French Avenue — women's Floral Fruity EDP 2024 by Carole Calmettes. 100ml. KES 3,900.",
    }
  },
  {
    match: "Nebras Perfumes",
    patch: {
      price: 3500, costPerItem: 2300, sku: "",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women", "Best Seller"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: true, trackInventory: false,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Nebras by Lattafa Perfumes is an Oriental Vanilla fragrance for women and men, launched in 2022. A luminous, fruity-oriental that opens with vibrant <strong>Red Berries</strong> and <strong>Mandarin Orange</strong>, flowing into a warm vanilla-oriental heart and a rich, glowing base.</p>",
      seoTitle: "Nebras EDP 100ml by Lattafa | Naire Scents",
      seoDescription: "Nebras by Lattafa — unisex Oriental Vanilla EDP. Red Berries & Mandarin Orange top notes. 100ml. KES 3,500.",
    }
  },
  {
    match: "Just Wardi",
    patch: {
      price: 1850, costPerItem: 1350, sku: "6290360375878",
      gender: "Women", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Just Wardi by Fragrance World is an Oriental Floral fragrance for women, launched in 2023. A soft, romantic composition that opens with tropical <strong>Coconut</strong>, <strong>Mandarin</strong> and <strong>Peach</strong>, blooming into a lush rose-floral heart and settling into a warm, sensual oriental base.</p>",
      seoTitle: "Just Wardi EDP 100ml by Fragrance World | Naire Scents",
      seoDescription: "Just Wardi by Fragrance World — women's Oriental Floral EDP. Coconut, Mandarin & Peach top notes. 100ml. KES 1,850.",
    }
  },
  {
    match: "Teriaq Intense",
    patch: {
      price: 3500, costPerItem: 2600, sku: "6290360595771",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women", "Best Seller", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 2, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Teriaq Intense by Lattafa Perfumes is an Oriental Spicy fragrance for women and men, launched in 2024. A powerful, medicinal-inspired oriental built around deep spices, dark woods and rich resins — intense, mysterious and utterly captivating.</p>",
      seoTitle: "Teriaq Intense 100ml by Lattafa | Naire Scents",
      seoDescription: "Teriaq Intense by Lattafa — unisex Oriental Spicy EDP 2024. Deep spices, woods & resins. 100ml. KES 3,500.",
    }
  },
  {
    match: "Bade'e Al Oud Amethyst",
    patch: {
      price: 3000, costPerItem: 2200, sku: "6291108733875",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Bade'e Al Oud Amethyst by Lattafa Perfumes is an Oriental Vanilla fragrance for women and men, launched in 2021. A rich, jewel-like oriental that opens with sparkling <strong>Pink Pepper</strong>, unfolds into a warm heart of Bulgarian Rose and Jasmine, and settles on a deep base of <strong>Agarwood (Oud)</strong> and Vanilla.</p>",
      seoTitle: "Bade'e Al Oud Amethyst EDP by Lattafa | Naire Scents",
      seoDescription: "Bade'e Al Oud Amethyst by Lattafa — unisex Oriental Vanilla EDP. Pink Pepper, Rose, Jasmine & Oud. 100ml. KES 3,000.",
    }
  },
  {
    match: "Yara Candy",
    patch: {
      price: 2500, costPerItem: 1800, sku: "6290360599168",
      gender: "Women", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Women", "New In"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Yara Candy by Lattafa Perfumes is a Floral Fruity Gourmand fragrance for women, launched in 2024. A playful, irresistible new scent that opens with juicy <strong>Black Currant</strong>, blooms into a sweet floral heart and finishes with a delectable gourmand base — pure candy for the senses.</p>",
      seoTitle: "Yara Candy 100ml by Lattafa | Naire Scents",
      seoDescription: "Yara Candy by Lattafa — women's Floral Fruity Gourmand EDP 2024. Black Currant top notes. 100ml. KES 2,500.",
    }
  },
  {
    match: "Imperium EDP",
    patch: {
      price: 2000, costPerItem: 1250, sku: "6291108326763",
      gender: "Men", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Men"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Imperium by Fragrance World is a Citrus Aromatic fragrance for men, launched in 2021. A commanding, fresh composition that bursts open with <strong>Grapefruit</strong>, <strong>Bergamot</strong>, <strong>Lime</strong>, <strong>Lemon</strong>, <strong>Artemisia</strong> and <strong>Geranium</strong> — bright, confident and built to leave a lasting impression.</p>",
      seoTitle: "Imperium EDP 100ml by Fragrance World | Naire Scents",
      seoDescription: "Imperium by Fragrance World — men's Citrus Aromatic EDP. Grapefruit, Bergamot, Lime & Lemon. 100ml. KES 2,000.",
    }
  },
  {
    match: "Khamrah Qahwa",
    patch: {
      price: 3200, costPerItem: 2400, sku: "6290360593661",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women", "Best Seller"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Khamrah Qahwa by Lattafa Perfumes is an Oriental Vanilla fragrance for women and men, launched in 2023. A deeply aromatic, coffee-inspired oriental that opens with warm <strong>Cinnamon</strong>, <strong>Cardamom</strong> and <strong>Ginger</strong>, evoking the rich aroma of Arabic Qahwa coffee over a sweet vanilla base.</p>",
      seoTitle: "Khamrah Qahwa EDP 100ml by Lattafa | Naire Scents",
      seoDescription: "Khamrah Qahwa by Lattafa — unisex Oriental Vanilla EDP. Cinnamon, Cardamom & Ginger. 100ml. KES 3,200.",
    }
  },
  {
    match: "Proud of You Tobacco",
    patch: {
      price: 2000, costPerItem: 1000, sku: "6290360378008",
      gender: "Men", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Men"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Proud of You Tobacco by Fragrance World is an Aromatic Spicy fragrance for men, launched in 2024. A bold, smoky composition that opens with <strong>Pink Pepper</strong>, <strong>Cardamom</strong> and <strong>Bergamot</strong>, evolving into a rich tobacco heart and a deep, masculine base.</p>",
      seoTitle: "Proud of You Tobacco 100ml by French Avenue | Naire Scents",
      seoDescription: "Proud of You Tobacco by Fragrance World — men's Aromatic Spicy EDP. Pink Pepper, Cardamom & Bergamot. 100ml. KES 2,000.",
    }
  },
  {
    match: "Cocoa Morado",
    patch: {
      price: 3600, costPerItem: 2650, sku: "6290360378602",
      gender: "Unisex", brand: "French Avenue", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Cocoa Morado by French Avenue is an Oriental Woody fragrance for women and men, launched in 2024. A rich, indulgent gourmand-oriental that wraps you in deep <strong>Cocoa</strong> and warm woody notes — luxurious, dark and utterly addictive.</p>",
      seoTitle: "Cocoa Morado EDP 100ml by Fragrance World | Naire Scents",
      seoDescription: "Cocoa Morado by French Avenue — unisex Oriental Woody EDP. Deep Cocoa & woody notes. 100ml. KES 3,600.",
    }
  },
  {
    match: "Vulcan Feu",
    patch: {
      price: 3600, costPerItem: 2650, sku: "6290360378053",
      gender: "Unisex", brand: "French Avenue", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Vulcan Feu by French Avenue is a Floral fragrance for women and men, launched in 2025. A fiery, exotic new release that erupts with <strong>Mango</strong>, <strong>Lemon</strong> and <strong>Ginger</strong> top notes, igniting into a vibrant floral heart and a bold, volcanic base.</p>",
      seoTitle: "Vulcan Feu 100ml by French Avenue | Naire Scents",
      seoDescription: "Vulcan Feu by French Avenue — unisex Floral EDP 2025. Mango, Lemon & Ginger. 100ml. KES 3,600.",
    }
  },
  {
    match: "Cocktail Intense",
    patch: {
      price: 1600, costPerItem: 1050, sku: "6290360370668",
      gender: "Unisex", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Cocktail Intense by Fragrance World is an Aromatic Spicy fragrance for women and men, launched in 2021. A bold, intoxicating blend that opens with <strong>Cognac</strong>, <strong>Cinnamon</strong> and <strong>Plum</strong>, mixing into a rich spiced heart and a warm, lingering base.</p>",
      seoTitle: "Cocktail Intense 100ml by Fragrance World | Naire Scents",
      seoDescription: "Cocktail Intense by Fragrance World — unisex Aromatic Spicy EDP. Cognac, Cinnamon & Plum. 100ml. KES 1,600.",
    }
  },
  {
    match: "Royal Blend Vintage",
    patch: {
      price: 3200, costPerItem: 2400, sku: "6290360375595",
      gender: "Unisex", brand: "French Avenue", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Royal Blend Vintage by French Avenue is a Woody Aromatic fragrance for women and men, launched in 2023. A sophisticated, vintage-inspired blend that opens with <strong>Cognac</strong>, <strong>Cinnamon</strong> and <strong>Plum</strong>, evolving into a rich woody-aromatic heart and a deep, lingering base.</p>",
      seoTitle: "Royal Blend Vintage EDP 100ml by French Avenue | Naire Scents",
      seoDescription: "Royal Blend Vintage by French Avenue — unisex Woody Aromatic EDP. Cognac, Cinnamon & Plum top notes. 100ml. KES 3,200.",
    }
  },
  {
    match: "Bint Hooran Rose Passion",
    patch: {
      price: 1650, costPerItem: 1150, sku: "6295199793503",
      gender: "Women", brand: "Ard Al Zaafaran", vendor: "Naire Scents",
      tags: ["Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Bint Hooran Rose Passion by Ard Al Zaafaran is a Floral Fruity Gourmand fragrance for women, launched in 2024. A luscious, feminine blend that opens with juicy <strong>Blackcurrant</strong>, blooms into a passionate rose heart, and finishes with a sweet, gourmand base.</p>",
      seoTitle: "Bint Hooran Rose Passion 100ml by Ard Al Zaafaran | Naire Scents",
      seoDescription: "Bint Hooran Rose Passion by Ard Al Zaafaran — women's Floral Fruity Gourmand EDP. Blackcurrant & Rose. 100ml. KES 1,650.",
    }
  },
  {
    match: "Heibah 100ml",
    patch: {
      price: 1800, costPerItem: 1300, sku: "6290362343103",
      gender: "Unisex", brand: "Ard Al Zaafaran", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Heibah by Ard Al Zaafaran is an Oriental Floral fragrance for women and men, launched in 2022. A bright, uplifting composition that opens with <strong>Mandarin Orange</strong>, <strong>Lemon</strong>, <strong>Bergamot</strong> and <strong>Ylang Ylang</strong>, unfolding into a rich floral-oriental heart and a warm, lasting base.</p>",
      seoTitle: "Heibah 100ml by Ard Al Zaafaran | Naire Scents",
      seoDescription: "Heibah by Ard Al Zaafaran — unisex Oriental Floral EDP. Mandarin, Lemon, Bergamot & Ylang Ylang. 100ml. KES 1,800.",
    }
  },
  {
    match: "Ana Abiyedh Rouge",
    patch: {
      price: 1750, costPerItem: 1250, sku: "6291107454412",
      gender: "Unisex", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "60ml",
      descriptionHtml: "<p>Ana Abiyedh Rouge by Lattafa Perfumes is a Woody Spicy fragrance for women and men, launched in 2016. A bold, fruity-spicy oriental that opens with <strong>Nashi Pear</strong>, <strong>Kumquat</strong> and bright citrus, deepening into a warm woody-spicy heart and a rich, lasting base.</p>",
      seoTitle: "Ana Abiyedh Rouge EDP 60ml by Lattafa | Naire Scents",
      seoDescription: "Ana Abiyedh Rouge by Lattafa — unisex Woody Spicy EDP. Nashi Pear, Kumquat top notes. 60ml. KES 1,750.",
    }
  },
  {
    match: "Proud of You Leather",
    patch: {
      price: 1700, costPerItem: 1000, sku: "6298042000209",
      gender: "Men", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Men"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Proud of You Leather by Fragrance World is a Leather fragrance for men, launched in 2024. A rich, masculine composition that opens with <strong>Chestnut</strong>, <strong>Spices</strong> and <strong>Elemi</strong>, settling into a smooth, confident leather heart and a deep, lasting base.</p>",
      seoTitle: "Proud of You Leather EDP 100ml by Fragrance World | Naire Scents",
      seoDescription: "Proud of You Leather by Fragrance World — men's leather EDP. Chestnut, Spices & Elemi top notes. 100ml. KES 1,700.",
    }
  },
  {
    match: "Delilah Pour Femme",
    patch: {
      price: 2400, costPerItem: 1150, sku: "6291107459196",
      gender: "Women", brand: "Maison Alhambra", vendor: "Naire Scents",
      tags: ["Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Delilah by Maison Alhambra is a Floral Fruity fragrance for women, launched in 2023. A fresh, feminine composition that opens with <strong>Rhubarb</strong>, <strong>Litchi</strong> and <strong>Bergamot</strong>, blooms into a lush heart of <strong>Tuberose</strong>, and dries down to a soft, sensual base.</p>",
      seoTitle: "Delilah Pour Femme EDP by Maison Alhambra | Naire Scents",
      seoDescription: "Delilah by Maison Alhambra — Floral Fruity EDP for women. Rhubarb, Litchi, Bergamot & Tuberose. KES 2,400.",
    }
  },
  {
    match: "Tuscany Leather",
    patch: {
      price: 1600, costPerItem: 1100, sku: "6291108321607",
      gender: "Unisex", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "80ml",
      descriptionHtml: "<p>Tuscany Leather by Fragrance World is a Leather fragrance for women and men, launched in 2023. An Italian-inspired composition that opens with <strong>Saffron</strong>, <strong>Raspberry</strong> and <strong>Thyme</strong>, evolving into a rich, smooth leather heart — bold, refined and long-lasting.</p>",
      seoTitle: "Tuscany Leather EDP 80ml by Fragrance World | Naire Scents",
      seoDescription: "Tuscany Leather by Fragrance World — unisex leather EDP. Saffron, Raspberry & Thyme top notes. 80ml. KES 1,600.",
    }
  },
  {
    match: "Ebony Fume",
    patch: {
      price: 1500, costPerItem: 1000, sku: "6290360370088",
      gender: "Unisex", brand: "Fragrance World", vendor: "Naire Scents",
      tags: ["Men", "Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 0, inStock: false, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "80ml",
      descriptionHtml: "<p>Ebony Fume by Fragrance World is a unisex fragrance launched in 2018. A smoky, resinous powerhouse that opens with <strong>Incense</strong>, <strong>Palo Santo</strong>, <strong>Black Pepper</strong> and <strong>Violet Leaf</strong> — bold, dark and unforgettable.</p>",
      seoTitle: "Ebony Fume 80ml by Fragrance World | Naire Scents",
      seoDescription: "Ebony Fume by Fragrance World — unisex smoky EDP. Incense, Palo Santo, Black Pepper & Violet Leaf. 80ml. KES 1,500.",
    }
  },
  {
    match: "Khamrah Dukhan",
    patch: {
      price: 3400, costPerItem: 2400, sku: "6290362342373",
      gender: "Men", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Men", "Best Seller"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 1, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Khamrah Dukhan by Lattafa Perfumes is an Oriental fragrance for men, launched in 2025. A bold, smoky new chapter in the Khamrah story — opens with fiery <strong>Spices</strong> and <strong>Pimento</strong>, evolving into a rich, incense-laced heart and a deep, lingering base of smoke and amber. Intense, masculine and unmistakably modern.</p>",
      seoTitle: "Khamrah Dukhan EDP 100ml by Lattafa | Naire Scents",
      seoDescription: "Khamrah Dukhan by Lattafa — men's Oriental EDP 2025. Spices & Pimento top notes. Smoky & bold. 100ml. KES 3,400.",
    }
  },
  {
    match: "Lattafa Yara EDP Spray 50ml",
    patch: {
      price: 600, costPerItem: 300, sku: "6423080728925",
      gender: "Women", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Women"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 2, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "50ml",
      descriptionHtml: "<p>Yara by Lattafa Perfumes is a Floral Fruity fragrance for women. A seductive, luminous scent that opens with a beautiful blend of <strong>Heliotrope</strong>, <strong>Orchid</strong> and <strong>Tangerine</strong> — the heliotrope providing a sweet, powdery floral softness while orchid adds an exotic depth. Fresh, feminine and irresistible. 50ml travel size.</p>",
      seoTitle: "Lattafa Yara EDP Spray 50ml | Naire Scents",
      seoDescription: "Yara by Lattafa — women's Floral Fruity EDP. Heliotrope, Orchid & Tangerine. 50ml travel size. KES 600.",
    }
  },
  {
    match: "Yara by Lattafa Perfume For Women",
    patch: {
      price: 2500, costPerItem: 1800, sku: "6291108730515",
      gender: "Women", brand: "Lattafa", vendor: "Naire Scents",
      tags: ["Women", "Best Seller"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 3, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Yara by Lattafa Perfumes is an Oriental Vanilla fragrance for women, launched in 2020. A beloved bestseller — opens with exotic <strong>Orchid</strong>, <strong>Heliotrope</strong> and <strong>Tangerine</strong>, blooms into a warm floral heart, and settles into a creamy, sensual vanilla base. Timeless, warm and effortlessly feminine.</p>",
      seoTitle: "Yara by Lattafa 100ml EDP for Women | Naire Scents",
      seoDescription: "Yara by Lattafa — Oriental Vanilla EDP for women 2020. Orchid, Heliotrope & Tangerine top notes. 100ml. KES 2,500.",
    }
  },
  {
    match: "Liquid Brun",
    patch: {
      price: 3600, costPerItem: 2600, sku: "6290360375694",
      gender: "Men", brand: "French Avenue", vendor: "Naire Scents",
      tags: ["Men", "Best Seller"], productType: "Eaux de Parfum", category: "Eaux de Parfum",
      status: "Active", publishedOnlineStore: true,
      inventory: 1, inStock: true, trackInventory: true,
      isPhysical: true, weight: 0, weightUnit: "kg", size: "100ml",
      descriptionHtml: "<p>Liquid Brun by French Avenue is a Woody fragrance for men, launched in 2024. A rich, earthy composition that opens with warm <strong>Cinnamon</strong>, <strong>Orange Blossom</strong>, <strong>Cardamom</strong> and <strong>Bergamot</strong>, deepening into a smooth woody-amber heart and a deep, masculine base — sophisticated, grounded and long-lasting.</p>",
      seoTitle: "Liquid Brun EDP 100ml by French Avenue | Naire Scents",
      seoDescription: "Liquid Brun by French Avenue — men's Woody EDP 2024. Cinnamon, Orange Blossom, Cardamom & Bergamot. 100ml. KES 3,600.",
    }
  },
];

async function run() {
  const all = await client.query(api.products.list, {});
  let updated = 0;
  for (const { match, patch } of UPDATES) {
    const product = all.find(p => p.title.includes(match));
    if (!product) { console.log(`✖ NOT FOUND: ${match}`); continue; }
    await client.mutation(api.products.update, { id: product._id, patch });
    console.log(`✔ Updated: ${product.title}`);
    updated++;
  }
  console.log(`\nDone — ${updated}/${UPDATES.length} products updated.`);
}

run().catch(console.error);
