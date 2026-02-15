'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'paft-cart';

function loadCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveCartToStorage(items: CartItem[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
        // silently fail
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
            setItems(loadCartFromStorage());
            setMounted(true);
        }, 0);
    }, []);

    // Persist to localStorage on changes (after initial mount)
    useEffect(() => {
        if (mounted) {
            saveCartToStorage(items);
        }
    }, [items, mounted]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
                        : i
                );
            }
            return [...prev, { ...item, price: Number(item.price), quantity }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(i => i.id !== id));
        } else {
            setItems(prev =>
                prev.map(i => (i.id === id ? { ...i, quantity: Math.min(99, quantity) } : i))
            );
        }
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPrice,
                isOpen,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
