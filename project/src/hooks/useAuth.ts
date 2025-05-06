import { useState, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthResponse, AuthError } from '../types/auth';
import { apiClient } from '../utils/apiClient';
import { tokenStorage } from '../utils/tokenStorage';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials, {
            requiresAuth: false
        });

        if (response.error) {
            setError(response.error);
            throw new Error(response.error.message);
        }

        if (response.data) {
            const { token, user: userData } = response.data;
            tokenStorage.setToken(token);
            setUser(userData);
        }

        setIsLoading(false);
    }, []);

    const register = useCallback(async (userData: RegisterCredentials) => {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.post<AuthResponse>('/api/auth/register', userData, {
            requiresAuth: false
        });

        if (response.error) {
            setError(response.error);
            throw new Error(response.error.message);
        }

        if (response.data) {
            const { token, user: newUser } = response.data;
            tokenStorage.setToken(token);
            setUser(newUser);
        }

        setIsLoading(false);
    }, []);

    const logout = useCallback(() => {
        tokenStorage.removeToken();
        setUser(null);
    }, []);

    const validateToken = useCallback(async () => {
        if (!tokenStorage.hasToken()) {
            setUser(null);
            return;
        }

        setIsLoading(true);
        const response = await apiClient.get<User>('/api/auth/validate');

        if (response.error) {
            tokenStorage.removeToken();
            setUser(null);
        } else if (response.data) {
            setUser(response.data);
        }

        setIsLoading(false);
    }, []);

    return {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        validateToken,
    };
};