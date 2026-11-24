export type ListingCategory = 'Books' | 'Electronics' | 'Furniture' | 'Stationery' | 'Other';
export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair';
export type ListingType = 'For Sale' | 'Free' | 'Exchange';
export type ListingStatus = 'Available' | 'Reserved' | 'Sold' | 'Inactive';
export type ContactPreference = 'WhatsApp' | 'Email' | 'In-App';
export type EnquiryStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  hostelOrLocation: string;
  contactPreference: ContactPreference;
  phoneOrHandle: string;
  savedListings: string[];
  createdAt?: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  condition: ItemCondition;
  listingType: ListingType;
  exchangePreference?: string;
  status: ListingStatus;
  location: string;
  images: string[];
  seller: {
    _id: string;
    name: string;
    email?: string;
    department?: string;
    year?: string;
    hostelOrLocation?: string;
    contactPreference?: ContactPreference;
    phoneOrHandle?: string;
    createdAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  _id: string;
  listing: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    status: ListingStatus;
  };
  buyer: {
    _id: string;
    name: string;
    email?: string;
    department?: string;
    year?: string;
    hostelOrLocation?: string;
    phoneOrHandle?: string;
    contactPreference?: ContactPreference;
  };
  seller: {
    _id: string;
    name: string;
    hostelOrLocation?: string;
    phoneOrHandle?: string;
    contactPreference?: ContactPreference;
  };
  message: string;
  offerPrice: number | null;
  status: EnquiryStatus;
  sellerReplyNote?: string;
  isReadByBuyer: boolean;
  createdAt: string;
}

export interface FilterOptions {
  search: string;
  category: string;
  condition: string;
  listingType: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}
