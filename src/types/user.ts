// 사용자 타입 정의

export type UserRole = 'buyer' | 'seller' | 'admin';

export type SellerLevel = 'standard' | 'verified' | 'top-creator';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  sellerLevel?: SellerLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}








