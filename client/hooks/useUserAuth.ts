import { useState, useEffect, useCallback } from "react";
import { 
    setEmail,
    getEmail,
    setAuthToken,
    getAuthToken,
    setRefreshToken,
    getRefreshToken,
    clearTokens
} from '../utils/userAuthStorage';
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { Platform } from "react-native";

export const useUserAuth = () => {
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuth = useCallback(async () => {
        const authToken = await getAuthToken();
        setIsAuthenticated(!!authToken);
    }, []);

    const login = useCallback(async (email: string, userAuthToken: string, refreshToken: string) => {
        await setEmail(email);
        await setAuthToken(userAuthToken);
        await setRefreshToken(refreshToken);
        await setIsAuthenticated(true);

        router.replace('/(logged-in)');
    }, []);

    const logout = useCallback(async () => {
        await clearTokens();
        setIsAuthenticated(false);
        
        router.replace('/login');
    }, []);

    useEffect(() => {
        checkAuth();
    }, []);

    useFocusEffect(() => {
        checkAuth();
    });

    return {
        isAuthenticated,
        checkAuth,
        login,
        logout
    }
}