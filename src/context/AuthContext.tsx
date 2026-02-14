'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, type AuthResponse } from '@/lib/api';
import { User, UserRole } from '@/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'paft_token';
const USER_KEY = 'paft_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Save auth data to localStorage
    const saveAuth = useCallback((authResponse: AuthResponse) => {
        const { user: userData, access_token } = authResponse;
        setUser(userData);
        setToken(access_token);
        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        // Set cookie so server-side middleware can read the token
        document.cookie = `paft_token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }, []);

    // Load auth data from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));

            // Verify token is still valid by fetching profile
            authApi
                .getProfile(storedToken)
                .then((res) => {
                    setUser(res.user);
                    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
                })
                .catch(() => {
                    // Token expired or invalid — clear everything
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                    document.cookie = 'paft_token=; path=/; max-age=0';
                    setToken(null);
                    setUser(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(
        async (email: string, password: string) => {
            const response = await authApi.login(email, password);
            saveAuth(response);
            return response;
        },
        [saveAuth],
    );

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            const response = await authApi.register(name, email, password);
            saveAuth(response);
        },
        [saveAuth],
    );

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        // Clear the cookie
        document.cookie = 'paft_token=; path=/; max-age=0';
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
