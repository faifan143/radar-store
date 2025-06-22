/**
 * Store Model Type
 * @module types/store
 */
export interface Store {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  image?: string;
  longitude: number;
  latitude: number;
  categoryId?: string;
  menuUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  createdAt: string;
  updatedAt: string;
}
