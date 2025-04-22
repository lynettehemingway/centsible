import { getAuthToken, setAuthToken, getRefreshToken, clearTokens } from "./userAuthStorage";

export const authFetch = async (url: string, options: RequestInit = {}) => {
    let authToken = await getAuthToken();

    const authOptions = {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${authToken}`,
        },
    };

    let response = await fetch(url, authOptions);

    if (response.status === 401) {
        const refreshToken = await getRefreshToken();
        
        const refreshResponse = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/users/refresh`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            }
        );

        if (refreshResponse.ok) {
            const { userAuthToken: newToken } = await refreshResponse.json();
            await setAuthToken(newToken);

            const newOptions = {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${newToken}`,
                },
            };

            return fetch(url, newOptions);
        }
        else {
            clearTokens();
        }
    }

    return response;
};