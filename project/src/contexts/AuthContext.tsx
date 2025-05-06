import React, { createContext, useContext, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthError } from '../types/auth';
import { useAuth as useAuthHook } from '../hooks/useAuth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: AuthError | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        validateToken
    } = useAuthHook();

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    const value = {
        user,
        isLoading,
        error,
        login,
        register,
        logout
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

// Export useAuth as an alias to useAuthContext for backward compatibility
export const useAuth = useAuthContext;