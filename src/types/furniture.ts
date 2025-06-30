export interface FurnitureFormData {
  name: string;
  category: string;
  materials: {
    material: string;
    quantity: number;
  }[];
  keywords: string[];
  quantity: number;
}

export interface Furniture {
  _id: string;
  name: string;
  category: Category;
  materials: {
    material: Material;
    quantity: number;
  }[];
  keywords: string[];
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Material {
  _id: string;
  name: string;
  description: string;
  keywords: string[];
  supplier: {
    _id: string;
    name: string;
  };
}
