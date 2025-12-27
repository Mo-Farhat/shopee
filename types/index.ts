/**
 * Shopee App TypeScript Types
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// User Types
// ============================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  defaultListId?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences: UserPreferences;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// ============================================
// Shopping List Types
// ============================================

export type ListStatus = 'On Budget' | 'Tight Budget' | 'Over Budget' | 'No Budget';

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  category?: string;
  status: ListStatus;
  budget?: number;
  spent: number;
  itemCount: number;
  completedCount: number;
  collaborators: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ListItem {
  id: string;
  listId: string;
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  note?: string;
  isCompleted: boolean;
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

export type ItemCategory = 
  | 'fruits'
  | 'vegetables'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'beverages'
  | 'snacks'
  | 'frozen'
  | 'household'
  | 'personal'
  | 'other';

// ============================================
// Component Props Types
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'password' | 'name' | 'off';
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  autoFocus?: boolean;
  style?: any;
}

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
  variant?: 'default' | 'elevated';
}

// ============================================
// Navigation Types
// ============================================

export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'list/[id]': { id: string };
  modal: undefined;
};

export type AuthStackParamList = {
  welcome: undefined;
  login: undefined;
  signup: undefined;
  'forgot-password': undefined;
};

export type TabsParamList = {
  index: undefined;
  create: undefined;
  settings: undefined;
};
