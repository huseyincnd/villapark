// Ürün tipi tanımlaması
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

// Kategori tipi tanımlaması
export interface Category {
  id: string;
  name: string;
  image: string;
  products: Product[];
}

// Tüm menü verisi tipi tanımlaması
export interface MenuData {
  categories: Category[];
}
