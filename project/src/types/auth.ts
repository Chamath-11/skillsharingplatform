export interface User {
    id: string;
    name: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    location?: string;
    occupation?: string;
    website?: string;
    followersCount: number;
    followingCount: number;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
    confirmPassword: string;
}

export interface AuthError {
    message: string;
    field?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: AuthError | null;
}