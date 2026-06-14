export interface ShippingZone {
  id: string;
  name: string;
  description: string;
  price: number; // KES
  eta: string;
}

export const SHIPPING_ZONES: ShippingZone[] = [
  { id: "nairobi-cbd",        name: "Nairobi CBD",              description: "Central Business District & surrounding areas",       price: 150, eta: "Same day" },
  { id: "nairobi-westlands",  name: "Nairobi — Westlands Zone", description: "Westlands, Parklands, Highridge, Spring Valley",       price: 200, eta: "Same day" },
  { id: "nairobi-south",      name: "Nairobi — South Zone",     description: "Kilimani, Lavington, Karen, Langata, Rongai",          price: 220, eta: "Same day" },
  { id: "nairobi-east",       name: "Nairobi — Eastlands",      description: "Umoja, Buruburu, Embakasi, Donholm, Komarock",         price: 250, eta: "Same day" },
  { id: "nairobi-north",      name: "Nairobi — North Zone",     description: "Kasarani, Roysambu, Ruaraka, Githurai, Mirema",        price: 250, eta: "Same day" },
  { id: "kiambu",             name: "Kiambu County",            description: "Thika, Ruiru, Juja, Kikuyu, Limuru, Githunguri",       price: 350, eta: "1 business day" },
  { id: "machakos",           name: "Machakos & Kajiado",       description: "Athi River, Kitengela, Machakos Town, Ngong, Kiserian", price: 400, eta: "1–2 business days" },
  { id: "nakuru",             name: "Nakuru County",            description: "Nakuru Town, Naivasha, Gilgil, Njoro",                 price: 500, eta: "1–2 business days" },
  { id: "central-kenya",      name: "Central Kenya",            description: "Nyeri, Murang'a, Kirinyaga, Nyandarua, Embu",          price: 550, eta: "2 business days" },
  { id: "mombasa",            name: "Mombasa County",           description: "Mombasa Island, Nyali, Likoni, Bamburi, Shanzu",       price: 600, eta: "2–3 business days" },
  { id: "coast",              name: "Coast Region",             description: "Kilifi, Malindi, Diani, Kwale, Lamu",                  price: 700, eta: "2–4 business days" },
  { id: "kisumu",             name: "Kisumu County",            description: "Kisumu City, Ahero, Kombewa, Muhoroni",                price: 600, eta: "2–3 business days" },
  { id: "nyanza-western",     name: "Nyanza & Western",         description: "Kisii, Migori, Kakamega, Bungoma, Busia, Siaya",       price: 650, eta: "2–3 business days" },
  { id: "rift-valley",        name: "Rift Valley",              description: "Eldoret, Kericho, Bomet, Nandi, Baringo, Trans Nzoia", price: 650, eta: "2–3 business days" },
  { id: "eastern-kenya",      name: "Eastern Kenya",            description: "Meru, Kitui, Makueni, Marsabit, Isiolo, Tharaka",      price: 750, eta: "3–4 business days" },
  { id: "northern-kenya",     name: "Northern Kenya",           description: "Garissa, Wajir, Mandera, Turkana, Samburu, Laikipia",  price: 900, eta: "4–5 business days" },
];

export const FREE_SHIPPING_THRESHOLD = 5000; // KES
