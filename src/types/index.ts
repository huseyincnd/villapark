// Ürün tipi tanımlaması
export interface Product {
  _id?: string; // MongoDB ObjectId
  id?: string;  // Eski ID (geriye uyumluluk için)
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId?: string | { _id?: string; id?: string; name?: string }; // String veya populate edilmiş obje
}

// Kategori tipi tanımlaması
export interface Category {
  _id?: string; // MongoDB ObjectId
  id?: string;  // Eski ID (geriye uyumluluk için)
  name: string;
  description?: string;
  image: string;
  products: Product[];
  productCount?: number; // API'den gelen ürün sayısı
}

// Tüm menü verisi tipi tanımlaması
export interface MenuData {
  categories: Category[];
}
