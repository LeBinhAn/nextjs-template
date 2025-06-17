// endpoints.ts
interface EndpointConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

// Example: LOGIN: { url: `${BASE_URL}/auth/login`, method: 'POST' },


interface EnvironmentConfig {
  development: string;
  staging: string;
  production: string;
}

const API_BASE_URLS: EnvironmentConfig = {
  development: 'http://localhost:3000/api',
  staging: 'https://staging-api.yourapp.com/api',
  production: 'https://api.yourapp.com/api'
};

const getBaseUrl = (): string => {
  const env = process.env.NODE_ENV as keyof EnvironmentConfig;
  return process.env.REACT_APP_API_BASE_URL || API_BASE_URLS[env] || API_BASE_URLS.development;
};

export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: "",
    SIGN_OUT: "",
    REGISTER: "",
    REFRESH_TOKEN: "",
  }
} as const;