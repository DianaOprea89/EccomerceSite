import axios from 'axios';
import jwtDecode from 'jwt-decode';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});

// Function to request a new access token using a refresh token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        // Using axiosInstance instead of axios directly
        const response = await axiosInstance.post('/api/token/refresh', { refreshToken });
        return response.data.accessToken; // Make sure the key matches what your server sends
    } catch (error) {
        console.warn('Failed to refresh access token:', error);
        return null;
    }
};

axiosInstance.interceptors.request.use(async config => {
    let token = localStorage.getItem('token');

    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            console.warn('Token has expired, attempting to refresh...');
            token = await refreshAccessToken();

            if (token) {
                localStorage.setItem('token', token);
            } else {
                console.warn('Could not refresh token');
                // Additional logic to handle token refresh failure (e.g., redirect to login)
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token included in request headers:', token);
        }
    } else {
        console.log('No token found, skipping authorization header');
    }

    return config;
}, error => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response && error.response.status === 401) {
        const newToken = await refreshAccessToken();

        if (newToken) {
            localStorage.setItem('token', newToken);
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance.request(error.config);
        } else {
            console.warn('Unauthorized: Could not refresh token');
            // Handle redirect to login or other action upon token refresh failure
        }
    }

    return Promise.reject(error);
});

export default axiosInstance;
