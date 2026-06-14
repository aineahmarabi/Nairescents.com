export interface ShippingZone {
  id: string;
  name: string;
  price: number; // KES
}

export const SHIPPING_ZONES: ShippingZone[] = [
  { id: "pickup",       name: "Pick Up from our Shop",                                                                              price: 0   },
  { id: "cbd",          name: "Delivery within CBD",                                                                                price: 100 },
  { id: "thika-road",   name: "Thika, Kikuyu, Ruiru, Juja, Syokimau, Ngong, Kitengela etc via Super Metro, Rembo sacco etc",       price: 200 },
  { id: "upperhill",    name: "Upperhill, Valley Road, Community, Hurlingham, Nairobi Hospital, Pangani, Ngara, KNH, Oijo Road etc",price: 300 },
  { id: "westlands",    name: "Riverside, Westlands, ABC, Kilimani, Kileleshwa, Westgate, Parklands, MP Shah, Aga Khan, Oshwal",   price: 350 },
  { id: "south-bc",     name: "South B, South C, Mbagathi, Madaraka, Lang'ata, Nairobi West, Bellevue, Nextgen Mall, Carnivore, Panari", price: 350 },
  { id: "junction",     name: "Junction Mall, Lavington, Kibra, Dagoreti Corner, Kawangware, Wanyee, Kabiria, Riruta, Naivasha Road Areas", price: 400 },
  { id: "roasters",     name: "Roasters, Mountain Mall, Garden City, TRM, USIU, Ngumba",                                           price: 400 },
  { id: "eastlands",    name: "Shauri Moyo, Huruma, Kariobangi, Donholm, Umoja, Kayole, Buruburu, Komarock, Dandora, Saika",       price: 400 },
  { id: "courier",      name: "Outside Nairobi via courier — 2NK, Northrift, Easycoach, Ena Coach",                                price: 450 },
  { id: "gigiri",       name: "Gigiri, Village Market, Runda, Ruaka",                                                              price: 500 },
  { id: "kangemi",      name: "Kangemi, Loresho, Mountain View, Spring Valley, Peponi Road, Lower Kabete Areas",                   price: 500 },
  { id: "muthaiga",     name: "Muthaiga North, Ridgeways, Fourways, Thindigua Areas",                                              price: 500 },
  { id: "zimmerman",    name: "Zimmerman, Thome, Githurai 44/45, Kahawa West / Wendani / Sukari",                                  price: 500 },
  { id: "karen",        name: "Galleria Mall, Karen Area",                                                                         price: 700 },
  { id: "rongai",       name: "Rongai, Kikuyu, Kiambu, Ngong Town, Tatu City",                                                    price: 800 },
];

export const FREE_SHIPPING_THRESHOLD = 5000; // KES
